import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const loopDir = resolve(rootDir, 'agent-loop');

const paths = {
  task: resolve(loopDir, 'task.md'),
  lastOutput: resolve(loopDir, 'last-codex-output.md'),
  reviewPrompt: resolve(loopDir, 'chatgpt-review-prompt.md'),
  nextPrompt: resolve(loopDir, 'next-codex-prompt.md'),
  runs: resolve(loopDir, 'runs'),
  sandboxCheck: resolve(loopDir, 'sandbox-check.txt'),
};

const isDryRun = process.argv.includes('--dry-run');
const isOnce = process.argv.includes('--once');
const isLoop = process.argv.includes('--loop');
const isCleanupTemp = process.argv.includes('--cleanup-temp');
const isAutoReview = process.argv.includes('--auto-review');
const maxTurnsArg = process.argv.find((arg) => arg.startsWith('--max-turns='));
const maxTurns = Math.max(1, Math.min(10, Number.parseInt(maxTurnsArg?.split('=')[1] || '3', 10) || 3));
const allowedTempCleanupFiles = new Set([paths.sandboxCheck]);

const riskRules = [
  { label: 'deploy/live publish', pattern: /\b(npm\s+run\s+deploy|vercel\s+(?:deploy|--prod)|netlify\s+deploy|firebase\s+deploy|deploy\s+(?:et|yap|calistir|çalıştır|to|site|production|canli|canlı)|publish\s+(?:et|yap|to|site|production))\b/i },
  { label: 'git history/remote write', pattern: /\bgit\s+(?:add|push|pull|commit|reset|checkout|clean|rebase|merge)\b/i },
  { label: 'database write/migration', pattern: /\b(migration\s+(?:yap|run|calistir|çalıştır|uygula)|migrate\s+(?:run|yap|calistir|çalıştır)|seed\s+(?:run|yap|calistir|çalıştır)|truncate|drop\s+table|alter\s+table|insert\s+into|update\s+\w+\s+set|delete\s+from|db\s+write\s+(?:yap|run|calistir|çalıştır|performed|executed)|database\s+write\s+(?:yap|run|calistir|çalıştır|performed|executed)|veritabani(?:na)?\s+yaz|veritabanina\s+yaz)\b/i },
  { label: 'secret or env access', pattern: /(\.env\b.*\b(?:oku|read|cat|get-content|open|yaz|write|print|goster|göster)\b|\b(?:api[_ -]?key|secret|token|password|sifre|şifre|parola|cpanel)\b.*\b(?:oku|read|access|eris|eriş|yaz|write|print|goster|göster)\b)/i },
  { label: 'destructive file operation', pattern: /\b(rm\s+-rf|del\s+\/[sq]|remove-item\b.*\b-recurse\b|rmdir\s+\/s|dosya\s+sil|delete\s+files?)\b/i },
  { label: 'package install or publish', pattern: /\b(npm\s+i(?:nstall)?|npm\s+add|pnpm\s+add|yarn\s+add|bun\s+add|npm\s+publish)\b/i },
  { label: 'external service integration', pattern: /\b(webhook|remote approval|gateway|external service|dis servis|d[iı]s servis|telegram|openclaw)\b.*\b(?:kullan|use|kur|setup|entegre|integrate|call|request|baglan|bağlan|gonder|gönder)\b/i },
];

function ensureLoopFiles() {
  mkdirSync(loopDir, { recursive: true });
  mkdirSync(paths.runs, { recursive: true });
  for (const file of Object.values(paths)) {
    if (file === paths.runs || file === paths.sandboxCheck) {
      continue;
    }
    if (!existsSync(file)) {
      writeFileSync(file, '', 'utf8');
    }
  }
}

