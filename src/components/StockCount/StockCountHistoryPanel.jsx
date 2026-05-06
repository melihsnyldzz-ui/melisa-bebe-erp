import { ClipboardList, FileJson, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { formatNumber } from "../../utils/formatters.js";
import { buildStockCountHistory, buildStockCountHistoryReport } from "../../utils/stockCountHistoryUtils.js";
import StockCountHistoryTable from "./StockCountHistoryTable.jsx";

const emptyFilters = {
  reference: "",
  movementType: "all",
  search: "",
};

export default function StockCountHistoryPanel({ stockMovements }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [reportPayload, setReportPayload] = useState(null);

  const history = useMemo(() => buildStockCountHistory(stockMovements, { limit: 20, filters }), [filters, stockMovements]);

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
    setSelectedGroup(null);
    setReportPayload(null);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setSelectedGroup(null);
    setReportPayload(null);
  }

  function prepareReport() {
    setReportPayload(buildStockCountHistoryReport(history));
  }

  return (
    <section className="table-panel stock-count-history-panel">
      <div className="section-heading">
        <ClipboardList size={19} />
        <h2>Stok Sayım Geçmişi</h2>
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

      {history.length > 0 ? (
        <StockCountHistoryTable history={history} selectedReferenceNo={selectedGroup?.referenceNo} onSelect={setSelectedGroup} />
      ) : (
        <p className="empty-table-text">Henüz stok sayım düzeltmesi bulunmuyor.</p>
      )}

      {selectedGroup && <StockCountHistoryDetail group={selectedGroup} />}

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

function StockCountHistoryDetail({ group }) {
  return (
    <div className="stock-count-history-detail">
      <div className="section-heading">
        <Search size={18} />
        <h3>{group.referenceNo} Detayı</h3>
      </div>
      <div className="stock-count-history-detail-meta">
        <span>Tarih: {group.displayDate || "-"}</span>
        <span>Oluşturan: {group.createdBy || "-"}</span>
        <span>Satır: {formatNumber(group.rowCount)}</span>
      </div>
      <div className="product-table-scroll">
        <table className="product-table stock-count-history-detail-table">
          <thead>
            <tr>
              <th>Ürün Kodu</th>
              <th>Barkod</th>
              <th>Ürün Adı</th>
              <th>Beden</th>
              <th>Renk</th>
              <th>Hareket</th>
              <th>Giriş</th>
              <th>Çıkış</th>
              <th>Kalan</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row) => (
              <tr key={row.id}>
                <td className="strong-cell">{row.productCode || "-"}</td>
                <td className="barcode-cell">{row.barcode || "-"}</td>
                <td>{row.productName || "-"}</td>
                <td>{row.size || "-"}</td>
                <td>{row.color || "-"}</td>
                <td>
                  <span className={`movement-badge ${row.movementType === "Sayım Fazlası" ? "movement-in" : "movement-out"}`}>
                    {row.movementType || "-"}
                  </span>
                </td>
                <td className="stock-in">{formatNumber(row.quantityIn)}</td>
                <td className="stock-out">{formatNumber(row.quantityOut)}</td>
                <td>{formatNumber(row.remainingStock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
