export const APP_VERSION = "v7.8.0";
export const APP_STAGE = "Terminal Entegrasyonuna Geçiş Ön Şartları";

export const releaseHighlights = [
  "Read-only Stok Test Hazırlığı paneli şirket test günü ve terminal entegrasyon ön şartlarıyla genişletildi.",
  "Şirket bilgisayarı test günü kontrol kartı, operatör rapor formatı, ilk gerçek stok testi hazır/beklet kararı ve terminal entegrasyon ön şartları görünür hale getirildi.",
  "v7.4 stok testi sonuç değerlendirme akışı korunur.",
  "Bu sürüm gerçek bağlantı kurmaz; yalnızca şirket ortamı read-only test ve terminal geçiş hazırlığını pasif olarak gösterir.",
];

export const versionHistory = [
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
];