function readText(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

function writeText(file, value) {
  writeFileSync(file, value, 'utf8');
}

function appendText(file, value) {
  writeFileSync(file, `${readText(file)}${value}`, 'utf8');
}

function cleanupTempFiles() {
  const cleaned = [];
  const blocked = [];

  for (const file of allowedTempCleanupFiles) {
    if (!file.startsWith(`${loopDir}\\`) && !file.startsWith(`${loopDir}/`)) {
      blocked.push(file);
      continue;
    }

    if (existsSync(file)) {
      rmSync(file, { force: true });
      cleaned.push(file);
    }
  }

  if (blocked.length > 0) {
    const report = buildStopReport('Cleanup target outside allowed temp list.', {
      riskSource: 'input',
      riskReason: 'unsafe cleanup target',
      matchedLine: blocked.join(', '),
      action: 'STOP',
    });
    writeText(paths.lastOutput, report);
    console.log(report);
    return;
  }

  const report = [
    '# TEMP CLEANUP',
    '',
    'Mode: --cleanup-temp',
    'Allowed files only: yes',
    `Cleaned files: ${cleaned.length}`,
    '',
    cleaned.length
      ? cleaned.map((file) => `- ${file}`).join('\n')
      : '- No allowed temp files existed.',
  ].join('\n');

  writeText(paths.lastOutput, `${report}\n`);
  console.log(report);
}

function hasScript(packageJson, scriptName) {
  try {
    const pkg = JSON.parse(readText(packageJson));
    return Boolean(pkg.scripts?.[scriptName]);
  } catch {
    return false;
  }
}

function isSafeNegativeLine(line) {
  return /(did not|do not|not performed|skipped|no\s+deploy|no\s+push|no\s+commit|no\s+database|no\s+secret|forbidden|yasak|blocked|stop rules|stop kurallari|stop kuralları|pattern|tanımlıyor|tanimliyor|yasaklıyor|yasakliyor|mevcut|var|yapmadim|yapmadım|yapmadi|yapmadı|yapilmadi|yapılmadı|çalıştırmadım|calistirmadim|çalıştırılmadı|calistirilmadi|erişmedim|erismedim|dokunmadım|dokunmadim|reddedildi|yok|kapsam disi|kapsam dışı|Safety constraints|Constraints for the next prompt)/i.test(line);
}

function firstRisk(text, source = 'input') {
  const lines = text.split(/\r?\n/);
  for (const rule of riskRules) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || isSafeNegativeLine(trimmed)) {
        continue;
      }

      const match = trimmed.match(rule.pattern);
      if (match) {
        return {
          riskSource: source,
          riskReason: rule.label,
          matchedLine: trimmed,
          match: match[0],
          action: 'STOP',
        };
      }
    }
  }

  return {
    riskSource: 'none',
    riskReason: '',
    matchedLine: '',
    match: '',
    action: 'CONTINUE',
  };
}

function firstInputRisk(parts) {
  for (const part of parts) {
    const result = firstRisk(part.text, 'input');
    if (result.action === 'STOP') {
      return { ...result, riskReason: `${part.name}: ${result.riskReason}` };
    }
  }
  return firstRisk('', 'none');
}

function firstOutputRisk(text) {
  return firstRisk(text, 'output');
}

function sanitizeText(text) {
  const sanitized = text
    .replace(/sk-[A-Za-z0-9_-]{12,}/g, 'sk-***')
    .replace(/\b\d{8,}:[A-Za-z0-9_-]{20,}\b/g, '***token***')
    .replace(/Authorization:\s*Bearer\s+\S+/gi, 'Authorization: Bearer ***')
    .replace(/__cf_chl_[A-Za-z0-9_./?=&%-]+/g, '__cf_chl_***')
    .replace(/c(?:H|Ray|UPMDTk|Zone|FPWv|ITimeS|TplB|TplC|TplO|TplV|Type|vId|OgUHash|OgUQuery):\s*'[^']*'/g, "cloudflare_field: '***'");

  return sanitized.length > 16000
    ? `${sanitized.slice(0, 16000)}\n\n[output truncated by agent-loop orchestrator]\n`
    : sanitized;
}

function sanitizeCodexStderr(text) {
  return sanitizeText(text)
    .replace(/\d{4}-\d{2}-\d{2}T[^\n]+WARN codex_core_plugins::startup_remote_sync:[\s\S]*?(?=\n\d{4}-\d{2}-\d{2}T|$)/g, '[codex plugin startup warning redacted]')
    .replace(/\d{4}-\d{2}-\d{2}T[^\n]+WARN codex_core_plugins::manager:[\s\S]*?(?=\n\d{4}-\d{2}-\d{2}T|$)/g, '[codex plugin manager warning redacted]');
}

function safeChildEnv() {
  const blocked = /(api|key|secret|token|password|passwd|pwd|sifre|parola|cpanel)/i;
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!blocked.test(key)) {
      env[key] = value;
    }
  }
  return env;
}

