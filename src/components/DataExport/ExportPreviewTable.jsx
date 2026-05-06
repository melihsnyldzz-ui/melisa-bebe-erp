import { formatNumber } from "../../utils/formatters.js";

export default function ExportPreviewTable({ columns = [], rows = [], totalRows = 0 }) {
  return (
    <section className="table-panel product-table-panel export-preview-panel">
      <div className="section-heading">
        <h2>Önizleme</h2>
        <span>{formatNumber(totalRows)} satır</span>
      </div>
      {rows.length === 0 ? (
        <p className="empty-table-text">Dışa aktarılacak veri bulunamadı.</p>
      ) : (
        <div className="product-table-scroll">
          <table className="product-table export-preview-table">
            <thead>
              <tr>
                <th>Satır</th>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 20).map((row, rowIndex) => (
                <tr key={`${row.id || rowIndex}-${rowIndex}`}>
                  <td className="strong-cell">{rowIndex + 1}</td>
                  {columns.map((column) => (
                    <td key={column.key}>{formatPreviewValue(row[column.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length > 20 && <p className="form-note data-import-note">İlk 20 satır gösteriliyor. CSV dosyasına tüm satırlar eklenecek.</p>}
    </section>
  );
}

function formatPreviewValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Aktif" : "Pasif";

  return String(value);
}
