import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

export const repoRoot = process.cwd();

export const requiredFiles = [
  "agent-loop/AGENTS.md",
  "agent-loop/orchestrator-prompt.md",
  "agent-loop/codex-task-template.md",
  "agent-loop/review-template.md",
  "agent-loop/stop-rules.md",
  "agent-loop/STOP_RULES.md",
  "agent-loop/loop-config.example.json",
  "agent-loop/README.md",
  "agent-loop/task.md",
  "agent-loop/last-codex-output.md",
  "agent-loop/chatgpt-review-prompt.md",
  "agent-loop/next-codex-prompt.md",
  "scripts/agent-loop-checklist.mjs",
  "scripts/agent-loop-review.mjs",
  "scripts/agent-loop-generate-prompt.mjs",
  "scripts/agent-loop-runner.mjs",
  "scripts/agent-loop-orchestrator.mjs"
];

export function toNative(filePath) {
  return filePath.split("/").join(path.sep);
}

export function fileExists(filePath) {
  return existsSync(path.join(repoRoot, toNative(filePath)));
}

export function runReadOnly(command, args = []) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false
  });

  return {
    ok: result.status === 0,
    status: result.status,
    stdout: sanitize(result.stdout || ""),
    stderr: sanitize(result.stderr || "")
  };
}

export function sanitize(text) {
  return text
    .replace(/sk-[A-Za-z0-9_-]{12,}/g, "sk-***")
    .replace(/\b\d{8,}:[A-Za-z0-9_-]{20,}\b/g, "***telegram-token***")
    .replace(/Authorization:\s*Bearer\s+\S+/gi, "Authorization: Bearer ***");
}

export function readPackageName() {
  const packagePath = path.join(repoRoot, "package.json");
  if (!existsSync(packagePath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
    return pkg.name || null;
  } catch {
    return null;
  }
}

export function formatSection(title, lines) {
  return [`## ${title}`, ...lines.map((line) => `- ${line}`)].join("\n");
}
