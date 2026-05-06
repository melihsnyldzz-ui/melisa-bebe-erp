import { ShieldAlert } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function DataQualitySummaryPanel({ quality }) {
  return (
    <section className="table-panel management-report-panel">
      <div className="section-heading">
        <ShieldAlert size={19} />
        <h2>Veri Kalite Özeti</h2>
      </div>
      <div className="management-quality-grid">
        {quality.warnings.map((warning) => (
          <div className={`integrity-summary-card ${warning.count > 0 ? "integrity-summary-amber" : "integrity-summary-green"}`} key={warning.key}>
            <span>{warning.label}</span>
            <strong>{formatNumber(warning.count)}</strong>
            <small>{warning.description}</small>
          </div>
        ))}
      </div>
      {quality.issueCount === 0 && <p className="success-message integrity-message">Veri kalite uyarısı bulunmadı.</p>}
    </section>
  );
}
