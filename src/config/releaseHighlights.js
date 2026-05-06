export const currentReleaseVersion = "v1.16.4";

export const currentReleaseTitle = "Dövizli ticaret özeti: alış/satış/cari kırılımına genişletme";

export const updatedSectionIds = ["latest-version-history", "project-maturity", "live-test-center"];

export const releaseHighlightItems = [
  "Dövizli satış özeti alış ve cari kırılımıyla genişletildi",
  "TL / USD / EUR satış, alış ve cari bilgileri Dashboard’da görünür hale getirildi",
  "Kur çevirmeden para birimi bazlı ticaret takibi hazırlandı",
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
      { id: "dashboard-currency-summary", label: "Dövizli Ticaret Özeti'ne git" },
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
