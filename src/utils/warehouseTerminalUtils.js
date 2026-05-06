import { normalizeLookupValue } from "./productLookup.js";

const MAX_MOVEMENT_ROWS = 8;
const MAX_SCAN_HISTORY = 12;

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

  return [scanRecord, ...(Array.isArray(currentHistory) ? currentHistory : [])].slice(0, MAX_SCAN_HISTORY);
}

function resolveWarehouseStockStatus(stockQuantity, criticalStockLevel, isActive) {
  if (!isActive) return "Pasif ürün";
  if (stockQuantity < 0) return "Negatif stok";
  if (stockQuantity === 0) return "Stok yok";
  if (stockQuantity <= criticalStockLevel) return "Kritik stok";
  return "Satışa hazır";
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
