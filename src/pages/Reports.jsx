import DataIntegrityPanel from "../components/Reports/DataIntegrityPanel.jsx";
import DataQualitySummaryPanel from "../components/Reports/DataQualitySummaryPanel.jsx";
import CustomerBalanceSummaryPanel from "../components/Reports/CustomerBalanceSummaryPanel.jsx";
import CriticalStockReport from "../components/Reports/CriticalStockReport.jsx";
import InventoryHealthPanel from "../components/Reports/InventoryHealthPanel.jsx";
import ManagementSummaryPanel from "../components/Reports/ManagementSummaryPanel.jsx";
import ReceivablePayableReport from "../components/Reports/ReceivablePayableReport.jsx";
import ReportSummaryCards from "../components/Reports/ReportSummaryCards.jsx";
import SalesPurchaseChart from "../components/Reports/SalesPurchaseChart.jsx";
import StockCountReportPanel from "../components/Reports/StockCountReportPanel.jsx";
import SupplierBalanceSummaryPanel from "../components/Reports/SupplierBalanceSummaryPanel.jsx";
import TopProductsReport from "../components/Reports/TopProductsReport.jsx";
import { currentReleaseVersion, releaseHighlightsByPage } from "../config/releaseHighlights.js";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatDateTR, getTodayISO } from "../utils/dateUtils.js";
import { buildDataIntegrityReport } from "../utils/dataIntegrity.js";
import { buildManagementReport } from "../utils/managementReportUtils.js";

const reportsReleaseHighlights = releaseHighlightsByPage.reports;
const reportsUpdatedSectionIds = reportsReleaseHighlights.updatedSectionIds;

