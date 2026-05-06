export function buildCsvContent({ columns = [], rows = [], delimiter = ";", includeBom = true }) {
  const safeDelimiter = delimiter === "," ? "," : ";";
  const headerLine = columns.map((column) => escapeCsvValue(column.label, safeDelimiter)).join(safeDelimiter);
  const rowLines = rows.map((row) =>
    columns.map((column) => escapeCsvValue(resolveExportValue(row[column.key]), safeDelimiter)).join(safeDelimiter),
  );
  const content = [headerLine, ...rowLines].join("\r\n");

  return `${includeBom ? "\uFEFF" : ""}${content}`;
}

export function downloadCsvFile({ content, fileName }) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value, delimiter) {
  const text = String(value ?? "");
  const shouldQuote = text.includes(delimiter) || text.includes(",") || text.includes("\"") || text.includes("\n") || text.includes("\r");
  const escaped = text.replace(/"/g, "\"\"");

  return shouldQuote ? `"${escaped}"` : escaped;
}

function resolveExportValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Aktif" : "Pasif";
  if (typeof value === "number") return Number.isFinite(value) ? value : "";

  return value;
}
