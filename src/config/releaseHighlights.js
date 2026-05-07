export const currentReleaseVersion = "v1.41.0";

export const currentReleaseTitle = "Read-only Bağlantı Altyapısı Pasif Teknik İskeleti";

export const updatedSectionIds = ["latest-version-history", "system-workflow-model", "readonly-connection-skeleton-status"];

export const releaseHighlightItems = [
  "İlk gerçek read-only bağlantı öncesi bağlantı altyapısının kapalı ve pasif teknik iskeleti hazırlandı.",
  "Bağlantı modu, güvenlik kilitleri, ilk kapsam, timeout ve hata politikası gerçek bağlantı açılmadan görünür hale getirildi.",
  "Gerçek Vega bağlantısı, SQL/ODBC, DB okuma, query, connection test, API veya veri yazma eklenmeden güvenli teknik hazırlık korundu.",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "readonly-connection-skeleton-status", label: "Read-only Altyapı Durumu'na git" },
  { id: "system-workflow-model", label: "Çalışma Modeli'ne git" },
];

export const releaseVisibilityChecklist = [
  "Üstte “Bu Sürümde Yenilenen Alanlar” paneli görünüyor mu?",
  "Hızlı geçiş linkleri ilgili bölüme götürüyor mu?",
  "YENİ etiketi güncel sürüm numarasını gösteriyor mu?",
  "Vurgulanan bölümlerin kenarlığı/arka planı ayırt ediliyor mu?",
];

export const releaseHighlightsByPage = {
  dashboard: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "dashboard-owner-view", label: "Patron Bakışı'na git" },
      { id: "dashboard-readonly-connection-skeleton-summary", label: "Read-only Altyapı Özeti'ne git" },
      { id: "dashboard-readonly-final-security-summary", label: "Read-only Final Güvenlik Özeti'ne git" },
      { id: "dashboard-readonly-final-decision-summary", label: "Read-only Son Karar Özeti'ne git" },
      { id: "dashboard-readonly-first-trial-summary", label: "İlk Deneme Planı Özeti'ne git" },
      { id: "dashboard-vega-technical-gate-summary", label: "Vega Teknik Ön Kapı Özeti'ne git" },
      { id: "dashboard-module-maturity-score-center", label: "Modül Olgunluk Skor Merkezi'ne git" },
      { id: "dashboard-prelive-operation-test-center", label: "Canlı Öncesi Test Merkezi'ne git" },
      { id: "dashboard-reporting-decision-center", label: "Raporlama ve Yönetici Karar Merkezi'ne git" },
      { id: "dashboard-commerce-profitability-center", label: "Alış Satış ve Kârlılık Merkezi'ne git" },
      { id: "dashboard-daily-operation", label: "Bugünkü Operasyon Özeti'ne git" },
      { id: "dashboard-currency-summary", label: "Dövizli Ticaret Özeti'ne git" },
      { id: "dashboard-commerce-insights", label: "Ticari Grafik Özeti'ne git" },
    ],
    updatedSectionIds: ["dashboard-owner-view", "dashboard-readonly-connection-skeleton-summary", "dashboard-daily-operation"],
  },
  reports: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "reports-module-maturity-center", label: "Modül Olgunluk Skor Merkezi'ne git" },
      { id: "reports-module-maturity-table", label: "Modül Bazlı Olgunluk Tablosu'na git" },
      { id: "reports-go-live-barometer", label: "Canlıya Geçiş Barometresi'ne git" },
      { id: "reports-closed-areas", label: "Kapalı ve Yasaklı Alanlar'a git" },
      { id: "reports-prelive-test-center", label: "Canlı Öncesi Test Merkezi'ne git" },
    ],
    updatedSectionIds: ["reports-module-maturity-center", "reports-module-maturity-table", "reports-go-live-barometer", "reports-closed-areas"],
  },
  customers: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "current-account-risk-center", label: "Cari Risk Merkezi'ne git" },
      { id: "current-account-risk-classes", label: "Risk Sınıfları'na git" },
      { id: "receivable-priority-matrix", label: "Alacak Öncelik Matrisi'ne git" },
      { id: "collection-preparation-guide", label: "Tahsilat Hazırlık Rehberi'ne git" },
    ],
    updatedSectionIds: ["current-account-risk-center", "current-account-risk-classes", "receivable-priority-matrix", "collection-preparation-guide"],
  },
  vegaStockTrial: {
    releaseHighlightItems,
    releaseJumpLinks: [{ id: "vega-stock-trial-panel", label: "Vega Stok Deneme alanına git" }],
    updatedSectionIds: ["vega-stock-trial-panel"],
  },
  vegaImportPreview: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "vega-readonly-connection-skeleton", label: "Pasif Teknik İskelet'e git" },
      { id: "vega-technical-infrastructure-locks", label: "Teknik Altyapı Kilitleri'ne git" },
      { id: "vega-first-connection-scope-limit", label: "İlk Bağlantı Kapsam Sınırı'na git" },
      { id: "vega-readonly-final-security-closure", label: "Final Güvenlik Kapanışı'na git" },
      { id: "vega-closed-security-locks", label: "Kapatılan Kilitler'e git" },
      { id: "vega-not-to-do-list", label: "Yapılmayacak İşlemler'e git" },
      { id: "vega-next-small-phase-boundary", label: "Sonraki Küçük Faz Sınırı'na git" },
      { id: "vega-readonly-final-decision-center", label: "Son Karar Merkezi'ne git" },
      { id: "vega-start-stop-decision-logic", label: "Başla / Başlama Mantığı'na git" },
      { id: "vega-final-decision-matrix", label: "Son Karar Matrisi'ne git" },
      { id: "vega-final-security-lock", label: "Son Güvenlik Kilidi'ne git" },
      { id: "vega-readonly-first-trial-plan", label: "İlk Deneme Planı'na git" },
      { id: "vega-first-trial-timeline", label: "Zaman Çizelgesi'ne git" },
      { id: "vega-rollback-procedure", label: "Rollback Prosedürü'ne git" },
      { id: "vega-post-test-template", label: "Değerlendirme Şablonu'na git" },
      { id: "vega-readonly-technical-gate-center", label: "Teknik Ön Kapı Merkezi'ne git" },
      { id: "vega-readonly-required-conditions", label: "Zorunlu Şartlar'a git" },
      { id: "vega-technical-lock-matrix", label: "Teknik Kilit Matrisi'ne git" },
      { id: "vega-first-readonly-procedure", label: "İlk Deneme Prosedürü'ne git" },
      { id: "vega-import-preview-panel", label: "Vega Import Önizleme alanına git" },
      { id: "vega-import-quality-note", label: "Kalite Kontrol Notu'na git" },
      { id: "vega-readonly-roadmap", label: "Read-only Yol Haritası'na git" },
    ],
    updatedSectionIds: ["vega-readonly-connection-skeleton", "vega-technical-infrastructure-locks", "vega-first-connection-scope-limit"],
  },

  warehouseTerminal: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "warehouse-barcode-operation-center", label: "Operasyon Merkezi'ne git" },
      { id: "warehouse-stock-barcode-quality-center", label: "Kalite Kontrol Merkezi'ne git" },
      { id: "warehouse-risk-priority-matrix", label: "Risk Öncelik Matrisi'ne git" },
      { id: "warehouse-barcode-risk-panel", label: "Barkod Riskleri'ne git" },
    ],
    updatedSectionIds: ["warehouse-barcode-operation-center", "warehouse-stock-barcode-quality-center", "warehouse-risk-priority-matrix", "warehouse-barcode-risk-panel"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
