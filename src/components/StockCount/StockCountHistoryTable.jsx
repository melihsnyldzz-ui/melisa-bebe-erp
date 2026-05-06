import { Eye } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function StockCountHistoryTable({ history, selectedReferenceNo, onSelect }) {
  return (
    <div className="product-table-scroll">
      <table className="product-table stock-count-history-table">
        <thead>
          <tr>
            <th>Referans No</th>
            <th>Tarih / Saat</th>
            <th>Satır</th>
            <th>Fazla</th>
            <th>Eksik</th>
            <th>Net Fark</th>
            <th>Detay</th>
          </tr>
        </thead>
        <tbody>
          {history.map((group) => (
            <tr key={group.referenceNo} className={selectedReferenceNo === group.referenceNo ? "selected-row" : ""}>
              <td className="strong-cell">{group.referenceNo || "-"}</td>
              <td>{group.displayDate || "-"}</td>
              <td>{formatNumber(group.rowCount)}</td>
              <td className="stock-in">{formatNumber(group.totalSurplusQuantity)}</td>
              <td className="stock-out">{formatNumber(group.totalShortageQuantity)}</td>
              <td className={group.netDifference === 0 ? "" : "danger-cell"}>{formatNumber(group.netDifference)}</td>
              <td>
                <button className="icon-button small" type="button" aria-label="Sayım detayını görüntüle" onClick={() => onSelect(group)}>
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
