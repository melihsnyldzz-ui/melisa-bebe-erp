export const APP_VERSION = "v3.1.0";
export const APP_STAGE = "Pilot Sonrası Hata ve Geri Bildirim Planı";

export const releaseHighlights = [
  "Terminal ve ERP pilot yol haritası dört güvenli adımda görünür hale getirildi.",
  "Mock kullanım iyileştirme, barkoddan stok köprüsü tasarımı, pilot başlatma kapısı ve pilot sonrası geri bildirim planı eklendi.",
  "Şirket ortamı test checklisti, barkod kalite kontrolü ve ERP + el terminali test planı korunur.",
  "Bu sürüm gerçek Vega/SQL bağlantısı, gerçek stok araması, API endpoint, veri yazma, import/export/sync, localStorage veya credential eklemez.",
];

export const versionHistory = [
  {
    version: "v3.1.0",
    title: "Pilot Sonrası Hata ve Geri Bildirim Planı",
    note: "Mock testten şirket pilotuna geçişi ve pilot sonrası hata/geri bildirim gündemini pasif yol haritası olarak gösterir.",
  },
  {
    version: "v3.0.0",
    title: "Şirket Pilot Başlatma Kapısı",
    note: "Pilotun yalnızca tüm read-only ve terminal kalite şartları sağlanırsa başlaması gerektiğini netleştirir.",
  },
  {
    version: "v2.9.0",
    title: "Barkoddan Stok Arama Köprüsü Pasif Tasarım",
    note: "Barkod normalize sonucunun ileride read-only stok arama anahtarı olacağı pasif tasarımı gösterir.",
  },
  {
    version: "v2.8.0",
    title: "Terminal Mock Test Kullanım İyileştirme",
    note: "Operatörün mock test sonucuna göre Geçti/Uyarı/Dur kararını nasıl okuyacağını sadeleştirir.",
  },
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
];
