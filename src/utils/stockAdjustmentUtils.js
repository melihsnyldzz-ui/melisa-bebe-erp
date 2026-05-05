import { getTodayISO } from "./dateUtils.js";

export function getAdjustableStockCountItems(items = []) {
  return items
    .filter((item) => Number(item.difference) !== 0)
    .map((item) => ({
      productId: item.productId,
      productCode: item.productCode || "",
      barcode: item.barcode || "",
      productName: item.productName || "",
      size: item.size || "",
      color: item.color || "",
      currentStock: Number(item.currentStock) || 0,
      countedQuantity: Math.max(0, Number(item.countedQuantity) || 0),
      difference: Number(item.difference) || 0,
    }));
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
