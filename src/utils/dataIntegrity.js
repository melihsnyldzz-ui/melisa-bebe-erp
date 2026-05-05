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

    const current = map.get(key) || [];
    map.set(key, [...current, movement]);
    return map;
  }, new Map());

  return products.map((product) => {
    const movements = movementMap.get(getProductKey(product));
    const cardStock = toNumber(product.stockQuantity);

    if (!movements?.length) {
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

    const calculatedStock = calculateStockFromMovements(movements);
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

function calculateStockFromMovements(movements) {
  const sortedMovements = [...movements].sort(compareMovementsAsc);
  const latestCountIndex = findLatestCountMovementIndex(sortedMovements);
  const calculationStartIndex = latestCountIndex >= 0 ? latestCountIndex + 1 : 0;
  const baselineStock = latestCountIndex >= 0 ? toNumber(sortedMovements[latestCountIndex].remainingStock) : 0;

  return sortedMovements.slice(calculationStartIndex).reduce(
    (stock, movement) => stock + toNumber(movement.quantityIn) - toNumber(movement.quantityOut),
    baselineStock,
  );
}

function findLatestCountMovementIndex(movements) {
  for (let index = movements.length - 1; index >= 0; index -= 1) {
    if (isStockCountAdjustmentMovement(movements[index])) return index;
  }

  return -1;
}

function isStockCountAdjustmentMovement(movement) {
  return ["Sayım Fazlası", "Sayım Eksiği"].includes(movement.movementType);
}

function compareMovementsAsc(first, second) {
  const firstTime = new Date(first.createdAt || first.date || 0).getTime();
  const secondTime = new Date(second.createdAt || second.date || 0).getTime();
  if (firstTime !== secondTime) return firstTime - secondTime;
  return toNumber(first.id) - toNumber(second.id);
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