function commandForPlatform(command) {
  if (process.platform !== 'win32') {
    return command;
  }

  if (/[\\/]/.test(command) || /\.[a-z0-9]+$/i.test(command)) {
    return command;
  }

  if (command === 'codex') {
    return 'codex.exe';
  }

  if (['npm', 'npx', 'pnpm', 'yarn'].includes(command)) {
    return `${command}.cmd`;
  }

  return command;
}

function spawnCommand(command, args) {
  const resolved = commandForPlatform(command);
  if (process.platform === 'win32' && resolved.endsWith('.cmd')) {
    return {
      command: 'cmd.exe',
      args: ['/d', '/c', resolved, ...args],
    };
  }

  return { command: resolved, args };
}

function run(command, args, options = {}) {
  return new Promise((resolveRun) => {
    const input = options.input;
    const allowEnvKeys = options.allowEnvKeys || [];
    const spawnOptions = { ...options };
    delete spawnOptions.input;
    delete spawnOptions.allowEnvKeys;
    const spawnTarget = spawnCommand(command, args);
    const childEnv = {
      ...safeChildEnv(),
      CODEX_AGENT_LOOP: '1',
    };

    for (const key of allowEnvKeys) {
      if (process.env[key]) {
        childEnv[key] = process.env[key];
      }
    }

    const child = spawn(spawnTarget.command, spawnTarget.args, {
      cwd: rootDir,
      shell: false,
      env: childEnv,
      ...spawnOptions,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      resolveRun({ code: 1, stdout, stderr: `${stderr}${error.message}` });
    });
    child.on('close', (code) => {
      resolveRun({ code: code ?? 0, stdout, stderr });
    });

    if (input) {
      child.stdin?.write(input);
    }
    child.stdin?.end();
  });
}

function formatCommandResult(title, result) {
  const stdout = sanitizeText(result.stdout);
  const stderr = title.toLowerCase().includes('codex')
    ? sanitizeCodexStderr(result.stderr)
    : sanitizeText(result.stderr);

  return [
    `## ${title}`,
    '',
    `Exit code: ${result.code}`,
    '',
    '### stdout',
    '```text',
    stdout.trim() || '(empty)',
    '```',
    '',
    '### stderr',
    '```text',
    stderr.trim() || '(empty)',
    '```',
  ].join('\n');
}

function fenceText(text) {
  const value = text.trim() || '(empty)';
  let fence = '```';
  while (value.includes(fence)) {
    fence += '`';
  }
  return [fence + 'text', value, fence].join('\n');
}

function buildStopReport(reason, risk = firstRisk('', 'none'), extra = '') {
  const lines = [
    '# STOP',
    '',
    `Reason: ${reason}`,
    '',
    '## Risk decision',
    '',
    `- riskSource: ${risk.riskSource || 'none'}`,
    `- riskReason: ${risk.riskReason || reason}`,
    `- matchedLine: ${risk.matchedLine || '(none)'}`,
    `- action: ${risk.action || 'STOP'}`,
  ];

  if (extra.trim()) {
    lines.push('', '## Context', '', fenceText(extra));
  }

  return `${lines.join('\n')}\n`;
}

function buildReviewPrompt({ task, codexOutput, buildResult, diffResult, stopped }) {
  return [
    'KONTROL:',
    'Codex ciktisi asagidadir. Lutfen yapilan islemi kontrol et, riskleri soyle, eksik varsa belirt ve bana Codex\'e verilecek siradaki promptu hazirla.',
    '',
    'Kurallar:',
    '- Canli siteye deploy yok.',
    '- Git push yok.',
    '- Veritabani yazma yok.',
    '- .env, API key, sifre veya token okuma/yazma yok.',
    '- Riskli islem varsa STOP de.',
    '',
    'ChatGPT bu incelemeden sonra eger devam edilecekse next-codex-prompt.md icine sadece CHATGPT_APPROVED_NEXT_PROMPT baslikli prompt yazmalidir.',
    'Devam edilmeyecekse next-codex-prompt.md icine sadece NO_NEXT_PROMPT veya STOP yazmalidir.',
    '',
    'Orijinal gorev:',
    fenceText(task),
    '',
    stopped ? 'Durum: STOP uretildi; Codex calistirilmadi veya sonraki adim durduruldu.' : 'Durum: Lokal Codex uygulama adimi tamamlandi.',
    '',
    'Codex ciktisi:',
    fenceText(codexOutput),
    '',
    'Build sonucu:',
    fenceText(buildResult || '(build calistirilmadi)'),
    '',
    'Git diff ozeti:',
    fenceText(diffResult || '(diff yok veya alinamadi)'),
    '',
    'Lutfen cevabinin sonunda su basligi kullan:',
    '',
    'CODEX\'E VERILECEK SIRADAKI PROMPT',
  ].join('\n');
}

