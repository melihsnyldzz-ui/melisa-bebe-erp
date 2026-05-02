import { RotateCcw, Search } from "lucide-react";

export default function CustomerFilters({ filters, options, onChange, onReset }) {
  function updateFilter(key, value) {
    onChange((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  return (
    <section className="product-filters table-panel">
      <div className="section-heading">
        <Search size={19} />
        <h2>Müşteri Filtreleri</h2>
      </div>
      <div className="filters-grid">
        <label className="filter-field search-filter">
          <span>Arama</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Müşteri, firma, telefon veya şehir"
          />
        </label>
        <SelectFilter
          label="Müşteri Tipi"
          value={filters.customerType}
          options={options.customerTypes}
          onChange={(value) => updateFilter("customerType", value)}
        />
        <SelectFilter label="Şehir" value={filters.city} options={options.cities} onChange={(value) => updateFilter("city", value)} />
        <label className="filter-field">
          <span>Borç</span>
          <select value={filters.debt} onChange={(event) => updateFilter("debt", event.target.value)}>
            <option value="all">Tümü</option>
            <option value="debt">Borçlu</option>
            <option value="clear">Borcu Yok</option>
          </select>
        </label>
        <label className="filter-field">
          <span>Risk</span>
          <select value={filters.risk} onChange={(event) => updateFilter("risk", event.target.value)}>
            <option value="all">Tümü</option>
            <option value="over">Limit Aşan</option>
            <option value="safe">Güvenli</option>
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
