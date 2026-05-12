export const APP_VERSION = "v3.5.0";
export const APP_STAGE = "Şirket Test Günü Komuta Merkezi";

export const releaseHighlights = [
  "Terminal Eğitim ve Prova Merkezi eklendi.",
  "Hazır barkod senaryoları, depo eğitim akışı ve test günü komuta akışı görünür hale getirildi.",
  "Terminal ve ERP pilot yol haritası, şirket checklisti, barkod kalite kontrolü ve test planı korunur.",
  "Bu sürüm gerçek Vega/SQL bağlantısı, gerçek stok araması, API endpoint, veri yazma, import/export/sync, localStorage veya credential eklemez.",
];

export const versionHistory = [
  {
    version: "v3.5.0",
    title: "Şirket Test Günü Komuta Merkezi",
    note: "Depo, yönetici ve teknik kontrol için test günü görev sırasını pasif eğitim/prova paneli olarak gösterir.",
  },
  {
    version: "v3.4.0",
    title: "Depo Kullanıcı Eğitim Paneli",
    note: "Depo kullanıcısının barkod kalite sonucunu nasıl okuyacağını ve hangi notları alacağını sadeleştirir.",
  },
  {
    version: "v3.3.0",
    title: "Barkod Test Senaryoları Hazır Liste",
    note: "Normal, leading zero, kısa, uzun, duplicate ve suffix örnekleriyle test prova listesini görünür kılar.",
  },
  {
    version: "v3.2.0",
    title: "Terminal Test Ekranı Görsel Sadeleştirme",
    note: "Mock barkod ekranında operatörün önce kalite sonucuna odaklanmasını sağlar.",
  },
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
];
