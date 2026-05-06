import { IMPORT_TYPES } from "../../data/importTemplates.js";

export default function ColumnMappingPanel({ headers, importType, mapping, onChange }) {
  const template = IMPORT_TYPES[importType];

  return (
    <section className="table-panel column-mapping-panel">
      <div className="section-heading">
        <h2>Kolon Eşleştirme</h2>
      </div>
      <div className="column-mapping-grid">
        {template.fields.map((field) => (
          <label className="filter-field" key={field}>
            <span>
              {field}
              {template.requiredFields.includes(field) && " *"}
            </span>
            <select value={mapping[field] || ""} onChange={(event) => onChange(field, event.target.value)}>
              <option value="">Eşleşme yok</option>
              {headers.map((header) => (
                <option value={header} key={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {headers.length === 0 && <p className="empty-table-text">Kolon eşleştirmek için CSV seçin veya örnek veri yükleyin.</p>}
    </section>
  );
}
