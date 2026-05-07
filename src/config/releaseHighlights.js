export const currentReleaseVersion = "v1.32.0";

export const currentReleaseTitle = "Cari ve Alacak Riskleri Yönetici Merkezi";

export const updatedSectionIds = ["latest-version-history", "live-test-center", "system-workflow-model", "current-account-risk-status"];

export const releaseHighlightItems = [
  "Cari, alacak ve tahsilat riskleri yönetici takibi için daha görünür hale getirildi.",
  "Vade, gecikme, alacak önceliği ve müşteri risk sınıfları pasif/mock modda toparlandı.",
  "Gerçek Vega bağlantısı, DB okuma, query, tahsilat kaydı, ödeme kaydı veya veri yazma eklenmeden güvenli hazırlık korundu.",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "current-account-risk-status", label: "Cari ve Alacak Durumu'na git" },
  { id: "live-test-center", label: "Canlı Test Merkezi'ne git" },
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
      { id: "dashboard-daily-operation", label: "Bugünkü Operasyon Özeti'ne git" },
      { id: "dashboard-currency-summary", label: "Dövizli Ticaret Özeti'ne git" },
      { id: "dashboard-commerce-insights", label: "Ticari Grafik Özeti'ne git" },
    ],
    updatedSectionIds: ["dashboard-owner-view", "dashboard-daily-operation"],
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
      { id: "vega-import-preview-panel", label: "Vega Import Önizleme alanına git" },
      { id: "vega-import-quality-note", label: "Kalite Kontrol Notu'na git" },
      { id: "vega-readonly-roadmap", label: "Read-only Yol Haritası'na git" },
    ],
    updatedSectionIds: ["vega-import-preview-panel", "vega-import-quality-note", "vega-readonly-roadmap"],
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
