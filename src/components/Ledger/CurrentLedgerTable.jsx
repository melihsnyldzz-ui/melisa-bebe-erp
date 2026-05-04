import { BookOpenText } from "lucide-react";
import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

export default function CurrentLedgerTable({ accountName, decreaseLabel, decreaseKey, rows }) {
  return (
    <section className="table-panel current-ledger-panel">
      <div className="section-heading ledger-heading">
        <div>
          <BookOpenText size={19} />
          <h2>Cari Hareketleri</h2>
        </div>
        <strong>{accountName}</strong>
      </div>
      <div className="product-table-scroll">
        <table className="product-table current-ledger-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>İşlem Tipi</th>
              <th>Fiş / Evrak No</th>
              <th>Borç</th>
              <th>{decreaseLabel}</th>
              <th>Bakiye</th>
              <th>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDateTR(row.date)}</td>
                <td>
                  <span className="movement-badge movement-neutral">{row.movementType}</span>
                </td>
                <td className="strong-cell">{row.documentNo}</td>
                <td className="ledger-debit">{row.debit ? formatCurrency(row.debit) : "-"}</td>
                <td className="ledger-credit">{row[decreaseKey] ? formatCurrency(row[decreaseKey]) : "-"}</td>
                <td className="ledger-balance">{formatCurrency(row.balance)}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="empty-table-text">Bu cari için henüz hareket bulunmuyor.</p>}
    </section>
  );
}
