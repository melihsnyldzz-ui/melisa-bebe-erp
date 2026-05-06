import { IMPORT_TYPES } from "../data/importTemplates.js";

export function parseDelimitedText(text = "") {
  const normalizedText = String(text || "").replace(/^\uFEFF/, "").trim();
  if (!normalizedText) return { headers: [], rows: [] };

  const lines = normalizedText.split(/\r?\n/).filter((line) => line.trim());
  const delimiter = detectDelimiter(lines[0] || "");
  const headers = parseDelimitedLine(lines[0] || "", delimiter).map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseDelimitedLine(line, delimiter);
    return headers.reduce((row, header, index) => ({ ...row, [header]: values[index] ?? "" }), {});
  });

  return { headers, rows };
}

export function buildInitialColumnMapping(headers = [], importType = "products") {
  const template = IMPORT_TYPES[importType];
  return template.fields.reduce((mapping, field) => {
    const matchedHeader = headers.find((header) => normalizeHeader(header) === normalizeHeader(field));
    return { ...mapping, [field]: matchedHeader || "" };
  }, {});
}

export function buildImportPreview({ importType, mapping, rows }) {
  const template = IMPORT_TYPES[importType];
  const duplicateMaps = buildDuplicateMaps(rows, mapping, template.duplicateFields);

  const previewRows = rows.slice(0, 20).map((rawRow, index) => {
    const mappedValues = template.fields.reduce((values, field) => {
      const sourceColumn = mapping[field];
      return { ...values, [field]: sourceColumn ? normalizeCellValue(rawRow[sourceColumn]) : "" };
    }, {});
    const validation = validateMappedRow(mappedValues, template, duplicateMaps);

    return {
      rowNumber: index + 1,
      rawValues: rawRow,
      mappedValues,
      status: validation.status,
      messages: validation.messages,
    };
  });

  const summary = previewRows.reduce(
    (currentSummary, row) => ({
      totalRows: currentSummary.totalRows + 1,
      validRows: currentSummary.validRows + (row.status === "valid" ? 1 : 0),
      warningRows: currentSummary.warningRows + (row.status === "warning" ? 1 : 0),
      errorRows: currentSummary.errorRows + (row.status === "error" ? 1 : 0),
    }),
    { totalRows: 0, validRows: 0, warningRows: 0, errorRows: 0 },
  );

  return { rows: previewRows, summary };
}

export function buildImportPayload({ importType, previewRows, summary }) {
  return {
    documentType: "DATA_IMPORT_PREVIEW",
    source: "ERP_DESKTOP",
    importType,
    createdAt: new Date().toISOString(),
    summary,
    rows: previewRows,
  };
}

function validateMappedRow(row, template, duplicateMaps) {
  const messages = [];
  let hasError = false;

  template.requiredFields.forEach((field) => {
    if (!String(row[field] || "").trim()) {
      messages.push(`${field} zorunlu.`);
      hasError = true;
    }
  });

  template.recommendedFields.forEach((field) => {
    if (!String(row[field] || "").trim()) messages.push(`${field} önerilir.`);
  });

  template.numericFields.forEach((field) => {
    const value = String(row[field] || "").trim();
    if (value && !isImportNumber(value)) {
      messages.push(`${field} sayı olmalı.`);
      hasError = true;
    }
  });

  template.duplicateFields.forEach((field) => {
    const value = normalizeDuplicateValue(row[field]);
    if (value && duplicateMaps[field]?.get(value) > 1) messages.push(`${field} import dosyasında tekrar ediyor.`);
  });

  return {
    status: hasError ? "error" : messages.length ? "warning" : "valid",
    messages,
  };
}

function buildDuplicateMaps(rows, mapping, fields) {
  return fields.reduce((maps, field) => {
    const sourceColumn = mapping[field];
    const values = rows.map((row) => normalizeDuplicateValue(sourceColumn ? row[sourceColumn] : "")).filter(Boolean);
    const fieldMap = values.reduce((map, value) => map.set(value, (map.get(value) || 0) + 1), new Map());
    return { ...maps, [field]: fieldMap };
  }, {});
}

function detectDelimiter(headerLine) {
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  const commaCount = (headerLine.match(/,/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

function parseDelimitedLine(line, delimiter) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeCellValue(value) {
  return String(value ?? "").trim();
}

function normalizeDuplicateValue(value) {
  return String(value || "").trim().toLocaleLowerCase("tr-TR");
}

function isImportNumber(value) {
  const normalized = String(value).replace(",", ".");
  return normalized.trim() !== "" && Number.isFinite(Number(normalized));
}