function runModeLabel() {
  if (isDryRun) return 'dry-run';
  if (isLoop) return 'loop';
  if (isOnce) return 'once';
  return 'standard';
}

function turnFile(turn) {
  return resolve(paths.runs, `turn-${String(turn).padStart(3, '0')}.md`);
}

function isPlaceholderPrompt(text) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return true;
  return normalized.includes('paste the next local-only prompt')
    || normalized.includes('paste chatgpt review output')
    || normalized.includes('constraints for the next prompt')
    || normalized.includes('next codex prompt template')
    || normalized.includes('[chatgpt tarafindan onaylanan net gorev buraya yazilir.]');
}

function hasApprovedNextPromptHeader(text) {
  return /^CHATGPT_APPROVED_NEXT_PROMPT\s*$/im.test(text);
}

function shouldStopBeforeNextPrompt(text) {
  return isPlaceholderPrompt(text)
    || /\b(?:STOP|NO_NEXT_PROMPT)\b/i.test(text)
    || !hasApprovedNextPromptHeader(text);
}

function buildDryRunReport({ task, inputRisk, outputRisk, diffResult }) {
  const taskFound = task.trim().length > 0;
  const stopTriggered = inputRisk.action === 'STOP' || !taskFound;
  const diffProduced = Boolean(diffResult.stdout.trim() || diffResult.stderr.trim() || diffResult.code === 0);

  return [
    '# DRY RUN RAPORU',
    '',
    `Task bulundu mu? ${taskFound ? 'Evet' : 'Hayir'}`,
    `Input risk var mi? ${inputRisk.action === 'STOP' ? 'Evet' : 'Hayir'}`,
    `Output risk var mi? ${outputRisk.action === 'STOP' ? 'Evet' : 'Hayir'}`,
    `Karar: ${stopTriggered ? 'STOP' : 'CONTINUE'}`,
    `STOP tetiklendi mi? ${stopTriggered ? 'Evet' : 'Hayir'}`,
    'codex exec calistirildi mi? Hayir',
    'build calistirildi mi? Hayir',
    `git diff ozeti uretildi mi? ${diffProduced ? 'Evet' : 'Hayir'}`,
    '',
    '## Risk karari',
    '',
    `- riskSource: ${inputRisk.riskSource}`,
    `- riskReason: ${inputRisk.riskReason || '(none)'}`,
    `- matchedLine: ${inputRisk.matchedLine || '(none)'}`,
    `- action: ${stopTriggered ? 'STOP' : 'CONTINUE'}`,
    '',
    '## Task',
    '',
    fenceText(task),
    '',
    formatCommandResult('git diff --stat', diffResult),
  ].join('\n');
}

function buildDryRunReviewPrompt({ task, dryRunReport, diffResult }) {
  return [
    '# DRY RUN RAPORU',
    '',
    'KONTROL:',
    'Asagidaki dry-run raporunu kontrol et. Gercek codex exec calistirilmadi ve build calistirilmadi. Lutfen riskleri, eksikleri ve Codex\'e verilecek siradaki guvenli promptu hazirla.',
    '',
    'Kurallar:',
    '- Canli siteye deploy yok.',
    '- Git push yok.',
    '- Veritabani yazma yok.',
    '- .env, API key, sifre veya token okuma/yazma yok.',
    '- Riskli islem varsa STOP de.',
    '',
    'Dry-run raporu:',
    fenceText(dryRunReport),
    '',
    'Git diff ozeti:',
    fenceText(diffResult || '(diff yok veya alinamadi)'),
    '',
    'Orijinal gorev:',
    fenceText(task),
    '',
    'Lutfen cevabinin sonunda su basligi kullan:',
    '',
    'CODEX\'E VERILECEK SIRADAKI PROMPT',
  ].join('\n');
}

