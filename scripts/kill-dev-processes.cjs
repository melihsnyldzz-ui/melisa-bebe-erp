const { execFileSync } = require("node:child_process");

if (process.platform !== "win32") {
  console.log("Bu otomatik temizleme script’i Windows için hazırlanmıştır.");
  process.exit(0);
}

const killedPids = new Set();

killPortProcess(5173);
killProcessesByName("node.exe");
killProcessesByName("electron.exe");

console.log("Geliştirme ortamı temizlendi. Şimdi npm run electron:dev çalıştırabilirsiniz.");

function killPortProcess(port) {
  const pids = getPidsUsingPort(port);
  if (!pids.length) {
    console.log(`${port} portunu kullanan süreç bulunamadı.`);
    return;
  }

  pids.forEach((pid) => killPid(pid));
  console.log(`${port} portunu kullanan süreç kapatıldı.`);
}

function getPidsUsingPort(port) {
  try {
    const output = execFileSync("netstat", ["-ano"], { encoding: "utf8" });
    const portPattern = new RegExp(`[:.]${port}\\s`);

    return [...new Set(
      output
        .split(/\r?\n/)
        .filter((line) => portPattern.test(line) && /LISTENING/i.test(line))
        .map((line) => line.trim().split(/\s+/).pop())
        .filter(Boolean),
    )];
  } catch (error) {
    console.error(`${port} portunu kontrol ederken hata oluştu: ${error.message}`);
    return [];
  }
}

function killProcessesByName(processName) {
  const pids = getPidsByName(processName);
  if (!pids.length) {
    console.log(`${processName} süreci bulunamadı.`);
    return;
  }

  pids.forEach((pid) => killPid(pid));
  console.log(`${processName} süreçleri kapatıldı.`);
}

function getPidsByName(processName) {
  try {
    const output = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq '${processName}' } | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress`,
      ],
      { encoding: "utf8" },
    ).trim();

    if (!output) return [];

    const rows = JSON.parse(output);
    const processes = Array.isArray(rows) ? rows : [rows];
    const repoPath = process.cwd().toLowerCase();

    return processes
      .filter((row) => String(row.CommandLine || "").toLowerCase().includes(repoPath))
      .map((row) => String(row.ProcessId))
      .filter(Boolean);
  } catch (error) {
    console.error(`${processName} süreçleri listelenirken hata oluştu: ${error.message}`);
    return [];
  }
}

function killPid(pid) {
  if (!pid || killedPids.has(pid) || Number(pid) === process.pid) return;

  try {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    killedPids.add(pid);
  } catch (error) {
    console.error(`${pid} PID numaralı süreç kapatılamadı: ${error.message}`);
  }
}
