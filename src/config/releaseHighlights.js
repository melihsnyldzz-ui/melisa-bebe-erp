export const currentReleaseVersion = "v1.16.3";

export const currentReleaseTitle = "Dashboard dövizli satış özetini kompaktlaştırma ve döviz veri hazırlığı";

export const updatedSectionIds = ["latest-version-history", "project-maturity", "live-test-center"];

export const releaseHighlightItems = [
  "Dövizli satış kartları daha kompakt hale getirildi",
  "USD ve EUR boş durumları 0 değer ve kısa notla sadeleştirildi",
  "Gün Sonu Raporu döviz satırları daha okunur hale getirildi",
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
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "dashboard-daily-operation", label: "Bugünkü Operasyon Özeti'ne git" },
      { id: "dashboard-currency-summary", label: "Dövizli Satış Özeti'ne git" },
      { id: "dashboard-commerce-insights", label: "Ticari Grafik Özeti'ne git" },
    ],
    updatedSectionIds: ["dashboard-daily-operation", "dashboard-currency-summary", "dashboard-commerce-insights"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
