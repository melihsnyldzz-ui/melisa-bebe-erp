import { Truck } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";
import { formatDateTR } from "../../utils/dateUtils.js";

export default function SupplierBalanceSummaryPanel({ suppliers }) {
  return (
    <section className="table-panel management-report-panel">
      <div className="section-heading">
        <Truck size={19} />
        <h2>Tedarikçi Cari Özeti</h2>
      </div>
      <div className="management-alert-grid">
        <AlertCard label="Bakiyesi olan tedarikçi" value={suppliers.balanceCount} />
        <AlertCard label="Son işlem tarihi boş" value={suppliers.missingLastTransactionCount} />
      </div>
      <div className="integrity-table-block">
        <h3>Borç/alacak bakiyesi en yüksek ilk 10 tedarikçi</h3>
        <div className="product-table-scroll">
          <table className="product-table management-report-table">
            <thead>
              <tr>
                <th>Tedarikçi</th>
                <th>Firma ünvanı</th>
                <th>Şehir</th>
                <th>Bakiye</th>
                <th>Son işlem tarihi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.topBalances.map((row) => (
                <tr key={row.id}>
                  <td className="strong-cell">{row.name || "-"}</td>
                  <td>{row.companyTitle || "-"}</td>
                  <td>{row.city || "-"}</td>
                  <td className="danger-cell">{formatCurrency(row.balance)}</td>
                  <td>{row.lastTransactionDate ? formatDateTR(row.lastTransactionDate) : "-"}</td>
                  <td>
                    <span className={`status ${row.status === "Kapalı" ? "status-active" : "status-warning"}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {suppliers.topBalances.length === 0 && <p className="empty-table-text">Gösterilecek kayıt bulunmadı.</p>}
      </div>
    </section>
  );
}

function AlertCard({ label, value }) {
  return (
    <div className="integrity-summary-card">
      <span>{label}</span>
      <strong>{formatNumber(value)}</strong>
    </div>
  );
}
