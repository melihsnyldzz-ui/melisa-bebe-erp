import { RotateCcw, Search } from "lucide-react";

export default function SupplierFilters({ filters, options, onChange, onReset }) {
  function updateFilter(key, value) {
    onChange((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  return (
    <section className="product-filters table-panel">
      <div className="section-heading">
        <Search size={19} />
        <h2>Tedarikçi Filtreleri</h2>
      </div>
      <div className="filters-grid supplier-filters-grid">
        <label className="filter-field search-filter">
          <span>Arama</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Tedarikçi, firma, yetkili, telefon veya şehir"
          />
        </label>
        <SelectFilter label="Şehir" value={filters.city} options={options.cities} onChange={(value) => updateFilter("city", value)} />
        <label className="filter-field">
          <span>Borç</span>
          <select value={filters.debt} onChange={(event) => updateFilter("debt", event.target.value)}>
            <option value="all">Tümü</option>
            <option value="debt">Borç Var</option>
            <option value="clear">Borç Yok</option>
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
