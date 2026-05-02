import { Edit3, Power, Truck } from "lucide-react";

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

export default function SupplierTable({ suppliers, onEdit, onToggleStatus }) {
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
                <tr className={!supplier.isActive ? "passive-row" : ""} key={supplier.id}>
                  <td className="strong-cell">{supplier.name}</td>
                  <td>{supplier.companyTitle}</td>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.whatsapp}</td>
                  <td>{`${supplier.city} / ${supplier.country}`}</td>
                  <td>{currencyFormatter.format(supplier.totalPurchases)}</td>
                  <td>{currencyFormatter.format(supplier.totalPayments)}</td>
                  <td>
                    <strong className={hasDebt ? "balance-due" : ""}>{currencyFormatter.format(supplier.currentBalance)}</strong>
                  </td>
                  <td>{formatDate(supplier.lastTransactionDate)}</td>
                  <td>
                    <span className={`status ${supplier.isActive ? "status-active" : "status-passive"}`}>
                      {supplier.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Tedarikçiyi düzenle" onClick={() => onEdit(supplier)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="icon-button small" aria-label="Aktif pasif yap" onClick={() => onToggleStatus(supplier.id)}>
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
      {suppliers.length === 0 && <p className="empty-table-text">Filtrelere uygun tedarikçi bulunamadı.</p>}
    </section>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return dateFormatter.format(new Date(value));
}
