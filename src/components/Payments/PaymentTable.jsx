import { Eye, Image, ReceiptText } from "lucide-react";

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

export default function PaymentTable({ payments, selectedPayment, onViewDetail }) {
  return (
    <section className="table-panel product-table-panel purchase-list-panel">
      <div className="section-heading">
        <ReceiptText size={19} />
        <h2>Ödeme Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table collection-table">
          <thead>
            <tr>
              <th>Ödeme No</th>
              <th>Tarih</th>
              <th>Tedarikçi</th>
              <th>Ödeme Tipi</th>
              <th>Tutar</th>
              <th>Açıklama</th>
              <th>Dekont</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="strong-cell">{payment.paymentNo}</td>
                <td>{formatDate(payment.date)}</td>
                <td>{payment.supplierName}</td>
                <td>{payment.paymentType}</td>
                <td className="strong-cell">{currencyFormatter.format(payment.amount)}</td>
                <td>{payment.description || "-"}</td>
                <td>
                  {payment.receiptImageUrl ? (
                    <a className="receipt-link" href={payment.receiptImageUrl} target="_blank" rel="noreferrer">
                      <Image size={15} />
                      Görüntüle
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button className="icon-button small" aria-label="Ödeme detayı görüntüle" onClick={() => onViewDetail(payment)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPayment && (
        <div className="slip-detail">
          <div className="section-heading">
            <ReceiptText size={18} />
            <h2>{selectedPayment.paymentNo} Detayı</h2>
          </div>
          <div className="slip-detail-grid">
            <div className="slip-detail-line">
              <strong>{selectedPayment.supplierName}</strong>
              <span>
                {formatDate(selectedPayment.date)} - {selectedPayment.paymentType}
              </span>
              <b>{currencyFormatter.format(selectedPayment.amount)}</b>
            </div>
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
