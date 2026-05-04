import { HeartPulse } from "lucide-react";
import { useMemo } from "react";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../../utils/dateUtils.js";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";
import { canUsePersistentDatabase } from "../../utils/desktopBridge.js";

export default function SystemHealthSettings() {
  const { customers, suppliers, products, purchaseSlips, salesSlips, collections, payments, stockMovements } = useErpData();
  const today = getTodayISO();
  const modeLabel = canUsePersistentDatabase() ? "Electron SQLite" : "Tarayıcı modu";

  const healthRows = useMemo(() => {
    const activeSalesSlips = salesSlips.filter((slip) => isActiveRecord(slip));
    const activePurchaseSlips = purchaseSlips.filter((slip) => isActiveRecord(slip));
    const activeCollections = collections.filter((collection) => isActiveRecord(collection));
    const activePayments = payments.filter((payment) => isActiveRecord(payment));
    const todaySalesSlips = activeSalesSlips.filter((slip) => slip.date === today);
    const todayPurchaseSlips = activePurchaseSlips.filter((slip) => slip.date === today);
    const todayCollections = activeCollections.filter((collection) => collection.date === today);
    const todayPayments = activePayments.filter((payment) => payment.date === today);
    const canceledCount = [...salesSlips, ...purchaseSlips, ...collections, ...payments].filter((record) => record.status === "İptal").length;
    const lastStockMovementDate = stockMovements[0]?.date;

    return [
      { label: "Çalışma modu", value: modeLabel },
      { label: "Bugünkü satış fişi sayısı", value: formatNumber(todaySalesSlips.length) },
      { label: "Bugünkü alış fişi sayısı", value: formatNumber(todayPurchaseSlips.length) },
      { label: "Bugünkü tahsilat sayısı", value: formatNumber(todayCollections.length) },
      { label: "Bugünkü ödeme sayısı", value: formatNumber(todayPayments.length) },
      { label: "Bugünkü satış toplamı", value: formatCurrency(sumBy(todaySalesSlips, "grandTotal")) },
      { label: "Bugünkü tahsilat toplamı", value: formatCurrency(sumBy(todayCollections, "amount")) },
      { label: "Kritik stok ürün sayısı", value: formatNumber(products.filter((product) => product.stockQuantity <= product.criticalStockLevel).length) },
      { label: "İptal edilmiş kayıt sayısı", value: formatNumber(canceledCount) },
      { label: "Son stok hareketi tarihi", value: formatDateTR(lastStockMovementDate) },
      { label: "Toplam müşteri alacağı", value: formatCurrency(sumBy(customers, "currentBalance")) },
      { label: "Toplam tedarikçi borcu", value: formatCurrency(sumBy(suppliers, "currentBalance")) },
    ];
  }, [collections, customers, modeLabel, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers, today]);

  return (
    <section className="table-panel settings-panel system-health-panel">
      <div className="section-heading">
        <HeartPulse size={19} />
        <h2>Sistem Sağlığı</h2>
      </div>
      <div className="system-health-grid">
        {healthRows.map((row) => (
          <div className="system-health-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function isActiveRecord(record) {
  return record.status !== "İptal";
}

function sumBy(records, key) {
  return records.reduce((total, record) => total + (Number(record[key]) || 0), 0);
}
