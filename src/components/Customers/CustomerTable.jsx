import { BookOpenText, Edit3, Power, UsersRound } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function CustomerTable({ canEdit = true, customers, selectedCustomerId, onEdit, onToggleStatus, onViewLedger }) {
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
                <tr className={`${!customer.isActive ? "passive-row" : ""} ${selectedCustomerId === customer.id ? "selected-row" : ""}`} key={customer.id}>
                  <td className="strong-cell">{customer.name}</td>
                  <td>{customer.companyName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.whatsapp}</td>
                  <td>{`${customer.city} / ${customer.country}`}</td>
                  <td>{customer.customerType}</td>
                  <td>{formatCurrency(customer.totalSales)}</td>
                  <td>{formatCurrency(customer.totalPayments)}</td>
                  <td>
                    <div className="stock-cell">
                      <strong className={hasDebt ? "balance-due" : ""}>{formatCurrency(customer.currentBalance)}</strong>
                      {overRisk && <span className="warning-badge">Risk</span>}
                    </div>
                  </td>
                  <td>{formatCurrency(customer.riskLimit)}</td>
                  <td>{formatDateTR(customer.lastPurchaseDate)}</td>
                  <td>
                    <span className={`status ${customer.isActive ? "status-active" : "status-passive"}`}>
                      {customer.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Cari hareketlerini görüntüle" onClick={() => onViewLedger(customer)}>
                        <BookOpenText size={16} />
                      </button>
                      {canEdit && (
                        <>
                          <button className="icon-button small" aria-label="Müşteriyi düzenle" onClick={() => onEdit(customer)}>
                            <Edit3 size={16} />
                          </button>
                          <button className="icon-button small" aria-label="Aktif pasif yap" onClick={() => onToggleStatus(customer.id)}>
                            <Power size={16} />
                          </button>
                        </>
                      )}
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
