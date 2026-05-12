import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const loopDir = resolve(rootDir, 'agent-loop');
const resultPath = resolve(loopDir, 'version-result.md');

function run(command, args) {
  const resolvedCommand = process.platform === 'win32' && ['npm', 'npx', 'pnpm', 'yarn'].includes(command)
    ? `${command}.cmd`
    : command;
  const result = spawnSync(resolvedCommand, args, {
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

function appendResult(text) {
  mkdirSync(loopDir, { recursive: true });
  const current = existsSync(resultPath) ? readFileSync(resultPath, 'utf8') : '# Version Target Result\n';
  writeFileSync(resultPath, `${current.trimEnd()}\n\n${text.trim()}\n`, 'utf8');
}

function pathsFromStatus(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^..\s+/, '').replace(/^"?(.+?)"?$/, '$1'))
    .flatMap((line) => line.includes(' -> ') ? line.split(' -> ').slice(-1) : [line])
    .filter(Boolean);
}

function pathsFromDiff(output) {
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/\/$/, '').toLowerCase();
}

function classifyPath(filePath) {
  const normalized = normalizePath(filePath);

  if (
    normalized === '.env'
    || normalized === '.env.local'
    || normalized.includes('/.env')
    || /(^|\/)(secrets|keys|credential|credentials|token|tokens|api-key|api-keys)(\/|$)/.test(normalized)
    || /(^|\/)config\/production(\/|$)/.test(normalized)
    || /(^|\/)(deploy|migrations|database|db|sql|cpanel|hosting)(\/|$)/.test(normalized)
  ) {
    return 'HIGH_RISK';
  }

  if (
    normalized === 'package.json'
    || normalized === 'package-lock.json'
    || normalized.includes('vite.config')
    || normalized.includes('tsconfig')
    || normalized.startsWith('scripts/')
    || normalized.startsWith('src/api')
    || normalized.startsWith('src/services')
    || normalized.startsWith('src/integrations')
  ) {
    return 'MEDIUM_RISK';
  }

  if (
    normalized === 'readme.md'
    || normalized === 'changelog.md'
    || normalized === 'erp_roadmap.md'
    || normalized.startsWith('agent-loop/')
    || normalized.startsWith('docs/')
    || normalized.endsWith('.md')
  ) {
    return 'LOW_RISK';
  }

  return 'MEDIUM_RISK';
}

function main() {
  const status = run('git', ['status', '--short']);
  const diff = run('git', ['diff', '--name-only']);

  if (status.code !== 0 || diff.code !== 0) {
    const message = [
      'STOP',
      'Risk guard git durumunu okuyamadi.',
      status.stderr.trim(),
      diff.stderr.trim(),
    ].filter(Boolean).join('\n');
    appendResult(`## Risk Guard\n\n${message}`);
    console.error(message);
    process.exit(2);
  }

  const changedPaths = [...new Set([
    ...pathsFromStatus(status.stdout),
    ...pathsFromDiff(diff.stdout),
  ])];

  const classified = changedPaths.map((filePath) => ({
    filePath,
    risk: classifyPath(filePath),
  }));

  const high = classified.filter((item) => item.risk === 'HIGH_RISK');
  const medium = classified.filter((item) => item.risk === 'MEDIUM_RISK');
  const low = classified.filter((item) => item.risk === 'LOW_RISK');
  const finalRisk = high.length ? 'STOP' : medium.length ? 'MEDIUM_RISK' : 'SAFE';

  const report = [
    '## Risk Guard',
    '',
    `Status: ${finalRisk}`,
    '',
    '### HIGH_RISK',
    high.length ? high.map((item) => `- ${item.filePath}`).join('\n') : '- Yok',
    '',
    '### MEDIUM_RISK',
    medium.length ? medium.map((item) => `- ${item.filePath}`).join('\n') : '- Yok',
    '',
    '### LOW_RISK',
    low.length ? low.map((item) => `- ${item.filePath}`).join('\n') : '- Yok',
  ].join('\n');

  appendResult(report);
  console.log(report);

  if (high.length) {
    process.exit(2);
  }
}

main();
