import { ScanLine } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

const dateTimeFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function TerminalLastScanSummary({ summary }) {
  const isMissing = summary?.status === "Ürün bulunamadı";

  return (
    <section className={`table-panel warehouse-last-scan-panel ${isMissing ? "not-found" : ""}`}>
      <div className="section-heading">
        <ScanLine size={19} />
        <h2>Son Okutma Özeti</h2>
      </div>

      {!summary ? (
        <p className="warehouse-last-scan-empty">Henüz okutma yapılmadı.</p>
      ) : isMissing ? (
        <div className="warehouse-last-scan-content">
          <SummaryItem label="Okutulan değer" value={summary.scannedValue || "-"} />
          <SummaryItem label="Durum" value="Ürün bulunamadı" />
          <SummaryItem label="Kısa not" value="Barkodu veya ürün kodunu kontrol edin." />
          <SummaryItem label="Okutma zamanı" value={formatScanTime(summary.scannedAt)} />
        </div>
      ) : (
        <div className="warehouse-last-scan-content">
          <SummaryItem label="Okutulan değer" value={summary.scannedValue || "-"} />
          <SummaryItem label="Ürün adı" value={summary.productName || "-"} />
          <SummaryItem label="Barkod" value={summary.barcode || "-"} />
          <SummaryItem label="Ürün kodu" value={summary.productCode || "-"} />
          <SummaryItem label="Mevcut stok" value={formatNumber(summary.stockQuantity)} />
          <SummaryItem label="Stok durumu" value={summary.status || "-"} />
          <SummaryItem label="Okutma zamanı" value={formatScanTime(summary.scannedAt)} />
        </div>
      )}
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="warehouse-last-scan-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatScanTime(value) {
  if (!value) return "-";
  return dateTimeFormatter.format(new Date(value));
}
