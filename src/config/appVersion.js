export const APP_VERSION = "v7.0.0";
export const APP_STAGE = "Read-only Stok Testine Geçiş Kapısı";

export const releaseHighlights = [
  "El Terminali ekranına Read-only Stok Testine Geçiş Kapısı eklendi.",
  "Görsel sıkıştırma, depo için gerekli alanlar, yönetici pilot özeti ve read-only geçiş şartları görünür hale getirildi.",
  "Pilot Öncesi Minimal Ekran Modu korunur.",
  "Bu sürüm gerçek stok bağlantısı eklemez; yalnızca geçiş şartlarını pasif olarak gösterir.",
];

export const versionHistory = [
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
  {
    version: "v6.6.0",
    title: "Pilot Öncesi Minimal Ekran Modu",
    note: "Depo ve yönetici için en kısa terminal kullanım akışını üstte toplar.",
  },
  {
    version: "v6.5.0",
    title: "Yönetici İçin Tek Karar Paneli",
    note: "Geçti, Uyarı ve Dur yoğunluğuna göre devam, eğitim tekrar, teknik kontrol veya sadeleştirme kararını netleştirir.",
  },
  {
    version: "v6.4.0",
    title: "Depo Personeli İçin Tek Akış Paneli",
    note: "Depo kullanıcısının barkodu okut, sonucu söyle, gerekirse not al akışını sadeleştirir.",
  },
  {
    version: "v6.3.0",
    title: "El Terminali Ekranı Üst Sıra Sadeleştirme",
    note: "Mock Barkod Test Alanı ve Barkod Kalite Durumu sonrası okunacak üst akışı görünür hale getirir.",
  },
];
