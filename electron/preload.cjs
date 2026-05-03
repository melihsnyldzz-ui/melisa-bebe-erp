const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openPurchaseSlipWindow: () => ipcRenderer.invoke("purchase-slip-window:open"),
  openSalesSlipWindow: () => ipcRenderer.invoke("sales-slip-window:open"),
});
