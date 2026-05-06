import {
  AlertTriangle,
  ArrowDownToLine,
  Banknote,
  Boxes,
  ClipboardList,
  CreditCard,
  ReceiptText,
  ShoppingBag,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useMemo } from "react";
import CommerceInsights from "../components/Dashboard/CommerceInsights.jsx";
import DataTable from "../components/Dashboard/DataTable.jsx";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SalesChart from "../components/Dashboard/SalesChart.jsx";
import SystemHealthCard from "../components/Dashboard/SystemHealthCard.jsx";
import TopProductsChart from "../components/Dashboard/TopProductsChart.jsx";
import { APP_STAGE, APP_VERSION } from "../config/appVersion.js";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../utils/dateUtils.js";
import { buildDataIntegrityReport } from "../utils/dataIntegrity.js";
import { formatCurrency, formatNumber } from "../utils/formatters.js";

export default function Dashboard() {
  const erpData = useErpData();
  const dashboardData = useMemo(() => buildDashboardData(erpData), [erpData]);

  return (
    <>
      <section className="page-title">
        <div>
          <span className="version-badge">
            {APP_VERSION} · {APP_STAGE}
          </span>
          <p>Canlı özet</p>
          <h1>Melisa Bebe Yönetim Paneli</h1>
          <span>Bugünkü satış, stok ve cari durumunuzu tek ekrandan takip edin.</span>
        </div>
        <button className="primary-action">
          <ClipboardList size={18} />
          Gün Sonu Raporu
        </button>
      </section>

      <section className="dashboard-live-note table-panel">
        <p>Canlıya geçiş hazırlığı Ayarlar &gt; Sistem Durumu ekranından takip edilir.</p>
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

      <CommerceInsights data={dashboardData.commerceInsights} />

      <SystemHealthCard integrity={dashboardData.integrity} />

      <section className="tables-grid">
        <DataTable title="Son Satış Fişleri" icon={ReceiptText} rows={dashboardData.tables.sales} columns={["Fiş", "Müşteri", "Tutar", "Saat"]} />
        <DataTable title="Son Alış Fişleri" icon={Truck} rows={dashboardData.tables.purchases} columns={["Fiş", "Tedarikçi", "Tutar", "Zaman"]} />
        <DataTable title="Son Tahsilatlar" icon={Banknote} rows={dashboardData.tables.collections} columns={["No", "Cari", "Tutar", "Tip"]} />
        <DataTable title="Kritik Stok Uyarıları" icon={AlertTriangle} rows={dashboardData.tables.stock} columns={["Kod", "Ürün", "Stok", "Durum"]} />
        <DataTable title="Riskli Müşteriler" icon={UserRound} rows={dashboardData.tables.risk} columns={["Müşteri", "Alacak", "Limit", "Risk"]} />
      </section>
    </>
  );
}

