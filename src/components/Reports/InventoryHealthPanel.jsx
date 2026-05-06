import { Boxes } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function InventoryHealthPanel({ inventory }) {
  return (
    <section className="table-panel management-report-panel">
      <div className="section-heading">
        <Boxes size={19} />
        <h2>Stok Sağlığı</h2>
      </div>
      <div className="management-alert-grid">
        <AlertCard label="Kritik stok altı" value={inventory.counts.critical} tone="amber" />
        <AlertCard label="Stoku 0 olan ürün" value={inventory.counts.zero} tone="red" />
        <AlertCard label="Negatif stok" value={inventory.counts.negative} tone="red" />
      </div>
      <InventoryTable title="Kritik stok altındaki ürünler" rows={inventory.criticalProducts} />
      <InventoryTable title="Stok adedi 0 olan ürünler" rows={inventory.zeroStockProducts} />
      <InventoryTable title="Negatif stok uyarıları" rows={inventory.negativeStockProducts} />
      <InventoryTable title="En yüksek stoklu ilk 10 ürün" rows={inventory.topStockProducts} />
    </section>
  );
}

function InventoryTable({ rows, title }) {
  return (
    <div className="integrity-table-block">
      <h3>{title}</h3>
      <div className="product-table-scroll">
        <table className="product-table management-report-table">
          <thead>
            <tr>
              <th>Ürün kodu</th>
              <th>Barkod</th>
              <th>Ürün adı</th>
              <th>Beden</th>
              <th>Renk</th>
              <th>Mevcut stok</th>
              <th>Kritik stok</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.id}-${title}`}>
                <td className="product-code-cell">{row.productCode || "-"}</td>
                <td className="barcode-cell">{row.barcode || "-"}</td>
                <td className="strong-cell">{row.productName || "-"}</td>
                <td>{row.size || "-"}</td>
                <td>{row.color || "-"}</td>
                <td>{formatNumber(row.stockQuantity)}</td>
                <td>{formatNumber(row.criticalStockLevel)}</td>
                <td>
                  <span className={`status ${row.status === "Sağlıklı" ? "status-active" : "status-warning"}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="empty-table-text">Gösterilecek kayıt bulunmadı.</p>}
    </div>
  );
}

function AlertCard({ label, tone, value }) {
  return (
    <div className={`integrity-summary-card integrity-summary-${tone}`}>
      <span>{label}</span>
      <strong>{formatNumber(value)}</strong>
    </div>
  );
}
