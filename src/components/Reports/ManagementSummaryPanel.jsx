import { BarChart3 } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function ManagementSummaryPanel({ summary }) {
  const cards = [
    { label: "Toplam ürün kartı", value: summary.totalProducts },
    { label: "Aktif ürün kartı", value: summary.activeProducts },
    { label: "Toplam stok adedi", value: summary.totalStockQuantity },
    { label: "Kritik stoktaki ürün", value: summary.criticalProductCount },
    { label: "Toplam müşteri", value: summary.totalCustomers },
    { label: "Toplam tedarikçi", value: summary.totalSuppliers },
    { label: "Toplam satış fişi", value: summary.totalSalesSlipCount },
    { label: "Toplam alış fişi", value: summary.totalPurchaseSlipCount },
  ];

  return (
    <section className="table-panel management-report-panel">
      <div className="section-heading">
        <BarChart3 size={19} />
        <h2>Yönetim Özeti</h2>
      </div>
      <div className="management-summary-grid">
        {cards.map((card) => (
          <div className="integrity-summary-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{formatNumber(card.value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
