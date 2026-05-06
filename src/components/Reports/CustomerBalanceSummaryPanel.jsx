import { UsersRound } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";

export default function CustomerBalanceSummaryPanel({ customers }) {
  return (
    <section className="table-panel management-report-panel">
      <div className="section-heading">
        <UsersRound size={19} />
        <h2>Müşteri Cari Özeti</h2>
      </div>
      <div className="management-alert-grid">
        <AlertCard label="Bakiyesi olan müşteri" value={customers.balanceCount} />
        <AlertCard label="Risk limiti aşan müşteri" value={customers.riskExceeded.length} />
        <AlertCard label="Son alış tarihi boş" value={customers.missingLastPurchaseCount} />
      </div>
      <CustomerTable title="Borç bakiyesi en yüksek ilk 10 müşteri" rows={customers.topBalances} />
      <CustomerTable title="Risk limiti aşan müşteriler" rows={customers.riskExceeded} />
    </section>
  );
}

function CustomerTable({ rows, title }) {
  return (
    <div className="integrity-table-block">
      <h3>{title}</h3>
      <div className="product-table-scroll">
        <table className="product-table management-report-table">
          <thead>
            <tr>
              <th>Müşteri</th>
              <th>Firma</th>
              <th>Şehir</th>
              <th>Bakiye</th>
              <th>Risk limiti</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.id}-${title}`}>
                <td className="strong-cell">{row.name || "-"}</td>
                <td>{row.companyName || "-"}</td>
                <td>{row.city || "-"}</td>
                <td className="danger-cell">{formatCurrency(row.balance)}</td>
                <td>{formatCurrency(row.riskLimit)}</td>
                <td>
                  <span className={`status ${row.status === "Risk limiti aşıldı" ? "status-canceled" : "status-warning"}`}>{row.status}</span>
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

function AlertCard({ label, value }) {
  return (
    <div className="integrity-summary-card">
      <span>{label}</span>
      <strong>{formatNumber(value)}</strong>
    </div>
  );
}
