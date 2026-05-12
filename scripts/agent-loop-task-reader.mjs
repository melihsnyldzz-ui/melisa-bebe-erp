import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const taskPath = resolve(process.cwd(), 'agent-loop', 'task.md');
const requiredHeadings = [
  'Current Goal',
  'Context',
  'Allowed Actions',
  'Forbidden Actions',
  'Acceptance Criteria',
];

if (!existsSync(taskPath)) {
  console.error('agent-loop/task.md bulunamadi.');
  process.exit(1);
}

const task = readFileSync(taskPath, 'utf8');
const missing = requiredHeadings.filter((heading) => !new RegExp(`^#\\s+${heading}\\s*$`, 'im').test(task));
const currentGoalMatch = task.match(/^#\s+Current Goal\s*\r?\n+([\s\S]*?)(?=\r?\n#\s+|$)/im);
const currentGoal = currentGoalMatch?.[1]?.trim() || '(Current Goal bulunamadi)';

console.log('AGENT LOOP TASK SUMMARY');
console.log('');
console.log(`Task file: ${taskPath}`);
console.log(`Current Goal: ${currentGoal.split(/\r?\n/)[0] || '(empty)'}`);
console.log(`Required headings: ${missing.length ? 'WARN' : 'OK'}`);

if (missing.length) {
  console.log('');
  console.log('Eksik basliklar:');
  for (const heading of missing) {
    console.log(`- ${heading}`);
  }
}
