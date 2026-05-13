export const APP_VERSION = "v8.6.0";
export const APP_STAGE = "Sonraki Terminal Pilot Planı";

export const releaseHighlights = [
  "Read-only Stok Test Hazırlığı paneli saha test yürütme planıyla genişletildi.",
  "Read-only saha testi yürütme akışı, test gözlem notları, durma/geri alma prosedürü ve sonraki terminal pilot planı görünür hale getirildi.",
  "v8.2 ilk test ve terminal karar kapıları korunur.",
  "Bu sürüm gerçek bağlantı kurmaz; yalnızca saha test yürütme ve sonraki terminal pilot hazırlığını pasif olarak gösterir.",
];

export const versionHistory = [
  {
    version: "v8.6.0",
    title: "Sonraki Terminal Pilot Planı",
    note: "Read-only stok testi temizse ilk terminal pilotunun yalnızca barkoddan stok görüntüleme hedefiyle planlanacağını gösterir.",
  },
  {
    version: "v8.5.0",
    title: "Durma ve Geri Alma Prosedürü",
    note: "Test durursa yeni deneme yapılmaması, hata özetlenmesi ve hassas bilginin paylaşılmaması gerektiğini görünür kılar.",
  },
  {
    version: "v8.4.0",
    title: "Test Gözlem Notları",
    note: "Satır sayısı, stok dışı alan, stok kodu, ürün adı, barkod ve hata notlarını sahada kontrol ettirir.",
  },
  {
    version: "v8.3.0",
    title: "Read-only Saha Testi Yürütme Akışı",
    note: "Saha testinde kimin neyi kontrol edeceğini ve testin nasıl durdurulacağını netleştirir.",
  },
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
];
