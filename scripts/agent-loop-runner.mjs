import { spawnSync } from 'node:child_process';

function run(label, command, args) {
  const resolvedCommand = process.platform === 'win32' && ['npm', 'npx', 'pnpm', 'yarn'].includes(command)
    ? `${command}.cmd`
    : command;
  const result = spawnSync(resolvedCommand, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: false,
  });

  return {
    label,
    code: result.error ? 1 : result.status ?? 0,
    stdout: result.stdout || '',
    stderr: result.error ? `${result.error.message}\n${result.stderr || ''}` : result.stderr || '',
  };
}

const steps = [
  run('Task Reader', 'node', ['scripts/agent-loop-task-reader.mjs']),
  run('Review', 'node', ['scripts/agent-loop-review.mjs']),
  run('Prompt Generator', 'node', ['scripts/agent-loop-generate-prompt.mjs']),
];

const failed = steps.find((step) => step.code !== 0 && step.label !== 'Review');
const review = steps.find((step) => step.label === 'Review');
const prompt = steps.find((step) => step.label === 'Prompt Generator');

console.log('AGENT LOOP RESULT');
console.log(`Status: ${failed ? 'FAILED' : 'OK'}`);
console.log(`Risk: ${review?.code === 2 ? 'STOP' : review?.code === 0 ? 'REVIEWED' : 'UNKNOWN'}`);
console.log(`Generated Prompt: ${prompt?.code === 0 ? 'agent-loop/generated-codex-prompt.md' : 'FAILED'}`);
console.log(`Next Action: ${review?.code === 2 ? 'STOP ve insan kontrolu' : 'npm run agent:version veya ChatGPT kontrolu'}`);

if (failed) {
  console.error(failed.stderr || failed.stdout || `${failed.label} failed`);
  process.exit(failed.code || 1);
}
