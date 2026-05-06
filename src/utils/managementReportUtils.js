const MAX_TABLE_ROWS = 10;

export function buildManagementReport(data = {}) {
  const products = asArray(data.products);
  const customers = asArray(data.customers);
  const suppliers = asArray(data.suppliers);
  const salesSlips = asArray(data.salesSlips);
  const purchaseSlips = asArray(data.purchaseSlips);
  const criticalProducts = products.filter((product) => toNumber(product.stockQuantity) <= toNumber(product.criticalStockLevel));
  const zeroStockProducts = products.filter((product) => toNumber(product.stockQuantity) === 0);
  const negativeStockProducts = products.filter((product) => toNumber(product.stockQuantity) < 0);
  const customerBalanceRows = customers.filter((customer) => toNumber(customer.currentBalance) > 0);
  const customerRiskRows = customers.filter((customer) => toNumber(customer.currentBalance) > toNumber(customer.riskLimit) && toNumber(customer.riskLimit) > 0);
  const supplierBalanceRows = suppliers.filter((supplier) => toNumber(supplier.currentBalance) !== 0);

  return {
    summary: {
      totalProducts: products.length,
      activeProducts: products.filter((product) => product.isActive !== false).length,
      totalStockQuantity: products.reduce((total, product) => total + toNumber(product.stockQuantity), 0),
      criticalProductCount: criticalProducts.length,
      totalCustomers: customers.length,
      totalSuppliers: suppliers.length,
      totalSalesSlipCount: salesSlips.length,
      totalPurchaseSlipCount: purchaseSlips.length,
    },
    inventory: {
      criticalProducts: buildProductHealthRows(criticalProducts).slice(0, MAX_TABLE_ROWS),
      zeroStockProducts: buildProductHealthRows(zeroStockProducts).slice(0, MAX_TABLE_ROWS),
      negativeStockProducts: buildProductHealthRows(negativeStockProducts).slice(0, MAX_TABLE_ROWS),
      topStockProducts: buildProductHealthRows([...products].sort((a, b) => toNumber(b.stockQuantity) - toNumber(a.stockQuantity))).slice(0, MAX_TABLE_ROWS),
      counts: {
        critical: criticalProducts.length,
        zero: zeroStockProducts.length,
        negative: negativeStockProducts.length,
      },
    },
    customers: {
      balanceCount: customerBalanceRows.length,
      topBalances: buildCustomerRows([...customerBalanceRows].sort((a, b) => toNumber(b.currentBalance) - toNumber(a.currentBalance))).slice(0, MAX_TABLE_ROWS),
      riskExceeded: buildCustomerRows(customerRiskRows).slice(0, MAX_TABLE_ROWS),
      missingLastPurchaseCount: customers.filter((customer) => !customer.lastPurchaseDate).length,
    },
    suppliers: {
      balanceCount: supplierBalanceRows.length,
      topBalances: buildSupplierRows([...supplierBalanceRows].sort((a, b) => Math.abs(toNumber(b.currentBalance)) - Math.abs(toNumber(a.currentBalance)))).slice(0, MAX_TABLE_ROWS),
      missingLastTransactionCount: suppliers.filter((supplier) => !supplier.lastTransactionDate).length,
    },
    quality: buildDataQualitySummary({ customers, products, suppliers }),
  };
}

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function buildProductHealthRows(products) {
  return products.map((product) => {
    const stockQuantity = toNumber(product.stockQuantity);
    const criticalStockLevel = toNumber(product.criticalStockLevel);

    return {
      id: product.id || product.code || product.barcode || product.name,
      productCode: product.code || "",
      barcode: product.barcode || "",
      productName: product.name || "",
      size: product.size || "",
      color: product.color || "",
      stockQuantity,
      criticalStockLevel,
      status: getProductStockStatus(stockQuantity, criticalStockLevel),
    };
  });
}

function buildCustomerRows(customers) {
  return customers.map((customer) => {
    const balance = toNumber(customer.currentBalance);
    const riskLimit = toNumber(customer.riskLimit);

    return {
      id: customer.id || customer.name,
      name: customer.name || "",
      companyName: customer.companyName || "",
      city: customer.city || "",
      balance,
      riskLimit,
      status: riskLimit > 0 && balance > riskLimit ? "Risk limiti aşıldı" : balance > 0 ? "Bakiye var" : "Güvenli",
    };
  });
}

function buildSupplierRows(suppliers) {
  return suppliers.map((supplier) => {
    const balance = toNumber(supplier.currentBalance);

    return {
      id: supplier.id || supplier.name,
      name: supplier.name || "",
      companyTitle: supplier.companyTitle || "",
      city: supplier.city || "",
      balance,
      lastTransactionDate: supplier.lastTransactionDate || "",
      status: balance > 0 ? "Borç var" : balance < 0 ? "Alacak var" : "Kapalı",
    };
  });
}

function buildDataQualitySummary({ customers, products, suppliers }) {
  const warnings = [
    {
      key: "missingBarcode",
      label: "Barkodu boş ürün",
      count: products.filter((product) => isBlank(product.barcode)).length,
      description: "Barkod okutma ve satış hızı için tamamlanmalı.",
    },
    {
      key: "missingProductName",
      label: "Ürün adı boş kayıt",
      count: products.filter((product) => isBlank(product.name)).length,
      description: "Listeleme ve raporlama okunabilirliği için gerekli.",
    },
    {
      key: "missingSalePrice",
      label: "Satış fiyatı boş veya 0 ürün",
      count: products.filter((product) => toNumber(product.salePrice) <= 0).length,
      description: "Satış fişlerinde fiyat hatasını önlemek için kontrol edilmeli.",
    },
    {
      key: "missingCustomerContact",
      label: "Telefon/WhatsApp boş müşteri",
      count: customers.filter((customer) => isBlank(customer.phone) && isBlank(customer.whatsapp)).length,
      description: "Cari takip ve iletişim için tamamlanmalı.",
    },
    {
      key: "missingSupplierContact",
      label: "Telefon/WhatsApp boş tedarikçi",
      count: suppliers.filter((supplier) => isBlank(supplier.phone) && isBlank(supplier.whatsapp)).length,
      description: "Alış ve ödeme süreçleri için tamamlanmalı.",
    },
    {
      key: "negativeStock",
      label: "Negatif stok",
      count: products.filter((product) => toNumber(product.stockQuantity) < 0).length,
      description: "Stok hareketleri ve satış çıkışları kontrol edilmeli.",
    },
    {
      key: "customerRiskExceeded",
      label: "Risk limiti aşan müşteri",
      count: customers.filter((customer) => toNumber(customer.currentBalance) > toNumber(customer.riskLimit) && toNumber(customer.riskLimit) > 0).length,
      description: "Tahsilat ve satış onayı açısından izlenmeli.",
    },
  ];

  return {
    warnings,
    issueCount: warnings.reduce((total, warning) => total + warning.count, 0),
  };
}

function getProductStockStatus(stockQuantity, criticalStockLevel) {
  if (stockQuantity < 0) return "Negatif stok";
  if (stockQuantity === 0) return "Stok yok";
  if (stockQuantity <= criticalStockLevel) return "Kritik stok";
  return "Sağlıklı";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isBlank(value) {
  return String(value ?? "").trim() === "";
}