const reportingStatusCards = [
  { label: "Raporlama modu", value: "Pasif/mock hazırlık" },
  { label: "Gerçek veri bağlantısı", value: "Kapalı" },
  { label: "Rapor export", value: "Kapalı" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Yönetici karar özeti", value: "Önizleme" },
  { label: "Günlük kontrol akışı", value: "Hazırlıkta" },
];

const dailyDecisionCards = [
  { title: "Stok / Barkod", text: "Barkodsuz ürün, duplicate barkod ve sayım farkı riskleri izlenecek." },
  { title: "Cari / Alacak", text: "Gecikmiş alacak, yakın vade ve kritik müşteri riskleri yönetici kontrolünde tutulacak." },
  { title: "Alış / Satış", text: "Düşük marjlı çok satan ürünler ve yüksek stoklu yavaş ürünler kontrol edilecek." },
  { title: "El Terminali", text: "Sayım sepeti, son okutulanlar ve personel saha notları manuel değerlendirilecek." },
  { title: "Vega Read-only", text: "İlk gerçek deneme henüz başlamadı; read-only hazırlık güvenli kapıda tutulacak." },
  { title: "Genel Karar", text: "Gerçek veri bağlantısı ve veri yazma ayrı küçük onaylı fazda ele alınacak." },
];

const riskReportGroups = [
  { title: "Stok ve Barkod Risk Raporu", items: ["Duplicate barkod", "Barkodsuz ürün", "Eksik stok kodu", "Sayım farkı", "Yanlış ürün eşleşmesi"] },
  { title: "Cari ve Alacak Risk Raporu", items: ["Gecikmiş alacak", "Yakın vade", "Kritik müşteri", "Ödeme sözü bozulan müşteri", "Yeni satış kararı bekleyen müşteri"] },
  { title: "Kârlılık ve Ticari Risk Raporu", items: ["Düşük marjlı ürün", "Yüksek stoklu yavaş ürün", "Maliyeti belirsiz ürün", "Zayıf kategori/marka performansı", "Kampanya kararı bekleyen ürün"] },
  { title: "Operasyon ve Saha Risk Raporu", items: ["Personel okutma notu bekliyor", "Sayım raporu önizleme", "El terminali gerçek cihaz bağlantısı kapalı", "Vega read-only bağlantı başlamadı", "Import/veri yazma kapalı"] },
];

const managerPriorityGroups = [
  { title: "Bugün Bakılacaklar", items: ["Barkod riskleri kontrol edilecek", "Gecikmiş alacaklar gözden geçirilecek", "Düşük marjlı ürünler not alınacak", "Günlük saha notları rapora eklenecek"] },
  { title: "Bu Hafta Takip Edilecekler", items: ["Personel el terminali kullanım notları toplanacak", "Stok kalite kontrol listesi sadeleştirilecek", "Cari risk görünümü yöneticiyle kontrol edilecek", "Kârlılık risk başlıkları netleştirilecek"] },
  { title: "İlk Gerçek Bağlantı Öncesi Bekleyenler", items: ["Manuel yedek doğrulanacak", "Read-only kullanıcı kesinleşecek", "20 satır sınırı korunacak", "Ham hata gizleme politikası netleşecek"] },
  { title: "Veri Yazma Öncesi Kesinleşmesi Gerekenler", items: ["Rollback prosedürü", "Yetki modeli", "Test ortamı", "Kullanıcı onayı", "Veri doğrulama raporu"] },
];

const reportSecurityRows = [
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "SQL/ODBC", value: "Kapalı" },
  { label: "DB okuma", value: "Kapalı" },
  { label: "Query", value: "Yok" },
  { label: "Export/indirilebilir rapor", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
  { label: "Gerçek işlem butonu", value: "Yok" },
];

export default function Reports() {
  const erpData = useErpData();
  const reportData = buildReportData(erpData);
  const managementReport = buildManagementReport(erpData);

  return (
    <>
      <section className="page-title">
        <div>
          <p>Analiz</p>
          <h1>Raporlar</h1>
          <span>Satış, alış, stok ve cari performansınızı tek ekrandan analiz edin.</span>
        </div>
      </section>

      <ReportingDecisionCenter />

      <ManagementSummaryPanel summary={managementReport.summary} />
      <InventoryHealthPanel inventory={managementReport.inventory} />
      <section className="management-balance-grid">
        <CustomerBalanceSummaryPanel customers={managementReport.customers} />
        <SupplierBalanceSummaryPanel suppliers={managementReport.suppliers} />
      </section>
      <DataQualitySummaryPanel quality={managementReport.quality} />

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

function ReportingDecisionCenter() {
  return (
    <section className={`reporting-manager-center ${reportsSectionClass("reports-decision-center")}`} id="reports-decision-center">
      <ReportsNewReleaseBadge sectionId="reports-decision-center" />
      <div className="reporting-manager-hero">
        <div>
          <p>Pasif yönetici raporu</p>
          <h2>Raporlama ve Yönetici Karar Merkezi</h2>
          <span>
            Stok, barkod, cari, alacak, kârlılık, el terminali ve Vega hazırlık durumlarını gerçek veri yazmadan yönetici seviyesinde tek rapor akışında özetleyen pasif hazırlık ekranı.
          </span>
        </div>
      </div>

      <div className="reporting-status-grid">
        {reportingStatusCards.map((card) => (
          <article className="reporting-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <ReportingPanel title="Patron Günlük Karar Özeti">
        <div className="reporting-decision-card-grid">
          {dailyDecisionCards.map((card) => (
            <article className="reporting-decision-card" key={card.title}>
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </ReportingPanel>

      <ReportingPanel title="Risk Raporları" sectionId="reports-risk-reports">
        <div className="risk-report-card-grid">
          {riskReportGroups.map((group) => (
            <article className="risk-report-card" key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ReportingPanel>

      <ReportingPanel title="Yönetici Öncelik Matrisi" sectionId="reports-priority-matrix">
        <div className="manager-priority-grid">
          {managerPriorityGroups.map((group) => (
            <article className="manager-priority-card" key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ReportingPanel>

      <ReportingPanel title="Rapor Güvenlik Kilidi" note="Bu raporlar sadece yönetici görünürlüğü sağlar. Gerçek veri okuma, dosya indirme, kayıt oluşturma veya veri yazma işlemi yapmaz." sectionId="reports-security-lock">
        <div className="report-security-grid">
          {reportSecurityRows.map((row) => (
            <article className="report-security-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </article>
          ))}
        </div>
      </ReportingPanel>
    </section>
  );
}

function ReportingPanel({ children, note, sectionId, title }) {
  return (
    <article className={`reporting-manager-panel ${sectionId ? reportsSectionClass(sectionId) : ""}`} id={sectionId}>
      <ReportsNewReleaseBadge sectionId={sectionId} />
      <div className="reporting-manager-panel-heading">
        <h3>{title}</h3>
        {note && <p>{note}</p>}
      </div>
      {children}
    </article>
  );
}

function reportsSectionClass(sectionId) {
  return reportsUpdatedSectionIds.includes(sectionId) ? "section-updated-highlight reports-updated-section" : "";
}

function ReportsNewReleaseBadge({ sectionId }) {
  if (!reportsUpdatedSectionIds.includes(sectionId)) return null;
  return <span className="new-release-badge reports-release-badge">YENİ · {currentReleaseVersion}</span>;
}

function buildReportData({ collections, customers, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers }) {
  const safeCollections = Array.isArray(collections) ? collections : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safePurchaseSlips = Array.isArray(purchaseSlips) ? purchaseSlips : [];
  const safeSalesSlips = Array.isArray(salesSlips) ? salesSlips : [];
  const safeStockMovements = Array.isArray(stockMovements) ? stockMovements : [];
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const activeSalesSlips = safeSalesSlips.filter((slip) => slip.status !== "İptal");
  const activePurchaseSlips = safePurchaseSlips.filter((slip) => slip.status !== "İptal");
  const activeCollections = safeCollections.filter((item) => item.status !== "İptal");
  const activePayments = safePayments.filter((item) => item.status !== "İptal");
  const totalSales = activeSalesSlips.reduce((total, slip) => total + toNumber(slip.grandTotal), 0);
  const totalPurchases = activePurchaseSlips.reduce((total, slip) => total + toNumber(slip.grandTotal), 0);
  const totalCollections = activeCollections.reduce((total, item) => total + toNumber(item.amount), 0);
  const totalPayments = activePayments.reduce((total, item) => total + toNumber(item.amount), 0);
  const customerReceivable = safeCustomers.reduce((total, customer) => total + toNumber(customer.currentBalance), 0);
  const supplierDebt = safeSuppliers.reduce((total, supplier) => total + toNumber(supplier.currentBalance), 0);
  const criticalProducts = safeProducts.filter((product) => toNumber(product.stockQuantity) <= toNumber(product.criticalStockLevel));

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
    integrity: buildDataIntegrityReport({
      collections: safeCollections,
      customers: safeCustomers,
      payments: safePayments,
      products: safeProducts,
      purchaseSlips: safePurchaseSlips,
      salesSlips: safeSalesSlips,
      stockMovements: safeStockMovements,
      suppliers: safeSuppliers,
    }),
  };
}

function buildSalesPurchaseChart(salesSlips, purchaseSlips) {
  const days = buildLastDays(7);

  return days.map((date) => ({
    date,
    label: formatShortDate(date),
    sales: salesSlips.filter((slip) => slip.date === date).reduce((total, slip) => total + toNumber(slip.grandTotal), 0),
    purchases: purchaseSlips.filter((slip) => slip.date === date).reduce((total, slip) => total + toNumber(slip.grandTotal), 0),
  }));
}

function buildTopProducts(salesSlips) {
  const productMap = new Map();

  salesSlips.forEach((slip) => {
    const items = Array.isArray(slip.items) ? slip.items : [];
    items.forEach((item) => {
      const current = productMap.get(item.productId) || {
        productCode: item.productCode,
        productName: item.productName,
        quantity: 0,
      };

      productMap.set(item.productId, {
        ...current,
        quantity: current.quantity + toNumber(item.quantity),
      });
    });
  });

  return [...productMap.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
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
