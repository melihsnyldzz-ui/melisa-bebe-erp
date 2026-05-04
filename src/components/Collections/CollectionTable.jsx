import { Eye, Image, ReceiptText, XCircle } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function CollectionTable({ collections, selectedCollection, onCancel, onViewDetail }) {
  return (
    <section className="table-panel product-table-panel purchase-list-panel">
      <div className="section-heading">
        <ReceiptText size={19} />
        <h2>Tahsilat Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table collection-table">
          <thead>
            <tr>
              <th>Tahsilat No</th>
              <th>Tarih</th>
              <th>Müşteri</th>
              <th>Ödeme Tipi</th>
              <th>Tutar</th>
              <th>Açıklama</th>
              <th>Durum</th>
              <th>Dekont</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => {
              const isCanceled = collection.status === "İptal";

              return (
                <tr className={isCanceled ? "canceled-row" : ""} key={collection.id}>
                  <td className="strong-cell">{collection.collectionNo}</td>
                  <td>{formatDateTR(collection.date)}</td>
                  <td>{collection.customerName}</td>
                  <td>{collection.paymentType}</td>
                  <td className="strong-cell">{formatCurrency(collection.amount)}</td>
                  <td>{collection.description || "-"}</td>
                  <td>
                    <span className={`status ${isCanceled ? "status-canceled" : "status-active"}`}>{collection.status || "Kayıtlı"}</span>
                  </td>
                  <td>
                    {collection.receiptImageUrl ? (
                      <a className="receipt-link" href={collection.receiptImageUrl} target="_blank" rel="noreferrer">
                        <Image size={15} />
                        Görüntüle
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Tahsilat detayı görüntüle" onClick={() => onViewDetail(collection)}>
                        <Eye size={16} />
                      </button>
                      <button
                        className="icon-button small danger"
                        aria-label="Tahsilatı iptal et"
                        disabled={isCanceled}
                        onClick={() => onCancel(collection)}
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
      {selectedCollection && (
        <div className="slip-detail">
          <div className="section-heading">
            <ReceiptText size={18} />
            <h2>{selectedCollection.collectionNo} Detayı</h2>
          </div>
          <div className="slip-detail-grid">
            <div className="slip-detail-line">
              <strong>{selectedCollection.customerName}</strong>
              <span>
                {formatDateTR(selectedCollection.date)} - {selectedCollection.paymentType}
              </span>
              <b>{formatCurrency(selectedCollection.amount)}</b>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
