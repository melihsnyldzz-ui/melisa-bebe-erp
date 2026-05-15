export const APP_VERSION = "v9.5.0";
export const APP_STAGE = "İlk Gerçek Vega Read-only Smoke Test Başarısı";

export const releaseHighlights = [
  "Şirket bilgisayarında melisa_stock_ro kullanıcısı ile gerçek Vega read-only bağlantısının çalıştığı kayıt altına alındı.",
  "dbo.F0102D0001TBLSTOKHAREKETLERI tablosundan TOP 20 sınırıyla gerçek stok hareketi okunduğu görünür hale getirildi.",
  "STOKNO, ACIKLAMA, DEPO, GIREN, CIKAN, KALAN ve TARIH kolonları ilk güvenli stok hareket önizleme kapsamı olarak belirlendi.",
  "sa kullanılmadan, .env.local içeriği yazdırılmadan ve veri yazma/import/export/sync yapılmadan ilerleme kuralı korunur.",
];

export const versionHistory = [
  {
    version: "v9.5.0",
    title: "İlk Gerçek Vega Read-only Smoke Test Başarısı",
    note: "melisa_stock_ro ile F0102 stok hareket tablosundan TOP 20 gerçek kayıt okunabildiğini ve ERP'nin gerçek read-only veri hattına geçtiğini kayıt altına alır.",
  },
  {
    version: "v9.4.0",
    title: "SA Kullanıcısı Fail-closed Beklet Kararı",
    note: "İlk bağlantı denemesinde sa tespit edilirse bağlantı açılmadan testin BEKLET kararıyla durdurulmasını kayıt altına alır.",
  },
  {
    version: "v9.3.0",
    title: "İlk 20 Satır Stok Testi Codex Promptu",
    note: "Codex'in local build, read-only bağlantı ve 20 satır stok testi dışında işlem yapmaması için güvenli görev metnini tanımlar.",
  },
  {
    version: "v9.2.0",
    title: "Read-only SQL Kullanıcı Hazırlık Kapısı",
    note: "Şirket ortamında sa kullanılmadan, sadece stok okuma yetkili kullanıcıyla ilerlenmesini görünür hale getirir.",
  },
  {
    version: "v9.1.0",
    title: "Web ve Local Sürüm Doğrulama",
    note: "Gerçek teste geçmeden önce web önizleme, main sürümü ve local build sonucunun aynı hatta olduğunu kontrol ettirir.",
  },
  {
    version: "v9.0.0",
    title: "İlk Gerçek Test Sonrası Karar",
    note: "İlk gerçek read-only stok testinden sonra Hazır, Beklet veya Dur kararının nasıl verileceğini görünür hale getirir.",
  },
  {
    version: "v8.9.0",
    title: "Test Günü Zaman Kutusu",
    note: "Hazırlık, ilk deneme, 20 satır gözlem, hata notu ve karar için hedef süreleri listeler.",
  },
  {
    version: "v8.8.0",
    title: "Görev Dağılımı",
    note: "Test sorumlusu, operatör, gözlemci, yönetici ve teknik kişi rollerini netleştirir.",
  },
  {
    version: "v8.7.0",
    title: "Saha Testi Onay Listesi",
    note: "Test günü, kullanıcı, bilgisayar ve test amacının onaylanmasını görünür hale getirir.",
  },
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
];
