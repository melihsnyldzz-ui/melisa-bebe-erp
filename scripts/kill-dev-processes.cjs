const { execFileSync } = require("node:child_process");

if (process.platform !== "win32") {
  console.log("Bu otomatik temizleme scripti Windows icin hazirlanmistir.");
  process.exit(0);
}

const killedPids = new Set();
const keepPids = new Set(
  String(process.env.MELISA_ERP_KEEP_PIDS || "")
    .split(",")
    .map((pid) => pid.trim())
    .filter(Boolean),
);

if (process.env.MELISA_ERP_SKIP_PORT_KILL !== "1") {
  killPortProcess(5173);
}
killProcessesByName("node.exe");
killProcessesByName("electron.exe");

console.log("Gelistirme ortami temizlendi. Simdi npm run desktop calistirabilirsiniz.");

function killPortProcess(port) {
  const pids = getPidsUsingPort(port);
  if (!pids.length) {
    console.log(`${port} portunu kullanan surec bulunamadi.`);
    return;
  }

  pids.forEach((pid) => killPid(pid));
  console.log(`${port} portunu kullanan surec kapatildi.`);
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
    console.error(`${port} portu kontrol edilirken hata olustu: ${error.message}`);
    return [];
  }
}

function killProcessesByName(processName) {
  const pids = getPidsByName(processName);
  if (!pids.length) {
    console.log(`${processName} sureci bulunamadi.`);
    return;
  }

  pids.forEach((pid) => killPid(pid));
  console.log(`${processName} surecleri kapatildi.`);
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
    console.error(`${processName} surecleri listelenirken hata olustu: ${error.message}`);
    return [];
  }
}

function killPid(pid) {
  const normalizedPid = String(pid);
  if (!pid || killedPids.has(normalizedPid) || Number(pid) === process.pid || keepPids.has(normalizedPid)) return;

  try {
    execFileSync("taskkill", ["/PID", normalizedPid, "/T", "/F"], { stdio: "ignore" });
    killedPids.add(normalizedPid);
  } catch (error) {
    console.error(`${pid} PID numarali surec kapatilamadi: ${error.message}`);
  }
}