function buildDashboardData({ collections, customers, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers }) {
  const today = getTodayISO();
  const activeSalesSlips = salesSlips.filter(isActiveRecord);
  const activePurchaseSlips = purchaseSlips.filter(isActiveRecord);
  const activeCollections = collections.filter(isActiveRecord);
  const activePayments = payments.filter(isActiveRecord);
  const criticalProducts = products.filter((product) => toNumber(product.stockQuantity) <= toNumber(product.criticalStockLevel));

  const todaySales = sumByDate(activeSalesSlips, today, "grandTotal");
  const todayCollections = sumByDate(activeCollections, today, "amount");
  const todayPurchases = sumByDate(activePurchaseSlips, today, "grandTotal");
  const todayPayments = sumByDate(activePayments, today, "amount");
  const customerReceivable = sumBy(customers, "currentBalance");
  const supplierDebt = sumBy(suppliers, "currentBalance");
  const totalStock = sumBy(products, "stockQuantity");

  return {
    kpis: [
      { label: "Bugünkü Satış", value: formatCurrency(todaySales), icon: ShoppingBag, tone: "red" },
      { label: "Bugünkü Tahsilat", value: formatCurrency(todayCollections), icon: Banknote, tone: "green" },
      { label: "Bugünkü Alış", value: formatCurrency(todayPurchases), icon: Truck, tone: "dark" },
      { label: "Bugünkü Tedarikçi Ödemesi", value: formatCurrency(todayPayments), icon: CreditCard, tone: "amber" },
      { label: "Toplam Müşteri Alacağı", value: formatCurrency(customerReceivable), icon: WalletCards, tone: "red" },
      { label: "Toplam Tedarikçi Borcu", value: formatCurrency(supplierDebt), icon: ArrowDownToLine, tone: "dark" },
      { label: "Toplam Stok Adedi", value: formatNumber(totalStock), icon: Boxes, tone: "green" },
      { label: "Kritik Stok Ürün Sayısı", value: formatNumber(criticalProducts.length), icon: AlertTriangle, tone: "amber" },
    ],
    salesChart: buildSalesChart(activeSalesSlips),
    topProducts: buildTopProducts(activeSalesSlips),
    commerceInsights: buildCommerceInsights({ activeCollections, activeSalesSlips, products, today, todayCollections, todaySales }),
    integrity: buildDataIntegrityReport({ collections, customers, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers }),
    tables: {
      sales: latestRows(activeSalesSlips).map((slip) => [
        slip.slipNo,
        slip.customerName,
        formatCurrency(slip.grandTotal),
        formatTimeOrDate(slip.createdAt || slip.date),
      ]),
      purchases: latestRows(activePurchaseSlips).map((slip) => [
        slip.slipNo,
        slip.supplierName,
        formatCurrency(slip.grandTotal),
        formatTimeOrDate(slip.createdAt || slip.date),
      ]),
      collections: latestRows(activeCollections).map((collection) => [
        collection.collectionNo,
        collection.customerName,
        formatCurrency(collection.amount),
        collection.paymentType || "-",
      ]),
      stock: criticalProducts
        .slice()
        .sort((a, b) => toNumber(a.stockQuantity) - toNumber(b.stockQuantity))
        .slice(0, 5)
        .map((product) => [
          product.code,
          product.name,
          `${formatNumber(product.stockQuantity)} adet`,
          buildStockRiskLabel(product),
        ]),
      risk: buildRiskCustomers(customers).map((customer) => [
        customer.name,
        formatCurrency(customer.currentBalance),
        formatCurrency(customer.riskLimit),
        customer.riskLabel,
      ]),
    },
  };
}

function buildCommerceInsights({ activeCollections, activeSalesSlips, products, today, todayCollections, todaySales }) {
  const monthKey = today.slice(0, 7);
  const todaySalesSlips = activeSalesSlips.filter((slip) => getRecordDate(slip) === today);
  const monthlySalesSlips = activeSalesSlips.filter((slip) => getRecordDate(slip).startsWith(monthKey));
  const monthlyCollections = activeCollections.filter((collection) => getRecordDate(collection).startsWith(monthKey));
  const monthlySalesTotal = sumBy(monthlySalesSlips, "grandTotal");
  const monthlyCollectionsTotal = sumBy(monthlyCollections, "amount");
  const todaySoldQuantity = sumSlipQuantity(todaySalesSlips);
  const monthlySoldQuantity = sumSlipQuantity(monthlySalesSlips);

  return {
    todayOperation: [
      buildOperationRow("Bugünkü satış fişi", todaySalesSlips.length, monthlySalesSlips.length, "count"),
      buildOperationRow("Bugün çıkan ürün", todaySoldQuantity, monthlySoldQuantity, "quantity"),
      buildOperationRow("Bugünkü satış tutarı", todaySales, monthlySalesTotal, "currency"),
      buildOperationRow("Bugünkü tahsilat tutarı", todayCollections, monthlyCollectionsTotal, "currency"),
    ],
    monthlySalesTrend: buildCurrentMonthSalesTrend(monthlySalesSlips, today),
    monthlyTopProducts: buildMonthlyTopProducts(monthlySalesSlips),
    topCustomersByRevenue: buildTopCustomers(monthlySalesSlips, "revenue"),
    topCustomersByQuantity: buildTopCustomers(monthlySalesSlips, "quantity"),
    categoryAgeDistribution: buildCategoryAgeDistribution(monthlySalesSlips, products),
  };
}

