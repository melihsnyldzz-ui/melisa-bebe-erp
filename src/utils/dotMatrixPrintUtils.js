import { formatDateTR } from "./dateUtils.js";
import { buildSalesSlipPrintModel } from "./printSlipUtils.js";

const DEFAULT_LINE_WIDTH = 80;

export function buildDotMatrixSalesSlipText(slip, options = {}) {
  const model = buildSalesSlipPrintModel(slip);
  if (!model) return "";

  const lineWidth = options.lineWidth || DEFAULT_LINE_WIDTH;
  const simplifyTurkish = Boolean(options.simplifyTurkish);
  const normalize = (value) => normalizeText(value, simplifyTurkish);
  const lines = [];

  lines.push(separator(lineWidth));
  lines.push(centerText(normalize("MELISA BEBE TEKSTIL SAN. VE TIC. LTD. STI."), lineWidth));
  lines.push(centerText(normalize(model.company.address), lineWidth));
  lines.push(centerText(normalize(model.company.phone), lineWidth));
  lines.push(separator(lineWidth));
  lines.push(centerText(normalize(model.documentTitle.toLocaleUpperCase("tr-TR")), lineWidth));
  if (model.isCanceled) lines.push(centerText(normalize("*** İPTAL ***"), lineWidth));
  lines.push(separator(lineWidth));
  lines.push(fieldLine("Fis No", model.slipNo, lineWidth, normalize));
  lines.push(fieldLine("Tarih", formatDateTR(model.date), lineWidth, normalize));
  lines.push(fieldLine("Musteri", model.customerName, lineWidth, normalize));
  lines.push(fieldLine("Satis Tipi", model.saleType, lineWidth, normalize));
  lines.push(fieldLine("Kargo", model.cargoInfo, lineWidth, normalize));
  lines.push(separator(lineWidth));
  lines.push(
    [
      padRight("No", 2),
      padRight("Kod", 10),
      padRight("Barkod", 13),
      padRight("Urun", 20),
      padRight("Beden", 5),
      padRight("Renk", 6),
      padLeft("Mik", 5),
      padLeft("Tutar", 9),
    ].join(" "),
  );
  lines.push(separator(lineWidth));

  if (model.items.length === 0) {
    lines.push(normalize("Satir yok").padEnd(lineWidth, " "));
  } else {
    model.items.forEach((item) => {
      lines.push(
        [
          padLeft(item.lineNo, 2),
          padRight(normalize(item.productCode), 10),
          padRight(normalize(item.barcode), 13),
          padRight(normalize(item.productName), 20),
          padRight(normalize(item.size), 5),
          padRight(normalize(item.color), 6),
          padLeft(formatQuantityText(item.quantity), 5),
          padLeft(formatMoneyText(item.lineTotal), 9),
        ].join(" "),
      );
      lines.push(
        padRight(
          `   Birim: ${formatMoneyText(item.unitPrice)}  Isk%: ${formatQuantityText(item.discountRate)}`,
          lineWidth,
        ),
      );
    });
  }

  lines.push(separator(lineWidth));
  lines.push(totalLine("Toplam Adet", formatQuantityText(model.totalQuantity), lineWidth, normalize));
  lines.push(totalLine("Ara Toplam", formatMoneyText(model.subtotal), lineWidth, normalize));
  lines.push(totalLine("Iskonto Toplami", formatMoneyText(model.discountTotal), lineWidth, normalize));
  lines.push(totalLine("Genel Toplam", formatMoneyText(model.grandTotal), lineWidth, normalize));
  lines.push(separator(lineWidth));
  lines.push(fieldLine("Aciklama", model.description, lineWidth, normalize));
  lines.push(separator(lineWidth));

  return lines.map((line) => truncateText(line, lineWidth)).join("\n");
}

export function normalizeTurkishForTextPrinter(value) {
  return String(value || "")
    .replaceAll("Ç", "C")
    .replaceAll("ç", "c")
    .replaceAll("Ğ", "G")
    .replaceAll("ğ", "g")
    .replaceAll("İ", "I")
    .replaceAll("ı", "i")
    .replaceAll("Ö", "O")
    .replaceAll("ö", "o")
    .replaceAll("Ş", "S")
    .replaceAll("ş", "s")
    .replaceAll("Ü", "U")
    .replaceAll("ü", "u");
}

export function padRight(value, width) {
  return truncateText(value, width).padEnd(width, " ");
}

export function padLeft(value, width) {
  return truncateText(value, width).padStart(width, " ");
}

export function truncateText(value, width) {
  const text = String(value || "-");
  return text.length > width ? text.slice(0, Math.max(0, width - 1)) + "~" : text;
}

export function formatMoneyText(value) {
  return `${(Number(value) || 0).toFixed(2)} TL`;
}

export function formatQuantityText(value) {
  return Number.isInteger(Number(value)) ? String(Number(value)) : (Number(value) || 0).toFixed(2);
}

function normalizeText(value, simplifyTurkish) {
  const text = String(value || "-");
  return simplifyTurkish ? normalizeTurkishForTextPrinter(text) : text;
}

function separator(width) {
  return "-".repeat(width);
}

function centerText(value, width) {
  const text = truncateText(value, width);
  const leftPadding = Math.max(0, Math.floor((width - text.length) / 2));
  return `${" ".repeat(leftPadding)}${text}`.padEnd(width, " ");
}

function fieldLine(label, value, width, normalize) {
  return padRight(`${normalize(label)}: ${normalize(value)}`, width);
}

function totalLine(label, value, width, normalize) {
  const normalizedLabel = normalize(label);
  return `${padRight(normalizedLabel, 24)}${padLeft(value, width - 24)}`;
}