function parseReviewJson(stdout) {
  const jsonLine = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{') && line.endsWith('}'))
    .at(-1);

  if (!jsonLine) {
    return {
      ok: false,
      manualMode: true,
      reason: 'OpenAI review script did not return JSON.',
      model: process.env.AGENT_LOOP_REVIEW_MODEL || 'gpt-5.1-codex-mini',
      inputChars: 0,
      estimatedTokens: 0,
      decision: 'STOP',
      riskLevel: 'HIGH',
      nextPrompt: 'NO_NEXT_PROMPT',
      rawReview: stdout,
    };
  }

  try {
    return JSON.parse(jsonLine);
  } catch (error) {
    return {
      ok: false,
      manualMode: true,
      reason: `OpenAI review JSON parse failed: ${error.message}`,
      model: process.env.AGENT_LOOP_REVIEW_MODEL || 'gpt-5.1-codex-mini',
      inputChars: 0,
      estimatedTokens: 0,
      decision: 'STOP',
      riskLevel: 'HIGH',
      nextPrompt: 'NO_NEXT_PROMPT',
      rawReview: stdout,
    };
  }
}

async function runAutoReview(turn) {
  const reviewResult = await run('node', ['scripts/agent-loop-openai-review.mjs'], {
    allowEnvKeys: ['OPENAI_API_KEY', 'AGENT_LOOP_REVIEW_MODEL'],
  });
  const parsed = parseReviewJson(reviewResult.stdout);
  const reviewInputRisk = firstInputRisk([
    { name: 'OpenAI review NEXT_PROMPT', text: parsed.nextPrompt || '' },
  ]);

  const lines = [
    '',
    '## OpenAI auto review',
    '',
    `Exit code: ${reviewResult.code}`,
    `Review model: ${parsed.model || process.env.AGENT_LOOP_REVIEW_MODEL || 'gpt-5.1-codex-mini'}`,
    `Approx input chars: ${parsed.inputChars || 0}`,
    `Approx estimated tokens: ${parsed.estimatedTokens || 0}`,
    `Manual mode: ${parsed.manualMode ? 'yes' : 'no'}`,
    `Decision: ${parsed.decision || 'STOP'}`,
    `Risk level: ${parsed.riskLevel || 'HIGH'}`,
    `Reason: ${parsed.reason || '(none)'}`,
    '',
    '### Review stdout',
    fenceText(sanitizeText(reviewResult.stdout)),
    '',
    '### Review stderr',
    fenceText(sanitizeText(reviewResult.stderr)),
    '',
    '### Raw review',
    fenceText(parsed.rawReview || '(empty)'),
  ];

  appendText(turnFile(turn), `${lines.join('\n')}\n`);

  if (reviewResult.code !== 0 || parsed.manualMode || !parsed.ok) {
    writeText(paths.nextPrompt, 'NO_NEXT_PROMPT\n');
    console.log(parsed.reason || 'OpenAI review unavailable; manual review mode.');
    return { stopped: true, reason: parsed.reason || 'manual review mode' };
  }

  if (parsed.decision !== 'CONTINUE') {
    writeText(paths.nextPrompt, 'NO_NEXT_PROMPT\n');
    console.log('OpenAI review decision: STOP');
    return { stopped: true, reason: 'OpenAI review STOP' };
  }

  if (reviewInputRisk.action === 'STOP') {
    const report = buildStopReport('OpenAI review produced a risky NEXT_PROMPT.', reviewInputRisk, parsed.nextPrompt || '');
    writeText(paths.lastOutput, report);
    appendText(turnFile(turn), `\n${report}`);
    writeText(paths.nextPrompt, 'NO_NEXT_PROMPT\n');
    console.log(report);
    return { stopped: true, reason: 'OpenAI review next prompt risk' };
  }

  if (!hasApprovedNextPromptHeader(parsed.nextPrompt || '') || shouldStopBeforeNextPrompt(parsed.nextPrompt || '')) {
    writeText(paths.nextPrompt, 'NO_NEXT_PROMPT\n');
    console.log('OpenAI review did not produce a valid CHATGPT_APPROVED_NEXT_PROMPT; loop stopped.');
    return { stopped: true, reason: 'invalid OpenAI next prompt' };
  }

  writeText(paths.nextPrompt, `${parsed.nextPrompt.trim()}\n`);
  return { stopped: false, reason: 'OpenAI review CONTINUE' };
}

