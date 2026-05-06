import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";
import { formatDateTR } from "../../utils/dateUtils.js";

export default function StockCountAdjustmentConfirm({ open, summary, errorMessage = "", lastBackupAt, onCancel, onConfirm, isSaving = false }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="product-modal stock-adjustment-modal" role="dialog" aria-modal="true" aria-labelledby="stock-adjustment-title">
        <div className="modal-header">
          <div>
            <p>Onaylı stok düzeltme</p>
            <h2 id="stock-adjustment-title">Stokları Sayıma Göre Düzelt</h2>
          </div>
          <AlertTriangle size={22} />
        </div>

        <div className="stock-adjustment-summary">
          <div>
            <span>Düzeltilecek Ürün Çeşidi</span>
            <strong>{formatNumber(summary.lineCount)}</strong>
          </div>
          <div>
            <span>Toplam Eksik Fark</span>
            <strong>{formatNumber(summary.shortageQuantity)}</strong>
          </div>
          <div>
            <span>Toplam Fazla Fark</span>
            <strong>{formatNumber(summary.surplusQuantity)}</strong>
          </div>
          <div>
            <span>Net Fark</span>
            <strong>{formatNumber(summary.netDifference)}</strong>
          </div>
        </div>

        <p className="form-note stock-adjustment-warning">
          Bu işlem stok miktarlarını değiştirir. Ürün kartlarındaki stok miktarlarını sayılan miktarlara göre günceller ve stok
          hareketi oluşturur. İşlem geri alınamaz; gerekirse yeni bir sayım/düzeltme yapılmalıdır.
        </p>
        <p className="form-note stock-adjustment-backup-note">
          İşlem öncesinde veritabanı yedeği almanız önerilir. {lastBackupAt ? `Son yedek: ${formatDateTR(lastBackupAt)}` : "Son yedek bilgisi bulunamadı."}
        </p>
        {errorMessage && <p className="barcode-message barcode-message-error stock-adjustment-error">{errorMessage}</p>}

        <div className="modal-actions">
          <button className="secondary-action" type="button" onClick={onCancel} disabled={isSaving}>
            Vazgeç
          </button>
          <button className="primary-action" type="button" onClick={onConfirm} disabled={isSaving}>
            <CheckCircle2 size={18} />
            {isSaving ? "Düzeltiliyor..." : "Onayla ve Stokları Düzelt"}
          </button>
        </div>
      </section>
    </div>
  );
}
