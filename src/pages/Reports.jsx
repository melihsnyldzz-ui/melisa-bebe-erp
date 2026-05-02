import CriticalStockReport from "../components/Reports/CriticalStockReport.jsx";
import ReceivablePayableReport from "../components/Reports/ReceivablePayableReport.jsx";
import ReportSummaryCards from "../components/Reports/ReportSummaryCards.jsx";
import SalesPurchaseChart from "../components/Reports/SalesPurchaseChart.jsx";
import TopProductsReport from "../components/Reports/TopProductsReport.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../utils/dateUtils.js";

export default function Reports() {
  const erpData = useErpData();
  const reportData = buildReportData(erpData);

  return (
    <>
      <section className="page-title">
        <div>
          <p>Analiz</p>
          <h1>Raporlar</h1>
          <span>Satış, alış, stok ve cari performansınızı tek ekrandan analiz edin.</span>
        </div>
      </section>

      <ReportSummaryCards summary={reportData.summary} />

      <section className="reports-grid">
        <SalesPurchaseChart data={reportData.salesPurchaseChart} />
        <TopProductsReport products={reportData.topProducts} />
        <ReceivablePayableReport receivable={reportData.summary.customerReceivable} payable={reportData.summary.supplierDebt} />
        <CriticalStockReport products={reportData.criticalProducts} />
      </section>

      <section className="table-panel profitability-note">
        <h2>Kârlılık Ön Hazırlık Alanı</h2>
        <p>Ürün bazlı kârlılık raporu, alış fişi ve satış fişi gerçek stok maliyetiyle bağlandığında aktif edilecektir.</p>
      </section>
    </>
  );
}

function buildReportData({ collections, customers, payments, products, purchaseSlips, salesSlips, suppliers }) {
  const totalSales = salesSlips.reduce((total, slip) => total + slip.grandTotal, 0);
  const totalPurchases = purchaseSlips.reduce((total, slip) => total + slip.grandTotal, 0);
  const totalCollections = collections.reduce((total, item) => total + item.amount, 0);
  const totalPayments = payments.reduce((total, item) => total + item.amount, 0);
  const customerReceivable = customers.reduce((total, customer) => total + customer.currentBalance, 0);
  const supplierDebt = suppliers.reduce((total, supplier) => total + supplier.currentBalance, 0);
  const criticalProducts = products.filter((product) => product.stockQuantity <= product.criticalStockLevel);

  return {
    summary: {
      totalSales,
      totalPurchases,
      netCashIn: totalCollections - totalPayments,
      customerReceivable,
      supplierDebt,
      criticalProductCount: criticalProducts.length,
    },
    salesPurchaseChart: buildSalesPurchaseChart(salesSlips, purchaseSlips),
    topProducts: buildTopProducts(salesSlips),
    criticalProducts,
  };
}

function buildSalesPurchaseChart(salesSlips, purchaseSlips) {
  const days = buildLastDays(7);

  return days.map((date) => ({
    date,
    label: formatShortDate(date),
    sales: salesSlips.filter((slip) => slip.date === date).reduce((total, slip) => total + slip.grandTotal, 0),
    purchases: purchaseSlips.filter((slip) => slip.date === date).reduce((total, slip) => total + slip.grandTotal, 0),
  }));
}

function buildTopProducts(salesSlips) {
  const productMap = new Map();

  salesSlips.forEach((slip) => {
    slip.items.forEach((item) => {
      const current = productMap.get(item.productId) || {
        productCode: item.productCode,
        productName: item.productName,
        quantity: 0,
      };

      productMap.set(item.productId, {
        ...current,
        quantity: current.quantity + item.quantity,
      });
    });
  });

  return [...productMap.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
}

function formatShortDate(value) {
  return formatDateTR(value).slice(0, 5);
}

function buildLastDays(dayCount) {
  const today = new Date(getTodayISO());

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (dayCount - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}
