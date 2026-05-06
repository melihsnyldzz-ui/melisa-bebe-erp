import { Download, FileSpreadsheet } from "lucide-react";
import { useMemo, useState } from "react";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { buildCsvContent, downloadCsvFile } from "../../utils/exportCsvUtils.js";
import { buildExportFileName, buildExportRows, EXPORT_TYPES } from "../../utils/exportDataUtils.js";
import ExportPreviewTable from "./ExportPreviewTable.jsx";
import ExportResultPanel from "./ExportResultPanel.jsx";
import ExportTypeSelector from "./ExportTypeSelector.jsx";

export default function DataExportPanel() {
  const erpData = useErpData();
  const [exportType, setExportType] = useState("products");
  const [recordScope, setRecordScope] = useState("active");
  const [delimiter, setDelimiter] = useState(";");
  const [includeBom, setIncludeBom] = useState(true);
  const [message, setMessage] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const config = EXPORT_TYPES[exportType] || EXPORT_TYPES.products;
  const rows = useMemo(
    () => buildExportRows({ exportType, data: erpData, activeOnly: recordScope === "active" }),
    [erpData, exportType, recordScope],
  );

  function changeExportType(nextExportType) {
    setExportType(nextExportType);
    setLastResult(null);
    setMessage(null);
  }

  function exportCsv() {
    if (rows.length === 0) {
      setMessage({ type: "error", text: "Dışa aktarılacak veri bulunamadı." });
      return;
    }

    const now = new Date();
    const fileName = buildExportFileName(exportType, now);
    const content = buildCsvContent({ columns: config.columns, rows, delimiter, includeBom });

    downloadCsvFile({ content, fileName });
    setLastResult({
      exportType,
      rowCount: rows.length,
      fileName,
      createdAt: now.toISOString(),
      status: "success",
    });
    setMessage({ type: "success", text: `${config.label} CSV dosyası hazırlandı: ${fileName}` });
  }

  return (
    <>
      <ExportTypeSelector value={exportType} onChange={changeExportType} />

      <section className="table-panel data-import-upload-panel export-options-panel">
        <div className="section-heading">
          <FileSpreadsheet size={19} />
          <h2>Dışa Aktarma Seçenekleri</h2>
        </div>
        <div className="export-options-grid">
          <label className="filter-field">
            <span>Kayıt kapsamı</span>
            <select value={recordScope} onChange={(event) => setRecordScope(event.target.value)}>
              <option value="active">Sadece aktif kayıtlar</option>
              <option value="all">Tüm kayıtlar</option>
            </select>
          </label>
          <label className="filter-field">
            <span>Ayraç</span>
            <select value={delimiter} onChange={(event) => setDelimiter(event.target.value)}>
              <option value=";">Noktalı virgül (;)</option>
              <option value=",">Virgül (,)</option>
            </select>
          </label>
          <label className="checkbox-row export-checkbox-row">
            <input type="checkbox" checked={includeBom} onChange={(event) => setIncludeBom(event.target.checked)} />
            <span>Türkçe Excel uyumu için UTF-8 BOM ekle</span>
          </label>
        </div>
        <div className="modal-actions stock-count-actions">
          <button className="primary-action" type="button" onClick={exportCsv} disabled={rows.length === 0}>
            <Download size={18} />
            CSV Dışa Aktar
          </button>
        </div>
        {message && <p className={`barcode-message barcode-message-${message.type} data-import-message`}>{message.text}</p>}
        <p className="form-note data-import-note">
          CSV dışa aktarma yalnızca mevcut verileri okur. Ürün, cari, stok, satış veya alış kayıtlarında değişiklik yapmaz.
        </p>
      </section>

      <ExportPreviewTable columns={config.columns} rows={rows} totalRows={rows.length} />
      <ExportResultPanel result={lastResult} />
    </>
  );
}
