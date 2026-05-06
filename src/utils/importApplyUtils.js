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
  const rows = buildApplicableImportRows(previewRows);
  return {
    importRef: buildImportReference(),
    importType,
    payloadHash: buildImportPayloadHash(importType, rows),
    totalRows: previewRows.length,
    warningCount: previewRows.filter((row) => row.status === "warning").length,
    errorCount: previewRows.filter((row) => row.status === "error").length,
    rows,
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
    importRef: buildImportReference(),
    importType,
    totalRows,
    insertedCount,
    skippedCount,
    errorCount: errors.length,
    warningCount: 0,
    status: errors.length ? "failed" : "success",
    errors,
    createdAt: new Date().toISOString(),
  };
}

export function buildImportReference(value = new Date().toISOString()) {
  const digits = value.replace(/\D/g, "");
  return `IMPORT-${digits.slice(0, 8)}-${digits.slice(8, 14)}`;
}

export function buildImportPayloadHash(importType, rows = []) {
  return hashText(JSON.stringify({ importType, rows: rows.map((row) => row.values) }));
}

export function normalizeImportLog(row = {}) {
  return {
    id: row.id || row.importRef || "",
    importRef: row.importRef || "-",
    importType: row.importType || "",
    totalRows: toNumber(row.totalRows),
    insertedCount: toNumber(row.insertedCount),
    skippedCount: toNumber(row.skippedCount),
    errorCount: toNumber(row.errorCount),
    warningCount: toNumber(row.warningCount),
    status: row.status || "-",
    createdAt: row.createdAt || "",
    summary: parseSummary(row.summaryJson),
  };
}

function normalizeMappedValues(values = {}) {
  return Object.entries(values).reduce((normalized, [key, value]) => ({ ...normalized, [key]: String(value ?? "").trim() }), {});
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return String(Math.abs(hash));
}

function parseSummary(value) {
  if (!value) return {};

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function toNumber(value) {
  return Number(value) || 0;
}
