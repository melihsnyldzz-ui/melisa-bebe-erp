import { FileJson, FileText, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { IMPORT_TYPES } from "../../data/importTemplates.js";
import { useErpData } from "../../context/ErpDataContext.jsx";
import {
  buildApplyImportPayload,
  buildImportResult,
  buildApplicableImportRows,
  getImportTypeLabel,
  validateApplyImportPayload,
} from "../../utils/importApplyUtils.js";
import {
  buildImportPayload,
  buildImportPreview,
  buildInitialColumnMapping,
  parseDelimitedText,
} from "../../utils/importPreviewUtils.js";
import ColumnMappingPanel from "./ColumnMappingPanel.jsx";
import ImportConfirmModal from "./ImportConfirmModal.jsx";
import ImportPreviewTable from "./ImportPreviewTable.jsx";
import ImportTypeSelector from "./ImportTypeSelector.jsx";

export default function DataImportPanel() {
  const { appSettings, applyDataImport } = useErpData();
  const [importType, setImportType] = useState("products");
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [message, setMessage] = useState(null);
  const [payload, setPayload] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [lastImportResult, setLastImportResult] = useState(null);

  const preview = useMemo(() => buildImportPreview({ importType, mapping, rows }), [importType, mapping, rows]);
  const importableRows = useMemo(() => buildApplicableImportRows(preview.rows), [preview.rows]);

  function changeImportType(nextImportType) {
    setImportType(nextImportType);
    const nextMapping = buildInitialColumnMapping(headers, nextImportType);
    setMapping(nextMapping);
    setPayload(null);
    setLastImportResult(null);
    setMessage(null);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      loadCsvText(text, `${file.name} dosyası yüklendi.`);
    } catch (error) {
      console.error("CSV dosyası okunamadı:", error);
      setMessage({ type: "error", text: "Dosya okunamadı. CSV veya TXT dosyasını kontrol edin." });
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
    setLastImportResult(null);
    setMessage(
      parsed.rows.length
        ? { type: "success", text: successMessage }
        : { type: "error", text: "CSV boş görünüyor. Başlık ve satırları kontrol edin." },
    );
  }

  function updateMapping(field, sourceColumn) {
    setMapping((currentMapping) => ({ ...currentMapping, [field]: sourceColumn }));
    setPayload(null);
    setLastImportResult(null);
  }

  function preparePayload() {
    setPayload(buildImportPayload({ importType, previewRows: preview.rows, summary: preview.summary }));
    setMessage({ type: "success", text: "İçe aktarma payload’ı hazırlandı." });
  }

  function openConfirmModal() {
    const importPayload = buildApplyImportPayload({ importType, previewRows: preview.rows });
    const validationError = validateApplyImportPayload(importPayload);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setImportError("");
    setIsConfirmOpen(true);
  }

  async function confirmImport() {
    const importPayload = buildApplyImportPayload({ importType, previewRows: preview.rows });
    const validationError = validateApplyImportPayload(importPayload);
    if (validationError) {
      setImportError(validationError);
      return;
    }

    setIsImporting(true);
    const result = await applyDataImport(importPayload);
    setIsImporting(false);

    if (!result?.ok) {
      setImportError(result?.error || "İçe aktarma sırasında hata oluştu. Hiçbir kayıt eklenmedi.");
      return;
    }

    const record = {
      ...buildImportResult({
        importType,
        totalRows: preview.summary.totalRows,
        insertedCount: importPayload.rows.length,
        skippedCount: preview.summary.errorRows,
        errors: [],
      }),
      ...(result.record || {}),
      totalRows: preview.summary.totalRows,
      skippedCount: preview.summary.errorRows,
    };
    setLastImportResult(record);
    setMessage({ type: "success", text: `${record.insertedCount} satır başarıyla içe aktarıldı.` });
    setIsConfirmOpen(false);
    setImportError("");
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
        {message && <p className={`barcode-message barcode-message-${message.type} data-import-message`}>{message.text}</p>}
        <p className="form-note data-import-note">
          Hatalı satırlar içe aktarılmaz. Uyarılı satırlar yalnızca onayınızla veritabanına eklenir.
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
          <button className="primary-action" type="button" onClick={openConfirmModal} disabled={importableRows.length === 0 || isImporting}>
            <Upload size={18} />
            İçe Aktarmayı Onayla
          </button>
        </div>
        {payload ? (
          <pre className="stock-count-report-preview">{JSON.stringify(payload, null, 2)}</pre>
        ) : (
          <p className="empty-table-text">Payload oluşturmak için veri yükleyip kolonları eşleştirin.</p>
        )}
      </section>

      {lastImportResult && (
        <section className="table-panel import-result-panel">
          <div className="section-heading">
            <h2>Son Import Sonucu</h2>
          </div>
          <div className="stock-count-report-summary">
            <ResultMetric label="Import Tipi" value={getImportTypeLabel(lastImportResult.importType)} />
            <ResultMetric label="Toplam Satır" value={lastImportResult.totalRows} />
            <ResultMetric label="Eklenen Satır" value={lastImportResult.insertedCount} />
            <ResultMetric label="Atlanan / Hatalı" value={lastImportResult.skippedCount} />
            <ResultMetric label="Tarih" value={new Date(lastImportResult.createdAt).toLocaleString("tr-TR")} />
          </div>
        </section>
      )}

      <ImportConfirmModal
        open={isConfirmOpen}
        importType={importType}
        summary={preview.summary}
        importableCount={importableRows.length}
        lastBackupAt={appSettings?.lastBackupAt}
        isSaving={isImporting}
        errorMessage={importError}
        onCancel={() => {
          setImportError("");
          setIsConfirmOpen(false);
        }}
        onConfirm={confirmImport}
      />
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

function ResultMetric({ label, value }) {
  return (
    <div className="stock-count-report-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
