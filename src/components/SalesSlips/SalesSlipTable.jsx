import { Eye, ReceiptText } from "lucide-react";

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

export default function SalesSlipTable({ slips, selectedSlip, onViewDetail }) {
  return (
    <section className="table-panel product-table-panel purchase-list-panel">
      <div className="section-heading">
        <ReceiptText size={19} />
        <h2>Satış Fişleri Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table purchase-slip-table">
          <thead>
            <tr>
              <th>Fiş No</th>
              <th>Tarih</th>
              <th>Müşteri</th>
              <th>Satış Tipi</th>
              <th>Satır</th>
              <th>Genel Toplam</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {slips.map((slip) => (
              <tr key={slip.id}>
                <td className="strong-cell">{slip.slipNo}</td>
                <td>{formatDate(slip.date)}</td>
                <td>{slip.customerName}</td>
                <td>{slip.saleType}</td>
                <td>{slip.items.length}</td>
                <td className="strong-cell">{currencyFormatter.format(slip.grandTotal)}</td>
                <td>
                  <span className="status status-active">{slip.status}</span>
                </td>
                <td>
                  <button className="icon-button small" aria-label="Fiş detayı görüntüle" onClick={() => onViewDetail(slip)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedSlip && (
        <div className="slip-detail">
          <div className="section-heading">
            <ReceiptText size={18} />
            <h2>{selectedSlip.slipNo} Detayı</h2>
          </div>
          <div className="slip-detail-grid">
            {selectedSlip.items.map((item) => (
              <div className="slip-detail-line" key={item.id}>
                <strong>{item.productName}</strong>
                <span>
                  {item.size} / {item.color} - {item.quantity} adet x {currencyFormatter.format(item.unitPrice)}
                </span>
                <b>{currencyFormatter.format(item.lineTotal)}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return dateFormatter.format(new Date(value));
}
