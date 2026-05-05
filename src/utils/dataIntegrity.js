const MONEY_TOLERANCE = 0.01;

export function buildDataIntegrityReport({
  collections = [],
  customers = [],
  payments = [],
  products = [],
  purchaseSlips = [],
  salesSlips = [],
  stockMovements = [],
  suppliers = [],
}) {
  const stockResults = buildStockResults(products, stockMovements);
  const customerResults = buildCustomerResults(customers, salesSlips, collections);
  const supplierResults = buildSupplierResults(suppliers, purchaseSlips, payments);

  const summary = {
    stockDifferenceCount: stockResults.filter((item) => item.status === "difference").length,
    stockWithoutMovementCount: stockResults.filter((item) => item.status === "no-movement").length,
    customerBalanceDifferenceCount: customerResults.filter((item) => item.status === "difference").length,
    supplierBalanceDifferenceCount: supplierResults.filter((item) => item.status === "difference").length,
  };

  const differenceCount =
    summary.stockDifferenceCount + summary.customerBalanceDifferenceCount + summary.supplierBalanceDifferenceCount;

  return {
    summary: {
      ...summary,
      differenceCount,
      requiresReview: differenceCount > 0 || summary.stockWithoutMovementCount > 0,
      statusLabel: differenceCount > 0 || summary.stockWithoutMovementCount > 0 ? "Kontrol gerekli" : "Sorun yok",
    },
    stockResults,
    customerResults,
    supplierResults,
  };
}

function buildStockResults(products, stockMovements) {
  const movementMap = stockMovements.reduce((map, movement) => {
    const key = getProductKey(movement);
    if (!key) return map;

    const current = map.get(key) || { quantityIn: 0, quantityOut: 0, movementCount: 0 };
    map.set(key, {
      quantityIn: current.quantityIn + toNumber(movement.quantityIn),
      quantityOut: current.quantityOut + toNumber(movement.quantityOut),
      movementCount: current.movementCount + 1,
    });
    return map;
  }, new Map());

  return products.map((product) => {
    const movementTotals = movementMap.get(getProductKey(product));
    const cardStock = toNumber(product.stockQuantity);

    if (!movementTotals) {
      return {
        id: product.id,
        productName: product.name,
        productCode: product.code,
        barcode: product.barcode,
        cardStock,
        calculatedStock: 0,
        difference: cardStock,
        status: cardStock > 0 ? "no-movement" : "ok",
      };
    }

    const calculatedStock = movementTotals.quantityIn - movementTotals.quantityOut;
    const difference = cardStock - calculatedStock;

    return {
      id: product.id,
      productName: product.name,
      productCode: product.code,
      barcode: product.barcode,
      cardStock,
      calculatedStock,
      difference,
      status: difference === 0 ? "ok" : "difference",
    };
  });
}

function buildCustomerResults(customers, salesSlips, collections) {
  const activeSalesSlips = salesSlips.filter(isActiveRecord);
  const activeCollections = collections.filter(isActiveRecord);

  return customers.map((customer) => {
    const openingBalance = toNumber(customer.openingBalance);
    const salesTotal = activeSalesSlips
      .filter((slip) => Number(slip.customerId) === Number(customer.id))
      .reduce((total, slip) => total + toNumber(slip.grandTotal), 0);
    const collectionTotal = activeCollections
      .filter((collection) => Number(collection.customerId) === Number(customer.id))
      .reduce((total, collection) => total + toNumber(collection.amount), 0);
    const currentBalance = toNumber(customer.currentBalance);
    const calculatedBalance = openingBalance + salesTotal - collectionTotal;
    const difference = roundMoney(currentBalance - calculatedBalance);

    return {
      id: customer.id,
      name: customer.name,
      companyName: customer.companyName,
      currentBalance,
      calculatedBalance,
      difference,
      status: Math.abs(difference) <= MONEY_TOLERANCE ? "ok" : "difference",
    };
  });
}

function buildSupplierResults(suppliers, purchaseSlips, payments) {
  const activePurchaseSlips = purchaseSlips.filter(isActiveRecord);
  const activePayments = payments.filter(isActiveRecord);

  return suppliers.map((supplier) => {
    const openingBalance = toNumber(supplier.openingBalance);
    const purchaseTotal = activePurchaseSlips
      .filter((slip) => Number(slip.supplierId) === Number(supplier.id))
      .reduce((total, slip) => total + toNumber(slip.grandTotal), 0);
    const paymentTotal = activePayments
      .filter((payment) => Number(payment.supplierId) === Number(supplier.id))
      .reduce((total, payment) => total + toNumber(payment.amount), 0);
    const currentBalance = toNumber(supplier.currentBalance);
    const calculatedBalance = openingBalance + purchaseTotal - paymentTotal;
    const difference = roundMoney(currentBalance - calculatedBalance);

    return {
      id: supplier.id,
      name: supplier.name,
      companyTitle: supplier.companyTitle,
      currentBalance,
      calculatedBalance,
      difference,
      status: Math.abs(difference) <= MONEY_TOLERANCE ? "ok" : "difference",
    };
  });
}

function getProductKey(item) {
  return item.productId ? `id:${item.productId}` : item.productCode ? `code:${item.productCode}` : item.barcode ? `barcode:${item.barcode}` : "";
}

function isActiveRecord(record) {
  return record.status !== "İptal";
}

function toNumber(value) {
  return Number(value) || 0;
}

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}
