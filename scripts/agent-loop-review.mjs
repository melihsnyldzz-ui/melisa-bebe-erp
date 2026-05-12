import { spawnSync } from 'node:child_process';

function run(command, args) {
  const resolvedCommand = process.platform === 'win32' && ['npm', 'npx', 'pnpm', 'yarn'].includes(command)
    ? `${command}.cmd`
    : command;
  const result = spawnSync(resolvedCommand, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
  });

  return {
    code: result.error ? 1 : result.status ?? 0,
    stdout: result.stdout || '',
    stderr: result.error ? `${result.error.message}\n${result.stderr || ''}` : result.stderr || '',
  };
}

function pathsFromStatus(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^..\s+/, '').replace(/^"?(.+?)"?$/, '$1'))
    .flatMap((line) => line.includes(' -> ') ? line.split(' -> ').slice(-1) : [line]);
}

function classify(filePath) {
  const value = filePath.replace(/\\/g, '/').toLowerCase();

  if (/env|secret|db|sql|migration|deploy|production|hosting|cpanel/.test(value)) {
    return 'HIGH';
  }
  if (/^(src|components|utils|scripts)\//.test(value) || value === 'package.json') {
    return 'MEDIUM';
  }
  if (/^(docs|agent-loop)\//.test(value) || value.endsWith('.md') || value.includes('readme') || value.includes('changelog')) {
    return 'LOW';
  }
  return 'MEDIUM';
}

const status = run('git', ['status', '--short']);
const diffStat = run('git', ['diff', '--stat']);
const diffName = run('git', ['diff', '--name-only']);
const changed = [...new Set([
  ...pathsFromStatus(status.stdout),
  ...diffName.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
])];

const classified = changed.map((filePath) => ({ filePath, risk: classify(filePath) }));
const hasHigh = classified.some((item) => item.risk === 'HIGH');
const hasMedium = classified.some((item) => item.risk === 'MEDIUM');
const statusLabel = changed.length === 0
  ? 'CLEAN'
  : hasHigh
    ? 'NEEDS_HUMAN_REVIEW and STOP'
    : hasMedium
      ? 'REVIEW_RECOMMENDED'
      : 'SAFE_CHANGES';

console.log('AGENT LOOP REVIEW');
console.log('');
console.log(`Status: ${statusLabel}`);
console.log('');
console.log('Changed Files:');
console.log(classified.length ? classified.map((item) => `- ${item.risk}: ${item.filePath}`).join('\n') : '- Yok');
console.log('');
console.log('git diff --stat:');
console.log(diffStat.stdout.trim() || diffStat.stderr.trim() || '(empty)');

if (hasHigh) {
  process.exitCode = 2;
}
