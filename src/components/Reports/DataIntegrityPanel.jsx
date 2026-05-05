import { Activity, AlertTriangle, CheckCircle2, Info, Scale } from "lucide-react";
import { formatCurrencyPrecise, formatNumber } from "../../utils/formatters.js";

const MAX_ROWS = 20;

export default function DataIntegrityPanel({ integrity }) {
  const hasDifferences = integrity.summary.differenceCount > 0;
  const hasNoMovementWarnings = integrity.summary.stockWithoutMovementCount > 0;

  return (
    <section className="table-panel data-integrity-panel">
      <div className="section-heading">
        <Scale size={19} />
        <h2>Veri Doğruluk Kontrolü</h2>
      </div>

      <div className="integrity-summary-grid">
        <IntegritySummaryCard label="Stok farkı bulunan ürün" value={integrity.summary.stockDifferenceCount} tone="red" />
        <IntegritySummaryCard label="Hareket kaydı olmayan stoklu ürün" value={integrity.summary.stockWithoutMovementCount} tone="amber" />
        <IntegritySummaryCard label="Müşteri cari farkı" value={integrity.summary.customerBalanceDifferenceCount} tone="red" />
        <IntegritySummaryCard label="Tedarikçi cari farkı" value={integrity.summary.supplierBalanceDifferenceCount} tone="red" />
        <IntegritySummaryCard label="Genel durum" value={integrity.summary.statusLabel} tone={integrity.summary.requiresReview ? "amber" : "green"} />
      </div>

      {!hasDifferences && !hasNoMovementWarnings && (
        <p className="success-message integrity-message">
          <CheckCircle2 size={17} />
          Stok ve cari kayıtlarında fark bulunmadı.
        </p>
      )}

      {hasNoMovementWarnings && (
        <p className="data-status-note integrity-message">
          <Info size={17} />
          Hareket kaydı olmayan stoklu ürünler başlangıç stoku içeriyor olabilir; bu satırlar kritik fark olarak sayılmaz.
        </p>
      )}

      <IntegrityTable
        columns={["Ürün", "Kod", "Barkod", "Kart Stok", "Hareket Stok", "Fark", "Durum"]}
        emptyText="Stok kontrolünde incelenecek fark bulunmadı."
        rows={integrity.stockResults.filter((item) => item.status !== "ok").slice(0, MAX_ROWS)}
        renderRow={(item) => (
          <tr key={item.id}>
            <td className="strong-cell">{item.productName}</td>
            <td className="product-code-cell">{item.productCode || "-"}</td>
            <td className="barcode-cell">{item.barcode || "-"}</td>
            <td>{formatNumber(item.cardStock)}</td>
            <td>{formatNumber(item.calculatedStock)}</td>
            <td className={item.status === "difference" ? "danger-cell" : ""}>{formatNumber(item.difference)}</td>
            <td>
              <IntegrityStatus status={item.status} />
            </td>
          </tr>
        )}
        title="Stok kontrol sonuçları"
      />

      <IntegrityTable
        columns={["Müşteri", "Firma", "Mevcut Bakiye", "Hesaplanan", "Fark", "Durum"]}
        emptyText="Müşteri carilerinde fark bulunmadı."
        rows={integrity.customerResults.filter((item) => item.status !== "ok").slice(0, MAX_ROWS)}
        renderRow={(item) => (
          <tr key={item.id}>
            <td className="strong-cell">{item.name}</td>
            <td>{item.companyName || "-"}</td>
            <td>{formatCurrencyPrecise(item.currentBalance)}</td>
            <td>{formatCurrencyPrecise(item.calculatedBalance)}</td>
            <td className="danger-cell">{formatCurrencyPrecise(item.difference)}</td>
            <td>
              <IntegrityStatus status={item.status} />
            </td>
          </tr>
        )}
        title="Müşteri cari kontrol sonuçları"
      />

      <IntegrityTable
        columns={["Tedarikçi", "Firma Ünvanı", "Mevcut Bakiye", "Hesaplanan", "Fark", "Durum"]}
        emptyText="Tedarikçi carilerinde fark bulunmadı."
        rows={integrity.supplierResults.filter((item) => item.status !== "ok").slice(0, MAX_ROWS)}
        renderRow={(item) => (
          <tr key={item.id}>
            <td className="strong-cell">{item.name}</td>
            <td>{item.companyTitle || "-"}</td>
            <td>{formatCurrencyPrecise(item.currentBalance)}</td>
            <td>{formatCurrencyPrecise(item.calculatedBalance)}</td>
            <td className="danger-cell">{formatCurrencyPrecise(item.difference)}</td>
            <td>
              <IntegrityStatus status={item.status} />
            </td>
          </tr>
        )}
        title="Tedarikçi cari kontrol sonuçları"
      />
    </section>
  );
}

function IntegritySummaryCard({ label, value, tone }) {
  return (
    <div className={`integrity-summary-card integrity-summary-${tone}`}>
      <span>{label}</span>
      <strong>{typeof value === "number" ? formatNumber(value) : value}</strong>
    </div>
  );
}

function IntegrityTable({ columns, emptyText, renderRow, rows, title }) {
  return (
    <div className="integrity-table-block">
      <h3>{title}</h3>
      <div className="product-table-scroll">
        <table className="product-table integrity-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows.map(renderRow)}</tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="empty-table-text">{emptyText}</p>}
    </div>
  );
}

function IntegrityStatus({ status }) {
  const statusMap = {
    ok: { icon: CheckCircle2, label: "Uyumlu", className: "status-active" },
    difference: { icon: AlertTriangle, label: "Fark var", className: "status-canceled" },
    "no-movement": { icon: Info, label: "Hareket yok", className: "status-warning" },
  };
  const item = statusMap[status] || statusMap.ok;
  const Icon = item.icon || Activity;

  return (
    <span className={`status ${item.className}`}>
      <Icon size={14} />
      {item.label}
    </span>
  );
}
