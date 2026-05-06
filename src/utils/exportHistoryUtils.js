const EXPORT_HISTORY_KEY = "melisa-bebe-export-history";

export function buildExportReference(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (part) => String(part).padStart(2, "0");

  return `EXPORT-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export function readExportHistory() {
  if (typeof localStorage === "undefined") return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(EXPORT_HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeExportHistoryRecord).filter(Boolean).slice(0, 10) : [];
  } catch (error) {
    console.error("Export geçmişi okunamadı:", error);
    return [];
  }
}

export function appendExportHistory(record) {
  if (typeof localStorage === "undefined") return [normalizeExportHistoryRecord(record)].filter(Boolean);

  const nextHistory = [normalizeExportHistoryRecord(record), ...readExportHistory()].filter(Boolean).slice(0, 10);
  localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}

export function normalizeExportHistoryRecord(record = {}) {
  if (!record || typeof record !== "object") return null;

  return {
    exportRef: record.exportRef || "-",
    exportType: record.exportType || "",
    rowCount: Number(record.rowCount) || 0,
    fileName: record.fileName || "-",
    delimiter: record.delimiter === "," ? "," : ";",
    bomEnabled: Boolean(record.bomEnabled),
    createdAt: record.createdAt || "",
    status: record.status || "success",
  };
}
