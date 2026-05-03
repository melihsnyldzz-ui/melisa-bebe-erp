export function canUseDesktopBridge() {
  return typeof window !== "undefined" && Boolean(window.electronAPI);
}

export function openPurchaseSlipWindow() {
  return window.electronAPI?.openPurchaseSlipWindow?.();
}

export function openSalesSlipWindow() {
  return window.electronAPI?.openSalesSlipWindow?.();
}
