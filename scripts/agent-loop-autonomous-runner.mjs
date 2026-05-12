import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const loopDir = resolve(rootDir, 'agent-loop');

const paths = {
  config: resolve(loopDir, 'autonomous-config.json'),
  state: resolve(loopDir, 'autonomous-state.json'),
  versionTarget: resolve(loopDir, 'version-target.json'),
  task: resolve(loopDir, 'task.md'),
  versionResult: resolve(loopDir, 'version-result.md'),
  stopRules: resolve(loopDir, 'stop-rules.md'),
  nextPrompt: resolve(loopDir, 'next-version-prompt.md'),
  roadmap: resolve(rootDir, 'ERP_ROADMAP.md'),
  packageJson: resolve(rootDir, 'package.json'),
};

const commandsRun = [];

function readText(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

function writeText(file, value) {
  writeFileSync(file, value, 'utf8');
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readText(file));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function run(command, args) {
  commandsRun.push([command, ...args].join(' '));
  const usesCmdShim = process.platform === 'win32' && ['npm', 'npx', 'pnpm', 'yarn'].includes(command);
  const spawnCommand = usesCmdShim ? 'cmd.exe' : command;
  const spawnArgs = usesCmdShim ? ['/d', '/c', `${command}.cmd`, ...args] : args;
  const result = spawnSync(spawnCommand, spawnArgs, {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false,
  });

  return {
    code: result.error ? 1 : result.status ?? 0,
    stdout: result.stdout || '',
    stderr: result.error ? `${result.error.message}\n${result.stderr || ''}` : result.stderr || '',
  };
}

function parseVersion(version) {
  return String(version || '0.0.0')
    .replace(/^v/i, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);
}

function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }
  return 0;
}

function incrementMinor(version) {
  const [major, minor] = parseVersion(version);
  return `${major}.${minor + 1}.0`;
}

