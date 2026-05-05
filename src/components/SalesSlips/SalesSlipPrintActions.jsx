import { Printer, X } from "lucide-react";

export default function SalesSlipPrintActions({ disabled = false, onClose, onPrint }) {
  return (
    <div className="print-actions no-print">
      <button className="secondary-action" type="button" onClick={onClose}>
        <X size={17} />
        Önizlemeyi Kapat
      </button>
      <button className="primary-action" type="button" disabled={disabled} onClick={onPrint}>
        <Printer size={18} />
        Yazdır
      </button>
    </div>
  );
}
