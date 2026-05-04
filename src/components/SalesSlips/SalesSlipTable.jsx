import { Eye, ReceiptText, XCircle } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function SalesSlipTable({ canCancel = true, slips, selectedSlip, onCancel, onViewDetail }) {
  const selectedItems = selectedSlip?.items || [];

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
            {slips.map((slip) => {
              const isCanceled = slip.status === "İptal";

              return (
                <tr className={isCanceled ? "cancelled-row" : ""} key={slip.id}>
                  <td className="strong-cell">{slip.slipNo}</td>
                  <td>{formatDateTR(slip.date)}</td>
                  <td>{slip.customerName}</td>
                  <td>{slip.saleType}</td>
                  <td>{(slip.items || []).length}</td>
                  <td className="strong-cell">{formatCurrency(slip.grandTotal)}</td>
                  <td>
                    <span className={`status ${isCanceled ? "status-canceled" : "status-active"}`}>{slip.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Fiş detayı görüntüle" onClick={() => onViewDetail(slip)}>
                        <Eye size={16} />
                      </button>
                      {canCancel && (
                        <button
                          className="icon-button small cancel-action"
                          aria-label="Satış fişini iptal et"
                          disabled={isCanceled}
                          onClick={() => onCancel(slip)}
                          title="İptal Et"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
            <div className="slip-detail-summary">
              <span>{selectedSlip.customerName}</span>
              <span>{formatDateTR(selectedSlip.date)}</span>
              <strong>{formatCurrency(selectedSlip.grandTotal)}</strong>
            </div>
            {selectedItems.length === 0 && (
              <p className="empty-detail-message">Bu fiş için satır detayı bulunamadı. Fiş kaydı korunuyor, ancak ürün satırları veritabanından okunamadı.</p>
            )}
            {selectedItems.map((item, index) => (
              <div className="slip-detail-line" key={item.id || `${item.productId}-${index}`}>
                <strong>{item.productName}</strong>
                <span>
                  {item.size} / {item.color} - {item.quantity} adet x {formatCurrency(item.unitPrice)}
                </span>
                <b>{formatCurrency(item.lineTotal)}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
