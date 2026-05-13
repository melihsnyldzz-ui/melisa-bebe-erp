export const APP_VERSION = "v8.2.0";
export const APP_STAGE = "Test Sonrası Terminal Entegrasyon Kararı";

export const releaseHighlights = [
  "Read-only Stok Test Hazırlığı paneli ilk gerçek test kapılarıyla genişletildi.",
  "Şirket SQL hazırlığı son kontrolü, ilk read-only test başlatma kapısı, stok testi hata senaryoları ve terminal entegrasyon kararı görünür hale getirildi.",
  "v7.8 terminal entegrasyonu ön şartları korunur.",
  "Bu sürüm gerçek bağlantı kurmaz; yalnızca ilk read-only test ve terminal kararı için pasif hazırlık gösterir.",
];

export const versionHistory = [
  {
    version: "v8.2.0",
    title: "Test Sonrası Terminal Entegrasyon Kararı",
    note: "İlk read-only stok testinden sonra terminal entegrasyonuna geçilip geçilmeyeceğini belirleyen şartları görünür hale getirir.",
  },
  {
    version: "v8.1.0",
    title: "İlk Stok Testi Hata Senaryoları",
    note: "Bağlantı, yetki, satır limiti, stok dışı veri, barkod alanı ve hassas hata mesajı senaryolarını listeler.",
  },
  {
    version: "v8.0.0",
    title: "İlk Gerçek Read-only Test Başlatma Kapısı",
    note: "Web/local sürüm, build, read-only kullanıcı ve manuel 20 satır şartları sağlanmadan test başlatılmamasını gösterir.",
  },
  {
    version: "v7.9.0",
    title: "Şirket SQL Hazırlığı Son Kontrol Paneli",
    note: "Read-only kullanıcı, .env.local, bağlantı gizliliği ve test sorumlusu şartlarını son kez kontrol ettirir.",
  },
  {
    version: "v7.8.0",
    title: "Terminal Entegrasyonuna Geçiş Ön Şartları",
    note: "Read-only stok testi başarılı olmadan terminal entegrasyonuna geçilmemesi gerektiğini netleştirir.",
  },
  {
    version: "v7.7.0",
    title: "İlk Gerçek Stok Testi Hazır / Beklet Kararı",
    note: "İlk gerçek stok testinden sonra hazır, beklet veya dur kararını görünür hale getirir.",
  },
  {
    version: "v7.6.0",
    title: "Read-only Test Operatör Rapor Formatı",
    note: "Test yapan kişinin tarih, satır sayısı, alan doğruluğu ve genel sonucu aynı formatta not almasını sağlar.",
  },
  {
    version: "v7.5.0",
    title: "Şirket Bilgisayarı Test Günü Kontrol Kartı",
    note: "Şirket bilgisayarında yapılacak ilk read-only testin kim, nerede ve hangi kapsamla yapılacağını netleştirir.",
  },
];
