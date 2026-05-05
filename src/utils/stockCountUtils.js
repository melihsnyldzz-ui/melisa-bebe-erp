import { getTodayISO } from "./dateUtils.js";

export function createStockCountLine(product, quantity = 1) {
  const currentStock = toNumber(product.stockQuantity);
  return calculateStockCountLine({
    id: product.id,
    productId: product.id,
    productCode: product.code || "",
    barcode: product.barcode || "",
    productName: product.name || "-",
    brand: product.brand || "",
    size: product.size || "",
    color: product.color || "",
    currentStock,
    countedQuantity: quantity,
  });
}

export function calculateStockCountLine(line) {
  const countedQuantity = Math.max(0, toNumber(line.countedQuantity));
  const currentStock = toNumber(line.currentStock);
  const difference = countedQuantity - currentStock;

  return {
    ...line,
    countedQuantity,
    currentStock,
    difference,
    status: getStockCountStatus(difference),
  };
}

export function buildStockCountSummary(items) {
  return items.reduce(
    (summary, item) => ({
      lineCount: summary.lineCount + 1,
      totalCountedQuantity: summary.totalCountedQuantity + toNumber(item.countedQuantity),
      matchedLines: summary.matchedLines + (item.status === "MATCHED" ? 1 : 0),
      shortageLines: summary.shortageLines + (item.status === "SHORTAGE" ? 1 : 0),
      surplusLines: summary.surplusLines + (item.status === "SURPLUS" ? 1 : 0),
      netDifference: summary.netDifference + toNumber(item.difference),
    }),
    {
      lineCount: 0,
      totalCountedQuantity: 0,
      matchedLines: 0,
      shortageLines: 0,
      surplusLines: 0,
      netDifference: 0,
    },
  );
}

export function buildStockCountReport(items) {
  const summary = buildStockCountSummary(items);

  return {
    documentType: "STOCK_COUNT",
    source: "ERP_DESKTOP",
    date: getTodayISO(),
    summary,
    items: items.map((item) => ({
      productId: item.productId,
      productCode: item.productCode,
      barcode: item.barcode,
      productName: item.productName,
      currentStock: item.currentStock,
      countedQuantity: item.countedQuantity,
      difference: item.difference,
      status: item.status,
    })),
  };
}

export function getStockCountStatusLabel(status) {
  if (status === "MATCHED") return "Uyumlu";
  if (status === "SHORTAGE") return "Eksik";
  if (status === "SURPLUS") return "Fazla";
  return "-";
}

function getStockCountStatus(difference) {
  if (difference === 0) return "MATCHED";
  return difference > 0 ? "SURPLUS" : "SHORTAGE";
}

function toNumber(value) {
  return Number(value) || 0;
}