function roadmapVersions(roadmap) {
  return [...roadmap.matchAll(/^##\s+v?(\d+\.\d+\.\d+)\b/gim)]
    .map((match) => match[1])
    .sort(compareVersions);
}

function selectNextVersion(currentVersion, roadmap) {
  const nextFromRoadmap = roadmapVersions(roadmap).find((version) => compareVersions(version, currentVersion) > 0);
  return nextFromRoadmap || incrementMinor(currentVersion);
}

function scopeForVersion(version) {
  const scopes = {
    '1.82.0': {
      goal: 'Barkod terminali iyileştirmeleri',
      scope: [
        'Barkod terminali iyileştirmeleri',
        'barcode/string normalize',
        'Honeywell whitespace',
        'duplicate scan guard',
        'focus behavior',
      ],
      files: ['src/', 'agent-loop/', 'ERP_ROADMAP.md', 'CHANGELOG.md'],
    },
    '1.83.0': {
      goal: 'Stok ve ürün görünürlüğü',
      scope: [
        'ürün kartı görünürlüğü',
        'son okutulan ürün alanı',
        'stok bilgisi gösterimi için güvenli hazırlık',
        'canlı DB bağlantısı yok',
      ],
      files: ['src/pages/Products.jsx', 'src/pages/StockMovements.jsx', 'agent-loop/', 'CHANGELOG.md'],
    },
    '1.84.0': {
      goal: 'Vega entegrasyon hazırlığı',
      scope: [
        'mock adapter',
        'interface/type tanımları',
        'canlı Vega DB bağlantısı yok',
      ],
      files: ['src/', 'agent-loop/', 'docs/', 'CHANGELOG.md'],
    },
    '1.85.0': {
      goal: 'Raporlama ve operasyon paneli',
      scope: [
        'güvenli local/demo rapor yapısı',
        'operasyon paneli hazırlığı',
        'canlı veri yazma yok',
      ],
      files: ['src/pages/Reports.jsx', 'src/pages/Dashboard.jsx', 'agent-loop/', 'CHANGELOG.md'],
    },
  };

  return scopes[version] || {
    goal: `v${version} güvenli ERP geliştirme hedefi`,
    scope: ['Roadmap dışı güvenli dokümantasyon ve kalite kapısı hazırlığı'],
    files: ['agent-loop/', 'ERP_ROADMAP.md', 'CHANGELOG.md'],
  };
}

function updateVersionTarget(targetVersion, config) {
  const current = readJson(paths.versionTarget, {});
  writeJson(paths.versionTarget, {
    ...current,
    targetVersion,
    currentVersionSource: current.currentVersionSource || 'package.json',
    mode: 'version-target-loop',
    maxIterations: config.maxIterationsPerVersion || current.maxIterations || 3,
    allowPackageVersionUpdate: current.allowPackageVersionUpdate ?? true,
    allowChangelogUpdate: current.allowChangelogUpdate ?? true,
    requireHumanApprovalOnlyForStopRules: true,
    stopOnHighRisk: true,
    stopOnSecretAccess: true,
    stopOnDeploy: true,
    stopOnDatabaseWrite: true,
  });
}

function updateTask(targetVersion, versionScope) {
  const content = [
    '# Current Goal',
    '',
    `v${targetVersion} ${versionScope.goal} hattını güvenli şekilde tamamla.`,
    '',
    '# Context',
    '',
    'Melisa Bebe ERP projesinde barkod terminali, stok görünürlüğü, Vega entegrasyon hazırlığı ve operasyon paneli geliştirme hattı devam ediyor.',
    'Bu agent-loop sistemi, ERP_ROADMAP.md ve version-result.md üzerinden sıradaki güvenli hedefi seçerek lokal geliştirme yapar.',
    '',
    '# Allowed Actions',
    '',
    '- Güvenli dokümantasyon güncellemesi',
    '- Güvenli frontend / utils düzenlemesi',
    '- Build/lint/test çalıştırma',
    '- Hata varsa güvenli dosyalarda düzeltme',
    '- Version ve changelog güncelleme',
    '- Risk raporu oluşturma',
    '- Bir sonraki versiyon için öneri üretme',
    '',
    '# Forbidden Actions',
    '',
    '- git push',
    '- git commit',
    '- deploy',
    '- canlı DB yazma',
    '- Vega canlı DB yazma',
    '- migration çalıştırma',
    '- secret/API key/token okuma',
    '- .env dosyalarına dokunma',
    '- dosya silme',
    '- npm install',
    '- hosting/cPanel/Turhost işlemi',
    '',
    '# Acceptance Criteria',
    '',
    `- package.json version ${targetVersion} olmalı`,
    '- CHANGELOG.md hedef versiyon notunu içermeli',
    '- Build sonucu raporlanmalı',
    '- Lint sonucu raporlanmalı veya SKIPPED yazmalı',
    '- Test sonucu raporlanmalı veya SKIPPED yazmalı',
    '- Risk durumu raporlanmalı',
    '- agent-loop/next-version-prompt.md oluşmalı',
    '- STOP kuralı varsa işlem durmalı',
    '',
    '# Latest Result',
    '',
    'Autonomous loop bu hedef için başlatıldı.',
    '',
    '# Next Prompt',
    '',
    `v${targetVersion} hedefini güvenli kapsamda uygula. STOP kurallarında dur.`,
  ].join('\n');

  writeText(paths.task, `${content}\n`);
}

function section(resultText, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = resultText.match(new RegExp(`^## ${escaped}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n## |$)`, 'im'));
  return match?.[1]?.trim() || 'UNKNOWN';
}

function changedFiles() {
  const status = spawnSync('git', ['status', '--short'], {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false,
  });
  return (status.stdout || '').trim() || '(empty)';
}

function writeNextPrompt(version, versionScope) {
  const nextVersion = version;
  const content = [
    '# Next Version Prompt',
    '',
    '## Recommended Target Version',
    '',
    `v${nextVersion}`,
    '',
    '## Goal',
    '',
    versionScope.goal,
    '',
    '## Scope',
    '',
    ...versionScope.scope.map((item) => `- ${item}`),
    '',
    '## Files To Inspect',
    '',
    ...versionScope.files.map((item) => `- ${item}`),
    '',
    '## Allowed Actions',
    '',
    '- Güvenli dokümantasyon güncellemesi',
    '- Küçük frontend / utils düzenlemesi',
    '- Build/lint/test çalıştırma',
    '- CHANGELOG ve result raporu güncelleme',
    '',
    '## Forbidden Actions',
    '',
    '- git commit / git push',
    '- deploy / production config',
    '- canlı DB yazma / migration',
    '- .env / secret / token / API key erişimi',
    '- dosya silme',
    '- npm install / npm publish',
    '- dış network erişimi',
    '',
    '## Acceptance Criteria',
    '',
    `- package.json version ${nextVersion} olmalı`,
    '- npm run build PASS olmalı',
    '- lint/test yoksa SKIPPED yazmalı',
    '- version-result.md güncellenmeli',
    '- STOP yoksa sonraki versiyon önerilmeli',
    '',
    '## STOP Conditions',
    '',
    '- agent-loop/stop-rules.md kuralları geçerlidir.',
  ].join('\n');

  writeText(paths.nextPrompt, `${content}\n`);
}

function updateState(state, patch) {
  writeJson(paths.state, {
    ...state,
    ...patch,
    runCount: Number(state.runCount || 0) + 1,
  });
}

function appendAutonomousResult({ previousVersion, targetVersion, finalStatus, stopReason, nextRecommendedVersion }) {
  const current = readText(paths.versionResult);
  const block = [
    '## Autonomous Loop',
    '',
    `Previous Version: ${previousVersion}`,
    `Selected Target Version: ${targetVersion}`,
    `Final Status: ${finalStatus}`,
    `Stop Reason: ${stopReason || '(none)'}`,
    `Next Recommended Version: ${nextRecommendedVersion}`,
  ].join('\n');
  writeText(paths.versionResult, `${current.trimEnd()}\n\n${block}\n`);
}

function printSummary(summary) {
  console.log('');
  console.log('AUTONOMOUS ERP DEVELOPMENT LOOP RESULT');
  console.log('');
  console.log(`Previous Version: ${summary.previousVersion}`);
  console.log(`Selected Target Version: ${summary.targetVersion}`);
  console.log(`Final Status: ${summary.finalStatus}`);
  console.log(`Changed Files: ${summary.changedFiles}`);
  console.log(`Commands Run: ${summary.commandsRun}`);
  console.log(`Build: ${summary.build}`);
  console.log(`Lint: ${summary.lint}`);
  console.log(`Test: ${summary.test}`);
  console.log(`Risk: ${summary.risk}`);
  console.log(`Stopped?: ${summary.stopped}`);
  console.log(`Stop Reason: ${summary.stopReason}`);
  console.log(`Next Recommended Version: ${summary.nextRecommendedVersion}`);
  console.log(`Next Prompt File: agent-loop/next-version-prompt.md`);
  console.log(`Next Action: ${summary.nextAction}`);
}

function main() {
  mkdirSync(loopDir, { recursive: true });
  const config = readJson(paths.config, {});
  const state = readJson(paths.state, {});
  const pkg = readJson(paths.packageJson, {});
  const roadmap = readText(paths.roadmap);
  readText(paths.versionResult);
  readText(paths.stopRules);

  if (config.enabled === false) {
    printSummary({
      previousVersion: pkg.version || 'UNKNOWN',
      targetVersion: 'NONE',
      finalStatus: 'STOPPED',
      changedFiles: changedFiles(),
      commandsRun: commandsRun.join(', ') || '(none)',
      build: 'SKIPPED',
      lint: 'SKIPPED',
      test: 'SKIPPED',
      risk: 'STOP',
      stopped: 'Yes',
      stopReason: 'autonomous-config.json enabled=false',
      nextRecommendedVersion: state.nextRecommendedVersion || 'UNKNOWN',
      nextAction: 'Autonomous config kontrol edilmeli.',
    });
    process.exit(2);
  }

  const previousVersion = pkg.version || '0.0.0';
  const targetVersion = selectNextVersion(previousVersion, roadmap);
  const selectedScope = scopeForVersion(targetVersion);
  const afterTargetVersion = selectNextVersion(targetVersion, roadmap);
  const afterTargetScope = scopeForVersion(afterTargetVersion);

  if ((config.maxVersionsPerRun || 1) > 1) {
    // Bilincli sinir: bu runner su an her calistirmada tek versiyon ilerler.
  }

  if (config.autoUpdateVersionTarget !== false) {
    updateVersionTarget(targetVersion, config);
  }
  if (config.autoUpdateTaskFile !== false) {
    updateTask(targetVersion, selectedScope);
  }

  const risk = run('node', ['scripts/agent-loop-risk-guard.mjs']);
  if (risk.code === 2) {
    const stopReason = 'Risk guard HIGH_RISK tespit etti.';
    updateState(state, {
      currentTargetVersion: targetVersion,
      nextRecommendedVersion: afterTargetVersion,
      lastRunStatus: 'STOPPED',
      lastStopReason: stopReason,
    });
    writeNextPrompt(targetVersion, selectedScope);
    appendAutonomousResult({ previousVersion, targetVersion, finalStatus: 'STOPPED', stopReason, nextRecommendedVersion: afterTargetVersion });
    printSummary({
      previousVersion,
      targetVersion,
      finalStatus: 'STOPPED',
      changedFiles: changedFiles(),
      commandsRun: commandsRun.join(', '),
      build: 'SKIPPED',
      lint: 'SKIPPED',
      test: 'SKIPPED',
      risk: 'STOP',
      stopped: 'Yes',
      stopReason,
      nextRecommendedVersion: afterTargetVersion,
      nextAction: 'STOP sebebi insan tarafindan incelenmeli.',
    });
    process.exit(2);
  }

  const versionRun = run('node', ['scripts/agent-loop-version-runner.mjs']);
  const resultText = readText(paths.versionResult);
  const build = section(resultText, 'Build Result').split(/\r?\n/)[0];
  const lint = section(resultText, 'Lint Result').split(/\r?\n/)[0];
  const test = section(resultText, 'Test Result').split(/\r?\n/)[0];
  const resultRisk = section(resultText, 'Risk Review').split(/\r?\n/)[0];
  const stopStatus = section(resultText, 'Stop Status').split(/\r?\n/)[0];
  const finalStatus = versionRun.code === 0 ? section(resultText, 'Final Status').split(/\r?\n/)[0] : 'FAILED';
  const stopped = stopStatus === 'STOPPED' || versionRun.code === 2 ? 'Yes' : 'No';
  const stopReason = stopped === 'Yes' ? 'version runner STOP veya risk guard STOP' : '(none)';

  if (config.autoGenerateNextPrompt !== false) {
    writeNextPrompt(afterTargetVersion, afterTargetScope);
  }

  const completed = versionRun.code === 0 && stopped === 'No';
  updateState(state, {
    lastCompletedVersion: completed ? targetVersion : state.lastCompletedVersion,
    currentTargetVersion: targetVersion,
    nextRecommendedVersion: afterTargetVersion,
    lastRunStatus: finalStatus,
    lastStopReason: stopped === 'Yes' ? stopReason : null,
  });
  appendAutonomousResult({ previousVersion, targetVersion, finalStatus, stopReason, nextRecommendedVersion: afterTargetVersion });

  printSummary({
    previousVersion,
    targetVersion,
    finalStatus,
    changedFiles: 'agent-loop/version-result.md dosyasinda listelendi',
    commandsRun: commandsRun.join(', '),
    build,
    lint,
    test,
    risk: resultRisk,
    stopped,
    stopReason,
    nextRecommendedVersion: afterTargetVersion,
    nextAction: completed ? 'Bir sonraki calistirmada autonomous loop sonraki versiyonu secer.' : 'version-result.md incelenmeli.',
  });

  if (versionRun.code !== 0) {
    process.exitCode = versionRun.code;
  }
}

main();
