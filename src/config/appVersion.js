export const APP_VERSION = "v2.4.0";
export const APP_STAGE = "El Terminali Mock Barkod Test Ekranı";

export const releaseHighlights = [
  "El terminali ve Honeywell benzeri barkod okutma davranışı için mock test alanı eklendi.",
  "Barkod string olarak tutulur; leading zero korunur, sonda gelen boşluk/enter/suffix temizliği görünür hale gelir.",
  "Aynı barkodun hızlı tekrar okutulması için duplicate guard sonucu geçici ekranda gösterilir.",
  "Bu sürüm gerçek Vega/SQL bağlantısı, stok verisi okuma, dosya üretimi, localStorage veya veri yazma eklemez.",
];

export const versionHistory = [
  {
    version: "v2.4.0",
    title: "El Terminali Mock Barkod Test Ekranı",
    note: "Gerçek Vega/SQL bağlantısı olmadan barkod yakalama, normalize etme, leading zero ve duplicate guard davranışını mock ekranda gösterir.",
  },
  {
    version: "v2.3.0",
    title: "Read-only Stok Pilot Öncesi Yerel Hazırlık Kontrolü",
    note: "SQL/Vega bağlantısı denemeden, ev ortamında güvenli hazırlık kontrolünü görünür kılar.",
  },
  {
    version: "v2.2.0",
    title: "Stok Read-only Pilot Ekranı Görsel Sadeleştirme ve Kullanıcı Odaklama",
    note: "Pilot ekranının ilk bakışta daha anlaşılır olması için sadeleştirme hattı.",
  },
];
