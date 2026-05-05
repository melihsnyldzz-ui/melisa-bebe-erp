import { Printer, X } from "lucide-react";

export default function SalesSlipPrintActions({ disabled = false, mode = "normal", onClose, onModeChange, onPrint }) {
  return (
    <div className="print-actions no-print">
      <div className="print-mode-tabs" role="tablist" aria-label="Yazdırma önizleme modu">
        <button
          className={mode === "normal" ? "active" : ""}
          type="button"
          onClick={() => onModeChange("normal")}
        >
          Normal Önizleme
        </button>
        <button
          className={mode === "dotMatrix" ? "active" : ""}
          type="button"
          onClick={() => onModeChange("dotMatrix")}
        >
          Dot-Matrix Önizleme
        </button>
      </div>
      <button className="secondary-action" type="button" onClick={onClose}>
        <X size={17} />
        Önizlemeyi Kapat
      </button>
      <button className="primary-action" type="button" disabled={disabled} onClick={onPrint}>
        <Printer size={18} />
        {mode === "dotMatrix" ? "Dot-Matrix Yazdır" : "Yazdır"}
      </button>
    </div>
  );
}
