import { Boxes } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";

export default function StockMovementTable({ movements }) {
  return (
    <section className="table-panel product-table-panel">
      <div className="section-heading">
        <Boxes size={19} />
        <h2>Stok Hareketleri Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table stock-movement-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Ürün Kodu</th>
              <th>Barkod</th>
              <th>Ürün Adı</th>
              <th>Beden</th>
              <th>Renk</th>
              <th>İşlem Tipi</th>
              <th>Giriş</th>
              <th>Çıkış</th>
              <th>Kalan</th>
              <th>İlgili Fiş No</th>
              <th>Cari / Tedarikçi</th>
              <th>Kullanıcı</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>{formatDateTR(movement.date)}</td>
                <td className="strong-cell">{movement.productCode}</td>
                <td>{movement.barcode}</td>
                <td>{movement.productName}</td>
                <td>{movement.size}</td>
                <td>{movement.color}</td>
                <td>
                  <span className={`movement-badge ${getMovementClass(movement.movementType)}`}>{movement.movementType}</span>
                </td>
                <td className="stock-in">{movement.quantityIn}</td>
                <td className="stock-out">{movement.quantityOut}</td>
                <td>
                  <div className="stock-cell">
                    <strong>{movement.remainingStock}</strong>
                    {movement.remainingStock <= 10 && <span className="warning-badge">Düşük</span>}
                  </div>
                </td>
                <td>{movement.relatedSlipNo}</td>
                <td>{movement.relatedPartyName}</td>
                <td>{movement.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {movements.length === 0 && <p className="empty-table-text">Filtrelere uygun stok hareketi bulunamadı.</p>}
    </section>
  );
}

function getMovementClass(type) {
  if (type === "Alış Girişi" || type === "İade Girişi" || type === "Satış İptali") return "movement-in";
  if (type === "Satış Çıkışı" || type === "İade Çıkışı" || type === "Alış İptali") return "movement-out";
  if (type === "Sayım Farkı") return "movement-count";
  return "movement-neutral";
}
