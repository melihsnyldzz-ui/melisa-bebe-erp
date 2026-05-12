export const APP_VERSION = "v2.7.0";
export const APP_STAGE = "Şirket Ortamı İlk Gerçek Test Checklisti";

export const releaseHighlights = [
  "ERP + el terminali entegrasyon test planı görünür hale getirildi.",
  "Mock barkod ekranına kalite kontrol göstergeleri, uyarılar ve operatör notları eklendi.",
  "Şirket ortamında yapılacak ilk gerçek read-only stok testi için pasif checklist hazırlandı.",
  "Bu sürüm gerçek Vega/SQL bağlantısı, gerçek stok araması, veri yazma, import/export/sync, localStorage veya credential eklemez.",
];

export const versionHistory = [
  {
    version: "v2.7.0",
    title: "Şirket Ortamı İlk Gerçek Test Checklisti",
    note: "Şirkette yapılacak ilk gerçek read-only stok testi, terminal ayrı testi ve birlikte teste geçme şartlarını pasif checklist olarak gösterir.",
  },
  {
    version: "v2.6.0",
    title: "Terminal Barkod Kalite Kontrol Paketi",
    note: "Mock barkod ekranında kalite durumu, uyarı mesajları ve operatör notunu gösterir.",
  },
  {
    version: "v2.5.0",
    title: "ERP + El Terminali Entegrasyon Test Planı",
    note: "ERP stok read-only ekranı ile el terminali mock barkod testinin birlikte nasıl test edileceğini planlar.",
  },
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
