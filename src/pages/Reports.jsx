import DataIntegrityPanel from "../components/Reports/DataIntegrityPanel.jsx";
import CriticalStockReport from "../components/Reports/CriticalStockReport.jsx";
import ReceivablePayableReport from "../components/Reports/ReceivablePayableReport.jsx";
import ReportSummaryCards from "../components/Reports/ReportSummaryCards.jsx";
import SalesPurchaseChart from "../components/Reports/SalesPurchaseChart.jsx";
import StockCountReportPanel from "../components/Reports/StockCountReportPanel.jsx";
import TopProductsReport from "../components/Reports/TopProductsReport.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../utils/dateUtils.js";
import { buildDataIntegrityReport } from "../utils/dataIntegrity.js";

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

      <DataIntegrityPanel integrity={reportData.integrity} />
      <StockCountReportPanel stockMovements={erpData.stockMovements} />

      <section className="table-panel profitability-note">
        <h2>Kârlılık Ön Hazırlık Alanı</h2>
        <p>Ürün bazlı kârlılık raporu, alış fişi ve satış fişi gerçek stok maliyetiyle bağlandığında aktif edilecektir.</p>
      </section>
    </>
  );
}

function buildReportData({ collections, customers, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers }) {
  const activeSalesSlips = salesSlips.filter((slip) => slip.status !== "İptal");
  const activePurchaseSlips = purchaseSlips.filter((slip) => slip.status !== "İptal");
  const activeCollections = collections.filter((item) => item.status !== "İptal");
  const activePayments = payments.filter((item) => item.status !== "İptal");
  const totalSales = activeSalesSlips.reduce((total, slip) => total + slip.grandTotal, 0);
  const totalPurchases = activePurchaseSlips.reduce((total, slip) => total + slip.grandTotal, 0);
  const totalCollections = activeCollections.reduce((total, item) => total + item.amount, 0);
  const totalPayments = activePayments.reduce((total, item) => total + item.amount, 0);
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
    salesPurchaseChart: buildSalesPurchaseChart(activeSalesSlips, activePurchaseSlips),
    topProducts: buildTopProducts(activeSalesSlips),
    criticalProducts,
    integrity: buildDataIntegrityReport({ collections, customers, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers }),
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
