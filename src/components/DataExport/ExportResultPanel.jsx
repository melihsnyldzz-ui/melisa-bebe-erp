import { getTodayISO } from "../../utils/dateUtils.js";
import { EXPORT_TYPES } from "../../utils/exportDataUtils.js";
import { formatNumber } from "../../utils/formatters.js";

export default function ExportResultPanel({ result }) {
  if (!result) return null;

  const exportLabel = EXPORT_TYPES[result.exportType]?.label || "Veri";

  return (
    <section className="table-panel import-result-panel">
      <div className="section-heading">
        <h2>Son Dışa Aktarma Sonucu</h2>
      </div>
      <div className="stock-count-report-summary export-result-summary">
        <ResultMetric label="Export Tipi" value={exportLabel} />
        <ResultMetric label="Satır Sayısı" value={formatNumber(result.rowCount)} />
        <ResultMetric label="Dosya Adı" value={result.fileName} />
        <ResultMetric label="Tarih / Saat" value={formatDateTime(result.createdAt)} />
        <ResultMetric label="Durum" value="Başarılı" />
      </div>
      <p className="form-note data-import-note">
        Bu işlem sadece okuma ve dosya indirme yapar; veritabanı kayıtlarında değişiklik oluşturmaz. Bugün: {getTodayISO()}
      </p>
    </section>
  );
}

function ResultMetric({ label, value }) {
  return (
    <div className="stock-count-report-metric">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}
