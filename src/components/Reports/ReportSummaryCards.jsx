import { AlertTriangle, Banknote, CreditCard, ShoppingBag, Truck, WalletCards } from "lucide-react";
import KpiCard from "../Dashboard/KpiCard.jsx";
import { formatCurrency } from "../../utils/formatters.js";

export default function ReportSummaryCards({ summary }) {
  const cards = [
    { label: "Toplam Satış", value: formatCurrency(summary.totalSales), icon: ShoppingBag, tone: "green" },
    { label: "Toplam Alış", value: formatCurrency(summary.totalPurchases), icon: Truck, tone: "dark" },
    { label: "Net Nakit Girişi", value: formatCurrency(summary.netCashIn), icon: Banknote, tone: "red" },
    { label: "Müşteri Alacağı", value: formatCurrency(summary.customerReceivable), icon: WalletCards, tone: "red" },
    { label: "Tedarikçi Borcu", value: formatCurrency(summary.supplierDebt), icon: CreditCard, tone: "amber" },
    { label: "Kritik Stok Ürünü", value: summary.criticalProductCount.toString(), icon: AlertTriangle, tone: "amber" },
  ];

  return (
    <section className="kpi-grid reports-summary-grid">
      {cards.map((item, index) => (
        <KpiCard item={item} index={index} key={item.label} />
      ))}
    </section>
  );
}
