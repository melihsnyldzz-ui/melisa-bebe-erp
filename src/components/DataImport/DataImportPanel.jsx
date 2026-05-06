import { FileJson, FileText, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { IMPORT_TYPES } from "../../data/importTemplates.js";
import {
  buildImportPayload,
  buildImportPreview,
  buildInitialColumnMapping,
  parseDelimitedText,
} from "../../utils/importPreviewUtils.js";
import ColumnMappingPanel from "./ColumnMappingPanel.jsx";
import ImportPreviewTable from "./ImportPreviewTable.jsx";
import ImportTypeSelector from "./ImportTypeSelector.jsx";

export default function DataImportPanel() {
  const [importType, setImportType] = useState("products");
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [message, setMessage] = useState("");
  const [payload, setPayload] = useState(null);

  const preview = useMemo(() => buildImportPreview({ importType, mapping, rows }), [importType, mapping, rows]);

  function changeImportType(nextImportType) {
    setImportType(nextImportType);
    const nextMapping = buildInitialColumnMapping(headers, nextImportType);
    setMapping(nextMapping);
    setPayload(null);
    setMessage("");
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      loadCsvText(text, `${file.name} dosyası yüklendi.`);
    } catch (error) {
      console.error("CSV dosyası okunamadı:", error);
      setMessage("Dosya okunamadı. CSV veya TXT dosyasını kontrol edin.");
    }
  }

  function loadSampleData() {
    loadCsvText(IMPORT_TYPES[importType].sampleCsv, `${IMPORT_TYPES[importType].label} örnek verisi yüklendi.`);
  }

  function loadCsvText(text, successMessage) {
    const parsed = parseDelimitedText(text);
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    setMapping(buildInitialColumnMapping(parsed.headers, importType));
    setPayload(null);
    setMessage(parsed.rows.length ? successMessage : "CSV boş görünüyor. Başlık ve satırları kontrol edin.");
  }

  function updateMapping(field, sourceColumn) {
    setMapping((currentMapping) => ({ ...currentMapping, [field]: sourceColumn }));
    setPayload(null);
  }

  function preparePayload() {
    setPayload(buildImportPayload({ importType, previewRows: preview.rows, summary: preview.summary }));
    setMessage("İçe aktarma payload’ı hazırlandı. Gerçek kayıt işlemi bu sürümde yapılmaz.");
  }

  return (
    <>
      <ImportTypeSelector value={importType} onChange={changeImportType} />

      <section className="table-panel data-import-upload-panel">
        <div className="section-heading">
          <Upload size={19} />
          <h2>Dosya Seçimi</h2>
        </div>
        <div className="data-import-upload-actions">
          <label className="secondary-action file-upload-action">
            <FileText size={17} />
            CSV / TXT Seç
            <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={handleFileChange} />
          </label>
          <button className="secondary-action" type="button" onClick={loadSampleData}>
            <FileText size={17} />
            Örnek Veri Yükle
          </button>
        </div>
        {message && <p className="barcode-message barcode-message-success data-import-message">{message}</p>}
        <p className="form-note data-import-note">
          Bu sürüm yalnızca içe aktarma önizlemesi hazırlar. Gerçek kayıt işlemi sonraki sürümde onaylı şekilde eklenecektir.
        </p>
      </section>

      <ColumnMappingPanel headers={headers} importType={importType} mapping={mapping} onChange={updateMapping} />

      <section className="kpi-grid import-summary-grid">
        <ImportSummaryCard label="Toplam Satır" value={preview.summary.totalRows} />
        <ImportSummaryCard label="Geçerli" value={preview.summary.validRows} />
        <ImportSummaryCard label="Uyarı" value={preview.summary.warningRows} />
        <ImportSummaryCard label="Hatalı" value={preview.summary.errorRows} />
      </section>

      <ImportPreviewTable rows={preview.rows} />

      <section className="table-panel data-import-payload-panel">
        <div className="section-heading">
          <FileJson size={19} />
          <h2>Import Payload</h2>
        </div>
        <div className="modal-actions stock-count-actions">
          <button className="primary-action" type="button" onClick={preparePayload} disabled={preview.rows.length === 0}>
            <FileJson size={18} />
            İçe Aktarma Payload’ını Hazırla
          </button>
          <button className="secondary-action" type="button" disabled>
            Gerçek Import Sonraki Sürümde
          </button>
        </div>
        {payload ? (
          <pre className="stock-count-report-preview">{JSON.stringify(payload, null, 2)}</pre>
        ) : (
          <p className="empty-table-text">Payload oluşturmak için veri yükleyip kolonları eşleştirin.</p>
        )}
      </section>
    </>
  );
}

function ImportSummaryCard({ label, value }) {
  return (
    <article className="kpi-card import-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
