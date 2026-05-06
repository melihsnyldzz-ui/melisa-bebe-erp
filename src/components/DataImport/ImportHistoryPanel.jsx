import { Eye } from "lucide-react";
import { useState } from "react";
import { getImportTypeLabel, normalizeImportLog } from "../../utils/importApplyUtils.js";
import { formatNumber } from "../../utils/formatters.js";

export default function ImportHistoryPanel({ logs = [] }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const normalizedLogs = logs.map(normalizeImportLog).slice(0, 20);

  return (
    <section className="table-panel product-table-panel import-history-panel">
      <div className="section-heading">
        <h2>Import Geçmişi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table import-history-table">
          <thead>
            <tr>
              <th>Referans</th>
              <th>Tip</th>
              <th>Tarih / Saat</th>
              <th>Eklenen</th>
              <th>Hatalı / Atlanan</th>
              <th>Durum</th>
              <th>Detay</th>
            </tr>
          </thead>
          <tbody>
            {normalizedLogs.map((log) => (
              <tr key={log.id || log.importRef}>
                <td className="strong-cell">{log.importRef}</td>
                <td>{getImportTypeLabel(log.importType)}</td>
                <td>{formatDateTime(log.createdAt)}</td>
                <td className="stock-in">{formatNumber(log.insertedCount)}</td>
                <td className="stock-out">{formatNumber(log.skippedCount)}</td>
                <td>
                  <span className={`status import-status-${log.status === "success" ? "valid" : "error"}`}>
                    {log.status === "success" ? "Başarılı" : "Başarısız"}
                  </span>
                </td>
                <td>
                  <button className="icon-button small" type="button" aria-label="Import detayını görüntüle" onClick={() => setSelectedLog(log)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {normalizedLogs.length === 0 && <p className="empty-table-text">Henüz içe aktarma geçmişi yok.</p>}
      {selectedLog && (
        <pre className="stock-count-report-preview">{JSON.stringify(selectedLog.summary || selectedLog, null, 2)}</pre>
      )}
    </section>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}
