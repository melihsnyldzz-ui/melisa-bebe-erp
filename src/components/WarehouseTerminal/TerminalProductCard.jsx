import { ShoppingBasket } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";

export default function TerminalProductCard({ onAddToBasket, product }) {
  if (!product) {
    return (
      <section className="table-panel warehouse-terminal-card warehouse-terminal-empty">
        <h2>Ürün Bilgisi</h2>
        <p className="empty-table-text">Ürün bilgisi görmek için barkod, ürün kodu veya varyant kodu okutun.</p>
      </section>
    );
  }

  return (
    <section className="table-panel warehouse-terminal-card">
      <div className="warehouse-terminal-product-head">
        <div>
          <span>{product.code || "-"}</span>
          <h2>{product.name || "-"}</h2>
          <p>{[product.brand, product.season, product.category, product.size, product.color].filter(Boolean).join(" / ") || "-"}</p>
        </div>
        <div className="warehouse-terminal-product-actions">
          <strong className={`warehouse-terminal-status ${product.status === "Sağlıklı" ? "status-ok" : "status-warn"}`}>{product.status}</strong>
          <button className="primary-action" type="button" onClick={() => onAddToBasket?.(product)}>
            <ShoppingBasket size={18} />
            Sepete Ekle
          </button>
        </div>
      </div>

      <div className="warehouse-terminal-metrics">
        <Metric label="Mevcut Stok" value={formatNumber(product.stockQuantity)} />
        <Metric label="Kritik Stok" value={formatNumber(product.criticalStockLevel)} />
        <Metric label="Satış Fiyatı" value={formatCurrency(product.salePrice)} />
        <Metric label="Alış Fiyatı" value={formatCurrency(product.purchasePrice)} />
      </div>

      <div className="warehouse-terminal-detail-grid">
        <Detail label="Ürün adı" value={product.name} />
        <Detail label="Barkod" value={product.barcode} />
        <Detail label="Ürün kodu" value={product.code} />
        <Detail label="Model kodu" value={product.modelCode} />
        <Detail label="Varyant kodu" value={product.variantCode} />
        <Detail label="Marka" value={product.brand} />
        <Detail label="Sezon" value={product.season} />
        <Detail label="Yaş grubu" value={product.ageGroup} />
        <Detail label="Cinsiyet" value={product.gender} />
        <Detail label="Kategori" value={product.category} />
        <Detail label="Beden" value={product.size} />
        <Detail label="Renk" value={product.color} />
        <Detail label="Tedarikçi" value={product.supplier} />
        <Detail label="Aktif/pasif durumu" value={product.isActive ? "Aktif" : "Pasif"} />
      </div>

      <div className="integrity-table-block">
        <h3>Son Stok Hareketleri</h3>
        <div className="product-table-scroll">
          <table className="product-table warehouse-terminal-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İşlem</th>
                <th>Giriş</th>
                <th>Çıkış</th>
                <th>Kalan</th>
                <th>Fiş</th>
              </tr>
            </thead>
            <tbody>
              {product.movements.map((movement) => (
                <tr key={movement.id || `${movement.relatedSlipNo}-${movement.date}`}>
                  <td>{movement.date ? formatDateTR(movement.date) : "-"}</td>
                  <td>{movement.movementType || "-"}</td>
                  <td className="stock-in">{formatNumber(movement.quantityIn)}</td>
                  <td className="stock-out">{formatNumber(movement.quantityOut)}</td>
                  <td>{formatNumber(movement.remainingStock)}</td>
                  <td>{movement.relatedSlipNo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {product.movements.length === 0 && <p className="empty-table-text">Bu ürün için stok hareketi bulunamadı.</p>}
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="stock-count-report-metric">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}
