import { RotateCcw, Search } from "lucide-react";

const movementTypes = ["Alış Girişi", "Satış Çıkışı", "İade Girişi", "İade Çıkışı", "Sayım Farkı", "Transfer"];

export default function StockMovementFilters({ filters, products, onChange, onReset }) {
  function updateFilter(key, value) {
    onChange((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  return (
    <section className="product-filters table-panel">
      <div className="section-heading">
        <Search size={19} />
        <h2>Stok Hareketi Filtreleri</h2>
      </div>
      <div className="filters-grid stock-filters-grid">
        <label className="filter-field search-filter">
          <span>Arama</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Ürün, kod, barkod, fiş no veya cari"
          />
        </label>
        <label className="filter-field">
          <span>İşlem Tipi</span>
          <select value={filters.movementType} onChange={(event) => updateFilter("movementType", event.target.value)}>
            <option value="all">Tümü</option>
            {movementTypes.map((movementType) => (
              <option value={movementType} key={movementType}>
                {movementType}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Tarih</span>
          <input type="date" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} />
        </label>
        <label className="filter-field">
          <span>Ürün</span>
          <select value={filters.productId} onChange={(event) => updateFilter("productId", event.target.value)}>
            <option value="all">Tümü</option>
            {products.map((product) => (
              <option value={product.id} key={product.id}>
                {product.code} - {product.name}
              </option>
            ))}
          </select>
        </label>
        <button className="secondary-action" onClick={onReset}>
          <RotateCcw size={17} />
          Temizle
        </button>
      </div>
    </section>
  );
}
