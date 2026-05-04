const path = require("node:path");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { exportDatabaseBackup, initializeDatabase } = require("./database/db.cjs");
const { createRepositories } = require("./database/repositories.cjs");

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:5173";
let repositories;

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
  repositories = createRepositories(initializeDatabase(app), {
    createBackup: () => exportDatabaseBackup(app),
  });
  registerErpHandlers();
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

function registerErpHandlers() {
  ipcMain.handle("erp:get-initial-data", () => repositories.getInitialErpData());
  ipcMain.handle("erp:export-database-backup", (_event, targetDirectory) => exportDatabaseBackup(app, targetDirectory));
  ipcMain.handle("erp:get-app-settings", () => repositories.getAppSettings());
  ipcMain.handle("erp:update-app-setting", (_event, key, value) => repositories.updateAppSetting(key, value));
  ipcMain.handle("erp:start-live-mode", () => repositories.startLiveMode());
  ipcMain.handle("erp:get-all-currencies", () => repositories.getAllCurrencies());
  ipcMain.handle("erp:get-all-exchange-rates", () => repositories.getAllExchangeRates());
  ipcMain.handle("erp:get-all-current-accounts", () => repositories.getAllCurrentAccounts());
  ipcMain.handle("erp:get-all-current-account-movements", () => repositories.getAllCurrentAccountMovements());
  ipcMain.handle("erp:get-all-product-barcodes", () => repositories.getAllProductBarcodes());
  ipcMain.handle("erp:get-all-warehouses", () => repositories.getAllWarehouses());
  ipcMain.handle("erp:get-all-stock-balances", () => repositories.getAllStockBalances());
  ipcMain.handle("erp:get-all-price-lists", () => repositories.getAllPriceLists());
  ipcMain.handle("erp:get-all-price-list-items", () => repositories.getAllPriceListItems());
  ipcMain.handle("erp:get-all-document-numbers", () => repositories.getAllDocumentNumbers());
  ipcMain.handle("erp:save-purchase-slip", (_event, payload) => repositories.savePurchaseSlip(payload));
  ipcMain.handle("erp:save-sales-slip", (_event, payload) => repositories.saveSalesSlip(payload));
  ipcMain.handle("erp:save-collection", (_event, payload) => repositories.saveCollection(payload));
  ipcMain.handle("erp:save-payment", (_event, payload) => repositories.savePayment(payload));
  ipcMain.handle("erp:cancel-purchase-slip", (_event, id) => repositories.cancelPurchaseSlip(id));
  ipcMain.handle("erp:cancel-sales-slip", (_event, id) => repositories.cancelSalesSlip(id));
  ipcMain.handle("erp:cancel-collection", (_event, id) => repositories.cancelCollection(id));
  ipcMain.handle("erp:cancel-payment", (_event, id) => repositories.cancelPayment(id));
  ipcMain.handle("erp:add-product", (_event, payload) => repositories.addProduct(payload));
  ipcMain.handle("erp:update-product", (_event, payload) => repositories.updateProduct(payload));
  ipcMain.handle("erp:toggle-product-status", (_event, id) => repositories.toggleProductStatus(id));
  ipcMain.handle("erp:add-customer", (_event, payload) => repositories.addCustomer(payload));
  ipcMain.handle("erp:update-customer", (_event, payload) => repositories.updateCustomer(payload));
  ipcMain.handle("erp:toggle-customer-status", (_event, id) => repositories.toggleCustomerStatus(id));
  ipcMain.handle("erp:add-supplier", (_event, payload) => repositories.addSupplier(payload));
  ipcMain.handle("erp:update-supplier", (_event, payload) => repositories.updateSupplier(payload));
  ipcMain.handle("erp:toggle-supplier-status", (_event, id) => repositories.toggleSupplierStatus(id));
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
