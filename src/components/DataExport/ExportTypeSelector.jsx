import { EXPORT_TYPES } from "../../utils/exportDataUtils.js";

export default function ExportTypeSelector({ value, onChange }) {
  return (
    <section className="table-panel import-type-panel">
      <div className="section-heading">
        <h2>Dışa Aktarma Tipi</h2>
      </div>
      <div className="import-type-grid">
        {Object.entries(EXPORT_TYPES).map(([type, template]) => (
          <button className={`import-type-card ${value === type ? "active" : ""}`} type="button" onClick={() => onChange(type)} key={type}>
            <strong>{template.label}</strong>
            <span>{template.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
