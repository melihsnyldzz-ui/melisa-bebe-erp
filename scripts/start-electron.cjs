const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const preferredPort = Number(process.env.MELISA_ERP_PORT || 5173);
const host = "127.0.0.1";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const viteCli = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");
const electronCli = path.join(rootDir, "node_modules", "electron", "cli.js");
const electronBuilderCli = path.join(rootDir, "node_modules", "electron-builder", "cli.js");

let viteProcess;
let electronProcess;
let shuttingDown = false;

main().catch((error) => {
  console.error(`\nMelisa Bebe ERP baslatilamadi: ${error.message}`);
  process.exit(1);
});

async function main() {
  process.chdir(rootDir);

  console.log("Melisa Bebe ERP masaustu modu hazirlaniyor...");
  ensureNodeProject();
  ensureDependencies();
  ensureElectronInstall();
  ensureNativeDependenciesForElectron();
  cleanupRepoProcesses();

  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`${preferredPort} portu dolu; ${port} portu kullanilacak.`);
  }

  const devServerUrl = `http://${host}:${port}`;
  viteProcess = startProcess(process.execPath, [viteCli, "--host", host, "--port", String(port)], {
    env: createChildEnv({ BROWSER: "none" }),
    name: "Vite",
  });

  await waitForUrl(devServerUrl, 45000);

  electronProcess = startProcess(process.execPath, [electronCli, "."], {
    env: createChildEnv({ VITE_DEV_SERVER_URL: devServerUrl }),
    name: "Electron",
  });

  electronProcess.on("exit", (code) => {
    shutdown(code || 0);
  });

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
}

function ensureNodeProject() {
  if (!fs.existsSync(path.join(rootDir, "package.json"))) {
    throw new Error("package.json bulunamadi. Komutu proje klasorunde calistirin.");
  }
}

function ensureDependencies() {
  const nodeModules = path.join(rootDir, "node_modules");

  if (fs.existsSync(nodeModules) && fs.existsSync(viteCli) && fs.existsSync(electronCli)) {
    return;
  }

  console.log("Eksik paketler algilandi; npm install calistiriliyor...");
  runChecked(npmCommand, ["install"], "npm install basarisiz oldu");
}

function ensureElectronInstall() {
  const result = runElectronVersionCheck();

  if (result.status === 0) {
    return;
  }

  console.log("Electron kurulumu dogrulanamadi; Electron paketi onariliyor...");
  const rebuildResult = runCommand(npmCommand, ["rebuild", "electron"]);

  const rebuiltResult = runElectronVersionCheck();
  if (rebuiltResult.status === 0) {
    return;
  }

  console.log("Electron hala acilamadi; paketler yenileniyor...");
  runChecked(npmCommand, ["install"], "npm install basarisiz oldu");

  const installedResult = runElectronVersionCheck();
  if (installedResult.status !== 0) {
    const detail = installedResult.error?.message
      || installedResult.stderr
      || installedResult.stdout
      || rebuildResult.error?.message
      || "Electron version komutu sonuc vermedi.";
    throw new Error(`Electron kurulumu yenilenemedi. Ayrinti: ${detail.trim()}`);
  }
}

function ensureNativeDependenciesForElectron() {
  const result = runElectronNode(["-e", "require('better-sqlite3')"]);
  if (result.status === 0) {
    return;
  }

  const electronAbi = readTextFile(path.join(rootDir, "node_modules", "electron", "abi_version")) || "bilinmiyor";
  console.log(`better-sqlite3 Electron ABI ${electronAbi.trim()} icin yenileniyor...`);

  if (!fs.existsSync(electronBuilderCli)) {
    throw new Error("electron-builder bulunamadi. Once npm install calistirin.");
  }

  runChecked(process.execPath, [electronBuilderCli, "install-app-deps"], "Electron native paketleri yenilenemedi");

  const rebuiltResult = runElectronNode(["-e", "require('better-sqlite3')"]);
  if (rebuiltResult.status !== 0) {
    const detail = rebuiltResult.stderr || rebuiltResult.stdout || rebuiltResult.error?.message || "better-sqlite3 yuklenemedi.";
    throw new Error(`better-sqlite3 Electron ile uyumlu hale getirilemedi. Ayrinti: ${detail.trim()}`);
  }
}

function runElectronVersionCheck() {
  return spawnSync(process.execPath, [electronCli, "--version"], {
    cwd: rootDir,
    encoding: "utf8",
    shell: false,
    stdio: "pipe",
  });
}

function runElectronNode(args) {
  return spawnSync(process.execPath, [electronCli, ...args], {
    cwd: rootDir,
    encoding: "utf8",
    env: createChildEnv({ ELECTRON_RUN_AS_NODE: "1" }),
    shell: false,
    stdio: "pipe",
  });
}

function cleanupRepoProcesses() {
  const script = path.join(rootDir, "scripts", "kill-dev-processes.cjs");
  if (!fs.existsSync(script)) return;

  const result = spawnSync(process.execPath, [script], {
    cwd: rootDir,
    encoding: "utf8",
    env: { ...process.env, MELISA_ERP_KEEP_PIDS: String(process.pid), MELISA_ERP_SKIP_PORT_KILL: "1" },
    stdio: "pipe",
  });

  if (result.status !== 0) {
    console.warn("Eski gelistirme surecleri temizlenirken uyari olustu; devam ediliyor.");
    if (result.stderr) console.warn(result.stderr.trim());
  }
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 50; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`${startPort}-${startPort + 49} araliginda bos port bulunamadi.`);
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

function waitForUrl(url, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          clearInterval(timer);
          resolve();
        }
      } catch {
        if (Date.now() - startedAt > timeoutMs) {
          clearInterval(timer);
          reject(new Error(`Vite sunucusu zamaninda acilmadi: ${url}`));
        }
      }
    }, 500);
  });
}

function startProcess(command, args, options) {
  const child = spawn(command, args, {
    cwd: rootDir,
    env: options.env,
    stdio: "inherit",
    shell: false,
  });

  child.on("error", (error) => {
    throw new Error(`${options.name} baslatilamadi: ${error.message}`);
  });

  return child;
}

function runChecked(command, args, errorMessage) {
  const result = runCommand(command, args);

  if (result.status !== 0) {
    throw new Error(errorMessage);
  }
}

function runCommand(command, args) {
  return spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: false,
  });
}

function createChildEnv(extraEnv) {
  const env = { ...process.env, ...extraEnv };
  if (!extraEnv || !Object.prototype.hasOwnProperty.call(extraEnv, "ELECTRON_RUN_AS_NODE")) {
    delete env.ELECTRON_RUN_AS_NODE;
  }
  return env;
}

function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;

  stopProcess(electronProcess);
  stopProcess(viteProcess);
  process.exit(code);
}

function stopProcess(child) {
  if (!child || child.killed) return;

  if (process.platform === "win32" && child.pid) {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  child.kill("SIGTERM");
}
