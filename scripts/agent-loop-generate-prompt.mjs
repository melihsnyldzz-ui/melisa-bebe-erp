import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const loopDir = resolve(rootDir, 'agent-loop');
const outputPath = resolve(loopDir, 'generated-codex-prompt.md');

function readText(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

mkdirSync(loopDir, { recursive: true });

const task = readText(resolve(loopDir, 'task.md'));
const target = readText(resolve(loopDir, 'version-target.json'));
const roadmap = readText(resolve(rootDir, 'ERP_ROADMAP.md'));
let targetVersion = 'unknown';

try {
  targetVersion = JSON.parse(target).targetVersion || 'unknown';
} catch {
  targetVersion = 'unknown';
}

const prompt = [
  '# Generated Codex Prompt',
  '',
  '## Gorev Ozeti',
  'Melisa Bebe ERP hedef versiyon loop gorevini guvenli sekilde uygula.',
  '',
  '## Hedef Versiyon',
  targetVersion,
  '',
  '## Mevcut Baglam',
  task.trim() || '(task.md bos)',
  '',
  '## ERP Roadmap Ozeti',
  roadmap.trim() ? roadmap.slice(0, 6000) : '(ERP_ROADMAP.md yok veya bos)',
  '',
  '## Izin Verilen Islemler',
  '- Dokumantasyon ve agent-loop dosyalari guncelleme',
  '- Build/lint/test calistirma',
  '- Guvenli hata duzeltme',
  '- CHANGELOG ve package.json version guncelleme',
  '',
  '## Yasak Islemler',
  '- git commit / git push',
  '- deploy / production config',
  '- DB write / migration',
  '- .env, secret, token, API key okuma/yazma',
  '- dosya veya klasor silme',
  '',
  '## Kabul Kriterleri',
  '- npm run agent:version calismali',
  '- agent-loop/version-result.md olusmali',
  '- build sonucu raporlanmali',
  '- lint/test sonucu PASS veya SKIPPED olmali',
  '- STOP kurallari korunmali',
  '',
  '## STOP Kurallari',
  'agent-loop/stop-rules.md dosyasindaki kurallar gecerlidir.',
  '',
  '## Build/Lint/Test Beklentileri',
  '- npm run build',
  '- npm run lint varsa calistir',
  '- npm test varsa calistir',
  '',
  '## Final Rapor Formati',
  'VERSION TARGET LOOP RESULT',
].join('\n');

writeFileSync(outputPath, `${prompt}\n`, 'utf8');
console.log(`Generated Prompt: ${outputPath}`);
