import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function SystemHealthCard({ integrity }) {
  const requiresReview = integrity.summary.requiresReview;
  const Icon = requiresReview ? AlertTriangle : CheckCircle2;

  return (
    <section className={`system-health-card ${requiresReview ? "system-health-warning" : "system-health-ok"}`}>
      <div className="system-health-icon">
        <Icon size={20} />
      </div>
      <div>
        <p>Sistem Sağlığı</p>
        <h2>{requiresReview ? "Kontrol gerekli" : "Stok ve cari kayıtları uyumlu"}</h2>
        <span>
          {formatNumber(integrity.summary.stockDifferenceCount)} stok farkı,{" "}
          {formatNumber(integrity.summary.customerBalanceDifferenceCount)} müşteri cari farkı,{" "}
          {formatNumber(integrity.summary.supplierBalanceDifferenceCount)} tedarikçi cari farkı
        </span>
        <small>
          <Activity size={13} />
          Detaylar Raporlar bölümündeki Veri Doğruluk Kontrolü panelinde incelenebilir.
        </small>
      </div>
    </section>
  );
}
