import { BookOpenText, Edit3, Power, Truck } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function SupplierTable({ canEdit = true, suppliers, selectedSupplierId, onEdit, onToggleStatus, onViewLedger }) {
  return (
    <section className="table-panel product-table-panel">
      <div className="section-heading">
        <Truck size={19} />
        <h2>Tedarikçi Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table customer-table">
          <thead>
            <tr>
              <th>Tedarikçi Adı</th>
              <th>Firma Ünvanı</th>
              <th>Yetkili Kişi</th>
              <th>Telefon</th>
              <th>WhatsApp</th>
              <th>Şehir / Ülke</th>
              <th>Toplam Alış</th>
              <th>Toplam Ödeme</th>
              <th>Kalan Bakiye</th>
              <th>Son İşlem</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => {
              const hasDebt = supplier.currentBalance > 0;

              return (
                <tr className={`${!supplier.isActive ? "passive-row" : ""} ${selectedSupplierId === supplier.id ? "selected-row" : ""}`} key={supplier.id}>
                  <td className="strong-cell">{supplier.name}</td>
                  <td>{supplier.companyTitle}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.whatsapp}</td>
                  <td>{`${supplier.city} / ${supplier.country}`}</td>
                  <td>{formatCurrency(supplier.totalPurchases)}</td>
                  <td>{formatCurrency(supplier.totalPayments)}</td>
                  <td>
                    <strong className={hasDebt ? "balance-due" : ""}>{formatCurrency(supplier.currentBalance)}</strong>
                  </td>
                  <td>{formatDateTR(supplier.lastTransactionDate)}</td>
                  <td>
                    <span className={`status ${supplier.isActive ? "status-active" : "status-passive"}`}>
                      {supplier.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Cari hareketlerini görüntüle" onClick={() => onViewLedger(supplier)}>
                        <BookOpenText size={16} />
                      </button>
                      {canEdit && (
                        <>
                          <button className="icon-button small" aria-label="Tedarikçiyi düzenle" onClick={() => onEdit(supplier)}>
                            <Edit3 size={16} />
                          </button>
                          <button className="icon-button small" aria-label="Aktif pasif yap" onClick={() => onToggleStatus(supplier.id)}>
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
      {suppliers.length === 0 && <p className="empty-table-text">Filtrelere uygun tedarikçi bulunamadı.</p>}
    </section>
  );
}
