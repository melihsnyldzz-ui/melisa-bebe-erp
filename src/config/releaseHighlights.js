export const currentReleaseVersion = "v1.14.3";

export const currentReleaseTitle = "Yenilik merkezi panelini tüm sayfalara yaymaya hazırlık";

export const updatedSectionIds = ["latest-version-history", "project-maturity", "live-test-center"];

export const releaseHighlightItems = [
  "Bu Sürümde Yenilenen Alanlar paneli ortak bileşene taşındı",
  "Sayfa bazlı yenilik yapısı için merkezi hazırlık eklendi",
  "Ayarlar sayfasındaki mevcut görünüm korunarak tekrar kullanılabilir yapı hazırlandı",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "project-maturity", label: "Proje Olgunluk Bilgisi'ne git" },
  { id: "live-test-center", label: "Canlı Test Merkezi'ne git" },
];

export const releaseHighlightsByPage = {
  settings: {
    updatedSectionIds,
    releaseHighlightItems,
    releaseJumpLinks,
  },
};
