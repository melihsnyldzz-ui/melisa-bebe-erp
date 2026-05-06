import { buildCsvContent } from "./exportCsvUtils.js";

export const WAREHOUSE_COUNT_CSV_COLUMNS = [
  { key: "documentType", label: "documentType" },
  { key: "createdAt", label: "createdAt" },
  { key: "productName", label: "productName" },
  { key: "barcode", label: "barcode" },
  { key: "code", label: "code" },
  { key: "size", label: "size" },
  { key: "color", label: "color" },
  { key: "currentStock", label: "currentStock" },
  { key: "countedQuantity", label: "countedQuantity" },
  { key: "difference", label: "difference" },
  { key: "status", label: "status" },
];

export function buildWarehouseCountCsvPreview(report, options = {}) {
  const rows = buildWarehouseCountCsvRows(report);

  return buildCsvContent({
    columns: WAREHOUSE_COUNT_CSV_COLUMNS,
    rows,
    delimiter: options.delimiter || ";",
    includeBom: options.includeBom ?? true,
  });
}

function buildWarehouseCountCsvRows(report = {}) {
  const items = Array.isArray(report.items) ? report.items : [];

  return items.map((item) => ({
    documentType: report.documentType || "DEPO_TERMINAL_COUNT_PREVIEW",
    createdAt: report.createdAt || "",
    productName: item.productName || "-",
    barcode: item.barcode || "-",
    code: item.code || "-",
    size: item.size || "-",
    color: item.color || "-",
    currentStock: toNumber(item.currentStock),
    countedQuantity: toNumber(item.countedQuantity),
    difference: toNumber(item.difference),
    status: item.status || "-",
  }));
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
