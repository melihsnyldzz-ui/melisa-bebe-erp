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
import ReleaseHighlightsPanel from "../components/Common/ReleaseHighlightsPanel.jsx";
import DataTable from "../components/Dashboard/DataTable.jsx";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SalesChart from "../components/Dashboard/SalesChart.jsx";
import SystemHealthCard from "../components/Dashboard/SystemHealthCard.jsx";
import TopProductsChart from "../components/Dashboard/TopProductsChart.jsx";
import { APP_STAGE, APP_VERSION } from "../config/appVersion.js";
import { currentReleaseVersion, releaseHighlightsByPage } from "../config/releaseHighlights.js";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../utils/dateUtils.js";
import { buildDataIntegrityReport } from "../utils/dataIntegrity.js";
import { formatCurrency, formatNumber } from "../utils/formatters.js";

const dashboardReleaseHighlights = releaseHighlightsByPage.dashboard;

const liveReadinessRows = [
  { label: "ERP hazırlık", value: "%76-81" },
  { label: "Canlı kullanım güvenliği", value: "%70-75" },
  { label: "El terminali hazırlığı", value: "%62-67" },
  { label: "Vega geçiş hazırlığı", value: "%63-68" },
];

const quickTestShortcuts = [
  { title: "Ayarlar kontrolüne git", path: "Sol menü > Ayarlar", moduleId: "settings" },
  { title: "Depo Terminali testine git", path: "Sol menü > Depo Terminali", moduleId: "warehouse-terminal" },
  { title: "Stok Sayım ekranına git", path: "Sol menü > Barkodlu Sayım", moduleId: "stock-count" },
  { title: "Raporları kontrol et", path: "Sol menü > Raporlar", moduleId: "reports" },
  { title: "Veri içe aktarma hazırlığına git", path: "Sol menü > Excel Aktarım", moduleId: "data-import" },
];

const liveActionCenterItems = [
  { title: "İlk kontrol", description: "Dashboard özetini incele" },
  { title: "Veri güvenliği", description: "Ayarlar > Yedekleme güvenlik kontrolünü oku" },
  { title: "Saha testi", description: "Depo Terminali'nde örnek barkod okut" },
  { title: "Rapor doğrulama", description: "Raporlar ekranını Vega çıktılarıyla karşılaştır" },
];

const quickTestNotes = [
  "Test sırasında gerçek stok/cari/fiş işlemi yapma.",
  "Hata görürsen ekran adı ve işlem adımını not al.",
  "Vega karşılaştırması manuel yapılmalıdır.",
  "Yedek/geri yükleme testi yalnızca test ortamında denenmelidir.",
];

const todayTestPriorities = [
  "Sol menüde mavi nokta olan sayfayı kontrol et",
  "Ayarlar > Bu Sürümde Yenilenen Alanlar panelini kontrol et",
  "Depo Terminali'nde örnek barkod okutma testi yap",
  "Rapor ekranlarının açıldığını kontrol et",
  "Hata varsa ekran adı ve işlem notunu kaydet",
];

export default function Dashboard({ onModuleChange }) {
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

      <ReleaseHighlightsPanel
        releaseHighlightItems={dashboardReleaseHighlights.releaseHighlightItems}
        releaseJumpLinks={dashboardReleaseHighlights.releaseJumpLinks}
      />

      <section className="dashboard-live-summary-panel table-panel" id="dashboard-live-summary">
        <div className="dashboard-panel-heading">
          <div>
            <h2>
              Canlıya Hazırlık Özeti <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
            </h2>
            <p>
              Sistem henüz tam canlı kullanım için açılmadı. Gerçek veri, Vega karşılaştırması, yedek/geri yükleme ve
              personel denemesi tamamlanmadan veri yazan işlemler kontrollü tutulmalıdır.
            </p>
          </div>
        </div>

        <div className="dashboard-live-summary-grid">
          {liveReadinessRows.map((row) => (
            <article className="dashboard-live-summary-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-test-panel table-panel" id="dashboard-test-shortcuts">
        <div className="dashboard-panel-heading">
          <div>
            <h2>
              Hızlı Test Kısayolları <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
            </h2>
            <p>Bu kartlar güvenli test yönlendirmesidir; sayfa değiştirme veya veri yazma işlemi yapmaz.</p>
          </div>
        </div>

        <div className="dashboard-shortcut-grid">
          {quickTestShortcuts.map((shortcut) => (
            <button className="dashboard-shortcut-card" key={shortcut.title} type="button" onClick={() => onModuleChange(shortcut.moduleId)}>
              <strong>{shortcut.title}</strong>
              <span>{shortcut.path}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-action-center-panel table-panel" id="dashboard-action-center">
        <div className="dashboard-panel-heading">
          <div>
            <h2>
              Canlı Hazırlık Aksiyon Merkezi <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
            </h2>
            <p>Canlı kullanıma geçmeden önce izlenecek güvenli test sırası.</p>
          </div>
        </div>

        <div className="dashboard-action-grid">
          {liveActionCenterItems.map((item) => (
            <article className="dashboard-action-card" key={item.title}>
              <span>{item.title}</span>
              <strong>{item.description}</strong>
            </article>
          ))}
        </div>

        <p className="dashboard-safety-note">
          Bu aksiyon merkezi yalnızca test sırasını gösterir. Veri yazmaz, kayıt oluşturmaz ve otomatik kontrol yapmaz.
        </p>
      </section>

      <section className="dashboard-quick-note-panel table-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Hızlı Test Notu</h2>
            <p>Canlı hazırlık denemelerinde güvenli kalmak için kısa hatırlatma.</p>
          </div>
        </div>
        <ul>
          {quickTestNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="dashboard-priority-panel table-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Bugün Test Edilecek Öncelikler</h2>
            <p>Canlı hazırlık testinde önce bakılacak başlıklar.</p>
          </div>
        </div>
        <ul>
          {todayTestPriorities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
