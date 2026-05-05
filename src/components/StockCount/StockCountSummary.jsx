import { AlertTriangle, BadgeCheck, Boxes, PackageCheck, Scale, TrendingUp } from "lucide-react";
import KpiCard from "../Dashboard/KpiCard.jsx";
import { formatNumber } from "../../utils/formatters.js";

export default function StockCountSummary({ summary }) {
  const cards = [
    { label: "Sayılan Ürün Çeşidi", value: formatNumber(summary.lineCount), icon: Boxes, tone: "dark" },
    { label: "Toplam Sayılan Adet", value: formatNumber(summary.totalCountedQuantity), icon: PackageCheck, tone: "green" },
    { label: "Uyumlu Satır", value: formatNumber(summary.matchedLines), icon: BadgeCheck, tone: "green" },
    { label: "Eksik Satır", value: formatNumber(summary.shortageLines), icon: AlertTriangle, tone: "red" },
    { label: "Fazla Satır", value: formatNumber(summary.surplusLines), icon: TrendingUp, tone: "amber" },
    { label: "Net Fark Toplamı", value: formatNumber(summary.netDifference), icon: Scale, tone: "dark" },
  ];

  return (
    <section className="kpi-grid stock-count-summary-grid">
      {cards.map((item, index) => (
        <KpiCard item={item} index={index} key={item.label} />
      ))}
    </section>
  );
}