async function performTurn(prompt, turn) {
  const inputRisk = firstInputRisk([{ name: turn === 1 ? 'agent-loop/task.md' : 'agent-loop/next-codex-prompt.md', text: prompt }]);
  if (!prompt.trim()) {
    const report = buildStopReport('No prompt available for this turn.', {
      riskSource: 'input',
      riskReason: 'empty prompt',
      matchedLine: '(empty)',
      action: 'STOP',
    });
    writeText(paths.lastOutput, report);
    writeText(paths.reviewPrompt, buildReviewPrompt({ task: prompt, codexOutput: report, buildResult: '', diffResult: '', stopped: true }));
    writeText(turnFile(turn), report);
    console.log(report);
    return { stopped: true, reason: 'empty prompt' };
  }

  if (inputRisk.action === 'STOP') {
    const report = buildStopReport('Risky input instruction detected before running Codex.', inputRisk, prompt);
    writeText(paths.lastOutput, report);
    writeText(paths.reviewPrompt, buildReviewPrompt({ task: prompt, codexOutput: report, buildResult: '', diffResult: '', stopped: true }));
    writeText(turnFile(turn), report);
    console.log(report);
    return { stopped: true, reason: 'input risk' };
  }

  const codexBin = process.env.CODEX_BIN || 'codex';
  const codexPrompt = [
    prompt,
    '',
    'Safety constraints for this run:',
    '- Work only on local files.',
    '- Do not deploy, push, commit, delete files, install packages, read secrets, or write to databases.',
    '- If any step requires a risky action, stop and report STOP.',
  ].join('\n');

  // Codex repo içinde yazabilir, fakat STOP kuralları commit/push/deploy/DB/secret işlemlerini engeller.
  const codexResult = await run(codexBin, ['exec', '-s', 'workspace-write', '-'], { input: codexPrompt });
  const codexOutput = formatCommandResult('Codex exec output', codexResult);
  writeText(paths.lastOutput, `${codexOutput}\n`);

  const outputRisk = firstOutputRisk(`${sanitizeText(codexResult.stdout)}\n${sanitizeCodexStderr(codexResult.stderr)}`);
  if (outputRisk.action === 'STOP') {
    const diffResult = await run('git', ['diff', '--stat']);
    const report = buildStopReport('Risky action detected in Codex output.', outputRisk, `${codexOutput}\n\n${formatCommandResult('git diff --stat', diffResult)}`);
    writeText(paths.lastOutput, report);
    writeText(paths.reviewPrompt, buildReviewPrompt({ task: prompt, codexOutput: report, buildResult: '', diffResult: diffResult.stdout || diffResult.stderr, stopped: true }));
    writeText(turnFile(turn), report);
    console.log(report);
    return { stopped: true, reason: 'output risk' };
  }

  let buildText = 'npm run build not found; skipped.';
  if (hasScript(resolve(rootDir, 'package.json'), 'build')) {
    const buildResult = await run('npm', ['run', 'build']);
    buildText = formatCommandResult('npm run build', buildResult);
  }

  const diffStat = await run('git', ['diff', '--stat']);
  const diffNameStatus = await run('git', ['diff', '--name-status']);
  const gitStatus = await run('git', ['status', '--short']);
  const diffText = [
    `Run mode: ${runModeLabel()}`,
    `Turn: ${turn}`,
    '',
    formatCommandResult('git status --short', gitStatus),
    '',
    formatCommandResult('git diff --stat', diffStat),
    '',
    formatCommandResult('git diff --name-status', diffNameStatus),
  ].join('\n');

  const fullOutput = `${codexOutput}\n\n${buildText}\n\n${diffText}\n`;
  writeText(paths.lastOutput, fullOutput);
  writeText(paths.reviewPrompt, buildReviewPrompt({
    task: prompt,
    codexOutput,
    buildResult: buildText,
    diffResult: diffText,
    stopped: false,
  }));
  writeText(turnFile(turn), fullOutput);

  return { stopped: false, reason: 'completed' };
}

