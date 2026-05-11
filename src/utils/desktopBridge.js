export function canUseDesktopBridge() {
  return typeof window !== "undefined" && Boolean(window.electronAPI);
}

export function openPurchaseSlipWindow() {
  return window.electronAPI?.openPurchaseSlipWindow?.();
}

export function openSalesSlipWindow() {
  return window.electronAPI?.openSalesSlipWindow?.();
}

export function canUseDatabaseBackup() {
  return typeof window !== "undefined" && Boolean(window.electronAPI?.erp?.exportDatabaseBackup);
}

export function exportDatabaseBackup(targetDirectory) {
  return window.electronAPI.erp.exportDatabaseBackup(targetDirectory);
}

export function canUsePersistentDatabase() {
  return typeof window !== "undefined" && Boolean(window.electronAPI?.erp?.getInitialData);
}

export function canUseVegaReadOnlyBridge() {
  return typeof window !== "undefined" && Boolean(window.electronAPI?.vegaReadOnly?.listStock);
}

export function canUseVegaMetadataBridge() {
  return typeof window !== "undefined" && Boolean(window.electronAPI?.vegaReadOnly?.discoverStockMovementMetadata);
}

export function discoverVegaStockMovementMetadata() {
  return window.electronAPI.vegaReadOnly.discoverStockMovementMetadata();
}

export function listVegaStockReadOnly() {
  return window.electronAPI.vegaReadOnly.listStock();
}

export function getDatabaseModeLabel() {
  return canUsePersistentDatabase() ? "Electron SQLite · Kalıcı veri" : "Tarayıcı modu · Geçici veri";
}
