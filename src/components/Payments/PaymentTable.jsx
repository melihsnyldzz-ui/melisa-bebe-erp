import { Eye, Image, ReceiptText, XCircle } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function PaymentTable({ payments, selectedPayment, onCancel, onViewDetail }) {
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
              <th>Durum</th>
              <th>Dekont</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const isCanceled = payment.status === "İptal";

              return (
                <tr className={isCanceled ? "cancelled-row" : ""} key={payment.id}>
                  <td className="strong-cell">{payment.paymentNo}</td>
                  <td>{formatDateTR(payment.date)}</td>
                  <td>{payment.supplierName}</td>
                  <td>{payment.paymentType}</td>
                  <td className="strong-cell">{formatCurrency(payment.amount)}</td>
                  <td>{payment.description || "-"}</td>
                  <td>
                    <span className={`status ${isCanceled ? "status-canceled" : "status-active"}`}>{payment.status || "Kayıtlı"}</span>
                  </td>
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
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Ödeme detayı görüntüle" onClick={() => onViewDetail(payment)}>
                        <Eye size={16} />
                      </button>
                      <button
                        className="icon-button small cancel-action"
                        aria-label="Ödemeyi iptal et"
                        disabled={isCanceled}
                        onClick={() => onCancel(payment)}
                        title="İptal Et"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
                {formatDateTR(selectedPayment.date)} - {selectedPayment.paymentType}
              </span>
              <b>{formatCurrency(selectedPayment.amount)}</b>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
