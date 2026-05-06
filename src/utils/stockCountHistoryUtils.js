import { formatDateTR } from "./dateUtils.js";

const STOCK_COUNT_MOVEMENT_TYPES = new Set(["Sayım Fazlası", "Sayım Eksiği"]);

export function buildStockCountHistory(stockMovements = [], options = {}) {
  const { limit = 20, filters = {} } = options;
  const groups = new Map();

  stockMovements.forEach((movement, index) => {
    if (!STOCK_COUNT_MOVEMENT_TYPES.has(movement.movementType)) return;

    const referenceNo = normalizeText(movement.relatedSlipNo) || `REFERANS-YOK-${movement.id || index + 1}`;
    const current = groups.get(referenceNo) || {
      referenceNo,
      date: movement.date || "",
      createdAt: movement.createdAt || movement.date || "",
      createdBy: movement.createdBy || "-",
      relatedPartyName: movement.relatedPartyName || "-",
      rows: [],
      rowCount: 0,
      totalSurplusQuantity: 0,
      totalShortageQuantity: 0,
      netDifference: 0,
    };

    const quantityIn = toNumber(movement.quantityIn);
    const quantityOut = toNumber(movement.quantityOut);
    const row = {
      id: movement.id || `${referenceNo}-${current.rows.length + 1}`,
      date: movement.date || "",
      createdAt: movement.createdAt || "",
      createdBy: movement.createdBy || "-",
      productCode: movement.productCode || "-",
      barcode: movement.barcode || "-",
      productName: movement.productName || "-",
      size: movement.size || "-",
      color: movement.color || "-",
      movementType: movement.movementType || "-",
      quantityIn,
      quantityOut,
      remainingStock: toNumber(movement.remainingStock),
      relatedSlipNo: referenceNo,
      relatedPartyName: movement.relatedPartyName || "-",
    };

    const createdAt = pickLatestDate(current.createdAt, row.createdAt || row.date);
    groups.set(referenceNo, {
      ...current,
      date: current.date || row.date,
      createdAt,
      createdBy: current.createdBy !== "-" ? current.createdBy : row.createdBy,
      relatedPartyName: current.relatedPartyName !== "-" ? current.relatedPartyName : row.relatedPartyName,
      rows: [...current.rows, row],
      rowCount: current.rowCount + 1,
      totalSurplusQuantity: current.totalSurplusQuantity + quantityIn,
      totalShortageQuantity: current.totalShortageQuantity + quantityOut,
      netDifference: current.netDifference + quantityIn - quantityOut,
    });
  });

  const history = [...groups.values()]
    .map((group) => ({
      ...group,
      displayDate: formatHistoryDate(group.createdAt || group.date),
    }))
    .filter((group) => matchesHistoryFilters(group, filters))
    .sort((first, second) => getTime(second.createdAt || second.date) - getTime(first.createdAt || first.date));

  return Number.isFinite(limit) ? history.slice(0, limit) : history;
}

export function buildStockCountHistorySummary(history = []) {
  return history.reduce(
    (summary, group) => ({
      adjustmentCount: summary.adjustmentCount + 1,
      totalSurplusQuantity: summary.totalSurplusQuantity + toNumber(group.totalSurplusQuantity),
      totalShortageQuantity: summary.totalShortageQuantity + toNumber(group.totalShortageQuantity),
      netDifference: summary.netDifference + toNumber(group.netDifference),
      maxRowCount: Math.max(summary.maxRowCount, toNumber(group.rowCount)),
      latestDate: pickLatestDate(summary.latestDate, group.createdAt || group.date),
    }),
    {
      adjustmentCount: 0,
      totalSurplusQuantity: 0,
      totalShortageQuantity: 0,
      netDifference: 0,
      maxRowCount: 0,
      latestDate: "",
    },
  );
}

export function buildStockCountHistoryReport(history = []) {
  return {
    documentType: "STOCK_COUNT_HISTORY_REPORT",
    source: "ERP_DESKTOP",
    createdAt: new Date().toISOString(),
    summary: buildStockCountHistorySummary(history),
    adjustments: history,
  };
}

export function filterStockCountHistory(history = [], filters = {}) {
  return history.filter((group) => matchesHistoryFilters(group, filters));
}

export function formatHistoryDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatDateTR(value);

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function matchesHistoryFilters(group, filters = {}) {
  const referenceQuery = normalizeText(filters.reference);
  const rowQuery = normalizeText(filters.search);
  const movementType = filters.movementType || "all";

  const matchesReference = !referenceQuery || normalizeText(group.referenceNo).includes(referenceQuery);
  const matchesMovementType = movementType === "all" || group.rows.some((row) => row.movementType === movementType);
  const matchesRowQuery =
    !rowQuery ||
    group.rows.some((row) => [row.productName, row.productCode, row.barcode].some((value) => normalizeText(value).includes(rowQuery)));

  return matchesReference && matchesMovementType && matchesRowQuery;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function getTime(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function pickLatestDate(first, second) {
  if (!first) return second || "";
  if (!second) return first;
  return getTime(second) > getTime(first) ? second : first;
}
