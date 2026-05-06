import { getImportTypeLabel, normalizeImportLog } from "../../utils/importApplyUtils.js";
import { formatNumber } from "../../utils/formatters.js";

export default function ImportResultPanel({ result }) {
  if (!result) return null;

  const normalized = normalizeImportLog(result);

  return (
    <section className="table-panel import-result-panel">
      <div className="section-heading">
        <h2>Son Import Sonucu</h2>
      </div>
      <div className="stock-count-report-summary">
        <ResultMetric label="Referans No" value={normalized.importRef} />
        <ResultMetric label="Import Tipi" value={getImportTypeLabel(normalized.importType)} />
        <ResultMetric label="Toplam Satır" value={formatNumber(normalized.totalRows)} />
        <ResultMetric label="Eklenen Satır" value={formatNumber(normalized.insertedCount)} />
        <ResultMetric label="Atlanan / Hatalı" value={formatNumber(normalized.skippedCount)} />
        <ResultMetric label="Durum" value={normalized.status === "success" ? "Başarılı" : "Başarısız"} />
        <ResultMetric label="Tarih" value={formatDateTime(normalized.createdAt)} />
      </div>
      {normalized.summary?.errors?.length > 0 && (
        <p className="barcode-message barcode-message-error data-import-message">{normalized.summary.errors.join(" ")}</p>
      )}
    </section>
  );
}

function ResultMetric({ label, value }) {
  return (
    <div className="stock-count-report-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}