async function runLoop(task) {
  let currentPrompt = task;

  for (let turn = 1; turn <= maxTurns; turn += 1) {
    if (turn > 1) {
      currentPrompt = readText(paths.nextPrompt).trim();
      if (shouldStopBeforeNextPrompt(currentPrompt)) {
        const summary = [
          '# LOOP STOP',
          '',
          `Turn: ${turn}`,
          `Reason: next-codex-prompt.md is empty, placeholder, STOP/NO_NEXT_PROMPT, or missing CHATGPT_APPROVED_NEXT_PROMPT.`,
          `Max turns: ${maxTurns}`,
          'Action: CONTINUE not possible without a reviewed next prompt.',
        ].join('\n');
        writeText(turnFile(turn), `${summary}\n`);
        console.log(summary);
        return;
      }
    }

    const result = await performTurn(currentPrompt, turn);
    if (result.stopped) {
      return;
    }

    if (isAutoReview) {
      const review = await runAutoReview(turn);
      if (review.stopped) {
        return;
      }
    }

    const nextPrompt = readText(paths.nextPrompt).trim();
    if (shouldStopBeforeNextPrompt(nextPrompt)) {
      const summary = [
        '# LOOP COMPLETE',
        '',
        `Completed turns: ${turn}`,
        `Max turns: ${maxTurns}`,
        'Reason: no ChatGPT-approved next prompt is available.',
      ].join('\n');
      console.log(summary);
      return;
    }
  }

  console.log(`Loop stopped after reaching max turns (${maxTurns}).`);
}

async function main() {
  ensureLoopFiles();

  if (isCleanupTemp) {
    cleanupTempFiles();
    return;
  }

  const task = readText(paths.task).trim();
  const nextPrompt = readText(paths.nextPrompt).trim();
  const inputRisk = firstInputRisk([
    { name: 'agent-loop/task.md', text: task },
    { name: 'agent-loop/next-codex-prompt.md', text: nextPrompt },
  ]);
  const noOutputRisk = firstOutputRisk('');

  if (isDryRun) {
    const diffResult = await run('git', ['diff', '--stat']);
    const dryRunReport = buildDryRunReport({ task, inputRisk, outputRisk: noOutputRisk, diffResult });
    const diffText = formatCommandResult('git diff --stat', diffResult);
    writeText(paths.lastOutput, `${dryRunReport}\n`);
    writeText(paths.reviewPrompt, buildDryRunReviewPrompt({ task, dryRunReport, diffResult: diffText }));
    console.log(dryRunReport);
    return;
  }

  if (!task) {
    const report = buildStopReport('agent-loop/task.md is empty. Add a local, safe task before running the loop.', {
      riskSource: 'input',
      riskReason: 'empty task',
      matchedLine: '(empty)',
      action: 'STOP',
    });
    writeText(paths.lastOutput, report);
    writeText(paths.reviewPrompt, buildReviewPrompt({ task, codexOutput: report, buildResult: '', diffResult: '', stopped: true }));
    console.log(report);
    return;
  }

  if (inputRisk.action === 'STOP') {
    const report = buildStopReport('Risky input instruction detected before running Codex.', inputRisk, `${task}\n\n${nextPrompt}`);
    writeText(paths.lastOutput, report);
    writeText(paths.reviewPrompt, buildReviewPrompt({ task, codexOutput: report, buildResult: '', diffResult: '', stopped: true }));
    console.log(report);
    return;
  }

  if (isLoop) {
    await runLoop(task);
    return;
  }

  await performTurn(task, 1);

  if (isAutoReview) {
    await runAutoReview(1);
  }

  if (!readText(paths.nextPrompt).trim()) {
    writeText(paths.nextPrompt, 'Paste ChatGPT review output here after it creates the next Codex prompt.\n');
  }
  console.log('Agent loop completed. Review agent-loop/chatgpt-review-prompt.md in ChatGPT before the next Codex run.');
}

main().catch((error) => {
  const report = buildStopReport('Unhandled orchestrator error.', {
    riskSource: 'none',
    riskReason: 'Unhandled orchestrator error.',
    matchedLine: '(none)',
    action: 'STOP',
  }, error.stack || error.message);
  ensureLoopFiles();
  writeText(paths.lastOutput, report);
  writeText(paths.reviewPrompt, buildReviewPrompt({ task: readText(paths.task), codexOutput: report, buildResult: '', diffResult: '', stopped: true }));
  console.error(report);
  process.exitCode = 1;
});
