export function getNextPurchaseSlipNo(purchaseSlips) {
  return getNextDocumentNo(purchaseSlips, "AF", "slipNo");
}

export function getNextSalesSlipNo(salesSlips) {
  return getNextDocumentNo(salesSlips, "SF", "slipNo");
}

export function getNextCollectionNo(collections) {
  return getNextDocumentNo(collections, "TH", "collectionNo");
}

export function getNextPaymentNo(payments) {
  return getNextDocumentNo(payments, "OD", "paymentNo");
}

export function getNextDocumentNo(records, prefix, numberField) {
  const year = new Date().getFullYear();
  const documentPrefix = `${prefix}-${year}-`;
  const maxSequence = records.reduce((highest, record) => {
    const documentNo = record?.[numberField];
    if (typeof documentNo !== "string" || !documentNo.startsWith(documentPrefix)) {
      return highest;
    }

    const sequence = Number(documentNo.slice(documentPrefix.length));
    return Number.isInteger(sequence) && sequence > highest ? sequence : highest;
  }, 0);

  return `${documentPrefix}${String(maxSequence + 1).padStart(6, "0")}`;
}
