import { Edit3, Power, UsersRound } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function CustomerTable({ customers, onEdit, onToggleStatus }) {
  return (
    <section className="table-panel product-table-panel">
      <div className="section-heading">
        <UsersRound size={19} />
        <h2>Müşteri Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table customer-table">
          <thead>
            <tr>
              <th>Müşteri Adı</th>
              <th>Firma Adı</th>
              <th>Telefon</th>
              <th>WhatsApp</th>
              <th>Şehir / Ülke</th>
              <th>Müşteri Tipi</th>
              <th>Toplam Satış</th>
              <th>Toplam Tahsilat</th>
              <th>Kalan Bakiye</th>
              <th>Risk Limiti</th>
              <th>Son Alışveriş</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const overRisk = customer.currentBalance > customer.riskLimit;
              const hasDebt = customer.currentBalance > 0;

              return (
                <tr className={!customer.isActive ? "passive-row" : ""} key={customer.id}>
                  <td className="strong-cell">{customer.name}</td>
                  <td>{customer.companyName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.whatsapp}</td>
                  <td>{`${customer.city} / ${customer.country}`}</td>
                  <td>{customer.customerType}</td>
                  <td>{currencyFormatter.format(customer.totalSales)}</td>
                  <td>{currencyFormatter.format(customer.totalPayments)}</td>
                  <td>
                    <div className="stock-cell">
                      <strong className={hasDebt ? "balance-due" : ""}>{currencyFormatter.format(customer.currentBalance)}</strong>
                      {overRisk && <span className="warning-badge">Risk</span>}
                    </div>
                  </td>
                  <td>{currencyFormatter.format(customer.riskLimit)}</td>
                  <td>{formatDate(customer.lastPurchaseDate)}</td>
                  <td>
                    <span className={`status ${customer.isActive ? "status-active" : "status-passive"}`}>
                      {customer.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Müşteriyi düzenle" onClick={() => onEdit(customer)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="icon-button small" aria-label="Aktif pasif yap" onClick={() => onToggleStatus(customer.id)}>
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {customers.length === 0 && <p className="empty-table-text">Filtrelere uygun müşteri bulunamadı.</p>}
    </section>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return dateFormatter.format(new Date(value));
}
