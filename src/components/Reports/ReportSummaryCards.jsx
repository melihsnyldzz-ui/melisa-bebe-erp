import { AlertTriangle, Banknote, CreditCard, ShoppingBag, Truck, WalletCards } from "lucide-react";
import KpiCard from "../Dashboard/KpiCard.jsx";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function ReportSummaryCards({ summary }) {
  const cards = [
    { label: "Toplam Satış", value: currencyFormatter.format(summary.totalSales), icon: ShoppingBag, tone: "green" },
    { label: "Toplam Alış", value: currencyFormatter.format(summary.totalPurchases), icon: Truck, tone: "dark" },
    { label: "Net Nakit Girişi", value: currencyFormatter.format(summary.netCashIn), icon: Banknote, tone: "red" },
    { label: "Müşteri Alacağı", value: currencyFormatter.format(summary.customerReceivable), icon: WalletCards, tone: "red" },
    { label: "Tedarikçi Borcu", value: currencyFormatter.format(summary.supplierDebt), icon: CreditCard, tone: "amber" },
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
