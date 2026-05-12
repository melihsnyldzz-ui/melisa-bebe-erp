import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = resolve(import.meta.dirname, '..');
const loopDir = resolve(rootDir, 'agent-loop');
const model = process.env.AGENT_LOOP_REVIEW_MODEL || 'gpt-5.1-codex-mini';
const maxInputChars = 40000;

const paths = {
  task: resolve(loopDir, 'task.md'),
  lastOutput: resolve(loopDir, 'last-codex-output.md'),
  reviewPrompt: resolve(loopDir, 'chatgpt-review-prompt.md'),
};

function readText(file) {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function truncateSection(text, maxChars) {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars)}\n\n[truncated by agent-loop OpenAI review]\n`;
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function runGitDiffStat() {
  const result = spawnSync('git', ['diff', '--stat'], {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false,
  });

  return [result.stdout || '', result.stderr || ''].join('').trim();
}

function extractBuildSummary(lastOutput) {
  const match = lastOutput.match(/## npm run build[\s\S]*?(?=\n## git status --short|\nRun mode:|\n## Codex exec output|$)/i);
  if (!match) {
    return 'Build summary not found in last-codex-output.md.';
  }

  return truncateSection(match[0], 6000);
}

function buildReviewInput() {
  const task = truncateSection(readText(paths.task), 6000);
  const lastOutput = truncateSection(readText(paths.lastOutput), 14000);
  const reviewPrompt = truncateSection(readText(paths.reviewPrompt), 12000);
  const diffStat = truncateSection(runGitDiffStat(), 4000);
  const buildSummary = extractBuildSummary(readText(paths.lastOutput));

  return [
    'You are the safe ChatGPT review layer for the Melisa Bebe ERP local agent loop.',
    '',
    'Hard safety rules:',
    '- Do not allow commit, push, deploy, live-site changes, database writes, file deletion, secret reads/writes, webhook, Telegram, OpenClaw, or external approval flows.',
    '- Do not ask Codex to read .env, API keys, tokens, passwords, cPanel data, or private credentials.',
    '- Keep the next prompt small and local-only.',
    '- If there is no clearly safe next step, decide STOP.',
    '',
    'Return exactly this format and no extra prose:',
    'DECISION: CONTINUE | STOP',
    'RISK_LEVEL: LOW | MEDIUM | HIGH',
    'SUMMARY:',
    'NEXT_PROMPT:',
    '',
    'If DECISION is CONTINUE, NEXT_PROMPT must include this heading:',
    'CHATGPT_APPROVED_NEXT_PROMPT',
    '',
    'If DECISION is STOP, NEXT_PROMPT must be NO_NEXT_PROMPT.',
    '',
    'Inputs are intentionally summarized; do not request full source files unless needed in a future safe Codex prompt.',
    '',
    '## agent-loop/task.md',
    task,
    '',
    '## agent-loop/last-codex-output.md',
    lastOutput,
    '',
    '## agent-loop/chatgpt-review-prompt.md',
    reviewPrompt,
    '',
    '## git diff --stat',
    diffStat || '(empty)',
    '',
    '## build result summary',
    buildSummary,
  ].join('\n');
}

function parseReview(text) {
  const decision = text.match(/^DECISION:\s*(CONTINUE|STOP)\s*$/im)?.[1] || 'STOP';
  const riskLevel = text.match(/^RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)\s*$/im)?.[1] || 'HIGH';
  const nextMatch = text.match(/^NEXT_PROMPT:\s*$/im);
  const nextPrompt = nextMatch
    ? text.slice((nextMatch.index || 0) + nextMatch[0].length).trim()
    : 'NO_NEXT_PROMPT';

  return {
    decision,
    riskLevel,
    nextPrompt: decision === 'CONTINUE' ? nextPrompt : 'NO_NEXT_PROMPT',
  };
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY yok, manuel review moduna geçiliyor.');
    console.log(JSON.stringify({
      ok: false,
      manualMode: true,
      reason: 'OPENAI_API_KEY missing',
      model,
      inputChars: 0,
      estimatedTokens: 0,
      decision: 'STOP',
      riskLevel: 'MEDIUM',
      nextPrompt: 'NO_NEXT_PROMPT',
      rawReview: '',
    }));
    return;
  }

  const input = buildReviewInput();
  const inputChars = input.length;
  const estimatedTokens = estimateTokens(input);

  console.error(`OpenAI review model: ${model}`);
  console.error(`Approx review input: ${inputChars} chars, ~${estimatedTokens} tokens`);

  if (inputChars > maxInputChars) {
    console.log(JSON.stringify({
      ok: false,
      manualMode: true,
      reason: `Review input too large (${inputChars} chars > ${maxInputChars})`,
      model,
      inputChars,
      estimatedTokens,
      decision: 'STOP',
      riskLevel: 'MEDIUM',
      nextPrompt: 'NO_NEXT_PROMPT',
      rawReview: '',
    }));
    return;
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input,
      reasoning: { effort: 'low' },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI API error ${response.status}`;
    console.log(JSON.stringify({
      ok: false,
      manualMode: true,
      reason: message,
      model,
      inputChars,
      estimatedTokens,
      decision: 'STOP',
      riskLevel: 'HIGH',
      nextPrompt: 'NO_NEXT_PROMPT',
      rawReview: '',
    }));
    return;
  }

  const rawReview = payload.output_text
    || payload.output?.flatMap((item) => item.content || [])
      .map((content) => content.text || '')
      .join('\n')
    || '';
  const parsed = parseReview(rawReview);

  console.log(JSON.stringify({
    ok: true,
    manualMode: false,
    reason: '',
    model,
    inputChars,
    estimatedTokens,
    decision: parsed.decision,
    riskLevel: parsed.riskLevel,
    nextPrompt: parsed.nextPrompt,
    rawReview,
  }));
}

main().catch((error) => {
  console.log(JSON.stringify({
    ok: false,
    manualMode: true,
    reason: error.message,
    model,
    inputChars: 0,
    estimatedTokens: 0,
    decision: 'STOP',
    riskLevel: 'HIGH',
    nextPrompt: 'NO_NEXT_PROMPT',
    rawReview: '',
  }));
  process.exitCode = 1;
});
