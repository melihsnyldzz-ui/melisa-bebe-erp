import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";
import { getImportTypeLabel } from "../../utils/importApplyUtils.js";

export default function ImportConfirmModal({
  errorMessage = "",
  importType,
  isSaving = false,
  lastBackupAt,
  open,
  summary,
  importableCount,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="product-modal import-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="import-confirm-title">
        <div className="modal-header">
          <div>
            <p>Onaylı içe aktarma</p>
            <h2 id="import-confirm-title">İçe Aktarmayı Onayla</h2>
          </div>
          <AlertTriangle size={22} />
        </div>

        <div className="stock-adjustment-summary import-confirm-summary">
          <div>
            <span>Import Tipi</span>
            <strong>{getImportTypeLabel(importType)}</strong>
          </div>
          <div>
            <span>Toplam Satır</span>
            <strong>{formatNumber(summary.totalRows)}</strong>
          </div>
          <div>
            <span>Aktarılacak Satır</span>
            <strong>{formatNumber(importableCount)}</strong>
          </div>
          <div>
            <span>Hatalı Satır</span>
            <strong>{formatNumber(summary.errorRows)}</strong>
          </div>
          <div>
            <span>Uyarılı Satır</span>
            <strong>{formatNumber(summary.warningRows)}</strong>
          </div>
        </div>

        <p className="form-note stock-adjustment-warning">
          Bu işlem veritabanına yeni kayıtlar ekler. Hatalı satırlar aktarılmayacak, uyarılı satırlar onayınızla aktarılacaktır.
        </p>
        <p className="form-note stock-adjustment-backup-note">
          İşlem öncesinde veritabanı yedeği almanız önerilir. {lastBackupAt ? `Son yedek: ${new Date(lastBackupAt).toLocaleDateString("tr-TR")}` : "Son yedek bilgisi bulunamadı."}
        </p>
        {errorMessage && <p className="barcode-message barcode-message-error stock-adjustment-error">{errorMessage}</p>}

        <div className="modal-actions">
          <button className="secondary-action" type="button" onClick={onCancel} disabled={isSaving}>
            Vazgeç
          </button>
          <button className="primary-action" type="button" onClick={onConfirm} disabled={isSaving || importableCount === 0}>
            <CheckCircle2 size={18} />
            {isSaving ? "İçe Aktarılıyor..." : "Onayla ve İçe Aktar"}
          </button>
        </div>
      </section>
    </div>
  );
}
