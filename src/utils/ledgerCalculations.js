export function buildCustomerLedger(customerId, salesSlips, collections) {
  const targetId = Number(customerId);
  const movements = [
    ...salesSlips
      .filter((slip) => isActiveRecord(slip) && Number(slip.customerId) === targetId)
      .map((slip) => ({
        date: slip.date,
        createdAt: slip.createdAt,
        movementType: "Satış Fişi",
        documentNo: slip.slipNo,
        debit: toNumber(slip.grandTotal),
        credit: 0,
        description: slip.description || slip.saleType || "Satış fişi",
      })),
    ...collections
      .filter((collection) => isActiveRecord(collection) && Number(collection.customerId) === targetId)
      .map((collection) => ({
        date: collection.date,
        createdAt: collection.createdAt,
        movementType: "Tahsilat",
        documentNo: collection.collectionNo,
        debit: 0,
        credit: toNumber(collection.amount),
        description: collection.description || collection.paymentType || "Tahsilat",
      })),
  ];

  return withRunningBalance(movements, "credit");
}

export function buildSupplierLedger(supplierId, purchaseSlips, payments) {
  const targetId = Number(supplierId);
  const movements = [
    ...purchaseSlips
      .filter((slip) => isActiveRecord(slip) && Number(slip.supplierId) === targetId)
      .map((slip) => ({
        date: slip.date,
        createdAt: slip.createdAt,
        movementType: "Alış Fişi",
        documentNo: slip.slipNo,
        debit: toNumber(slip.grandTotal),
        payment: 0,
        description: slip.description || slip.warehouse || "Alış fişi",
      })),
    ...payments
      .filter((payment) => isActiveRecord(payment) && Number(payment.supplierId) === targetId)
      .map((payment) => ({
        date: payment.date,
        createdAt: payment.createdAt,
        movementType: "Tedarikçi Ödemesi",
        documentNo: payment.paymentNo,
        debit: 0,
        payment: toNumber(payment.amount),
        description: payment.description || payment.paymentType || "Tedarikçi ödemesi",
      })),
  ];

  return withRunningBalance(movements, "payment");
}

function withRunningBalance(movements, decreaseKey) {
  let balance = 0;

  return movements
    .slice()
    .sort((a, b) => getSortTime(a) - getSortTime(b))
    .map((movement, index) => {
      balance += toNumber(movement.debit) - toNumber(movement[decreaseKey]);

      return {
        ...movement,
        id: `${movement.documentNo || index}-${movement.movementType}-${index}`,
        balance,
      };
    });
}

function getSortTime(movement) {
  return new Date(movement.createdAt || movement.date || 0).getTime();
}

function isActiveRecord(record) {
  return record.status !== "İptal";
}

function toNumber(value) {
  return Number(value) || 0;
}
