import { Trash2 } from "lucide-react";
import { useState } from "react";
import { buildCountBasketSummary, getBasketDifferenceStatus } from "../../utils/warehouseCountBasketUtils.js";
import { buildWarehouseCountCsvPreview } from "../../utils/warehouseCountExportUtils.js";
import { buildWarehouseCountPreviewReport } from "../../utils/warehouseCountReportUtils.js";
import { formatNumber } from "../../utils/formatters.js";

export default function TerminalCountBasket({ basket, onClear, onRemove, onUpdateQuantity }) {
  const [previewReport, setPreviewReport] = useState(null);
  const [exportPreviewType, setExportPreviewType] = useState("");
  const summary = buildCountBasketSummary(basket);
  const csvPreview = previewReport ? buildWarehouseCountCsvPreview(previewReport) : "";

  function previewCountReport() {
    setPreviewReport(buildWarehouseCountPreviewReport(basket));
    setExportPreviewType("json");
  }

  function closePreview() {
    setPreviewReport(null);
    setExportPreviewType("");
  }

  function previewCsv() {
    setPreviewReport((currentReport) => currentReport || buildWarehouseCountPreviewReport(basket));
    setExportPreviewType("csv");
  }

  function previewJson() {
    setPreviewReport((currentReport) => currentReport || buildWarehouseCountPreviewReport(basket));
    setExportPreviewType("json");
  }

  return (
    <section className="table-panel warehouse-terminal-card warehouse-count-basket-panel">
      <div className="section-heading">
        <h2>Sayım Sepeti</h2>
        <button className="secondary-action small-action" type="button" onClick={onClear} disabled={basket.length === 0}>
          <Trash2 size={15} />
          Sepeti Temizle
        </button>
      </div>

      <p className="form-note warehouse-terminal-note warehouse-count-basket-warning">
        Bu sepet önizleme amaçlıdır. Stokları değiştirmez.
      </p>

      <div className="management-alert-grid warehouse-count-summary-grid">
        <SummaryCard label="Sepetteki ürün satırı" value={summary.lineCount} />
        <SummaryCard label="Toplam sayılan adet" value={summary.totalCountedQuantity} />
        <SummaryCard label="Fazla çıkan satır" value={summary.surplusCount} />
        <SummaryCard label="Eksik çıkan satır" value={summary.shortageCount} />
        <SummaryCard label="Eşit çıkan satır" value={summary.matchedCount} />
      </div>

      {basket.length === 0 ? (
        <p className="empty-table-text">Sayım sepetinde ürün yok.</p>
      ) : (
        <div className="product-table-scroll">
          <table className="product-table warehouse-terminal-table warehouse-count-basket-table">
            <thead>
              <tr>
                <th>Ürün adı</th>
                <th>Barkod</th>
                <th>Kod</th>
                <th>Beden</th>
                <th>Renk</th>
                <th>Sistem stoğu</th>
                <th>Sayılan</th>
                <th>Fark</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {basket.map((item) => {
                const status = getBasketDifferenceStatus(item.difference);

                return (
                  <tr key={item.productId}>
                    <td className="strong-cell">{item.productName || "-"}</td>
                    <td className="barcode-cell">{item.barcode || "-"}</td>
                    <td className="product-code-cell">{item.code || "-"}</td>
                    <td>{item.size || "-"}</td>
                    <td>{item.color || "-"}</td>
                    <td>{formatNumber(item.currentStock)}</td>
                    <td>
                      <input
                        className="warehouse-count-quantity-input"
                        min="0"
                        type="number"
                        value={item.countedQuantity}
                        onChange={(event) => onUpdateQuantity(item.productId, event.target.value)}
                      />
                    </td>
                    <td>
                      <span className={`status ${status === "Eşit" ? "status-active" : "status-warning"}`}>
                        {status} · {formatNumber(item.difference)}
                      </span>
                    </td>
                    <td>
                      <button className="icon-button danger" type="button" aria-label="Satırı sil" onClick={() => onRemove(item.productId)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="modal-actions stock-count-actions warehouse-count-report-actions">
        <button className="primary-action" type="button" onClick={previewCountReport} disabled={basket.length === 0}>
          Raporu Önizle
        </button>
        <button className="secondary-action" type="button" onClick={previewCsv} disabled={basket.length === 0}>
          CSV Önizle
        </button>
        <button className="secondary-action" type="button" onClick={previewJson} disabled={basket.length === 0}>
          JSON Önizle
        </button>
        {previewReport && (
          <button className="secondary-action" type="button" onClick={closePreview}>
            Rapor Önizlemesini Kapat
          </button>
        )}
      </div>

      {previewReport && (
        <section className="warehouse-count-report-preview-panel">
          <p className="form-note warehouse-terminal-note warehouse-count-basket-warning">
            Bu rapor önizlemedir. Stokları değiştirmez ve veritabanına kaydedilmez.
          </p>
          <p className="form-note warehouse-terminal-note warehouse-count-basket-warning">
            Bu dışa aktarım hazırlığı stokları değiştirmez ve veritabanına kaydedilmez.
          </p>
          <div className="stock-count-report-summary warehouse-count-report-summary">
            <SummaryCard label="Rapor tipi" value={previewReport.documentType} raw />
            <SummaryCard label="Oluşturulma zamanı" value={formatDateTime(previewReport.createdAt)} raw />
            <SummaryCard label="Sistem stok toplamı" value={previewReport.summary.totalSystemStock} />
            <SummaryCard label="Net fark" value={previewReport.summary.netDifference} />
          </div>
          {exportPreviewType === "csv" ? (
            <pre className="stock-count-report-preview warehouse-count-csv-preview">{csvPreview}</pre>
          ) : (
            <pre className="stock-count-report-preview">{JSON.stringify(previewReport, null, 2)}</pre>
          )}
        </section>
      )}
    </section>
  );
}

function SummaryCard({ label, raw = false, value }) {
  return (
    <div className="integrity-summary-card">
      <span>{label}</span>
      <strong>{raw ? value || "-" : formatNumber(value)}</strong>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("tr-TR");
}
