const path = require("node:path");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:5173";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 720,
    title: "Melisa Bebe ERP",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.once("ready-to-show", () => mainWindow.show());

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  return mainWindow;
}

function createSlipWindow(type) {
  const title = type === "purchase" ? "Yeni Alış Fişi" : "Yeni Satış Fişi";
  const windowParam = type === "purchase" ? "purchase-slip" : "sales-slip";
  const slipWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 980,
    minHeight: 700,
    title,
    show: false,
    parent: BrowserWindow.getFocusedWindow() || undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  slipWindow.setMenuBarVisibility(false);
  slipWindow.once("ready-to-show", () => slipWindow.show());

  if (isDev) {
    slipWindow.loadURL(`${devServerUrl}?window=${windowParam}`);
  } else {
    slipWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"), {
      query: { window: windowParam },
    });
  }

  return slipWindow;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createMainWindow();

  ipcMain.handle("purchase-slip-window:open", () => {
    createSlipWindow("purchase");
    return true;
  });

  ipcMain.handle("sales-slip-window:open", () => {
    createSlipWindow("sales");
    return true;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
