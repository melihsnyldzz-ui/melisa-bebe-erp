import {
  AlertTriangle,
  ArrowDownToLine,
  Banknote,
  ClipboardList,
  CreditCard,
  ReceiptText,
  ShoppingBag,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";
import DataTable from "../components/Dashboard/DataTable.jsx";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SalesChart from "../components/Dashboard/SalesChart.jsx";
import TopProductsChart from "../components/Dashboard/TopProductsChart.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../utils/dateUtils.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Dashboard() {
  const erpData = useErpData();
  const dashboardData = buildDashboardData(erpData);

  return (
    <>
      <section className="page-title">
        <div>
          <p>Canlı özet</p>
          <h1>Melisa Bebe Yönetim Paneli</h1>
          <span>Bugünkü satış, stok ve cari durumunuzu tek ekrandan takip edin.</span>
        </div>
        <button className="primary-action">
          <ClipboardList size={18} />
          Gün Sonu Raporu
        </button>
      </section>

      <section className="kpi-grid">
        {dashboardData.kpis.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <section className="charts-grid">
        <SalesChart data={dashboardData.salesChart} />
        <TopProductsChart data={dashboardData.topProducts} />
      </section>

      <section className="tables-grid">
        <DataTable title="Son Satış Fişleri" icon={ReceiptText} rows={dashboardData.tables.sales} columns={["Fiş", "Müşteri", "Tutar", "Tarih"]} />
        <DataTable title="Son Alış Fişleri" icon={Truck} rows={dashboardData.tables.purchases} columns={["Fiş", "Tedarikçi", "Tutar", "Tarih"]} />
        <DataTable title="Son Tahsilatlar" icon={Banknote} rows={dashboardData.tables.collections} columns={["No", "Cari", "Tutar", "Tip"]} />
        <DataTable title="Kritik Stok Uyarıları" icon={AlertTriangle} rows={dashboardData.tables.stock} columns={["Kod", "Ürün", "Stok", "Durum"]} />
        <DataTable title="Riskli Müşteriler" icon={UserRound} rows={dashboardData.tables.risk} columns={["Müşteri", "Alacak", "Limit", "Risk"]} />
      </section>
    </>
  );
}

function buildDashboardData({ collections, customers, payments, products, purchaseSlips, salesSlips, suppliers }) {
  const today = getTodayISO();
  const activeSalesSlips = salesSlips.filter((slip) => slip.status !== "İptal");
  const activePurchaseSlips = purchaseSlips.filter((slip) => slip.status !== "İptal");
  const activeCollections = collections.filter((collection) => collection.status !== "İptal");
  const activePayments = payments.filter((payment) => payment.status !== "İptal");
  const todaySales = sumBy(activeSalesSlips.filter((slip) => slip.date === today), "grandTotal");
  const todayCollections = sumBy(activeCollections.filter((collection) => collection.date === today), "amount");
  const todayPurchases = sumBy(activePurchaseSlips.filter((slip) => slip.date === today), "grandTotal");
  const todayPayments = sumBy(activePayments.filter((payment) => payment.date === today), "amount");
  const criticalProducts = products.filter((product) => product.stockQuantity <= product.criticalStockLevel);
  const riskyCustomers = customers.filter((customer) => customer.currentBalance > customer.riskLimit);

  return {
    kpis: [
      { label: "Bugünkü Satış", value: formatCurrency(todaySales), icon: ShoppingBag, tone: "red" },
      { label: "Bugünkü Tahsilat", value: formatCurrency(todayCollections), icon: Banknote, tone: "green" },
      { label: "Bugünkü Alış", value: formatCurrency(todayPurchases), icon: Truck, tone: "dark" },
      { label: "Bugünkü Tedarikçi Ödemesi", value: formatCurrency(todayPayments), icon: CreditCard, tone: "amber" },
      { label: "Toplam Müşteri Alacağı", value: formatCurrency(sumBy(customers, "currentBalance")), icon: WalletCards, tone: "red" },
      { label: "Toplam Tedarikçi Borcu", value: formatCurrency(sumBy(suppliers, "currentBalance")), icon: ArrowDownToLine, tone: "dark" },
      { label: "Toplam Stok Adedi", value: sumBy(products, "stockQuantity").toLocaleString("tr-TR"), icon: ClipboardList, tone: "green" },
      { label: "Kritik Stok Ürün Sayısı", value: criticalProducts.length.toString(), icon: AlertTriangle, tone: "amber" },
    ],
    salesChart: buildSalesChart(activeSalesSlips),
    topProducts: buildTopProducts(activeSalesSlips),
    tables: {
      sales: activeSalesSlips.slice(0, 3).map((slip) => [slip.slipNo, slip.customerName, formatCurrency(slip.grandTotal), formatDateTR(slip.date)]),
      purchases: activePurchaseSlips.slice(0, 3).map((slip) => [slip.slipNo, slip.supplierName, formatCurrency(slip.grandTotal), formatDateTR(slip.date)]),
      collections: activeCollections.slice(0, 3).map((collection) => [
        collection.collectionNo,
        collection.customerName,
        formatCurrency(collection.amount),
        collection.paymentType,
      ]),
      stock: criticalProducts.slice(0, 3).map((product) => [product.code, product.name, `${product.stockQuantity} adet`, "Kritik"]),
      risk: riskyCustomers.slice(0, 3).map((customer) => [
        customer.name,
        formatCurrency(customer.currentBalance),
        formatCurrency(customer.riskLimit),
        "Yüksek",
      ]),
    },
  };
}

function buildSalesChart(salesSlips) {
  return buildLastDays(7).map((date) => ({
    day: formatDateTR(date).slice(0, 5),
    value: salesSlips.filter((slip) => slip.date === date).reduce((total, slip) => total + slip.grandTotal, 0),
  }));
}

function buildTopProducts(salesSlips) {
  const productMap = new Map();

  salesSlips.forEach((slip) => {
    slip.items.forEach((item) => {
      productMap.set(item.productId, {
        name: item.productName,
        adet: (productMap.get(item.productId)?.adet || 0) + item.quantity,
      });
    });
  });

  return [...productMap.values()].sort((a, b) => b.adet - a.adet).slice(0, 5);
}

function buildLastDays(dayCount) {
  const today = new Date(getTodayISO());

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (dayCount - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}

function sumBy(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
}
