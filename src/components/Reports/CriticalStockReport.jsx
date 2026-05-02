import { AlertTriangle } from "lucide-react";

export default function CriticalStockReport({ products }) {
  return (
    <section className="table-panel product-table-panel report-panel critical-stock-panel">
      <div className="section-heading">
        <AlertTriangle size={19} />
        <h2>Kritik Stok Raporu</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table reports-critical-table">
          <thead>
            <tr>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th>Stok</th>
              <th>Kritik Seviye</th>
              <th>Tedarikçi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="strong-cell">{product.code}</td>
                <td>{product.name}</td>
                <td>
                  <span className="warning-badge">{product.stockQuantity}</span>
                </td>
                <td>{product.criticalStockLevel}</td>
                <td>{product.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <p className="empty-table-text">Kritik stokta ürün bulunmuyor.</p>}
    </section>
  );
}
