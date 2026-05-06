import { getTodayISO } from "./dateUtils.js";

export function getAdjustableStockCountItems(items = []) {
  return items.filter((item) => toNumber(item.difference) !== 0).map(normalizeAdjustmentItem);
}

export function buildStockAdjustmentSummary(items = []) {
  return items.reduce(
    (summary, item) => {
      const difference = Number(item.difference) || 0;
      return {
        lineCount: summary.lineCount + 1,
        shortageQuantity: summary.shortageQuantity + (difference < 0 ? Math.abs(difference) : 0),
        surplusQuantity: summary.surplusQuantity + (difference > 0 ? difference : 0),
        netDifference: summary.netDifference + difference,
      };
    },
    {
      lineCount: 0,
      shortageQuantity: 0,
      surplusQuantity: 0,
      netDifference: 0,
    },
  );
}

export function buildStockAdjustmentPayload(items = []) {
  return {
    date: getTodayISO(),
    description: "Barkodlu stok sayım düzeltmesi",
    items: getAdjustableStockCountItems(items),
  };
}

export function validateStockAdjustmentPayload(payload) {
  if (!payload?.date) return "Sayım tarihi bulunamadı.";
  if (!Array.isArray(payload.items) || payload.items.length === 0) return "Düzeltilecek ürün bulunamadı.";

  const productIds = new Set();
  for (const item of payload.items) {
    if (!item.productId) return "Düzeltilecek ürün bulunamadı.";
    if (productIds.has(Number(item.productId))) return "Aynı ürün birden fazla satırda görünüyor. Lütfen listeyi kontrol edin.";
    productIds.add(Number(item.productId));

    if (!isSafeNumber(item.countedQuantity) || Number(item.countedQuantity) < 0) return "Sayım miktarı geçersiz.";
    if (!isSafeNumber(item.currentStock) || !isSafeNumber(item.difference)) return "Sayım miktarı geçersiz.";
  }

  return "";
}

export function buildStockCountReference(value = new Date().toISOString()) {
  const digits = value.replace(/\D/g, "");
  const datePart = digits.slice(0, 8);
  const timePart = digits.slice(8, 14);
  return `SAYIM-${datePart}-${timePart}`;
}

function normalizeAdjustmentItem(item) {
  const currentStock = Number(item.currentStock);
  const countedQuantity = Number(item.countedQuantity);

  return {
    productId: item.productId,
    productCode: item.productCode || "",
    barcode: item.barcode || "",
    productName: item.productName || "",
    size: item.size || "",
    color: item.color || "",
    currentStock,
    countedQuantity,
    difference: countedQuantity - currentStock,
  };
}

function isSafeNumber(value) {
  return Number.isFinite(Number(value));
}

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}
