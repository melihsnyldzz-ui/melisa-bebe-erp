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

export default function CollectionTable({ collections, selectedCollection, onViewDetail }) {
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
              <th>Dekont</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td className="strong-cell">{collection.collectionNo}</td>
                <td>{formatDate(collection.date)}</td>
                <td>{collection.customerName}</td>
                <td>{collection.paymentType}</td>
                <td className="strong-cell">{currencyFormatter.format(collection.amount)}</td>
                <td>{collection.description || "-"}</td>
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
                  <button className="icon-button small" aria-label="Tahsilat detayı görüntüle" onClick={() => onViewDetail(collection)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
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
                {formatDate(selectedCollection.date)} - {selectedCollection.paymentType}
              </span>
              <b>{currencyFormatter.format(selectedCollection.amount)}</b>
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
