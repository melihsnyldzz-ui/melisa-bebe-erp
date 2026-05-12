import { fileExists, formatSection, readPackageName, requiredFiles, runReadOnly } from "./agent-loop-utils.mjs";

const checks = [];

checks.push(`Repo klasoru: ${process.cwd()}`);
checks.push(`package.json: ${fileExists("package.json") ? "var" : "yok"}`);
checks.push(`Proje adi: ${readPackageName() || "okunamadi"}`);
checks.push(`src klasoru: ${fileExists("src") ? "var" : "yok"}`);

const missing = requiredFiles.filter((file) => !fileExists(file));
checks.push(`Agent-loop dosyalari: ${missing.length === 0 ? "tam" : `${missing.length} eksik`}`);

const nodeVersion = runReadOnly("node", ["--version"]);
const npmVersion = runReadOnly("npm", ["--version"]);

console.log("Melisa Bebe ERP Lokal Checklist");
console.log("");
console.log(formatSection("Proje", checks));
console.log("");
console.log(formatSection("Ortam", [
  `Node: ${nodeVersion.ok ? nodeVersion.stdout.trim() : "kontrol edilemedi"}`,
  `npm: ${npmVersion.ok ? npmVersion.stdout.trim() : "kontrol edilemedi"}`,
  "Dis servis entegrasyonlari: kapsam disi"
]));

if (missing.length > 0) {
  console.log("");
  console.log(formatSection("Eksik Agent Loop Dosyalari", missing));
}

console.log("");
console.log("Güvenlik: Bu komut git, paket, DB veya gerçek veri işlemi yapmadı.");
