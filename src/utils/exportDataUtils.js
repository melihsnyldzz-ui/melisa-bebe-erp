export const EXPORT_TYPES = {
  products: {
    label: "Ürün Kartları",
    description: "Ürün kartı, barkod, fiyat ve stok bilgileri.",
    fileKey: "products",
    sourceKey: "products",
    supportsActiveFilter: true,
    columns: [
      { key: "id", label: "id" },
      { key: "code", label: "code" },
      { key: "barcode", label: "barcode" },
      { key: "variantCode", label: "variantCode" },
      { key: "modelCode", label: "modelCode" },
      { key: "name", label: "name" },
      { key: "brand", label: "brand" },
      { key: "season", label: "season" },
      { key: "ageGroup", label: "ageGroup" },
      { key: "gender", label: "gender" },
      { key: "category", label: "category" },
      { key: "size", label: "size" },
      { key: "color", label: "color" },
      { key: "purchasePrice", label: "purchasePrice" },
      { key: "salePrice", label: "salePrice" },
      { key: "stockQuantity", label: "stockQuantity" },
      { key: "criticalStockLevel", label: "criticalStockLevel" },
      { key: "supplier", label: "supplier" },
      { key: "isActive", label: "isActive" },
    ],
  },
  customers: {
    label: "Müşteriler",
    description: "Cari bakiye, satış ve tahsilat özetleri.",
    fileKey: "customers",
    sourceKey: "customers",
    supportsActiveFilter: true,
    columns: [
      { key: "id", label: "id" },
      { key: "name", label: "name" },
      { key: "companyName", label: "companyName" },
      { key: "phone", label: "phone" },
      { key: "whatsapp", label: "whatsapp" },
      { key: "country", label: "country" },
      { key: "city", label: "city" },
      { key: "customerType", label: "customerType" },
      { key: "openingBalance", label: "openingBalance" },
      { key: "totalSales", label: "totalSales" },
      { key: "totalPayments", label: "totalPayments" },
      { key: "currentBalance", label: "currentBalance" },
      { key: "riskLimit", label: "riskLimit" },
      { key: "lastPurchaseDate", label: "lastPurchaseDate" },
      { key: "isActive", label: "isActive" },
    ],
  },
  suppliers: {
    label: "Tedarikçiler",
    description: "Tedarikçi cari, alış ve ödeme özetleri.",
    fileKey: "suppliers",
    sourceKey: "suppliers",
    supportsActiveFilter: true,
    columns: [
      { key: "id", label: "id" },
      { key: "name", label: "name" },
      { key: "companyTitle", label: "companyTitle" },
      { key: "phone", label: "phone" },
      { key: "whatsapp", label: "whatsapp" },
      { key: "contactPerson", label: "contactPerson" },
      { key: "city", label: "city" },
      { key: "country", label: "country" },
      { key: "openingBalance", label: "openingBalance" },
      { key: "totalPurchases", label: "totalPurchases" },
      { key: "totalPayments", label: "totalPayments" },
      { key: "currentBalance", label: "currentBalance" },
      { key: "lastTransactionDate", label: "lastTransactionDate" },
      { key: "isActive", label: "isActive" },
    ],
  },
  stockMovements: {
    label: "Stok Hareketleri",
    description: "Ürün giriş, çıkış ve kalan stok hareketleri.",
    fileKey: "stock-movements",
    sourceKey: "stockMovements",
    columns: [
      { key: "id", label: "id" },
      { key: "date", label: "date" },
      { key: "productCode", label: "productCode" },
      { key: "barcode", label: "barcode" },
      { key: "productName", label: "productName" },
      { key: "size", label: "size" },
      { key: "color", label: "color" },
      { key: "movementType", label: "movementType" },
      { key: "quantityIn", label: "quantityIn" },
      { key: "quantityOut", label: "quantityOut" },
      { key: "remainingStock", label: "remainingStock" },
      { key: "relatedSlipNo", label: "relatedSlipNo" },
      { key: "relatedPartyName", label: "relatedPartyName" },
      { key: "createdBy", label: "createdBy" },
    ],
  },
  salesSlips: {
    label: "Satış Fişleri Özeti",
    description: "Satış fişi başlık ve toplam bilgileri.",
    fileKey: "sales-slips",
    sourceKey: "salesSlips",
    columns: [
      { key: "id", label: "id" },
      { key: "slipNo", label: "slipNo" },
      { key: "date", label: "date" },
      { key: "customerName", label: "customerName" },
      { key: "saleType", label: "saleType" },
      { key: "subtotal", label: "subtotal" },
      { key: "discountTotal", label: "discountTotal" },
      { key: "grandTotal", label: "grandTotal" },
      { key: "status", label: "status" },
      { key: "itemCount", label: "itemCount" },
    ],
    mapRow: (slip) => ({ ...slip, itemCount: Array.isArray(slip.items) ? slip.items.length : 0 }),
  },
  purchaseSlips: {
    label: "Alış Fişleri Özeti",
    description: "Alış fişi başlık, depo ve toplam bilgileri.",
    fileKey: "purchase-slips",
    sourceKey: "purchaseSlips",
    columns: [
      { key: "id", label: "id" },
      { key: "slipNo", label: "slipNo" },
      { key: "date", label: "date" },
      { key: "supplierName", label: "supplierName" },
      { key: "warehouse", label: "warehouse" },
      { key: "subtotal", label: "subtotal" },
      { key: "discountTotal", label: "discountTotal" },
      { key: "taxTotal", label: "taxTotal" },
      { key: "grandTotal", label: "grandTotal" },
      { key: "status", label: "status" },
      { key: "itemCount", label: "itemCount" },
    ],
    mapRow: (slip) => ({ ...slip, itemCount: Array.isArray(slip.items) ? slip.items.length : 0 }),
  },
};

export function buildExportRows({ exportType, data, activeOnly = false }) {
  const config = EXPORT_TYPES[exportType] || EXPORT_TYPES.products;
  const sourceRows = Array.isArray(data?.[config.sourceKey]) ? data[config.sourceKey] : [];

  return sourceRows
    .filter((row) => !activeOnly || !config.supportsActiveFilter || row.isActive !== false)
    .map((row) => normalizeExportRow(config.mapRow ? config.mapRow(row) : row, config.columns));
}

export function buildExportFileName(exportType, value = new Date()) {
  const config = EXPORT_TYPES[exportType] || EXPORT_TYPES.products;
  const stamp = toFileStamp(value);

  return `melisa-bebe-${config.fileKey}-${stamp}.csv`;
}

function normalizeExportRow(row, columns) {
  return columns.reduce((normalized, column) => {
    normalized[column.key] = row?.[column.key] ?? "";
    return normalized;
  }, {});
}

function toFileStamp(value) {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (part) => String(part).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("-");
}