function buildOperationRow(label, todayValue, monthValue, type) {
  const monthTotal = Math.max(toNumber(monthValue), 0);
  const currentValue = Math.max(toNumber(todayValue), 0);
  const percent = monthTotal > 0 ? Math.min((currentValue / monthTotal) * 100, 100) : 0;

  return {
    label,
    percent,
    value: formatInsightValue(currentValue, type),
    monthValue: formatInsightValue(monthTotal, type),
  };
}

function formatInsightValue(value, type) {
  if (type === "currency") return formatCurrency(value);
  if (type === "quantity") return `${formatNumber(value)} adet`;
  return formatNumber(value);
}

function buildCurrentMonthSalesTrend(salesSlips, today) {
  const dayCount = Number(today.slice(8, 10));
  const monthKey = today.slice(0, 7);

  return Array.from({ length: dayCount }, (_, index) => {
    const dayNumber = index + 1;
    const date = `${monthKey}-${String(dayNumber).padStart(2, "0")}`;

    return {
      day: String(dayNumber),
      value: sumByDate(salesSlips, date, "grandTotal"),
    };
  });
}

function buildMonthlyTopProducts(salesSlips) {
  const productMap = new Map();

  salesSlips.forEach((slip) => {
    (slip.items || []).forEach((item) => {
      const key = item.productId || item.productCode || item.barcode || item.productName;
      const current = productMap.get(key) || { name: item.productName || "-", quantity: 0, revenue: 0 };
      productMap.set(key, {
        ...current,
        quantity: current.quantity + toNumber(item.quantity),
        revenue: current.revenue + getItemRevenue(item),
      });
    });
  });

  return [...productMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((item) => ({ ...item, name: shortenLabel(item.name) }));
}

function buildTopCustomers(salesSlips, sortKey) {
  const customerMap = new Map();

  salesSlips.forEach((slip) => {
    const key = slip.customerId || slip.customerName || "Müşteri";
    const current = customerMap.get(key) || { name: slip.customerName || "Müşteri", quantity: 0, revenue: 0 };
    customerMap.set(key, {
      ...current,
      quantity: current.quantity + sumSlipQuantity([slip]),
      revenue: current.revenue + toNumber(slip.grandTotal),
    });
  });

  return [...customerMap.values()]
    .sort((a, b) => b[sortKey] - a[sortKey])
    .slice(0, 5)
    .map((item) => ({ ...item, name: shortenLabel(item.name) }));
}

function buildCategoryAgeDistribution(salesSlips, products) {
  const productMap = buildProductLookup(products);
  const distributionMap = new Map();

  salesSlips.forEach((slip) => {
    (slip.items || []).forEach((item) => {
      const product = findProductForItem(productMap, item);
      const category = product?.category || product?.categoryName;
      const ageGroup = product?.ageGroup;
      if (!category && !ageGroup) return;

      const key = `${category || "Kategori yok"} / ${ageGroup || "Yaş grubu yok"}`;
      distributionMap.set(key, (distributionMap.get(key) || 0) + toNumber(item.quantity));
    });
  });

  const rows = [...distributionMap.entries()]
    .map(([name, quantity]) => ({ name: shortenLabel(name, 34), quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6);
  const maxQuantity = Math.max(...rows.map((row) => row.quantity), 0);

  return rows.map((row) => ({
    ...row,
    percent: maxQuantity > 0 ? Math.max((row.quantity / maxQuantity) * 100, 4) : 0,
  }));
}

function buildProductLookup(products) {
  const lookup = new Map();
  products.forEach((product) => {
    [product.id, product.productId, product.code, product.barcode, product.name].filter(Boolean).forEach((key) => {
      lookup.set(String(key), product);
    });
  });
  return lookup;
}

function findProductForItem(productMap, item) {
  const keys = [item.productId, item.id, item.productCode, item.code, item.barcode, item.productName].filter(Boolean);
  return keys.map((key) => productMap.get(String(key))).find(Boolean);
}

function sumSlipQuantity(slips) {
  return slips.reduce((total, slip) => total + (slip.items || []).reduce((itemTotal, item) => itemTotal + toNumber(item.quantity), 0), 0);
}

function getItemRevenue(item) {
  const directTotal = item.lineTotal ?? item.total ?? item.netTotal ?? item.amount;
  if (directTotal !== undefined && directTotal !== null && directTotal !== "") return toNumber(directTotal);

  const quantity = toNumber(item.quantity);
  const unitPrice = toNumber(item.unitPrice || item.price || item.salePrice);
  const discountRate = toNumber(item.discountRate);
  return quantity * unitPrice * (1 - discountRate / 100);
}

function getRecordDate(record) {
  return String(record.date || record.createdAt || "").slice(0, 10);
}

function shortenLabel(value, maxLength = 24) {
  const text = String(value || "-");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function sumByDate(items, date, key) {
  return items.filter((item) => item.date === date).reduce((total, item) => total + toNumber(item[key]), 0);
}

function isActiveRecord(record) {
  return record.status !== "İptal";
}

function sumBy(items, key) {
  return items.reduce((total, item) => total + toNumber(item[key]), 0);
}

function latestRows(items) {
  return items
    .slice()
    .sort((a, b) => getSortTime(b) - getSortTime(a))
    .slice(0, 5);
}

function getSortTime(item) {
  return new Date(item.createdAt || item.date || 0).getTime();
}

function buildSalesChart(salesSlips) {
  return buildLastDays(7).map((date) => ({
    day: formatShortDay(date),
    value: sumByDate(salesSlips, date, "grandTotal"),
  }));
}

function buildTopProducts(salesSlips) {
  const productMap = new Map();

  salesSlips.forEach((slip) => {
    (slip.items || []).forEach((item) => {
      const key = item.productId || item.productCode || item.productName;
      const current = productMap.get(key) || { name: item.productName || "-", adet: 0 };
      productMap.set(key, { ...current, adet: current.adet + toNumber(item.quantity) });
    });
  });

  return [...productMap.values()].sort((a, b) => b.adet - a.adet).slice(0, 5);
}

function buildRiskCustomers(customers) {
  return customers
    .map((customer) => {
      const balance = toNumber(customer.currentBalance);
      const riskLimit = toNumber(customer.riskLimit);
      const riskRatio = riskLimit > 0 ? balance / riskLimit : 0;

      return {
        ...customer,
        riskRatio,
        riskLabel: riskRatio >= 1 ? "Limit Aşıldı" : "Yakın",
      };
    })
    .filter((customer) => toNumber(customer.riskLimit) > 0 && customer.riskRatio >= 0.8)
    .sort((a, b) => b.riskRatio - a.riskRatio)
    .slice(0, 5);
}

function buildStockRiskLabel(product) {
  return toNumber(product.stockQuantity) <= 0 ? "Tükendi" : "Kritik";
}

function buildLastDays(dayCount) {
  const today = new Date(getTodayISO());

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (dayCount - 1 - index));
    return date.toISOString().slice(0, 10);
  });
}

function formatShortDay(value) {
  return formatDateTR(value).slice(0, 5);
}

function formatTimeOrDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return value.includes("T")
    ? date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : formatDateTR(value).slice(0, 5);
}

function toNumber(value) {
  return Number(value) || 0;
}
