export const APP_VERSION = "v9.6.0";
export const APP_STAGE = "Electron UI Read-only Gösterim Başarısı";

export const releaseHighlights = [
  "Electron desktop modunda Vega read-only stok hareket paneline gerçek verinin geldiği kayıt altına alındı.",
  "Son okuma özetinde 20 satır, 7 kolon, veri yazma yok ve import/senkron yok sonucu başarıyla doğrulandı.",
  "dbo.F0102D0001TBLSTOKHAREKETLERI kapsamı, STOKNO/ACIKLAMA/DEPO/GIREN/CIKAN/KALAN/TARIH kolonları ve TOP 20 limiti korunur.",
  "Bu sürüm barkod/ürün JOIN yapmaz; terminal pilotu için sonraki fazda sadece read-only barkod eşleştirme keşfi yapılacaktır.",
];

export const versionHistory = [
  {
    version: "v9.6.0",
    title: "Electron UI Read-only Gösterim Başarısı",
    note: "Electron desktop üzerinden gerçek Vega stok hareketlerinin UI içinde 20 satır ve 7 kolonla read-only görüntülenebildiğini kayıt altına alır.",
  },
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
];
