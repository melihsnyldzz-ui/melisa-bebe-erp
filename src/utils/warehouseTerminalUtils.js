import { normalizeLookupValue } from "./productLookup.js";

const MAX_MOVEMENT_ROWS = 8;
const MAX_SCAN_HISTORY = 20;
const MAX_PARTIAL_MATCHES = 10;
const WAREHOUSE_HISTORY_KEY = "melisa-bebe-warehouse-terminal-history";

export function findWarehouseTerminalMatches(products = [], value) {
  const normalizedValue = normalizeLookupValue(value);
  const sourceProducts = Array.isArray(products) ? products : [];
  if (!normalizedValue) return { exactProduct: null, partialProducts: [] };

  const exactProduct =
    sourceProducts.find((product) =>
      getWarehouseLookupValues(product).some((candidate) => candidate === normalizedValue),
    ) || null;

  if (exactProduct) return { exactProduct, partialProducts: [] };

  const partialProducts = sourceProducts
    .filter((product) => getWarehouseLookupValues(product).some((candidate) => candidate.includes(normalizedValue)))
    .slice(0, MAX_PARTIAL_MATCHES);

  return { exactProduct: null, partialProducts };
}

export function buildWarehouseProductView(product, stockMovements = []) {
  if (!product) return null;

  const movements = Array.isArray(stockMovements) ? stockMovements : [];
  const productId = product.id;
  const productCode = normalizeLookupValue(product.code);
  const barcode = normalizeLookupValue(product.barcode);
  const variantCode = normalizeLookupValue(product.variantCode);
  const relatedMovements = movements
    .filter((movement) => {
      const movementProductId = movement.productId;
      return (
        (productId && movementProductId === productId) ||
        normalizeLookupValue(movement.productCode) === productCode ||
        normalizeLookupValue(movement.barcode) === barcode ||
        normalizeLookupValue(movement.variantCode) === variantCode
      );
    })
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .slice(0, MAX_MOVEMENT_ROWS);

  const stockQuantity = toNumber(product.stockQuantity);
  const criticalStockLevel = toNumber(product.criticalStockLevel);

  return {
    id: product.id,
    barcode: product.barcode || "",
    code: product.code || "",
    variantCode: product.variantCode || "",
    modelCode: product.modelCode || "",
    name: product.name || "",
    brand: product.brand || "",
    season: product.season || "",
    ageGroup: product.ageGroup || "",
    gender: product.gender || "",
    category: product.category || "",
    size: product.size || "",
    color: product.color || "",
    supplier: product.supplier || "",
    purchasePrice: toNumber(product.purchasePrice),
    salePrice: toNumber(product.salePrice),
    stockQuantity,
    criticalStockLevel,
    isActive: product.isActive !== false,
    status: resolveWarehouseStockStatus(stockQuantity, criticalStockLevel, product.isActive !== false),
    movements: relatedMovements,
  };
}

function getWarehouseLookupValues(product = {}) {
  return [product.barcode, product.code, product.variantCode, product.modelCode].map(normalizeLookupValue).filter(Boolean);
}

export function appendWarehouseScanHistory(currentHistory, productView, rawValue) {
  const scanRecord = {
    id: `${Date.now()}-${productView?.id || rawValue}`,
    scannedValue: rawValue || "",
    productCode: productView?.code || "",
    barcode: productView?.barcode || "",
    productName: productView?.name || "",
    stockQuantity: productView?.stockQuantity || 0,
    status: productView?.status || "Bulunamadı",
    scannedAt: new Date().toISOString(),
  };

  const nextHistory = [scanRecord, ...(Array.isArray(currentHistory) ? currentHistory : [])].slice(0, MAX_SCAN_HISTORY);
  writeWarehouseScanHistory(nextHistory);

  return nextHistory;
}

export function readWarehouseScanHistory() {
  if (typeof localStorage === "undefined") return [];

  try {
    const parsedHistory = JSON.parse(localStorage.getItem(WAREHOUSE_HISTORY_KEY) || "[]");
    return Array.isArray(parsedHistory) ? parsedHistory.map(normalizeHistoryRecord).filter(Boolean).slice(0, MAX_SCAN_HISTORY) : [];
  } catch (error) {
    console.error("Depo terminali geçmişi okunamadı:", error);
    return [];
  }
}

export function clearWarehouseScanHistory() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(WAREHOUSE_HISTORY_KEY);
  }

  return [];
}

function writeWarehouseScanHistory(history) {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(WAREHOUSE_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Depo terminali geçmişi kaydedilemedi:", error);
  }
}

function normalizeHistoryRecord(record = {}) {
  if (!record || typeof record !== "object") return null;

  return {
    id: record.id || `${record.scannedAt || Date.now()}-${record.barcode || record.productCode || record.scannedValue || "scan"}`,
    scannedValue: record.scannedValue || "",
    productCode: record.productCode || "",
    barcode: record.barcode || "",
    productName: record.productName || "",
    stockQuantity: toNumber(record.stockQuantity),
    status: record.status || "-",
    scannedAt: record.scannedAt || "",
  };
}

function resolveWarehouseStockStatus(stockQuantity, criticalStockLevel, isActive) {
  if (!isActive) return "Pasif ürün";
  if (stockQuantity < 0) return "Negatif stok";
  if (stockQuantity === 0) return "Stok yok";
  if (stockQuantity <= criticalStockLevel) return "Kritik stok";
  return "Sağlıklı";
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
