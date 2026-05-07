export const currentReleaseVersion = "v1.35.0";

export const currentReleaseTitle = "Canlı Kullanım Öncesi Operasyon Test Merkezi";

export const updatedSectionIds = ["latest-version-history", "system-workflow-model", "prelive-operation-test-status"];

export const releaseHighlightItems = [
  "Canlı kullanım öncesi personel, patron, saha ve güvenlik testleri tek merkezde toparlandı.",
  "Dashboard, raporlama, el terminali, cari, stok ve Vega hazırlık modülleri için pasif test senaryoları görünür hale getirildi.",
  "Gerçek Vega bağlantısı, DB okuma, query, kayıt oluşturma, cihaz bağlantısı veya veri yazma eklenmeden güvenli hazırlık korundu.",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "prelive-operation-test-status", label: "Canlı Öncesi Operasyon Test Durumu'na git" },
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
      { id: "dashboard-prelive-operation-test-center", label: "Canlı Öncesi Test Merkezi'ne git" },
      { id: "dashboard-reporting-decision-center", label: "Raporlama ve Yönetici Karar Merkezi'ne git" },
      { id: "dashboard-commerce-profitability-center", label: "Alış Satış ve Kârlılık Merkezi'ne git" },
      { id: "dashboard-daily-operation", label: "Bugünkü Operasyon Özeti'ne git" },
      { id: "dashboard-currency-summary", label: "Dövizli Ticaret Özeti'ne git" },
      { id: "dashboard-commerce-insights", label: "Ticari Grafik Özeti'ne git" },
    ],
    updatedSectionIds: ["dashboard-owner-view", "dashboard-prelive-operation-test-center", "dashboard-daily-operation"],
  },
  reports: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "reports-prelive-test-center", label: "Canlı Öncesi Test Merkezi'ne git" },
      { id: "reports-prelive-scenarios", label: "Test Senaryoları'na git" },
      { id: "reports-staff-trial-plan", label: "Personel Deneme Planı'na git" },
      { id: "reports-prelive-security-lock", label: "Test Güvenlik Kilidi'ne git" },
    ],
    updatedSectionIds: ["reports-prelive-test-center", "reports-prelive-scenarios", "reports-staff-trial-plan", "reports-prelive-security-lock"],
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
