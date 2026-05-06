export const currentReleaseVersion = "v1.15.1";

export const currentReleaseTitle = "Dashboard test kartlarından sayfalara geçiş ve canlı hazırlık aksiyon merkezi";

export const updatedSectionIds = ["latest-version-history", "project-maturity", "live-test-center"];

export const releaseHighlightItems = [
  "Dashboard test kartları tıklanabilir hale getirildi",
  "Canlı Hazırlık Aksiyon Merkezi eklendi",
  "Hızlı Test Notu ile güvenli kullanım uyarıları görünür hale getirildi",
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
      "Dashboard test kartları tıklanabilir hale getirildi",
      "Canlı Hazırlık Aksiyon Merkezi eklendi",
      "Hızlı Test Notu ile güvenli kullanım uyarıları görünür hale getirildi",
    ],
    releaseJumpLinks: [
      { id: "dashboard-live-summary", label: "Canlıya Hazırlık Özeti'ne git" },
      { id: "dashboard-test-shortcuts", label: "Hızlı Test Kısayolları'na git" },
      { id: "dashboard-action-center", label: "Canlı Hazırlık Aksiyon Merkezi'ne git" },
    ],
    updatedSectionIds: ["dashboard-live-summary", "dashboard-test-shortcuts", "dashboard-action-center"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
