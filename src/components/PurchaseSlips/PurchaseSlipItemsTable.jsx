import { Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatters.js";

export default function PurchaseSlipItemsTable({ items, onUpdateItem, onRemoveItem }) {
  return (
    <div className="product-table-scroll">
      <table className="purchase-items-table">
        <thead>
          <tr>
            <th>Ürün Kodu</th>
            <th>Barkod</th>
            <th>Ürün</th>
            <th>Beden</th>
            <th>Renk</th>
            <th>Adet</th>
            <th>Birim</th>
            <th>İskonto %</th>
            <th>KDV %</th>
            <th>Toplam</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="strong-cell">{item.productCode}</td>
              <td>{item.barcode}</td>
              <td>{item.productName}</td>
              <td>{item.size}</td>
              <td>{item.color}</td>
              <td>
                <input
                  className="line-input"
                  min="1"
                  type="number"
                  value={item.quantity}
                  onChange={(event) => onUpdateItem(item.id, "quantity", event.target.value)}
                />
              </td>
              <td>
                <input
                  className="line-input"
                  min="0"
                  type="number"
                  value={item.unitPrice}
                  onChange={(event) => onUpdateItem(item.id, "unitPrice", event.target.value)}
                />
              </td>
              <td>
                <input
                  className="line-input"
                  min="0"
                  type="number"
                  value={item.discountRate}
                  onChange={(event) => onUpdateItem(item.id, "discountRate", event.target.value)}
                />
              </td>
              <td>
                <input
                  className="line-input"
                  min="0"
                  type="number"
                  value={item.taxRate}
                  onChange={(event) => onUpdateItem(item.id, "taxRate", event.target.value)}
                />
              </td>
              <td className="strong-cell">{formatCurrency(item.lineTotal)}</td>
              <td>
                <button className="icon-button small" aria-label="Satırı kaldır" onClick={() => onRemoveItem(item.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="empty-table-text">Fişe ürün eklemek için barkod veya ürün seçimi kullanın.</p>}
    </div>
  );
}
