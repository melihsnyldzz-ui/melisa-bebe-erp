export const currentReleaseVersion = "v1.15.0";

export const currentReleaseTitle = "ERP hızlandırma paketi: ana sayfa canlı hazırlık özeti ve hızlı test kısayolları";

export const updatedSectionIds = ["latest-version-history", "project-maturity", "live-test-center"];

export const releaseHighlightItems = [
  "Ana sayfaya canlıya hazırlık özeti eklendi",
  "Hızlı test kısayolları görünür hale getirildi",
  "Bugün test edilecek öncelikler Dashboard'a eklendi",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "project-maturity", label: "Proje Olgunluk Bilgisi'ne git" },
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
    releaseHighlightItems: [
      "Ana sayfaya canlıya hazırlık özeti eklendi",
      "Hızlı test kısayolları eklendi",
      "Bugün test edilecek öncelikler görünür hale getirildi",
    ],
    releaseJumpLinks: [
      { id: "dashboard-live-summary", label: "Canlıya Hazırlık Özeti'ne git" },
      { id: "dashboard-test-shortcuts", label: "Hızlı Test Kısayolları'na git" },
    ],
    updatedSectionIds: ["dashboard-live-summary", "dashboard-test-shortcuts"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
