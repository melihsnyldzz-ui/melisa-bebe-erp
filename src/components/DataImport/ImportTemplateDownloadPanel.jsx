import { Download } from "lucide-react";
import { useState } from "react";
import { IMPORT_TYPES } from "../../data/importTemplates.js";
import { buildCsvTemplateContent, downloadCsvFile } from "../../utils/exportCsvUtils.js";
import { getImportTemplateFileName } from "../../utils/importTemplateDownloadUtils.js";

const templateTypes = ["products", "customers", "suppliers"];

export default function ImportTemplateDownloadPanel() {
  const [message, setMessage] = useState(null);

  function downloadTemplate(importType) {
    const template = IMPORT_TYPES[importType];
    const fields = Array.isArray(template?.fields) ? template.fields : [];

    if (fields.length === 0) {
      setMessage({ type: "error", text: "Şablon kolonları bulunamadı." });
      return;
    }

    const fileName = getImportTemplateFileName(importType);
    const content = buildCsvTemplateContent({ fields, delimiter: ";", includeBom: true });
    const result = downloadCsvFile({ content, fileName });

    setMessage(
      result.ok
        ? { type: "success", text: `${template.label} şablonu indirildi: ${fileName}` }
        : { type: "error", text: result.error || "Şablon indirilemedi." },
    );
  }

  return (
    <section className="table-panel import-template-panel">
      <div className="section-heading">
        <h2>İçe Aktarma Şablonları</h2>
      </div>
      <p className="form-note data-import-note">Şablonları indirip kendi verilerinizi aynı kolon yapısıyla doldurabilirsiniz.</p>
      <div className="data-import-upload-actions">
        {templateTypes.map((importType) => (
          <button className="secondary-action" type="button" onClick={() => downloadTemplate(importType)} key={importType}>
            <Download size={17} />
            {IMPORT_TYPES[importType].label} CSV Şablonu
          </button>
        ))}
      </div>
      {message && <p className={`barcode-message barcode-message-${message.type} data-import-message`}>{message.text}</p>}
    </section>
  );
}
