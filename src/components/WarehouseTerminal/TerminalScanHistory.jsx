import { Trash2 } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function TerminalScanHistory({ history, onClear }) {
  return (
    <section className="table-panel warehouse-terminal-card">
      <div className="section-heading">
        <h2>Son Okutulanlar</h2>
        <button className="secondary-action small-action" type="button" onClick={onClear} disabled={history.length === 0}>
          <Trash2 size={15} />
          Geçmişi Temizle
        </button>
      </div>
      {history.length === 0 ? (
        <p className="empty-table-text">Henüz ürün okutulmadı.</p>
      ) : (
        <div className="warehouse-terminal-history">
          {history.map((item) => (
            <div className="warehouse-terminal-history-row" key={item.id}>
              <strong>{item.productName || item.productCode || "-"}</strong>
              <span>Okutulan: {item.scannedValue || "-"}</span>
              <span>Barkod: {item.barcode || "-"}</span>
              <span>Kod: {item.productCode || "-"}</span>
              <small>
                {formatHistoryTime(item.scannedAt)} · {formatNumber(item.stockQuantity)} adet · {item.status || "-"}
              </small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatHistoryTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}
