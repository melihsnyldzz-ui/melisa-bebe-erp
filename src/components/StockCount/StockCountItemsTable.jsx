import { Trash2 } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";
import { getStockCountStatusLabel } from "../../utils/stockCountUtils.js";

export default function StockCountItemsTable({ items, onRemoveItem, onUpdateQuantity }) {
  return (
    <section className="table-panel product-table-panel stock-count-table-panel">
      <div className="section-heading">
        <h2>Sayım Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table stock-count-table">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Kod</th>
              <th>Barkod</th>
              <th>Marka</th>
              <th>Beden</th>
              <th>Renk</th>
              <th>Mevcut</th>
              <th>Sayılan</th>
              <th>Fark</th>
              <th>Durum</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId}>
                <td className="strong-cell">{item.productName}</td>
                <td className="product-code-cell">{item.productCode || "-"}</td>
                <td className="barcode-cell">{item.barcode || "-"}</td>
                <td>{item.brand || "-"}</td>
                <td>{item.size || "-"}</td>
                <td>{item.color || "-"}</td>
                <td>{formatNumber(item.currentStock)}</td>
                <td>
                  <input
                    className="line-input"
                    min="0"
                    type="number"
                    value={item.countedQuantity}
                    onChange={(event) => onUpdateQuantity(item.productId, event.target.value)}
                  />
                </td>
                <td className={item.difference === 0 ? "" : "danger-cell"}>{formatNumber(item.difference)}</td>
                <td>
                  <span className={`status stock-count-status-${item.status.toLowerCase()}`}>
                    {getStockCountStatusLabel(item.status)}
                  </span>
                </td>
                <td>
                  <button className="icon-button small" type="button" aria-label="Sayım satırını sil" onClick={() => onRemoveItem(item.productId)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <p className="empty-table-text">Sayım listesine ürün eklemek için barkod okutun.</p>}
    </section>
  );
}
