import { AlertTriangle, BadgeCheck, Info } from "lucide-react";

const statusLabels = {
  valid: "Geçerli",
  warning: "Uyarı",
  error: "Hatalı",
};

export default function ImportPreviewTable({ rows }) {
  return (
    <section className="table-panel product-table-panel import-preview-panel">
      <div className="section-heading">
        <h2>Önizleme</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table import-preview-table">
          <thead>
            <tr>
              <th>Satır</th>
              <th>Eşleşmiş Değerler</th>
              <th>Durum</th>
              <th>Uyarı Mesajı</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rowNumber}>
                <td className="strong-cell">{row.rowNumber}</td>
                <td>
                  <div className="import-mapped-values">
                    {Object.entries(row.mappedValues).map(([key, value]) => (
                      <span key={key}>
                        <strong>{key}:</strong> {value || "-"}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status import-status-${row.status}`}>
                    {row.status === "valid" && <BadgeCheck size={14} />}
                    {row.status === "warning" && <Info size={14} />}
                    {row.status === "error" && <AlertTriangle size={14} />}
                    {statusLabels[row.status]}
                  </span>
                </td>
                <td>{row.messages.length ? row.messages.join(" ") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="empty-table-text">Önizleme için CSV seçin veya örnek veri yükleyin.</p>}
    </section>
  );
}
