import { Eye } from "lucide-react";
import { useState } from "react";
import { EXPORT_TYPES } from "../../utils/exportDataUtils.js";
import { normalizeExportHistoryRecord } from "../../utils/exportHistoryUtils.js";
import { formatNumber } from "../../utils/formatters.js";

export default function ExportHistoryPanel({ history = [] }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const normalizedHistory = history.map(normalizeExportHistoryRecord).filter(Boolean).slice(0, 10);

  return (
    <section className="table-panel product-table-panel export-history-panel">
      <div className="section-heading">
        <h2>Export Geçmişi</h2>
        <span>Son 10 işlem</span>
      </div>
      {normalizedHistory.length === 0 ? (
        <p className="empty-table-text">Henüz dışa aktarma geçmişi yok.</p>
      ) : (
        <div className="product-table-scroll">
          <table className="product-table export-history-table">
            <thead>
              <tr>
                <th>Referans</th>
                <th>Tip</th>
                <th>Satır</th>
                <th>Dosya</th>
                <th>Ayraç</th>
                <th>BOM</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th>Detay</th>
              </tr>
            </thead>
            <tbody>
              {normalizedHistory.map((record) => (
                <tr key={`${record.exportRef}-${record.fileName}`}>
                  <td className="strong-cell">{record.exportRef}</td>
                  <td>{EXPORT_TYPES[record.exportType]?.label || "-"}</td>
                  <td>{formatNumber(record.rowCount)}</td>
                  <td>{record.fileName}</td>
                  <td>{record.delimiter}</td>
                  <td>{record.bomEnabled ? "Açık" : "Kapalı"}</td>
                  <td>{formatDateTime(record.createdAt)}</td>
                  <td>
                    <span className="status import-status-valid">{record.status === "success" ? "Başarılı" : "Başarısız"}</span>
                  </td>
                  <td>
                    <button className="icon-button small" type="button" aria-label="Export detayını görüntüle" onClick={() => setSelectedRecord(record)}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedRecord && <pre className="stock-count-report-preview">{JSON.stringify(selectedRecord, null, 2)}</pre>}
    </section>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}
