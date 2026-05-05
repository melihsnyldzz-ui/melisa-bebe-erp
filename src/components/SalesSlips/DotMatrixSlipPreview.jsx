import { Copy, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { buildDotMatrixSalesSlipText } from "../../utils/dotMatrixPrintUtils.js";

export default function DotMatrixSlipPreview({ onPrint, slip }) {
  const [simplifyTurkish, setSimplifyTurkish] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const dotMatrixText = useMemo(
    () => buildDotMatrixSalesSlipText(slip, { lineWidth: 80, simplifyTurkish }),
    [simplifyTurkish, slip],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(dotMatrixText);
      setCopyMessage("Metin panoya kopyalandı.");
    } catch (error) {
      console.error("Dot-matrix metni kopyalanamadı:", error);
      setCopyMessage("Metin kopyalanamadı.");
    }
  }

  if (!slip) return null;

  return (
    <section className="table-panel dot-matrix-panel print-area dot-matrix-print-area">
      <div className="dot-matrix-toolbar no-print">
        <label className="dot-matrix-option">
          <input
            checked={simplifyTurkish}
            type="checkbox"
            onChange={(event) => setSimplifyTurkish(event.target.checked)}
          />
          Türkçe karakterleri sadeleştir
        </label>
        <div className="dot-matrix-toolbar-actions">
          <button className="secondary-action" type="button" onClick={handleCopy}>
            <Copy size={17} />
            Metni Kopyala
          </button>
          <button className="primary-action" type="button" onClick={onPrint}>
            <Printer size={18} />
            Dot-Matrix Yazdır
          </button>
        </div>
      </div>

      {copyMessage && <p className="success-message dot-matrix-copy-message no-print">{copyMessage}</p>}

      <pre className="dot-matrix-preview" aria-label="Dot-matrix satış fişi metin önizlemesi">
        {dotMatrixText}
      </pre>
    </section>
  );
}
