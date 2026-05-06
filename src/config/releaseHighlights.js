export const currentReleaseVersion = "v1.27.3";

export const currentReleaseTitle = "Read-only öncesi saha doğrulama özeti sadeleştirme";

export const updatedSectionIds = ["latest-version-history", "live-test-center"];

export const releaseHighlightItems = [
  "Read-only öncesi saha doğrulama özeti sadeleştirildi",
  "Personelin kontrol edeceği yedek, read-only kullanıcı ve 20 satır sınırı daha net gösterildi",
  "Gerçek bağlantı, query, DB okuma, import ve veri yazma eklenmeden güvenli hazırlık korundu",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
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
      { id: "dashboard-daily-operation", label: "Bugünkü Operasyon Özeti'ne git" },
      { id: "dashboard-currency-summary", label: "Dövizli Ticaret Özeti'ne git" },
      { id: "dashboard-commerce-insights", label: "Ticari Grafik Özeti'ne git" },
    ],
    updatedSectionIds: [],
  },
  vegaStockTrial: {
    releaseHighlightItems,
    releaseJumpLinks: [{ id: "vega-stock-trial-panel", label: "Vega Stok Deneme alanına git" }],
    updatedSectionIds: ["vega-stock-trial-panel"],
  },
  vegaImportPreview: {
    releaseHighlightItems,
    releaseJumpLinks: [{ id: "vega-import-preview-panel", label: "Vega Import Önizleme alanına git" }],
    updatedSectionIds: ["vega-import-preview-panel"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
