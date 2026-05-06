import { AlertTriangle, Banknote, Boxes, ClipboardList, ReceiptText, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import CommerceInsights from "../components/Dashboard/CommerceInsights.jsx";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import { APP_STAGE, APP_VERSION } from "../config/appVersion.js";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { formatCurrency, formatNumber } from "../utils/formatters.js";

const dashboardPeriodOptions = [
  { id: "today", label: "Bugün" },
  { id: "month", label: "Bu Ay" },
  { id: "last7", label: "Son 7 Gün" },
  { id: "last30", label: "Son 30 Gün" },
];

export default function Dashboard() {
  const erpData = useErpData();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const dashboardData = useMemo(() => buildDashboardData(erpData, selectedPeriod), [erpData, selectedPeriod]);
  const selectedPeriodLabel = dashboardPeriodOptions.find((option) => option.id === selectedPeriod)?.label || "Bu Ay";

  return (
    <>
      <section className="page-title dashboard-title">
        <div>
          <span className="version-badge">
            {APP_VERSION} · {APP_STAGE}
          </span>
          <p>Canlı özet</p>
          <h1>Melisa Bebe Yönetim Paneli</h1>
          <span>Satış, tahsilat, stok ve müşteri performansını tek ekrandan takip edin.</span>
        </div>
        <button className="primary-action">
          <ClipboardList size={18} />
          Gün Sonu Raporu
        </button>
      </section>

      <div className="dashboard-period-selector" aria-label="Ana Panel dönem seçimi">
        {dashboardPeriodOptions.map((option) => (
          <button
            aria-pressed={selectedPeriod === option.id}
            className={selectedPeriod === option.id ? "active" : ""}
            key={option.id}
            onClick={() => setSelectedPeriod(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
        <span className="dashboard-period-summary" title="Seçili dönem ticari özeti">
          <strong>Seçili dönem: {selectedPeriodLabel}</strong>
          <small>
            {formatNumber(dashboardData.periodSummary.salesSlipCount)} fiş · {formatNumber(dashboardData.periodSummary.soldQuantity)} adet ·{" "}
            {formatCurrency(dashboardData.periodSummary.salesTotal)} satış · {formatCurrency(dashboardData.periodSummary.collectionsTotal)} tahsilat
          </small>
        </span>
      </div>

      <section className="kpi-grid dashboard-compact-kpis" id="dashboard-daily-operation">
        {dashboardData.kpis.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <CommerceInsights data={dashboardData.commerceInsights} />
    </>
  );
}

function buildDashboardData({ collections, customers, products, purchaseSlips, salesSlips }, selectedPeriod) {
  const today = getTodayISO();
  const periodRange = getPeriodRange(selectedPeriod, today);
  const activeSalesSlips = salesSlips.filter(isActiveRecord);
  const activePurchaseSlips = purchaseSlips.filter(isActiveRecord);
  const activeCollections = collections.filter(isActiveRecord);
  const criticalProducts = products.filter((product) => toNumber(product.stockQuantity) <= toNumber(product.criticalStockLevel));
  const monthKey = today.slice(0, 7);
  const monthlySalesSlips = activeSalesSlips.filter((slip) => getRecordDate(slip).startsWith(monthKey));
  const monthlyCollections = activeCollections.filter((collection) => getRecordDate(collection).startsWith(monthKey));
  const periodSalesSlips = activeSalesSlips.filter((slip) => isDateInRange(getRecordDate(slip), periodRange));
  const periodCollections = activeCollections.filter((collection) => isDateInRange(getRecordDate(collection), periodRange));
  const periodSales = sumBy(periodSalesSlips, "grandTotal");
  const periodCollectionsTotal = sumBy(periodCollections, "amount");
  const monthlySalesTotal = sumBy(monthlySalesSlips, "grandTotal");
  const monthlyCollectionsTotal = sumBy(monthlyCollections, "amount");
  const periodSoldQuantity = sumSlipQuantity(periodSalesSlips);
  const monthlySoldQuantity = sumSlipQuantity(monthlySalesSlips);

  return {
    kpis: [
      buildKpi(selectedPeriod === "today" ? "Bugünkü fiş" : "Satış fişi", periodSalesSlips.length, monthlySalesSlips.length, "count", ReceiptText, "dark"),
      buildKpi("Çıkan adet", periodSoldQuantity, monthlySoldQuantity, "quantity", Boxes, "green", "Satış fişlerindeki ürün adedi"),
      buildKpi("Satış", periodSales, monthlySalesTotal, "currency", ShoppingBag, "red"),
      buildKpi("Tahsilat", periodCollectionsTotal, monthlyCollectionsTotal, "currency", Banknote, "amber"),
    ],
    commerceInsights: {
      monthlySalesTrend: buildSalesTrend(periodSalesSlips, periodRange),
      monthlyTopProducts: buildMonthlyTopProducts(periodSalesSlips),
      topCustomersByRevenue: buildTopCustomers(periodSalesSlips),
      categoryAgeDistribution: buildCategoryAgeDistribution(periodSalesSlips, products),
      riskRows: buildRiskRows({ criticalProducts, customers }),
      latestSlips: buildLatestSlipRows({ activePurchaseSlips, activeSalesSlips }),
    },
    periodSummary: {
      collectionsTotal: periodCollectionsTotal,
      salesSlipCount: periodSalesSlips.length,
      salesTotal: periodSales,
      soldQuantity: periodSoldQuantity,
    },
  };
}

function buildKpi(label, currentValueRaw, monthValue, type, icon, tone, helperText) {
  const monthTotal = Math.max(toNumber(monthValue), 0);
  const currentValue = Math.max(toNumber(currentValueRaw), 0);
  const percent = monthTotal > 0 ? Math.min((currentValue / monthTotal) * 100, 100) : 0;

  return {
    icon,
    label,
    monthValue: helperText || `Bu ay: ${formatInsightValue(monthTotal, type)}`,
    percent,
    tone,
    value: formatInsightValue(currentValue, type),
  };
}

function formatInsightValue(value, type) {
  if (type === "currency") return formatCurrency(value);
  if (type === "quantity") return `${formatNumber(value)} adet`;
  return formatNumber(value);
}

function buildSalesTrend(salesSlips, range) {
  const dates = getDateKeysInRange(range);

  return dates.map((date) => ({
    day: formatTrendLabel(date),
    value: sumByDate(salesSlips, date, "grandTotal"),
  }));
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

function buildTopCustomers(salesSlips) {
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
    .sort((a, b) => b.revenue - a.revenue)
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
    .slice(0, 3);
  const maxQuantity = Math.max(...rows.map((row) => row.quantity), 0);

  return rows.map((row) => ({
    ...row,
    percent: maxQuantity > 0 ? Math.max((row.quantity / maxQuantity) * 100, 4) : 0,
  }));
}

function buildRiskRows({ criticalProducts, customers }) {
  const stockRows = criticalProducts
    .slice()
    .sort((a, b) => toNumber(a.stockQuantity) - toNumber(b.stockQuantity))
    .slice(0, 2)
    .map((product) => ({
      label: product.name || product.code || "Ürün",
      meta: `${formatNumber(product.stockQuantity)} adet`,
      status: toNumber(product.stockQuantity) <= 0 ? "Stok yok" : "Kritik",
    }));
  const customerRows = buildRiskCustomers(customers)
    .slice(0, 1)
    .map((customer) => ({
      label: customer.name,
      meta: formatCurrency(customer.currentBalance),
      status: customer.riskLabel,
    }));

  return [...stockRows, ...customerRows].slice(0, 3);
}

function buildLatestSlipRows({ activePurchaseSlips, activeSalesSlips }) {
  return [
    ...activeSalesSlips.map((slip) => ({
      no: slip.slipNo,
      party: slip.customerName,
      total: toNumber(slip.grandTotal),
      type: "Satış",
      when: slip.createdAt || slip.date,
    })),
    ...activePurchaseSlips.map((slip) => ({
      no: slip.slipNo,
      party: slip.supplierName,
      total: toNumber(slip.grandTotal),
      type: "Alış",
      when: slip.createdAt || slip.date,
    })),
  ]
    .sort((a, b) => getSortTime(b) - getSortTime(a))
    .slice(0, 3);
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
  return items.filter((item) => getRecordDate(item) === date).reduce((total, item) => total + toNumber(item[key]), 0);
}

function getPeriodRange(periodId, todayISO) {
  const today = parseISODate(todayISO);
  const end = todayISO;

  if (periodId === "today") return { end, start: todayISO };
  if (periodId === "last7") return { end, start: toISODate(addDays(today, -6)) };
  if (periodId === "last30") return { end, start: toISODate(addDays(today, -29)) };

  return { end, start: `${todayISO.slice(0, 7)}-01` };
}

function getDateKeysInRange({ start, end }) {
  const startDate = parseISODate(start);
  const endDate = parseISODate(end);
  const dates = [];

  for (let cursor = startDate; cursor <= endDate; cursor = addDays(cursor, 1)) {
    dates.push(toISODate(cursor));
  }

  return dates;
}

function isDateInRange(date, { start, end }) {
  return Boolean(date) && date >= start && date <= end;
}

function formatTrendLabel(date) {
  return String(Number(date.slice(8, 10)));
}

function parseISODate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isActiveRecord(record) {
  return record.status !== "İptal";
}

function sumBy(items, key) {
  return items.reduce((total, item) => total + toNumber(item[key]), 0);
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
    .sort((a, b) => b.riskRatio - a.riskRatio);
}

function getSortTime(item) {
  return new Date(item.when || item.createdAt || item.date || 0).getTime();
}

function toNumber(value) {
  return Number(value) || 0;
}
