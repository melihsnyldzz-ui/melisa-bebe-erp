export const APP_VERSION = "v2.3.0";
export const APP_STAGE = "Read-only Stok Pilot Öncesi Yerel Hazırlık Kontrolü";

export const releaseHighlights = [
  "Ev ortamında SQL/Vega bağlantısı kurmadan pilot öncesi yerel hazırlık kontrolü eklendi.",
  ".env.local, credential ve connection string bilgilerinin ekranda veya repoda gösterilmemesi vurgulandı.",
  "Build, git temizliği ve güvenli pilot sınırları pasif kontrol kartlarıyla görünür hale getirildi.",
  "Şirket ortamında yalnızca read-only SQL kullanıcısı ve manuel, en fazla 20 satırlık ilk kontrol yaklaşımı not edildi.",
];

export const versionHistory = [
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
