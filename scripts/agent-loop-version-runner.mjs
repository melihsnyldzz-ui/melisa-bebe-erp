import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const loopDir = resolve(rootDir, 'agent-loop');
const packagePath = resolve(rootDir, 'package.json');
const targetPath = resolve(loopDir, 'version-target.json');
const taskPath = resolve(loopDir, 'task.md');
const roadmapPath = resolve(rootDir, 'ERP_ROADMAP.md');
const planPath = resolve(loopDir, 'version-plan.md');
const resultPath = resolve(loopDir, 'version-result.md');
const changelogPath = resolve(rootDir, 'CHANGELOG.md');

const commandsRun = [];
const remainingIssues = [];

function readText(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

function writeText(file, text) {
  writeFileSync(file, text, 'utf8');
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

function hasScript(pkg, name) {
  return Boolean(pkg.scripts?.[name]);
}

function summarizeResult(result) {
  const text = [result.stdout, result.stderr].join('\n').trim();
  return text.length > 6000 ? `${text.slice(0, 6000)}\n[truncated]` : text;
}

function updateVersionPlan({ currentVersion, targetVersion, maxIterations }) {
  const task = readText(taskPath).trim();
  const roadmap = readText(roadmapPath).trim();
  const content = [
    '# Version Target Plan',
    '',
    '## Current Version',
    currentVersion,
    '',
    '## Target Version',
    targetVersion,
    '',
    '## Scope',
    'Bu versiyon hedefi, güvenli temel iyileştirme hattı içindir.',
    'Öncelik agent-loop altyapısı, güvenli review, build/lint/test kontrolü, changelog ve versiyonlama sistemidir.',
    '',
    '## Task Context',
    task || 'Task okunamadi.',
    '',
    '## Roadmap Context',
    roadmap ? 'ERP_ROADMAP.md bulundu ve planlama bağlamına alındı.' : 'ERP_ROADMAP.md bulunamadi.',
    '',
    '## Allowed Automatic Actions',
    '- Dokümantasyon güncelleme',
    '- Agent-loop scriptleri ekleme/güncelleme',
    '- Build/lint/test çalıştırma',
    '- Güvenli hata düzeltme',
    '- CHANGELOG güncelleme',
    '- package.json version güncelleme',
    '',
    '## Stop Rules',
    'agent-loop/stop-rules.md dosyasındaki kurallar geçerlidir.',
    '',
    '## Iteration Log',
    `- Maksimum iteration: ${maxIterations}`,
    '- Iteration 1 başlatıldı.',
    '',
    '## Final Acceptance Criteria',
    `- npm run agent:version çalışmalı`,
    `- version-result.md oluşmalı`,
    `- package.json version ${targetVersion} olmalı`,
    '- risk raporu oluşmalı',
    '- build sonucu yazmalı',
    '- lint/test sonucu yazmalı veya SKIPPED olmalı',
  ].join('\n');

  writeText(planPath, `${content}\n`);
}

function updatePackageVersion(pkg, targetVersion) {
  const nextPkg = { ...pkg, version: targetVersion };
  writeText(packagePath, `${JSON.stringify(nextPkg, null, 2)}\n`);
}

function updateChangelog(targetVersion) {
  const entry = [
    `## v${targetVersion} - Version Target Loop`,
    '',
    '- Added version-target-loop agent workflow.',
    '- Added local risk guard.',
    '- Added build/lint/test reporting.',
    '- Added version result reporting.',
    '- Preserved STOP rules for deploy, push, DB, secrets, and production changes.',
    '',
  ].join('\n');
  const current = readText(changelogPath);

  if (current.includes(`## v${targetVersion} - Version Target Loop`)) {
    return;
  }

  writeText(changelogPath, `${entry}${current.trim() ? `\n${current.trimStart()}` : ''}`);
}

function changedFiles() {
  const status = spawnSync('git', ['status', '--short'], {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false,
  });
  return (status.stdout || '').trim() || '(empty)';
}

function writeResult({
  targetVersion,
  currentVersion,
  finalStatus,
  buildResult,
  lintResult,
  testResult,
  riskReview,
  stopStatus,
}) {
  const content = [
    '# Version Target Result',
    '',
    '## Target Version',
    targetVersion,
    '',
    '## Current Version',
    currentVersion,
    '',
    '## Final Status',
    finalStatus,
    '',
    '## Changed Files',
    changedFiles(),
    '',
    '## Commands Run',
    commandsRun.length ? commandsRun.map((item) => `- ${item}`).join('\n') : 'Henüz çalıştırılmadı.',
    '',
    '## Build Result',
    buildResult,
    '',
    '## Lint Result',
    lintResult,
    '',
    '## Test Result',
    testResult,
    '',
    '## Risk Review',
    riskReview,
    '',
    '## Stop Status',
    stopStatus,
    '',
    '## Remaining Issues',
    remainingIssues.length ? remainingIssues.map((item) => `- ${item}`).join('\n') : '- Yok',
    '',
    '## Next Recommended Version',
    'v1.82.0',
  ].join('\n');

  writeText(resultPath, `${content}\n`);
}

function main() {
  mkdirSync(loopDir, { recursive: true });

  const pkg = JSON.parse(readText(packagePath));
  const target = JSON.parse(readText(targetPath));
  const currentVersion = pkg.version;
  const targetVersion = target.targetVersion;
  const maxIterations = Number(target.maxIterations || 5);
  let buildResult = 'PENDING';
  let lintResult = 'PENDING';
  let testResult = 'PENDING';
  let riskReview = 'LOW';
  let finalStatus = 'COMPLETED';
  let stopStatus = 'NOT_STOPPED';

  const riskGuard = run('node', ['scripts/agent-loop-risk-guard.mjs']);
  if (riskGuard.code === 2) {
    finalStatus = 'STOPPED';
    stopStatus = 'STOPPED';
    riskReview = 'STOP';
    remainingIssues.push('Risk guard HIGH_RISK değişiklik tespit etti.');
    writeResult({ targetVersion, currentVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus });
    printSummary({ currentVersion, targetVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus });
    process.exit(2);
  }
  if (riskGuard.code !== 0) {
    finalStatus = 'FAILED';
    stopStatus = 'STOPPED';
    riskReview = 'STOP';
    remainingIssues.push('Risk guard çalıştırılamadı.');
    writeResult({ targetVersion, currentVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus });
    printSummary({ currentVersion, targetVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus });
    process.exit(1);
  }
  if (/MEDIUM_RISK/.test(riskGuard.stdout)) {
    riskReview = 'MEDIUM';
  }

  updateVersionPlan({ currentVersion, targetVersion, maxIterations });

  run('git', ['status', '--short']);
  run('git', ['diff', '--stat']);

  const build = run('npm', ['run', 'build']);
  buildResult = build.code === 0 ? 'PASS' : `FAIL\n${summarizeResult(build)}`;
  if (build.code !== 0) {
    finalStatus = 'FAILED';
    remainingIssues.push('Build başarısız oldu; otomatik güvenli düzeltme uygulanamadı.');
  }

  if (hasScript(pkg, 'lint')) {
    const lint = run('npm', ['run', 'lint']);
    lintResult = lint.code === 0 ? 'PASS' : `FAIL\n${summarizeResult(lint)}`;
    if (lint.code !== 0) {
      finalStatus = finalStatus === 'FAILED' ? 'FAILED' : 'COMPLETED_WITH_WARNINGS';
      remainingIssues.push('Lint başarısız oldu; otomatik güvenli düzeltme uygulanamadı.');
    }
  } else {
    lintResult = 'SKIPPED - no lint script';
  }

  if (hasScript(pkg, 'test')) {
    const test = run('npm', ['test']);
    testResult = test.code === 0 ? 'PASS' : `FAIL\n${summarizeResult(test)}`;
    if (test.code !== 0) {
      finalStatus = finalStatus === 'FAILED' ? 'FAILED' : 'COMPLETED_WITH_WARNINGS';
      remainingIssues.push('Test başarısız oldu; otomatik güvenli düzeltme uygulanamadı.');
    }
  } else {
    testResult = 'SKIPPED - no test script';
  }

  if (target.allowPackageVersionUpdate) {
    updatePackageVersion(pkg, targetVersion);
  }
  if (target.allowChangelogUpdate) {
    updateChangelog(targetVersion);
  }

  if (finalStatus === 'COMPLETED' && riskReview === 'MEDIUM') {
    finalStatus = 'COMPLETED_WITH_WARNINGS';
  }

  writeResult({ targetVersion, currentVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus });
  printSummary({ currentVersion, targetVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus });

  if (finalStatus === 'FAILED') {
    process.exitCode = 1;
  }
}

function oneLine(value) {
  return String(value).split(/\r?\n/)[0];
}

function printSummary({ currentVersion, targetVersion, finalStatus, buildResult, lintResult, testResult, riskReview, stopStatus }) {
  console.log('');
  console.log('VERSION TARGET LOOP RESULT');
  console.log('');
  console.log(`Current Version: ${currentVersion}`);
  console.log(`Target Version: ${targetVersion}`);
  console.log(`Final Status: ${finalStatus}`);
  console.log(`Changed Files: agent-loop/version-result.md dosyasinda listelendi`);
  console.log(`Commands Run: ${commandsRun.join(', ')}`);
  console.log(`Build: ${oneLine(buildResult)}`);
  console.log(`Lint: ${oneLine(lintResult)}`);
  console.log(`Test: ${oneLine(testResult)}`);
  console.log(`Risk: ${riskReview}`);
  console.log(`Stopped?: ${stopStatus === 'STOPPED' ? 'Yes' : 'No'}`);
  console.log('Next Recommended Action: npm run agent:version sonucunu ve agent-loop/version-result.md dosyasini kontrol et.');
}

main();
