const importTypeLabels = {
  products: "Ürün Kartları",
  customers: "Müşteriler",
  suppliers: "Tedarikçiler",
};

export function getImportTypeLabel(importType) {
  return importTypeLabels[importType] || "Veri";
}

export function buildApplicableImportRows(previewRows = []) {
  return previewRows
    .filter((row) => row.status !== "error")
    .map((row) => ({
      rowNumber: row.rowNumber,
      status: row.status,
      messages: row.messages || [],
      values: normalizeMappedValues(row.mappedValues),
    }));
}

export function buildApplyImportPayload({ importType, previewRows = [] }) {
  return {
    importType,
    rows: buildApplicableImportRows(previewRows),
  };
}

export function validateApplyImportPayload(payload) {
  if (!["products", "customers", "suppliers"].includes(payload?.importType)) return "İçe aktarma tipi geçersiz.";
  if (!Array.isArray(payload.rows) || payload.rows.length === 0) return "İçe aktarılacak geçerli satır bulunamadı.";

  const invalidRow = payload.rows.find((row) => row.status === "error" || !row.values);
  if (invalidRow) return "Hatalı satırlar içe aktarılamaz.";

  return "";
}

export function buildImportResult({ importType, totalRows, insertedCount, skippedCount, errors = [] }) {
  return {
    importType,
    totalRows,
    insertedCount,
    skippedCount,
    errors,
    createdAt: new Date().toISOString(),
  };
}

function normalizeMappedValues(values = {}) {
  return Object.entries(values).reduce((normalized, [key, value]) => ({ ...normalized, [key]: String(value ?? "").trim() }), {});
}
