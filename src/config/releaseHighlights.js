export const currentReleaseVersion = "v1.14.6";

export const currentReleaseTitle = "Sol üst sürüm rozetini kısaltma ve okunabilirlik iyileştirmesi";

export const updatedSectionIds = ["latest-version-history", "project-maturity", "live-test-center"];

export const releaseHighlightItems = [
  "Sol üst sürüm rozeti daha kompakt hale getirildi",
  "Tam sürüm açıklaması erişilebilir bilgi olarak korundu",
  "Sidebar görünümü daha sade ve okunaklı hale getirildi",
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
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
