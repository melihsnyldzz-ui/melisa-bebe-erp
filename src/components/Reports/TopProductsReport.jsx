import { ShoppingBag } from "lucide-react";

export default function TopProductsReport({ products }) {
  return (
    <section className="table-panel report-panel">
      <div className="section-heading">
        <ShoppingBag size={19} />
        <h2>En Çok Satan Ürünler</h2>
      </div>
      <div className="report-list">
        {products.map((product, index) => (
          <div className="report-list-row" key={product.productCode}>
            <span>{index + 1}</span>
            <strong>{product.productName}</strong>
            <small>{product.productCode}</small>
            <b>{product.quantity} adet</b>
          </div>
        ))}
      </div>
    </section>
  );
}
