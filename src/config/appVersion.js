export const APP_VERSION = "v7.4.0";
export const APP_STAGE = "Stok Testi Sonuç Değerlendirme Paneli";

export const releaseHighlights = [
  "Ayarlar sayfasına Read-only Stok Test Hazırlığı paneli eklendi.",
  "Read-only SQL kullanıcısı hazırlığı, .env.local güvenli yerleşim, ilk 20 satır stok testi planı ve sonuç değerlendirme akışı görünür hale getirildi.",
  "v7.0 Read-only Stok Testine Geçiş Kapısı korunur.",
  "Bu sürüm gerçek bağlantı kurmaz; yalnızca şirket ortamı read-only test hazırlığını pasif olarak gösterir.",
];

export const versionHistory = [
  {
    version: "v7.4.0",
    title: "Stok Testi Sonuç Değerlendirme Paneli",
    note: "İlk 20 satır stok testinde hangi sonuçların olumlu, beklet veya dur sebebi olacağını görünür hale getirir.",
  },
  {
    version: "v7.3.0",
    title: "İlk 20 Satır Stok Testi Planı",
    note: "Şirket ortamındaki ilk gerçek stok okuma testinin yalnızca manuel, read-only ve 20 satırla sınırlı yapılmasını planlar.",
  },
  {
    version: "v7.2.0",
    title: ".env.local Güvenli Bağlantı Yerleşimi",
    note: "Bağlantı bilgisinin yalnızca şirket bilgisayarındaki .env.local içinde kalması gerektiğini görünür kılar.",
  },
  {
    version: "v7.1.0",
    title: "Read-only SQL Kullanıcısı Hazırlık Rehberi",
    note: "sa veya tam yetkili kullanıcı yerine ayrı read-only kullanıcı şartını netleştirir.",
  },
  {
    version: "v7.0.0",
    title: "Read-only Stok Testine Geçiş Kapısı",
    note: "Gerçek stok okuma testine geçmeden önce build, web/local sürüm, mock barkod ve depo akışı şartlarını görünür hale getirir.",
  },
  {
    version: "v6.9.0",
    title: "Yönetici İçin Pilot Durum Özeti",
    note: "Yönetici için ekran okunabilirliği, depo akışı ve read-only stok testi öncesi eksikleri özetler.",
  },
  {
    version: "v6.8.0",
    title: "Depo Kullanıcı İçin Sadece Gerekli Alanlar",
    note: "Depo personelinin sadece barkod, kalite sonucu ve not kararına odaklanmasını sağlar.",
  },
  {
    version: "v6.7.0",
    title: "El Terminali Ekranı Görsel Sıkıştırma",
    note: "Minimal modun birinci referans kabul edilmesini ve detay panellerin ikinci sıraya alınmasını netleştirir.",
  },
];
