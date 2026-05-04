import { RotateCcw, Search } from "lucide-react";

export default function ProductFilters({ filters, options, onChange, onReset }) {
  function updateFilter(key, value) {
    onChange((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  return (
    <section className="product-filters table-panel">
      <div className="section-heading">
        <Search size={19} />
        <h2>Ürün Filtreleri</h2>
      </div>
      <div className="filters-grid">
        <label className="filter-field search-filter">
          <span>Arama</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Ad, kod, model, varyant, barkod veya marka"
          />
        </label>
        <SelectFilter label="Kategori" value={filters.category} options={options.categories} onChange={(value) => updateFilter("category", value)} />
        <SelectFilter label="Marka" value={filters.brand} options={options.brands} onChange={(value) => updateFilter("brand", value)} />
        <SelectFilter label="Sezon" value={filters.season} options={options.seasons} onChange={(value) => updateFilter("season", value)} />
        <SelectFilter label="Yaş Grubu" value={filters.ageGroup} options={options.ageGroups} onChange={(value) => updateFilter("ageGroup", value)} />
        <SelectFilter label="Cinsiyet" value={filters.gender} options={options.genders} onChange={(value) => updateFilter("gender", value)} />
        <SelectFilter label="Beden" value={filters.size} options={options.sizes} onChange={(value) => updateFilter("size", value)} />
        <SelectFilter label="Renk" value={filters.color} options={options.colors} onChange={(value) => updateFilter("color", value)} />
        <label className="filter-field">
          <span>Stok</span>
          <select value={filters.stock} onChange={(event) => updateFilter("stock", event.target.value)}>
            <option value="all">Tümü</option>
            <option value="critical">Kritik stok</option>
            <option value="healthy">Yeterli stok</option>
          </select>
        </label>
        <label className="filter-field">
          <span>Durum</span>
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="all">Tümü</option>
            <option value="active">Aktif</option>
            <option value="passive">Pasif</option>
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

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">Tümü</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
