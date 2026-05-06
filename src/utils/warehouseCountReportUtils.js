import { buildCountBasketSummary, getBasketDifferenceStatus } from "./warehouseCountBasketUtils.js";

export function buildWarehouseCountPreviewReport(basket = [], value = new Date()) {
  const safeBasket = Array.isArray(basket) ? basket : [];
  const summary = buildCountBasketSummary(safeBasket);
  const totalSystemStock = safeBasket.reduce((total, item) => total + toNumber(item.currentStock), 0);
  const netDifference = safeBasket.reduce((total, item) => total + toNumber(item.difference), 0);

  return {
    documentType: "DEPO_TERMINAL_COUNT_PREVIEW",
    source: "WAREHOUSE_TERMINAL_READ_ONLY",
    createdAt: value instanceof Date ? value.toISOString() : new Date(value).toISOString(),
    summary: {
      lineCount: summary.lineCount,
      totalCountedQuantity: summary.totalCountedQuantity,
      totalSystemStock,
      netDifference,
      surplusCount: summary.surplusCount,
      shortageCount: summary.shortageCount,
      matchedCount: summary.matchedCount,
    },
    items: safeBasket.map((item) => ({
      productName: item.productName || "-",
      barcode: item.barcode || "-",
      code: item.code || "-",
      size: item.size || "-",
      color: item.color || "-",
      currentStock: toNumber(item.currentStock),
      countedQuantity: toNumber(item.countedQuantity),
      difference: toNumber(item.difference),
      status: getBasketDifferenceStatus(item.difference),
    })),
  };
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
