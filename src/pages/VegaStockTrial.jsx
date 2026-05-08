import { useMemo, useState } from "react";
import { AlertTriangle, Database, Search, ShieldCheck } from "lucide-react";
import { currentReleaseVersion } from "../config/releaseHighlights.js";
import { canUseVegaReadOnlyBridge, listVegaStockReadOnly } from "../utils/desktopBridge.js";
import { formatCurrency } from "../utils/formatters.js";

const demoStockRows = [
  {
    stockCode: "DEMO-STK-001",
    barcode: "869000000001",
    productName: "Demo Bebek Body",
    brand: "Demo Marka",
    size: "3-6 Ay",
    color: "Ekru",
    quantity: 12,
    purchasePrice: 120,
    salePrice: 190,
  },
  {
    stockCode: "DEMO-STK-002",
    barcode: "869000000002",
    productName: "Demo Bebek Tulum",
    brand: "Demo Marka",
    size: "6-9 Ay",
    color: "Pudra",
    quantity: 7,
    purchasePrice: 160,
    salePrice: 260,
  },
];

const statusLabels = {
  not_configured: "Vega bağlantısı yok",
  demo: "Demo veri",
  loading: "Manuel deneme",
  ready: "Read-only bağlantı hazır",
  success: "Read-only bağlantı hazır",
  error: "Bağlantı hatası",
};

const defaultConnectionMetadata = {
  readOnlyEnabled: false,
  driverConfigured: false,
  serverConfigured: false,
  databaseConfigured: false,
  stockQueryPrepared: false,
  writeEnabled: false,
  technicalPhase: "v1.20-read-only-prep",
  connectionLocked: true,
  sqlExecutionEnabled: false,
  odbcEnabled: false,
  databaseReadEnabled: false,
  maxRowsLimitPrepared: false,
  approvalRequired: true,
  maxRowsLimit: 20,
  timeoutMsPrepared: false,
  retryEnabled: false,
  failClosedEnabled: true,
  errorPressureProtection: true,
  stockReadScope: "stock-cards-only",
  connectionAttemptEnabled: false,
  timeoutMs: 3000,
  timeoutPolicyPrepared: true,
  safeErrorMessageEnabled: true,
  rawErrorExposeEnabled: false,
  lastConnectionAttempt: null,
  manualApprovalStatus: "required",
  approvalRecordEnabled: false,
  connectionUnlockAllowed: false,
  unlockReasonRequired: true,
  operatorNameRequired: true,
  backupCheckRequired: true,
};

const columnMappings = [
  { vegaField: "Stok Kodu", erpField: "stockCode" },
  { vegaField: "Barkod", erpField: "barcode" },
  { vegaField: "Ürün Adı", erpField: "productName" },
  { vegaField: "Marka", erpField: "brand" },
  { vegaField: "Beden", erpField: "size" },
  { vegaField: "Renk", erpField: "color" },
  { vegaField: "Mevcut Stok", erpField: "quantity" },
  { vegaField: "Alış Fiyatı", erpField: "purchasePrice" },
  { vegaField: "Satış Fiyatı", erpField: "salePrice" },
];

const stockPreviewReadGuide = [
  "Bu tablo manuel read-only deneme sonrası gelen geçici önizlemedir.",
  "Veri kaydedilmez.",
  "Vega'ya veri yazılmaz.",
  "En fazla 20 satır gösterilir.",
  "Stok dışı veri gösterilmez.",
];

const stockPreviewControlSequence = [
  "Önce stok kodu ve ürün adını kontrol et.",
  "Sonra barkod/etiket alanını kontrol et.",
  "Sonra fiyat/KDV alanlarını yönetici veya muhasebe ile yorumla.",
  "Şüpheli/boş alan varsa canlı kullanım kararı verme.",
];

const topStockOutStatusCards = [
  { label: "Veri kaynağı", value: "Vega SQL read-only" },
  { label: "Kapsam", value: "Sadece stok çıkış hareketleri" },
  { label: "Limit", value: "Top 100" },
  { label: "Sıralama", value: "Toplam çıkış miktarı" },
  { label: "Dönem", value: "Son 30 gün / doğrulanacak" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Import/Senkron/Export", value: "Yok" },
  { label: "Çalışma şekli", value: "Manuel tetikleme" },
  { label: "SQL kullanıcısı", value: "sa / geçici riskli test" },
  { label: "Risk seviyesi", value: "Orta-yüksek" },
];

const topStockOutValidationRows = [
  { label: "Stok hareket tablosu", value: "Doğrulanamadı" },
  { label: "Stok kodu alanı", value: "Doğrulanamadı" },
  { label: "Çıkış miktarı alanı", value: "Doğrulanamadı" },
  { label: "Hareket yönü ayrımı", value: "Doğrulanamadı" },
  { label: "Tarih alanı", value: "Doğrulanamadı" },
];

const stockMovementDiscoveryStatusCards = [
  { label: "Amaç", value: "Top 100 stok çıkışı için alan doğrulama" },
  { label: "Veri türü", value: "Şema/metadata keşfi" },
  { label: "Canlı hareket verisi", value: "Okunmayacak" },
  { label: "Top 100 sorgusu", value: "Çalıştırılmayacak" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Çalışma şekli", value: "Manuel doğrulama" },
  { label: "SQL kullanıcısı", value: "sa / geçici riskli test" },
  { label: "Risk seviyesi", value: "Orta-yüksek" },
];

const stockMovementDiscoveryFields = [
  "Stok hareket tablosu",
  "Stok kodu alanı",
  "Çıkış miktarı alanı",
  "Hareket yönü / giriş-çıkış ayrımı",
  "Hareket tarihi alanı",
  "Stok kartı bağlantı alanı",
];

const stockMovementDiscoveryLocks = [
  "Top 100 sorgusu çalışmaz.",
  "Son 30 gün filtresi çalışmaz.",
  "Çıkış miktarına göre sıralama çalışmaz.",
  "Manuel Top 100 butonu aktif olmaz.",
  "Canlı stok çıkışı yorumu yapılmaz.",
];

const stockMovementDiscoverySafetyNotes = [
  "Bu ekran canlı stok hareket verisi okumaz.",
  "Bu ekran Top 100 sorgusu çalıştırmaz.",
  "Bu ekran sadece alan doğrulama hazırlığıdır.",
  "Veri kaydetmez.",
  "Vega'ya veri yazmaz.",
  "Import/senkron/export yapılmaz.",
  "Cari/sipariş/kasa/finans verisi okunmaz.",
  "sa kullanımı geçici ve orta-yüksek risklidir.",
  "Metadata keşif fonksiyonu sonraki sürümde manuel ve maskeli şekilde eklenecek.",
];

const topStockOutSafetyNotes = [
  "Bu ekran Vega'dan sadece read-only stok çıkış özeti okumak için hazırlanır.",
  "Sonuç ileride sadece geçici olarak ekranda görünür.",
  "Veri kaydedilmez.",
  "Vega'ya veri yazılmaz.",
  "Import/senkron/export yapılmaz.",
  "Cari/sipariş/kasa/finans verisi okunmaz.",
  "sa kullanımı geçici ve orta-yüksek risklidir.",
];

const topStockOutPreviewHeaders = [
  "Sıra",
  "Stok Kodu",
  "Ürün Adı",
  "Barkod",
  "Toplam Çıkış Miktarı",
  "Son Çıkış Tarihi",
  "Hareket Sayısı",
  "Kontrol Notu",
];

const pendingLabel = "Doğrulanacak";

const pickFirstValue = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null && String(item).trim() !== "");
  return value === undefined ? pendingLabel : value;
};

const formatOptionalCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return pendingLabel;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? formatCurrency(numericValue) : pendingLabel;
};

const buildPreviewRow = (row, hasVegaRows) => ({
  stockCode: pickFirstValue(row.stockCode, row.STOKKODU),
  productName: pickFirstValue(row.productName, row.MALINCINSI),
  barcode: hasVegaRows ? pendingLabel : pickFirstValue(row.barcode),
  brand: hasVegaRows ? pendingLabel : pickFirstValue(row.brand),
  category: pendingLabel,
  size: hasVegaRows ? pendingLabel : pickFirstValue(row.size),
  color: hasVegaRows ? pendingLabel : pickFirstValue(row.color),
  purchasePrice: formatOptionalCurrency(pickFirstValue(row.purchasePrice, row.ALISFIYATI)),
  salePrice: formatOptionalCurrency(pickFirstValue(row.salePrice, row.ISKSATISFIYATI2, row.ISKSATISFIYATI3)),
  vat: pickFirstValue(row.KDVGRUBU),
  controlNote: hasVegaRows ? "Kullanıcı kontrolü" : "Demo satır",
});

export default function VegaStockTrial() {
  const [query, setQuery] = useState("");
  const [stockState, setStockState] = useState({
    status: "not_configured",
    message: "Vega stok read-only bağlantısı otomatik başlamaz. Manuel deneme yapılana kadar gerçek stok okunmuyor.",
    items: [],
    metadata: defaultConnectionMetadata,
  });

  const handleManualStockTrial = async () => {
    if (!canUseVegaReadOnlyBridge()) {
      setStockState({
        status: "error",
        message: "Electron güvenli köprüsü bulunamadı. Vega stok read-only denemesi yalnızca desktop uygulamada manuel çalışır.",
        items: [],
        metadata: defaultConnectionMetadata,
      });
      return;
    }

    setStockState({
      status: "loading",
      message: "Manuel Vega stok read-only denemesi çalışıyor...",
      items: [],
      metadata: defaultConnectionMetadata,
    });

    try {
      const result = await listVegaStockReadOnly();
      setStockState(result || {
        status: "error",
        message: "Vega read-only denemesi güvenli şekilde tamamlanamadı.",
        items: [],
        metadata: defaultConnectionMetadata,
      });
    } catch {
      setStockState({
        status: "error",
        message: "Vega read-only denemesi sırasında hata oluştu. Ham hata gizlendi.",
        items: [],
        metadata: defaultConnectionMetadata,
      });
    }
  };

  const hasVegaRows = stockState.items?.length > 0;
  const visibleRows = hasVegaRows ? stockState.items : demoStockRows;
  const visibleStatus = stockState.status;
  const isStockTrialLoading = stockState.status === "loading";
  const connectionMetadata = { ...defaultConnectionMetadata, ...(stockState.metadata || {}) };
  const connectionCards = [
    { label: "Read-only mod", value: connectionMetadata.readOnlyEnabled ? "Açık" : "Kapalı" },
    { label: "Bağlantı sürücüsü", value: connectionMetadata.driverConfigured ? "Tanımlı" : "Tanımlı değil" },
    { label: "Veri yazma", value: connectionMetadata.writeEnabled ? "Açık" : "Kapalı" },
    { label: "Gösterilen veri", value: hasVegaRows ? "Vega read-only" : "Demo veri" },
  ];
  const dataSourceLabel = hasVegaRows ? "Vega read-only" : "Demo veri";
  const dataSourceMessage = hasVegaRows
    ? "Vega read-only satırları gösteriliyor. Veri yazma kapalıdır."
    : "Şu anda demo stok verisi gösteriliyor. Gerçek Vega stoğu okunmuyor.";
  const readinessSummaryRows = [
    { label: "Vega read-only mod", value: connectionMetadata.readOnlyEnabled ? "Açık" : "Kapalı" },
    { label: "Bağlantı sürücüsü", value: connectionMetadata.driverConfigured ? "Tanımlı" : "Tanımlı değil" },
    { label: "Gerçek stok okuma", value: hasVegaRows ? "Açık" : "Kapalı" },
    { label: "Veri yazma", value: connectionMetadata.writeEnabled ? "Açık" : "Kapalı" },
    { label: "Gösterilen veri", value: hasVegaRows ? "Vega read-only" : "Demo veri" },
  ];
  const readOnlyPreparationRows = [
    { label: "Read-only bağlantı modu", value: connectionMetadata.readOnlyEnabled ? "Açık" : "Kapalı" },
    { label: "ODBC / SQL sürücüsü", value: connectionMetadata.driverConfigured ? "Tanımlı" : "Tanımlı değil" },
    {
      label: "Vega veritabanı yolu / sunucusu",
      value: connectionMetadata.serverConfigured || connectionMetadata.databaseConfigured ? "Tanımlı" : "Tanımlı değil",
    },
    { label: "Stok okuma sorgusu", value: connectionMetadata.stockQueryPrepared ? "Hazır" : "Hazırlanmadı" },
    { label: "Veri yazma izni", value: connectionMetadata.writeEnabled ? "Açık" : "Kapalı" },
    { label: "Sonraki kontrollü adım", value: "Bağlantı parametrelerinin sadece okunur önizlemesi" },
  ];
  const connectionPreviewRows = [
    { label: "Bağlantı modu", value: "Read-only" },
    { label: "Sürücü türü", value: "ODBC / SQL" },
    { label: "Sunucu / dosya yolu", value: "Tanımlı değil" },
    { label: "Veritabanı adı", value: "Tanımlı değil" },
    { label: "Kullanıcı yetkisi", value: "Sadece okuma için hazırlanacak" },
    { label: "Stok sorgusu", value: "Hazırlanmadı" },
    { label: "Yazma izni", value: "Kapalı" },
  ];
  const driverRequirementRows = [
    { label: "Gerekli sürücü", value: "ODBC / SQL uyumlu bağlantı sürücüsü" },
    { label: "Erişim türü", value: "Sadece okuma" },
    { label: "Yazma izni", value: "Kapalı olmalı" },
    { label: "Kullanıcı yetkisi", value: "Minimum yetkili read-only kullanıcı" },
    { label: "Bağlantı testi", value: "Bu sürümde yapılmaz" },
    { label: "Stok sorgusu", value: "Ayrı kontrollü sürümde hazırlanacak" },
    { label: "Güvenlik notu", value: "Gerçek Vega verisine yazma işlemi kesinlikle açılmayacak" },
  ];
  const databaseGuideRows = [
    { label: "Bilgi türü", value: "Vega veritabanı yolu veya SQL sunucu bilgisi" },
    { label: "Varsayılan durum", value: "Tanımlı değil" },
    { label: "Erişim şekli", value: "Sadece okunur bağlantı için kullanılacak" },
    { label: "Dosya / sunucu seçimi", value: "Bu sürümde yapılmaz" },
    { label: "Bağlantı testi", value: "Bu sürümde yapılmaz" },
    { label: "Güvenlik notu", value: "Gerçek Vega verisine yazma yetkisi açılmayacak" },
    { label: "Sonraki adım", value: "Stok sorgusu taslak önizleme" },
  ];
  const stockQueryPreviewRows = [
    { label: "Sorgu amacı", value: "Stok kartlarını sadece okumak" },
    { label: "Çalışma modu", value: "Read-only" },
    { label: "Yazma işlemi", value: "Yok" },
    { label: "Mutasyon", value: "Yok" },
    { label: "Filtre hazırlığı", value: "Stok kodu / barkod / ürün adı" },
    { label: "Döndürülecek alanlar", value: "Stok kodu, barkod, ürün adı, marka, beden, renk, mevcut stok, alış fiyatı, satış fiyatı" },
    { label: "Çalıştırma durumu", value: "Bu sürümde çalıştırılmaz" },
  ];
  const stockQueryDraftFields = [
    "stockCode",
    "barcode",
    "productName",
    "brand",
    "size",
    "color",
    "quantity",
    "purchasePrice",
    "salePrice",
  ];
  const readOnlySecurityChecklist = [
    "Vega bağlantısı sadece okuma modunda olacak",
    "Yazma izni kapalı kalacak",
    "Stok, cari, fiş ve ürün kayıtları değiştirilmeyecek",
    "Bağlantı kullanıcı yetkisi minimum seviyede olacak",
    "İlk gerçek okuma küçük satır limitiyle yapılacak",
    "Demo veri ile gerçek Vega verisi ayrı gösterilecek",
    "Hata durumunda Vega'ya tekrar deneme baskısı yapılmayacak",
    "Gerçek okuma öncesi manuel yedek kontrolü yapılacak",
  ];
  const stockUserValidationChecklist = [
    "20 satır gerçekten Vega'dan mı geldi?",
    "Stok kodu ürünle uyumlu mu?",
    "Ürün adı okunabilir mi?",
    "Kategori/marka alanı tahmin edilebilir mi?",
    "Alış fiyatı mantıklı mı?",
    "Satış fiyatı mantıklı mı?",
    "KDV alanı kontrol edildi mi?",
    "Boş veya şüpheli alan var mı?",
  ];
  const stockUserValidationSafetyNotes = [
    "Bu panel sadece manuel kontrol rehberidir.",
    "Kontrol sonucu kaydedilmez.",
    "Vega'ya veri yazılmaz.",
    "Yeni bağlantı başlatılmaz.",
    "Önizleme verisi geçici frontend state içinde kalır.",
  ];
  const readOnlyTransitionGateRows = [
    { requirement: "Manuel Vega yedeği kontrol edildi mi?", status: "Manuel kontrol gerekli" },
    { requirement: "Read-only kullanıcı yetkisi hazır mı?", status: "Bekliyor" },
    { requirement: "Yazma yetkisi kapalı mı?", status: "Manuel kontrol gerekli" },
    { requirement: "İlk okuma satır limiti belirlendi mi?", status: "Bekliyor" },
    { requirement: "Demo veri / gerçek veri ayrımı korunacak mı?", status: "Bu sürümde pasif" },
    { requirement: "Hata durumunda tekrar deneme baskısı engellenecek mi?", status: "Bu sürümde pasif" },
    { requirement: "İlk test sadece stok kartı okuma ile sınırlı mı?", status: "Bekliyor" },
    { requirement: "Cari, fiş, ürün mutasyonu kapalı mı?", status: "Bu sürümde pasif" },
  ];
  const technicalLockRows = [
    { label: "Gerçek bağlantı", value: "Kilitli" },
    { label: "SQL / ODBC", value: "Kilitli" },
    { label: "Vega DB okuma", value: "Kilitli" },
    { label: "Veri yazma", value: "Kapalı" },
    { label: "Query çalıştırma", value: "Kapalı" },
    { label: "Onay kaydı", value: "Yok" },
    { label: "Sonraki faz", value: "v1.20.0 read-only teknik hazırlık" },
  ];
  const technicalPreparationRows = [
    { label: "Teknik faz", value: connectionMetadata.technicalPhase === "v1.20-read-only-prep" ? "v1.20 read-only prep" : "Tanımlı değil" },
    { label: "Bağlantı kilidi", value: connectionMetadata.connectionLocked ? "Açık" : "Kapalı" },
    { label: "SQL çalıştırma", value: connectionMetadata.sqlExecutionEnabled ? "Açık" : "Kapalı" },
    { label: "ODBC", value: connectionMetadata.odbcEnabled ? "Açık" : "Kapalı" },
    { label: "DB okuma", value: connectionMetadata.databaseReadEnabled ? "Açık" : "Kapalı" },
    { label: "Satır limiti hazırlığı", value: connectionMetadata.maxRowsLimitPrepared ? "Hazır" : "Bekliyor" },
    { label: "Manuel onay", value: connectionMetadata.approvalRequired ? "Gerekli" : "Gerekli değil" },
  ];
  const rowLimitSafetyRows = [
    { label: "İlk satır limiti", value: connectionMetadata.maxRowsLimit || 20 },
    { label: "Timeout hazırlığı", value: connectionMetadata.timeoutMsPrepared ? "Hazır" : "Bekliyor" },
    { label: "Retry", value: connectionMetadata.retryEnabled ? "Açık" : "Kapalı" },
    { label: "Fail-closed", value: connectionMetadata.failClosedEnabled ? "Açık" : "Kapalı" },
    { label: "Hata baskısı koruması", value: connectionMetadata.errorPressureProtection ? "Açık" : "Kapalı" },
    {
      label: "Okuma kapsamı",
      value: connectionMetadata.stockReadScope === "stock-cards-only" ? "Sadece stok kartları" : "Tanımlı değil",
    },
  ];
  const timeoutConnectionSafetyRows = [
    { label: "Bağlantı denemesi", value: connectionMetadata.connectionAttemptEnabled ? "Açık" : "Kapalı" },
    { label: "Timeout süresi", value: `${connectionMetadata.timeoutMs || 3000} ms` },
    { label: "Timeout politikası", value: connectionMetadata.timeoutPolicyPrepared ? "Hazır" : "Bekliyor" },
    { label: "Güvenli hata mesajı", value: connectionMetadata.safeErrorMessageEnabled ? "Açık" : "Kapalı" },
    { label: "Ham hata gösterimi", value: connectionMetadata.rawErrorExposeEnabled ? "Açık" : "Kapalı" },
    { label: "Son bağlantı denemesi", value: connectionMetadata.lastConnectionAttempt || "Yok" },
  ];
  const manualApprovalLockRows = [
    { label: "Manuel onay", value: connectionMetadata.manualApprovalStatus === "required" ? "Gerekli" : "Bekliyor" },
    { label: "Onay kaydı", value: connectionMetadata.approvalRecordEnabled ? "Açık" : "Kapalı" },
    { label: "Kilit açma izni", value: connectionMetadata.connectionUnlockAllowed ? "Açık" : "Kapalı" },
    { label: "Kilit açma gerekçesi", value: connectionMetadata.unlockReasonRequired ? "Zorunlu" : "Zorunlu değil" },
    { label: "Operatör adı", value: connectionMetadata.operatorNameRequired ? "Zorunlu" : "Zorunlu değil" },
    { label: "Yedek kontrolü", value: connectionMetadata.backupCheckRequired ? "Zorunlu" : "Zorunlu değil" },
  ];
  const firstReadOnlyTestSteps = [
    "Manuel Vega yedeğinin alındığını kontrol et.",
    "Read-only kullanıcı yetkisinin hazır olduğunu doğrula.",
    "Bağlantı kilidinin açık olduğunu kontrol et.",
    "İlk test kapsamının sadece stok kartları olduğunu doğrula.",
    "Satır limitinin 20 olduğunu kontrol et.",
    "Retry’nin kapalı olduğunu kontrol et.",
    "Fail-closed davranışının açık olduğunu kontrol et.",
    "Ham hata mesajının gizli olduğunu kontrol et.",
    "Test sonucunu manuel olarak not al.",
  ];
  const operatorControlGuideItems = [
    "Testi yapan kişi adı manuel not alınmalı.",
    "Test tarihi manuel not alınmalı.",
    "Vega ekranı ve ERP ekranı karşılaştırılmalı.",
    "Beklenen sonuç ve görülen sonuç manuel yazılmalı.",
    "Hata varsa ekran görüntüsü alınmalı.",
    "Bu uygulama içinde hiçbir test notu kaydedilmez.",
  ];
  const finalTransitionSummary = [
    "Demo veri ayrımı yapıldı.",
    "Bağlantı hazırlığı pasif gösterildi.",
    "Sorgu taslağı çalıştırılmadan gösterildi.",
    "Güvenlik checklist'i eklendi.",
    "Geçiş kapısı ve onay matrisi eklendi.",
    "Gerçek bağlantı hâlâ kapalı.",
  ];
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredRows = useMemo(() => {
    if (!normalizedQuery) {
      return visibleRows;
    }

    return visibleRows.filter((row) =>
      [row.stockCode, row.STOKKODU, row.barcode, row.productName, row.MALINCINSI].some((value) =>
        String(value || "")
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedQuery),
      ),
    );
  }, [normalizedQuery, visibleRows]);
  const previewRows = useMemo(() => filteredRows.map((row) => buildPreviewRow(row, hasVegaRows)), [filteredRows, hasVegaRows]);

  return (
    <>
      <section className="page-title vega-stock-trial-title">
        <div>
          <p>Deneme Modu</p>
          <h1>Vega Stok Deneme</h1>
          <span>Bu ekran gerçek Vega bağlantısı açılmadan stok okuma modülünün hazırlık ve kontrol alanıdır.</span>
        </div>
      </section>

      <section className="vega-stock-trial-panel section-updated-highlight" id="vega-stock-trial-panel">
        <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
        <div className="vega-panel-group">
          <div className="vega-panel-group-header">
            <h2>Güvenli Deneme Özeti</h2>
            <p>Durum, veri kaynağı ve güvenli deneme sınırları tek bakışta gösterilir.</p>
          </div>

          <div className="vega-stock-safety-box">
            <ShieldCheck size={18} />
            <div>
              <strong>Güvenli Deneme Modu</strong>
              <span>Bu sürümde bağlantı kurulmaz, sorgu çalıştırılmaz, veri yazılmaz.</span>
            </div>
          </div>
          <div className="vega-stock-trial-header">
            <div>
              <h2>Stok Okuma Denemesi</h2>
              <p>Gerçek bağlantı açılmadan stok okuma hazırlığı ve demo veri kontrol alanıdır.</p>
            </div>
            <div className="vega-stock-status-list">
              <span className={`vega-stock-status ${visibleStatus}`}>{statusLabels[visibleStatus] || statusLabels.error}</span>
              {!hasVegaRows && <span className="vega-stock-status demo">Demo veri</span>}
              <span className="vega-stock-mode-chip">
                <ShieldCheck size={14} />
                Read-only
              </span>
              <span className="vega-stock-mode-chip">
                <Database size={14} />
                Veri yazılmaz
              </span>
            </div>
          </div>

          <div className="vega-data-source-panel">
            <div>
              <strong>Veri Kaynağı</strong>
              <span>{dataSourceMessage}</span>
              <small>Vega read-only bağlantısı ileride ayrı kontrollü sürümde açılacaktır.</small>
            </div>
            <em>{dataSourceLabel}</em>
          </div>

          <div className="vega-stock-warning">
            <AlertTriangle size={18} />
            <span>
              {stockState.message} {!hasVegaRows && "Gösterilen satırlar demo veridir; gerçek Vega stoğu değildir."}
            </span>
          </div>

          <div className="vega-readonly-preview-action">
            <div>
              <h3>Manuel Read-only Stok Denemesi</h3>
              <p>Bu işlem otomatik başlamaz; sadece kullanıcı bu butona bastığında 20 satırlık stok read-only önizleme denenir.</p>
            </div>
            <button type="button" onClick={handleManualStockTrial} disabled={isStockTrialLoading}>
              {isStockTrialLoading ? "Deneme çalışıyor..." : "Manuel read-only stok dene"}
            </button>
          </div>

          <div className="vega-readiness-panel">
            <div>
              <h2>Hazır Değil Kontrol Özeti</h2>
              <p>Eksik hazırlıkları gösterir; bağlantı açmaz, veri yazmaz.</p>
            </div>
            <div className="vega-readiness-grid">
              {readinessSummaryRows.map((row) => (
                <div className="vega-readiness-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="vega-panel-group">
          <div className="vega-panel-group-header">
            <h2>Read-only Bağlantı Hazırlığı</h2>
            <p>Sürücü, parametre ve bağlantı hazırlıkları pasif olarak özetlenir.</p>
          </div>

        <div className="vega-connection-panel">
          <div>
            <h2>Bağlantı Kontrolü</h2>
            <p>Read-only hazırlık durumunu gösterir; gerçek Vega bağlantısını açmaz.</p>
          </div>
          <div className="vega-connection-grid">
            {connectionCards.map((card) => (
              <div className="vega-connection-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-readonly-prep-panel">
          <div>
            <h2>Hazırlık Durumu</h2>
            <p>
              Read-only mod, sürücü, DB bilgisi ve stok sorgusu hazırlığı pasif olarak gösterilir.
            </p>
          </div>
          <div className="vega-readonly-prep-grid">
            {readOnlyPreparationRows.map((row) => (
              <div className="vega-readonly-prep-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-technical-prep-panel">
          <div>
            <h2>v1.20 Teknik Hazırlık Durumu</h2>
            <p>v1.20.0 sadece teknik hazırlık başlangıcıdır; bağlantı açmaz, sorgu çalıştırmaz, Vega verisi okumaz.</p>
          </div>
          <div className="vega-technical-prep-grid" aria-label="v1.20 teknik hazırlık durumu">
            {technicalPreparationRows.map((row) => (
              <div className="vega-technical-prep-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-row-limit-safety-panel">
          <div>
            <h2>Satır Limiti ve Hata Güvenliği</h2>
            <p>Bu panel sadece ilk read-only deneme güvenlik sınırlarını gösterir; bağlantı açmaz, sorgu çalıştırmaz, veri okumaz.</p>
          </div>
          <div className="vega-row-limit-safety-grid" aria-label="Satır limiti ve hata güvenliği">
            {rowLimitSafetyRows.map((row) => (
              <div className="vega-row-limit-safety-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-timeout-safety-panel">
          <div>
            <h2>Timeout ve Bağlantı Denemesi Güvenliği</h2>
            <p>Bu panel sadece bağlantı denemesi açılmadan önceki timeout ve hata mesajı güvenliğini gösterir; bağlantı açmaz, sorgu çalıştırmaz, veri okumaz.</p>
          </div>
          <div className="vega-timeout-safety-grid" aria-label="Timeout ve bağlantı denemesi güvenliği">
            {timeoutConnectionSafetyRows.map((row) => (
              <div className="vega-timeout-safety-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-manual-approval-panel">
          <div>
            <h2>Manuel Onay ve Bağlantı Kilidi</h2>
            <p>Bu panel sadece manuel onay ve bağlantı kilidi şartlarını gösterir; onay kaydetmez, kilit açmaz, bağlantı başlatmaz.</p>
          </div>
          <div className="vega-manual-approval-grid" aria-label="Manuel onay ve bağlantı kilidi">
            {manualApprovalLockRows.map((row) => (
              <div className="vega-manual-approval-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-connection-preview-panel">
          <div>
            <h2>Bağlantı Parametreleri Önizleme</h2>
            <p>
              Bu alan ileride kullanılacak Vega read-only bağlantı parametrelerinin sadece okunur önizlemesidir. Bu
              sürümde parametre girilmez, kaydedilmez ve bağlantı testi yapılmaz.
            </p>
          </div>
          <div className="vega-connection-preview-grid">
            {connectionPreviewRows.map((row) => (
              <div className="vega-connection-preview-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-driver-guide-panel">
          <div>
            <h2>ODBC / SQL Sürücü Gereksinim Rehberi</h2>
            <p>
              Bu alan ileride yapılacak Vega read-only bağlantısı için gereken sürücü ve erişim hazırlıklarını gösterir.
              Bu sürümde sürücü kurulmaz, bağlantı açılmaz ve sorgu çalıştırılmaz.
            </p>
          </div>
          <div className="vega-driver-guide-grid">
            {driverRequirementRows.map((row) => (
              <div className="vega-driver-guide-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-db-guide-panel">
          <div>
            <h2>Vega DB Yolu / Sunucu Bilgisi Rehberi</h2>
            <p>
              Bu alan ileride yapılacak read-only bağlantı için Vega veritabanı yolu veya sunucu bilgisinin nasıl kontrol
              edileceğini gösterir. Bu sürümde yol seçilmez, sunucu girilmez, bağlantı kurulmaz.
            </p>
          </div>
          <div className="vega-db-guide-grid">
            {databaseGuideRows.map((row) => (
              <div className="vega-db-guide-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className="vega-panel-group">
          <div className="vega-panel-group-header">
            <h2>Vega Bilgi / Sorgu Hazırlığı</h2>
            <p>Stok okuma taslağı ve kolon eşleştirme planı sadece önizleme olarak gösterilir.</p>
          </div>

        <div className="vega-stock-query-preview-panel">
          <div>
            <h2>Stok Sorgusu Taslak Önizleme</h2>
            <p>
              Bu alan ileride yapılacak read-only stok okuma sorgusunun taslak mantığını gösterir. Bu sürümde sorgu
              çalıştırılmaz, Vega verisi okunmaz ve kayıt oluşturulmaz.
            </p>
          </div>
          <div className="vega-stock-query-preview-grid">
            {stockQueryPreviewRows.map((row) => (
              <div className="vega-stock-query-preview-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <div className="vega-stock-query-field-list" aria-label="Taslak stok okuma alan listesi">
            {stockQueryDraftFields.map((field) => (
              <span key={field}>{field}</span>
            ))}
          </div>
        </div>

        <div className="vega-column-mapping-panel">
          <div>
            <h2>Kolon Eşleştirme Hazırlığı</h2>
            <p>Bu alan yalnızca ileride yapılacak read-only stok okuma eşleştirmesini gösterir. Vega'dan veri çekmez ve kayıt oluşturmaz.</p>
          </div>
          <div className="vega-column-mapping-grid" aria-label="Vega stok kolon eşleştirme hazırlığı">
            {columnMappings.map((mapping) => (
              <div className="vega-column-mapping-row" key={mapping.erpField}>
                <span>{mapping.vegaField}</span>
                <strong>{mapping.erpField}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-test-note">
          <strong>Test Notu</strong>
          <span>Demo stok görünümü, bağlantı durumu ve kolon eşleştirme hazırlığı kontrol edilir; veri çekilmez, veri yazılmaz, kayıt oluşturulmaz.</span>
        </div>

        <div className="vega-closing-note">
          <div>
            <strong>Hazırlık Kapanış Notu</strong>
            <span>
              Demo veri, veri kaynağı, bağlantı güvenliği ve kolon eşleştirme kontrolleri gerçek bağlantı açılmadan
              hazırlanır. Gerçek Vega read-only bağlantısı ayrı ve kontrollü bir sürümde açılacaktır.
            </span>
          </div>
          <p>
            Sonraki Faz: <strong>v1.19.x · Vega read-only bağlantı hazırlığı</strong>
          </p>
        </div>
        </div>

        <div className="vega-panel-group">
          <div className="vega-panel-group-header">
            <h2>Güvenlik Checklist'i</h2>
            <p>Gerçek bağlantı öncesi şartlar pasif liste olarak korunur; onay kaydı yapılmaz.</p>
          </div>

          <div className="vega-transition-gate-panel">
            <div>
              <h2>Read-only Geçiş Kapısı</h2>
              <p>Bu geçiş kapısı sadece rehberdir; onay kaydetmez, bağlantı açmaz, sorgu çalıştırmaz.</p>
            </div>
            <div className="vega-transition-gate-grid" aria-label="Read-only geçiş kapısı onay matrisi">
              {readOnlyTransitionGateRows.map((row) => (
                <div className="vega-transition-gate-row" key={row.requirement}>
                  <strong>{row.requirement}</strong>
                  <span>{row.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="vega-technical-lock-panel">
            <div>
              <h2>Teknik Hazırlık Kilidi</h2>
              <p>Bu kilit sadece bilgilendirme amaçlıdır; bağlantı açmaz, sorgu çalıştırmaz, ayar kaydetmez.</p>
            </div>
            <div className="vega-technical-lock-grid" aria-label="Vega read-only teknik hazırlık kilidi">
              {technicalLockRows.map((row) => (
                <div className="vega-technical-lock-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="vega-final-summary-panel">
            <div>
              <h2>v1.19.x Hazırlık Fazı Son Özeti</h2>
              <p>v1.20.0 öncesi pasif güvenlik hazırlığı kapanış özeti.</p>
            </div>
            <div className="vega-final-summary-grid" aria-label="v1.19.x hazırlık fazı son özeti">
              {finalTransitionSummary.map((item) => (
                <div className="vega-final-summary-item" key={item}>
                  <span aria-hidden="true">•</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="vega-security-checklist-panel">
            <div>
              <h2>Read-only Güvenlik Checklist'i</h2>
              <p>Bu sürümde bağlantı kurulmaz, sorgu çalıştırılmaz ve herhangi bir onay kaydedilmez.</p>
            </div>
          <div className="vega-security-checklist-grid" aria-label="Read-only güvenlik checklist'i">
            {readOnlySecurityChecklist.map((item) => (
              <div className="vega-security-checklist-item" key={item}>
                <span aria-hidden="true">•</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

          <div className="vega-first-test-procedure-panel">
            <div>
              <h2>İlk Read-only Test Prosedürü</h2>
              <p>Bu panel sadece manuel test adımlarını gösterir; bağlantı açmaz, sorgu çalıştırmaz, veri okumaz.</p>
            </div>
            <ol className="vega-first-test-procedure-list" aria-label="İlk read-only test prosedürü">
              {firstReadOnlyTestSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="vega-operator-guide-panel">
            <div>
              <h2>Operatör Kontrol Rehberi</h2>
              <p>Bu rehber sadece manuel test prosedürüdür; bağlantı açmaz, veri okumaz, test notu kaydetmez.</p>
            </div>
            <div className="vega-operator-guide-list" aria-label="Operatör kontrol rehberi">
              {operatorControlGuideItems.map((item) => (
                <div className="vega-operator-guide-item" key={item}>
                  <span aria-hidden="true">•</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="vega-panel-group section-updated-highlight" id="vega-top-100-stock-out-preview">
          <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
          <div className="vega-panel-group-header">
            <h2>Vega Top 100 Stok Çıkışı</h2>
            <p>Stok çıkış hareketleri için read-only önizleme hazırlığıdır; hareket tablosu ve alanlar doğrulanmadan çalıştırılmaz.</p>
          </div>

          <div className="vega-stock-safety-box">
            <ShieldCheck size={18} />
            <div>
              <strong>Güvenlik Kilidi</strong>
              <span>Stok çıkış hareket tablosu ve çıkış miktarı alanı doğrulanmadan gerçek sorgu eklenmedi; bağlantı açılmaz, veri okunmaz ve kayıt oluşturulmaz.</span>
            </div>
          </div>

          <div className="vega-connection-grid" aria-label="Top 100 stok çıkışı durum kartları">
            {topStockOutStatusCards.map((card) => (
              <div className="vega-connection-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="vega-security-checklist-panel section-updated-highlight" id="vega-stock-movement-field-discovery">
            <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
            <div>
              <h2>Stok Hareket Alanları Keşif Hazırlığı</h2>
              <p>Top 100 stok çıkışı sorgusuna geçmeden önce yalnızca tablo/kolon doğrulama hazırlığı yapılır; canlı hareket verisi okunmaz.</p>
            </div>

            <div className="vega-connection-grid" aria-label="Stok hareket alanları keşif durum kartları">
              {stockMovementDiscoveryStatusCards.map((card) => (
                <div className="vega-connection-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                </div>
              ))}
            </div>

            <div className="vega-readiness-panel">
              <div>
                <h2>Doğrulanacak Alanlar</h2>
                <p>Bu liste gerçek tablo veya kolon adı değildir; sadece manuel doğrulama başlıklarını gösterir.</p>
              </div>
              <div className="vega-security-checklist-grid" aria-label="Doğrulanacak stok hareket alanları">
                {stockMovementDiscoveryFields.map((item) => (
                  <div className="vega-security-checklist-item" key={item}>
                    <span aria-hidden="true">•</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="vega-readiness-panel">
              <div>
                <h2>Alanlar Doğrulanmadan Çalışmayacaklar</h2>
                <p>Bu koşullar tamamlanmadan Top 100 önizleme kilitli kalır.</p>
              </div>
              <div className="vega-security-checklist-grid" aria-label="Alanlar doğrulanmadan çalışmayacaklar">
                {stockMovementDiscoveryLocks.map((item) => (
                  <div className="vega-security-checklist-item" key={item}>
                    <span aria-hidden="true">•</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="vega-stock-safety-box">
              <ShieldCheck size={18} />
              <div>
                <strong>Keşif Güvenlik Notu</strong>
                <span>{stockMovementDiscoverySafetyNotes.join(" ")}</span>
              </div>
            </div>
          </div>

          <div className="vega-readonly-preview-action">
            <div>
              <h3>Top 100 Stok Çıkışını Read-only Getir</h3>
              <p>Bu buton alan doğrulaması tamamlanana kadar kilitlidir; sayfa açılışında otomatik bağlantı veya sorgu çalışmaz.</p>
            </div>
            <button type="button" disabled>
              Top 100 Stok Çıkışını Read-only Getir
            </button>
          </div>

          <div className="vega-readiness-panel">
            <div>
              <h2>Tablo ve Alan Doğrulama Durumu</h2>
              <p>Canlı tablo/kolon adı raporlanmadan yalnızca doğrulama sonucu gösterilir.</p>
            </div>
            <div className="vega-readiness-grid">
              {topStockOutValidationRows.map((row) => (
                <div className="vega-readiness-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="vega-security-checklist-panel">
            <div>
              <h2>Güvenlik Notu</h2>
              <p>Bu kutu Top 100 stok çıkışı önizlemesinin kapalı sınırlarını gösterir; işlem başlatmaz.</p>
            </div>
            <div className="vega-security-checklist-grid" aria-label="Top 100 stok çıkışı güvenlik notları">
              {topStockOutSafetyNotes.map((item) => (
                <div className="vega-security-checklist-item" key={item}>
                  <span aria-hidden="true">•</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="vega-stock-table-wrap">
            <table className="vega-stock-table">
              <thead>
                <tr>
                  {topStockOutPreviewHeaders.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={topStockOutPreviewHeaders.length}>
                    Stok çıkış hareket tablosu ve çıkış miktarı alanı doğrulanmadan çalıştırılmaz; veri gösterilmez.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="vega-panel-group">
          <div className="vega-panel-group-header">
            <h2>Stok Önizleme Tablosu</h2>
            <p>Manuel read-only deneme sonrası gelen stok satırları iş diliyle okunur; kesin olmayan alanlar doğrulanacak etiketiyle kalır.</p>
          </div>

        <label className="vega-stock-search">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Stok kodu, barkod veya ürün adı ara"
          />
        </label>

        <div className="vega-security-checklist-panel section-updated-highlight" id="vega-stock-user-validation-panel">
          <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
          <div>
            <h2>Kullanıcı Doğrulama Paneli</h2>
            <p>20 satırlık stok önizlemesini Vega ekranıyla manuel karşılaştırmak için pasif kontrol rehberidir.</p>
          </div>
          <div className="vega-security-checklist-grid" aria-label="Stok önizleme kullanıcı doğrulama kontrol maddeleri">
            {stockUserValidationChecklist.map((item) => (
              <div className="vega-security-checklist-item" key={item}>
                <span aria-hidden="true">•</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
          <div className="vega-stock-safety-box">
            <ShieldCheck size={18} />
            <div>
              <strong>Güvenlik Notu</strong>
              <span>{stockUserValidationSafetyNotes.join(" ")}</span>
            </div>
          </div>
        </div>

        <div className="vega-security-checklist-panel">
          <div>
            <h2>Bu Tablo Nasıl Okunur?</h2>
            <p>Bu kutu yalnızca okuma rehberidir; yeni bağlantı, kayıt veya export başlatmaz.</p>
          </div>
          <div className="vega-security-checklist-grid" aria-label="Stok önizleme tablosu okuma rehberi">
            {stockPreviewReadGuide.map((item) => (
              <div className="vega-security-checklist-item" key={item}>
                <span aria-hidden="true">•</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-security-checklist-panel">
          <div>
            <h2>Kullanıcı Kontrol Sırası</h2>
            <p>Bu sıra kullanıcı değerlendirmesini kolaylaştırır; karar veya not kaydetmez.</p>
          </div>
          <div className="vega-security-checklist-grid" aria-label="Stok önizleme kullanıcı kontrol sırası">
            {stockPreviewControlSequence.map((item) => (
              <div className="vega-security-checklist-item" key={item}>
                <span aria-hidden="true">•</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-stock-table-wrap">
          <table className="vega-stock-table">
            <thead>
              <tr>
                <th>Durum</th>
                <th>Stok Kodu</th>
                <th>Ürün Adı</th>
                <th>Barkod</th>
                <th>Marka</th>
                <th>Kategori</th>
                <th>Beden</th>
                <th>Renk</th>
                <th>Alış Fiyatı</th>
                <th>Satış Fiyatı</th>
                <th>KDV</th>
                <th>Kontrol Notu</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, index) => (
                <tr key={`${row.stockCode}-${row.productName}-${index}`}>
                  <td>
                    <span className={`vega-stock-row-source ${hasVegaRows ? "ready" : "demo"}`}>
                      {hasVegaRows ? "Vega read-only" : "Demo veri"}
                    </span>
                  </td>
                  <td>{row.stockCode}</td>
                  <td>{row.productName}</td>
                  <td>{row.barcode}</td>
                  <td>{row.brand}</td>
                  <td>{row.category}</td>
                  <td>{row.size}</td>
                  <td>{row.color}</td>
                  <td>{row.purchasePrice}</td>
                  <td>{row.salePrice}</td>
                  <td>{row.vat}</td>
                  <td>{row.controlNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && <p className="vega-stock-empty">Arama kriterine uygun stok satırı görünmüyor.</p>}
        </div>
      </section>
    </>
  );
}
