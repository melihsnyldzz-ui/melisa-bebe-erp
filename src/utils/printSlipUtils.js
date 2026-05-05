export function buildSalesSlipPrintModel(slip) {
  if (!slip) return null;

  const items = (slip.items || []).map((item, index) => ({
    lineNo: index + 1,
    productCode: valueOrDash(item.productCode),
    barcode: valueOrDash(item.barcode),
    productName: valueOrDash(item.productName),
    size: valueOrDash(item.size),
    color: valueOrDash(item.color),
    quantity: toNumber(item.quantity),
    unitPrice: toNumber(item.unitPrice),
    discountRate: toNumber(item.discountRate),
    lineTotal: toNumber(item.lineTotal),
  }));

  return {
    company: {
      name: "Melisa Bebe Tekstil San. ve Tic. Ltd. Şti.",
      address: "İstanbul / Türkiye",
      phone: "Telefon / WhatsApp: -",
    },
    documentTitle: "Satış Fişi",
    slipNo: valueOrDash(slip.slipNo),
    date: slip.date,
    customerName: valueOrDash(slip.customerName),
    customerId: slip.customerId || "-",
    saleType: valueOrDash(slip.saleType),
    cargoInfo: valueOrDash(slip.cargoInfo),
    description: valueOrDash(slip.description),
    items,
    subtotal: toNumber(slip.subtotal),
    discountTotal: toNumber(slip.discountTotal),
    grandTotal: toNumber(slip.grandTotal),
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    createdAt: slip.createdAt,
    status: slip.status || "Kayıtlı",
    isCanceled: slip.status === "İptal",
  };
}

function valueOrDash(value) {
  const text = String(value || "").trim();
  return text || "-";
}

function toNumber(value) {
  return Number(value) || 0;
}
