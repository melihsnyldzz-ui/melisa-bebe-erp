import { Edit3, PackageSearch, Power } from "lucide-react";
import { formatCurrency } from "../../utils/formatters.js";

export default function ProductTable({ products, onEdit, onToggleStatus }) {
  return (
    <section className="table-panel product-table-panel">
      <div className="section-heading">
        <PackageSearch size={19} />
        <h2>Ürün Listesi</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Ürün Kodu</th>
              <th>Barkod</th>
              <th>Model Kodu</th>
              <th>Varyant Kodu</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Beden</th>
              <th>Renk</th>
              <th>Stok</th>
              <th>Alış</th>
              <th>Satış</th>
              <th>Tedarikçi</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isCritical = product.stockQuantity <= product.criticalStockLevel;

              return (
                <tr className={!product.isActive ? "passive-row" : ""} key={product.id}>
                  <td>
                    <ProductImage product={product} />
                  </td>
                  <td className="strong-cell product-code-cell">{product.code}</td>
                  <td className="barcode-cell">{product.barcode}</td>
                  <td className="product-code-cell">{product.modelCode || "-"}</td>
                  <td className="product-code-cell">{product.variantCode || "-"}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.size}</td>
                  <td>{product.color}</td>
                  <td>
                    <div className="stock-cell">
                      <strong>{product.stockQuantity}</strong>
                      {isCritical && <span className="warning-badge">Kritik</span>}
                    </div>
                  </td>
                  <td>{formatCurrency(product.purchasePrice)}</td>
                  <td>{formatCurrency(product.salePrice)}</td>
                  <td>{product.supplier}</td>
                  <td>
                    <span className={`status ${product.isActive ? "status-active" : "status-passive"}`}>
                      {product.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button small" aria-label="Ürünü düzenle" onClick={() => onEdit(product)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="icon-button small" aria-label="Aktif pasif yap" onClick={() => onToggleStatus(product.id)}>
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <p className="empty-table-text">Filtrelere uygun ürün bulunamadı.</p>}
    </section>
  );
}

function ProductImage({ product }) {
  if (product.imageUrl) {
    return <img className="product-thumb" src={product.imageUrl} alt={product.name} />;
  }

  return <div className="product-thumb placeholder-thumb">{product.name.slice(0, 2).toLocaleUpperCase("tr-TR")}</div>;
}
