import { IMPORT_TYPES } from "../../data/importTemplates.js";

export default function ImportTypeSelector({ value, onChange }) {
  return (
    <section className="table-panel import-type-panel">
      <div className="section-heading">
        <h2>İçe Aktarma Tipi</h2>
      </div>
      <div className="import-type-grid">
        {Object.entries(IMPORT_TYPES).map(([type, template]) => (
          <button className={`import-type-card ${value === type ? "active" : ""}`} type="button" onClick={() => onChange(type)} key={type}>
            <strong>{template.label}</strong>
            <span>{template.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
