import { ClipboardList, FileJson, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { formatNumber } from "../../utils/formatters.js";
import {
  buildStockCountHistory,
  buildStockCountHistoryReport,
  buildStockCountHistorySummary,
  formatHistoryDate,
} from "../../utils/stockCountHistoryUtils.js";

const emptyFilters = {
  reference: "",
  movementType: "all",
  search: "",
};

export default function StockCountReportPanel({ stockMovements }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [reportPayload, setReportPayload] = useState(null);

  const history = useMemo(() => buildStockCountHistory(stockMovements, { limit: Number.POSITIVE_INFINITY, filters }), [filters, stockMovements]);
  const summary = useMemo(() => buildStockCountHistorySummary(history), [history]);

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
    setReportPayload(null);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setReportPayload(null);
  }

  function prepareReport() {
    setReportPayload(buildStockCountHistoryReport(history));
  }

  return (
    <section className="table-panel product-table-panel stock-count-report-section">
      <div className="section-heading">
        <ClipboardList size={19} />
        <h2>Stok Sayım Raporu</h2>
      </div>

      <div className="stock-count-report-summary">
        <ReportMetric label="Toplam Sayım Düzeltmesi" value={formatNumber(summary.adjustmentCount)} />
        <ReportMetric label="Toplam Sayım Fazlası" value={formatNumber(summary.totalSurplusQuantity)} />
        <ReportMetric label="Toplam Sayım Eksiği" value={formatNumber(summary.totalShortageQuantity)} />
        <ReportMetric label="En Son Sayım Tarihi" value={formatHistoryDate(summary.latestDate)} />
        <ReportMetric label="En Çok Fark Satırı" value={formatNumber(summary.maxRowCount)} />
      </div>

      <div className="filters-grid stock-count-history-filters">
        <label className="filter-field">
          <span>Referans No</span>
          <input value={filters.reference} onChange={(event) => updateFilter("reference", event.target.value)} placeholder="SAYIM-..." />
        </label>
        <label className="filter-field">
          <span>Hareket Tipi</span>
          <select value={filters.movementType} onChange={(event) => updateFilter("movementType", event.target.value)}>
            <option value="all">Tümü</option>
            <option value="Sayım Fazlası">Sayım Fazlası</option>
            <option value="Sayım Eksiği">Sayım Eksiği</option>
          </select>
        </label>
        <label className="filter-field search-filter">
          <span>Ürün Arama</span>
          <input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Ürün, kod veya barkod" />
        </label>
        <button className="secondary-action" type="button" onClick={resetFilters}>
          <RotateCcw size={17} />
          Temizle
        </button>
      </div>

      <div className="product-table-scroll">
        <table className="product-table stock-count-report-table">
          <thead>
            <tr>
              <th>Referans No</th>
              <th>Tarih</th>
              <th>Satır Sayısı</th>
              <th>Fazla Toplamı</th>
              <th>Eksik Toplamı</th>
              <th>Net Fark</th>
            </tr>
          </thead>
          <tbody>
            {history.map((group) => (
              <tr key={group.referenceNo}>
                <td className="strong-cell">{group.referenceNo || "-"}</td>
                <td>{group.displayDate || "-"}</td>
                <td>{formatNumber(group.rowCount)}</td>
                <td className="stock-in">{formatNumber(group.totalSurplusQuantity)}</td>
                <td className="stock-out">{formatNumber(group.totalShortageQuantity)}</td>
                <td className={group.netDifference === 0 ? "" : "danger-cell"}>{formatNumber(group.netDifference)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {history.length === 0 && <p className="empty-table-text">Henüz stok sayım düzeltmesi bulunmuyor.</p>}

      <div className="modal-actions stock-count-actions">
        <button className="secondary-action" type="button" onClick={prepareReport} disabled={history.length === 0}>
          <FileJson size={17} />
          Rapor JSON’u Hazırla
        </button>
      </div>

      {reportPayload && <pre className="stock-count-report-preview">{JSON.stringify(reportPayload, null, 2)}</pre>}
    </section>
  );
}

function ReportMetric({ label, value }) {
  return (
    <div className="stock-count-report-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
