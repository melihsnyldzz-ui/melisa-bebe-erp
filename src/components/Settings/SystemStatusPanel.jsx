import { ShieldCheck } from "lucide-react";
import ReleaseHighlightsPanel from "../Common/ReleaseHighlightsPanel.jsx";
import { APP_STAGE, APP_VERSION } from "../../config/appVersion.js";
import {
  currentReleaseVersion,
  releaseHighlightsByPage,
} from "../../config/releaseHighlights.js";

const settingsReleaseHighlights = releaseHighlightsByPage.settings;
const updatedSectionIds = settingsReleaseHighlights.updatedSectionIds;

const statusRows = [
  { label: "Uygulama sürümü", value: APP_VERSION },
  { label: "Geliştirme aşaması", value: APP_STAGE },
  { label: "Build kontrolü", value: "GitHub Actions + npm run build" },
  { label: "Çalışma modeli", value: "GitHub PR kontrollü manuel geliştirme" },
  { label: "Kritik işlem politikası", value: "Stok, cari, fiş, yedekleme, import ve migration işlemleri ayrı kontrollü sürümlerle açılır." },
  { label: "El terminali operasyonu", value: "Pasif/mock hazırlık" },
  { label: "Gerçek cihaz bağlantısı", value: "Kapalı" },
  { label: "Barkod okutma entegrasyonu", value: "Gerçek cihazla bağlı değil" },
  { label: "Sayım raporu", value: "Önizleme" },
  { label: "Stok ve barkod kalite kontrolü", value: "Pasif/mock hazırlık" },
  { label: "ERP’ye stok yazma", value: "Kapalı" },
  { label: "Vega geçiş hazırlığı", value: "Read-only yol haritası ile kademeli hazırlık sürüyor." },
];

const workflowRows = [
  { label: "ChatGPT", value: "PR/diff kontrolü ve Codex prompt hazırlığı" },
  { label: "Codex", value: "Branch üzerinde kodlama, build, commit, PR açma" },
  { label: "Kullanıcı", value: "PR onayı ve merge kararı" },
  { label: "Main branch", value: "Doğrudan push yapılmayacak" },
];

const maturityRows = [
  { label: "ERP genel hazırlık", value: "%72-76" },
  { label: "Canlı kullanım güvenliği", value: "%65-70" },
  { label: "El terminali hazırlığı", value: "%60-65" },
  { label: "Vega'dan geçiş hazırlığı", value: "%58-63" },
];

const goLiveMissingItems = [
  "Gerçek Vega verisiyle karşılaştırmalı ürün/stok testi",
  "Yedek alma ve geri yükleme gerçek test ortamı doğrulaması",
  "Personel ile en az 1 günlük deneme kullanımı",
  "Hatalı işlem geri alma / rollback prosedürü",
  "Vega'dan bağımsız rapor doğrulama",
  "Yetki ve kullanıcı rol testleri",
  "El terminaliyle gerçek barkod/stok sayım testi",
];

const goLiveTestPlanSteps = [
  "1. Gün: Vega ürün/stok verisiyle ekran karşılaştırması",
  "2. Gün: El terminali barkod okutma ve stok sayım denemesi",
  "3. Gün: Satış/alış fişi ekranlarının sadece görüntüleme testi",
  "4. Gün: Rapor ekranlarının Vega çıktılarıyla karşılaştırılması",
  "5. Gün: Personel deneme kullanımı ve hata notlarının toplanması",
];

const vegaComparisonChecklist = [
  "Ürün sayısı Vega ile aynı mı?",
  "Barkodlar doğru eşleşiyor mu?",
  "Stok toplamları Vega ile tutarlı mı?",
  "Cari kart sayısı doğru mu?",
  "Alış/satış fişleri görüntülenebiliyor mu?",
  "Rapor toplamları Vega ile karşılaştırıldı mı?",
  "Hatalı veya eksik kayıtlar not alındı mı?",
];

const vegaComparisonResultTemplate = [
  "Test tarihi:",
  "Testi yapan kişi:",
  "Vega ekranı / raporu:",
  "ERP ekranı / raporu:",
  "Karşılaştırılan kayıt türü:",
  "Vega'daki değer:",
  "ERP'deki değer:",
  "Sonuç: Uyumlu / Fark var / Kontrol edilecek",
  "Not:",
];

const vegaComparisonIssueTemplate = [
  "Ekran adı:",
  "İşlem:",
  "Beklenen sonuç:",
  "Görülen sonuç:",
  "Vega'daki karşılığı:",
  "Tekrar ediyor mu:",
  "Önem seviyesi: Düşük / Orta / Yüksek",
  "Not / ekran görüntüsü:",
];

const liveTestChecklistItems = [
  "Uygulama doğru adresten açıldı mı?",
  "Sol menüde mavi yenilik noktası kontrol edildi mi?",
  "Ayarlar ekranındaki sürüm bilgisi kontrol edildi mi?",
  "Vega karşılaştırma test planı okundu mu?",
  "Test edilecek ekran belirlendi mi?",
  "Veri yazan işlem yapılmayacağı personele söylendi mi?",
  "Hata görülürse ekran görüntüsü alınacağı söylendi mi?",
  "Test sonunda notlar ChatGPT/Codex için hazırlanacak mı?",
];

const staffTrialNotesTemplate = [
  "Personel adı:",
  "Test tarihi:",
  "Test edilen ekran:",
  "Anlaşılan kısımlar:",
  "Zorlanılan kısımlar:",
  "Görülen hata:",
  "Öneri:",
  "Genel değerlendirme:",
];

const goLiveChecklistGroups = [
  {
    title: "Hazır",
    tone: "ready",
    items: [
      "GitHub Actions build kontrolü aktif",
      "El terminali okuma modu hazır",
      "Son okutulanlar geçmişi hazır",
      "Sayım sepeti önizleme hazır",
      "Sayım raporu JSON/CSV önizleme hazır",
      "README ve proje özeti düzenli",
    ],
  },
  {
    title: "Hazırlıkta",
    tone: "progress",
    items: ["Gerçek veriyle uzun test bekleniyor", "Yedekleme / geri yükleme testi bekleniyor", "Rollback senaryosu bekleniyor"],
  },
  {
    title: "Bekliyor",
    tone: "waiting",
    items: ["Personel deneme kullanımı bekleniyor", "Vega karşılaştırmalı doğrulama bekleniyor"],
  },
];

const handheldBarcodeStatusRows = [
  { label: "El terminali operasyonu", value: "Pasif/mock hazırlık" },
  { label: "Gerçek cihaz bağlantısı", value: "Kapalı" },
  { label: "Barkod okutma entegrasyonu", value: "Gerçek cihazla bağlı değil" },
  { label: "Sayım raporu", value: "Önizleme" },
  { label: "Stok ve barkod kalite kontrolü", value: "Pasif/mock hazırlık" },
  { label: "ERP’ye stok yazma", value: "Kapalı" },
];

const stockBarcodeQualityStatusRows = [
  { label: "Barkod kalite kontrolü", value: "Pasif/mock hazırlık" },
  { label: "Stok kartı kalite kontrolü", value: "Önizleme" },
  { label: "Duplicate barkod kontrolü", value: "Manuel takip" },
  { label: "Sayım farkı kontrolü", value: "Manuel takip" },
  { label: "Gerçek veri düzeltme", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
];

const versionHistoryRows = [
  {
    version: "v1.31.0",
    title: "Stok Riskleri ve Barkod Kalite Kontrol Merkezi",
    area: "Depo Terminali / Vega Import / Dashboard / Sistem Durumu",
    description: "Stok ve barkod kalite kontrol görünürlüğü pasif/mock modda güçlendirildi; duplicate barkod, barkodsuz ürün, eksik stok kodu ve sayım farkı riskleri gerçek cihaz bağlantısı, Vega bağlantısı veya veri yazma eklenmeden özetlendi.",
  },
  {
    version: "v1.30.0",
    title: "El Terminali ve Barkod Operasyon Merkezi",
    area: "Depo Terminali / Dashboard / Sistem Durumu",
    description: "El terminali ve barkod operasyonu pasif/mock modda netleştirildi; sayım akışı, son okutulanlar, barkod riskleri ve saha rehberi gerçek cihaz bağlantısı veya veri yazma eklenmeden görünür hale getirildi.",
  },
  {
    version: "v1.29.0",
    title: "Yönetici Kokpiti ve Read-only Yol Haritası",
    area: "Dashboard / Vega / Sistem Durumu",
    description: "Patron Bakışı yönetici özeti, Vega read-only yol haritası ve GitHub PR kontrollü manuel çalışma modeli statik/pasif olarak güncellendi.",
  },
  {
    version: "v1.27.0",
    title: "Vega read-only manuel kontrollü test kapısı",
    area: "Vega / Import Önizleme",
    description: "Vega read-only manuel kontrollü test kapısı eklendi; manuel yedek, read-only kullanıcı ve 20 satır sınırı görünür hale getirildi; gerçek bağlantı, query, DB okuma veya veri yazma eklenmeden test kapısı pasif rehber olarak hazırlandı.",
  },
  {
    version: "v1.26.1",
    title: "Read-only kullanıcı yetki rehberi ve ilk sorgu kapsam sınırı genişletme",
    area: "Vega / Import Önizleme",
    description: "Read-only kullanıcı yetki rehberi, ilk sorgu kapsamı ve operatör/saha hazırlık özeti ayrı statik panellerle tamamlandı; gerçek bağlantı, SQL/ODBC, DB okuma, query veya veri yazma eklenmeden manuel hazırlık görünürlüğü artırıldı.",
  },
  {
    version: "v1.26.0",
    title: "Vega read-only bağlantı bilgisi manuel hazırlık ekranı",
    area: "Vega / Import Önizleme",
    description: "Read-only deneme için bağlantı bilgisi manuel hazırlık paneli eklendi; SQL sunucu, veritabanı adı, kullanıcı tipi ve ilk kapsam bilgileri statik rehber olarak listelendi; bağlantı testi ve ilk okumanın ayrı sürümde ele alınacağı netleştirildi.",
  },
  {
    version: "v1.25.1",
    title: "Vega read-only final karar ekranı kapanış özeti ve sadeleştirme",
    area: "Vega / Import Önizleme",
    description: "Final karar ekranına hazırlık fazı kapanış notu eklendi; read-only hazırlık rehberlerinin tamamlandığı daha sade şekilde belirtildi ve gerçek denemenin ayrı sürümde, manuel doğrulamalar sonrası ele alınacağı tekrar vurgulandı.",
  },
  {
    version: "v1.25.0",
    title: "İlk gerçek read-only deneme hazırlığına geçiş öncesi final karar ekranı",
    area: "Vega / Import Önizleme",
    description: "İlk read-only deneme öncesi final karar rehberi eklendi; hazırlık, manuel yedek, read-only kullanıcı ve 20 satır sınırı son kez görünür hale getirildi ve gerçek denemenin bu ekrandan başlatılmayacağı netleştirildi.",
  },
  {
    version: "v1.24.2",
    title: "İlk read-only deneme öncesi kapanış kontrolü ve final saha notu",
    area: "Vega / Import Önizleme",
    description: "İlk read-only deneme öncesi hazırlık fazı için kapanış kontrolü eklendi; final saha notu ile gerçek denemenin ayrı sürümde yapılacağı tekrar vurgulandı ve gerçek bağlantı, query, DB okuma veya veri yazma eklenmeden hazırlık fazı kapatıldı.",
  },
  {
    version: "v1.24.1",
    title: "İlk read-only deneme öncesi saha kontrol özeti ve personel notu",
    area: "Vega / Import Önizleme",
    description: "İlk read-only deneme öncesi saha kontrol özeti eklendi; personel notu şablonu statik rehber olarak hazırlandı ve gerçek bağlantı, query, DB okuma veya veri yazma eklenmeden saha hazırlık akışı netleştirildi.",
  },
  {
    version: "v1.24.0",
    title: "İlk gerçek read-only deneme öncesi onay matrisi ve test prosedürü",
    area: "Vega / Import Önizleme",
    description: "İlk read-only deneme öncesi pasif onay matrisi eklendi; ilk test prosedürü ve test sonucu not şablonu hazırlandı; gerçek bağlantı, query, DB okuma ve veri yazma eklenmeden manuel kontrol akışı netleştirildi.",
  },
  {
    version: "v1.23.1",
    title: "Teknik kontrol paneli görsel düzen ve son güvenlik kontrolü",
    area: "Vega / Import Önizleme",
    description: "İlk Deneme Teknik Kontrolü paneline pasif güvenlik notu eklendi; bağlantı, SQL/ODBC, DB okuma, query ve veri yazma durumları daha net gösterildi ve gerçek bağlantı veya sorgu davranışı eklenmeden teknik kontrol paneli son kez düzenlendi.",
  },
  {
    version: "v1.23.0",
    title: "İlk gerçek read-only deneme öncesi teknik kontrol paketi",
    area: "Vega / Import Önizleme",
    description: "İlk gerçek read-only deneme öncesi teknik kontrol paneli eklendi; bağlantı, SQL/ODBC, DB okuma, query ve veri yazma durumlarının henüz kapalı olduğu netleştirildi ve gerçek ilk denemenin ayrı sürümde, manuel yedek doğrulandıktan sonra ele alınacağı belirtildi.",
  },
  {
    version: "v1.22.2",
    title: "Read-only ilk deneme öncesi final güvenlik matrisi",
    area: "Vega / Import Önizleme",
    description: "İlk gerçek read-only deneme öncesi final güvenlik matrisi eklendi; yedek, read-only yetki, 20 satır limiti, timeout, retry kapalı ve ham hata gizleme şartları tek panelde toplandı; cari, fiş, hareket, ödeme, tahsilat, stok mutasyonu ve import işlemlerinin kapsam dışı olduğu netleştirildi.",
  },
  {
    version: "v1.22.1",
    title: "Read-only bağlantı hazırlık paneli kapanış kontrolü ve operatör rehberi",
    area: "Vega / Import Önizleme",
    description: "Read-only bağlantı hazırlığına operatör kontrol rehberi eklendi; ilk gerçek deneme öncesi manuel yedek, read-only yetki, 20 satır sınırı, ham hata gizleme ve manuel karşılaştırma gereklilikleri tekrar vurgulandı.",
  },
  {
    version: "v1.22.0",
    title: "Vega read-only bağlantı parametreleri pasif hazırlık paketi",
    area: "Vega / Import Önizleme",
    description: "Read-only bağlantı parametreleri yalnızca pasif hazırlık olarak görünür hale getirildi; ilk deneme için 20 satır limiti, 3000 ms timeout, retry kapalı ve ham hata gizleme politikası not edildi; ilk read-only sorgu kapsamının sadece stok kartı okuma taslağı olduğu netleştirildi.",
  },
  {
    version: "v1.21.2",
    title: "Vega read-only geçiş kapısı kapanış özeti ve hazırlık sınırı",
    area: "Vega / Import Önizleme",
    description: "Read-only Geçiş Kapısı altına sonraki aşama sınırı eklendi; gerçek Vega bağlantısının bu fazda başlamadığı ve bağlantı parametreleri ile read-only kullanıcı hazırlığının ayrı güvenli sürümde yapılacağı netleştirildi.",
  },
  {
    version: "v1.21.1",
    title: "Read-only Geçiş Kapısı görsel denge ve son kontrol",
    area: "Vega / Import Önizleme",
    description: "Read-only Geçiş Kapısı paneline pasif güvenlik notu eklendi; geçiş checklist’i görsel okunabilirlik açısından dengelendi ve gerçek bağlantı, sorgu, DB okuma veya import işlemi eklenmeden son kontrol yapıldı.",
  },
  {
    version: "v1.21.0",
    title: "Vega Import Önizleme kapanış kontrolü ve read-only geçiş kapısı",
    area: "Vega / Import Önizleme",
    description: "Vega Import Önizleme fazı read-only geçiş kapısı ile kapatıldı; gerçek Vega read-only denemesi öncesi manuel yedek, minimum yetki, satır limiti, timeout ve yalnızca okuma sorgusu şartları pasif checklist olarak görünür hale getirildi.",
  },
  {
    version: "v1.20.9",
    title: "Vega Import Önizleme son kalite kontrol ve güvenlik metni sadeleştirme",
    area: "Vega / Import Önizleme",
    description: "Vega Import Önizleme güvenlik metinleri daha kısa ve net hale getirildi; Import Kilidi Aktif alanında canlı bağlantı, SQL/ODBC okuma, ERP’ye yazma ve import başlatma yapılmadığı güçlendirildi.",
  },
  {
    version: "v1.20.8",
    title: "Vega Import Önizleme sürüm geçmişi tamamlama ve build doğrulama",
    area: "Vega / Import Önizleme",
    description: "Ayarlar ekranındaki Son Sürüm Geçmişi v1.20.7 satırıyla tamamlandı; Vega Import Önizleme güvenlik kilidi sonrası sürüm kayıtları düzenlendi ve build doğrulaması yapıldı.",
  },
  {
    version: "v1.20.7",
    title: "Vega Import Önizleme güvenlik kilidi ve import butonsuz akış kontrolü",
    area: "Vega / Import Önizleme",
    description: "Vega Import Önizleme ekranında canlı bağlantı, SQL/ODBC okuma, ERP’ye yazma ve import başlatma işlemlerinin kapalı olduğu daha görünür hale getirildi; ekranın yalnızca pasif mock önizleme olduğu netleştirildi.",
  },
  {
    version: "v1.20.6",
    title: "Vega Import Önizleme build stabilizasyonu ve sürüm geçmişi düzeltmesi",
    area: "Vega / Import Önizleme",
    description: "Vega Import Önizleme altyapısı sonrası build kontrolü, sürüm geçmişi görünürlüğü ve güvenli önizleme bağlantısı düzeltildi; gerçek Vega bağlantısı, SQL/ODBC, DB okuma ve ERP import işlemi eklenmedi.",
  },
  {
    version: "v1.20.5",
    title: "Vega stok import önizleme altyapısı",
    area: "Vega / Import Önizleme",
    description: "Vega yedek analizine göre F0102/F0103/F0104 tablo bilgileri, stok/barkod/cari mapping dosyası, mock stok önizleme tablosu ve risk badge sistemi gerçek bağlantı ve ERP import işlemi olmadan eklendi.",
  },
  {
    version: "v1.20.4",
    title: "Vega read-only ilk test prosedürü ve operatör kontrol rehberi",
    area: "Vega / Read-only",
    description: "İlk Vega read-only denemesi öncesinde operatörün manuel yedek, read-only yetki, bağlantı kilidi, stok kartı kapsamı, 20 satır limiti, retry kapalı, fail-closed açık ve ham hata gizli şartlarını kontrol etmesini sağlayan pasif test prosedürü ve operatör rehberi eklendi.",
  },
  {
    version: "v1.20.3",
    title: "Vega read-only manuel onay ve bağlantı kilidi görünürlüğü",
    area: "Vega / Read-only",
    description: "Vega read-only teknik hazırlığı kapsamında gerçek bağlantı açılmadan manuel onay gerekliliği, onay kaydının kapalı olması, bağlantı kilidinin açılamaması, kilit açma gerekçesi, operatör adı ve yedek kontrolü şartları pasif metadata ve UI düzeyinde görünür hale getirildi.",
  },
  {
    version: "v1.20.2",
    title: "Vega read-only timeout ve bağlantı denemesi kapalı hazırlığı",
    area: "Vega / Read-only",
    description: "Vega read-only teknik hazırlığı kapsamında gerçek bağlantı açılmadan bağlantı denemesinin kapalı olduğu, 3000 ms timeout politikası, güvenli hata mesajı, ham hata gizleme ve son bağlantı denemesi yok durumu pasif metadata ve UI düzeyinde görünür hale getirildi.",
  },
  {
    version: "v1.20.1",
    title: "Vega read-only satır limiti ve hata güvenliği hazırlığı",
    area: "Vega / Read-only",
    description: "İlk Vega read-only denemesi için gerçek bağlantı açılmadan 20 satır limiti, timeout hazırlığı, retry kapalı, fail-closed açık, hata baskısı koruması ve sadece stok kartları okuma kapsamı pasif metadata ve UI düzeyinde görünür hale getirildi.",
  },
  {
    version: "v1.20.0",
    title: "Vega read-only teknik hazırlık başlangıcı",
    area: "Vega / Read-only",
    description: "Vega read-only teknik hazırlık fazı gerçek bağlantı açılmadan pasif metadata ile başlatıldı; bağlantı kilidi, SQL/ODBC, DB okuma, satır limiti hazırlığı ve manuel onay gerekliliği Vega Stok Deneme ekranında görünür hale getirildi.",
  },
  {
    version: "v1.19.9",
    title: "Vega read-only teknik hazırlık kilidi ve son geçiş özeti",
    area: "Vega / Read-only",
    description: "Vega Stok Deneme ekranına gerçek bağlantı, SQL/ODBC, Vega DB okuma, query çalıştırma ve onay kaydının kapalı olduğunu gösteren pasif teknik hazırlık kilidi ile v1.19.x hazırlık fazı son geçiş özeti eklendi.",
  },
  {
    version: "v1.19.8",
    title: "Vega read-only geçiş kapısı ve onay matrisi",
    area: "Vega / Read-only",
    description: "Vega Stok Deneme ekranına gerçek read-only bağlantı fazına geçmeden önce manuel yedek, minimum yetki, yazma izni, satır limiti, demo/gerçek veri ayrımı ve mutasyon kapalı şartlarını pasif onay matrisiyle gösteren geçiş kapısı eklendi.",
  },
  {
    version: "v1.19.7",
    title: "Vega Stok Deneme görsel denge ve son kalite kontrol",
    area: "Vega / Read-only",
    description: "Vega Stok Deneme ekranındaki panel grup boşlukları, mobil görünüm, demo stok tablosu hizası ve read-only bağlantı hazırlığı başlık dili son kalite kontrol kapsamında sadeleştirildi.",
  },
  {
    version: "v1.19.6",
    title: "Vega Stok Deneme sayfa sadeleştirme ve panel gruplama",
    area: "Vega / Read-only",
    description: "Vega Stok Deneme ekranındaki pasif hazırlık panelleri güvenli deneme özeti, read-only bağlantı hazırlığı, Vega bilgi/sorgu hazırlığı, güvenlik checklist'i ve demo stok tablosu grupları altında daha okunur hale getirildi.",
  },
  {
    version: "v1.19.5",
    title: "Read-only güvenlik checklist'i",
    area: "Vega / Read-only",
    description: "Vega read-only bağlantı hazırlığı kapsamında gerçek bağlantı açılmadan önce sadece okuma modu, yazma izninin kapalı kalması, minimum kullanıcı yetkisi, küçük satır limiti, demo/gerçek veri ayrımı ve manuel yedek kontrolü gibi güvenlik şartlarını gösteren pasif checklist paneli eklendi.",
  },
  {
    version: "v1.19.4",
    title: "Stok sorgusu taslak önizleme",
    area: "Vega / Read-only",
    description: "Vega read-only bağlantı hazırlığı kapsamında stok kartlarını yalnızca okumaya yönelik sorgu mantığını, döndürülecek alanları ve çalıştırma durumunun kapalı olduğunu gösteren pasif stok sorgusu taslak önizleme paneli eklendi.",
  },
  {
    version: "v1.19.3",
    title: "Vega DB yolu / sunucu bilgisi kontrol rehberi",
    area: "Vega / Read-only",
    description: "Vega read-only bağlantı hazırlığı kapsamında Vega veritabanı yolu veya SQL sunucu bilgisinin ileride nasıl kontrol edileceğini gösteren, dosya seçme veya bağlantı testi içermeyen pasif DB yolu / sunucu bilgisi rehberi eklendi.",
  },
  {
    version: "v1.19.2",
    title: "ODBC / SQL sürücü gereksinim rehberi",
    area: "Vega / Read-only",
    description: "Vega read-only bağlantı hazırlığı kapsamında ODBC / SQL uyumlu bağlantı sürücüsü, sadece okuma erişimi, minimum yetkili kullanıcı, yazma izninin kapalı olması ve stok sorgusunun ayrı kontrollü sürümde hazırlanacağı bilgisini gösteren pasif rehber eklendi.",
  },
  {
    version: "v1.19.1",
    title: "Vega read-only bağlantı parametreleri önizleme hazırlığı",
    area: "Vega / Read-only",
    description: "Vega read-only bağlantı hazırlığı kapsamında sürücü türü, sunucu/dosya yolu, veritabanı adı, kullanıcı yetkisi, stok sorgusu ve yazma izni başlıklarını yalnızca okunur şekilde gösteren pasif bağlantı parametreleri önizleme alanı eklendi.",
  },
  {
    version: "v1.19.0",
    title: "Vega read-only bağlantı hazırlığı başlangıcı",
    area: "Vega / Read-only",
    description: "Vega Stok Deneme hazırlık fazı kapatıldıktan sonra gerçek bağlantı kurulmadan read-only bağlantı için gerekli ODBC/SQL sürücüsü, veritabanı yolu/sunucusu, stok okuma sorgusu ve veri yazma izni durumlarını gösteren pasif hazırlık alanı eklendi.",
  },
  {
    version: "v1.18.8",
    title: "Vega stok deneme hazırlık kapanışı ve read-only geçiş notu",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranına hazırlık kapanış notu eklendi; demo veri, veri kaynağı, bağlantı güvenliği ve kolon eşleştirme kontrollerinden sonra gerçek Vega read-only bağlantısının ayrı ve kontrollü v1.19.x fazında ele alınacağı netleştirildi.",
  },
  {
    version: "v1.18.7",
    title: "Vega stok deneme final kalite kontrol ve ekran sadeleştirme",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranındaki güvenli deneme, veri kaynağı, hazır değil özeti, bağlantı kontrolü ve kolon eşleştirme panelleri daha anlaşılır sıraya alındı; tekrar eden açıklamalar sadeleştirilerek gerçek bağlantı açılmadan final hazırlık görünümü güçlendirildi.",
  },
  {
    version: "v1.18.6",
    title: "Vega stok deneme hazır değil kontrol özeti",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranına, gerçek Vega stok okuması açılmadan önce read-only mod, bağlantı sürücüsü, gerçek stok okuma, veri yazma ve gösterilen veri durumlarını özetleyen güvenli hazır değil kontrol alanı eklendi.",
  },
  {
    version: "v1.18.5",
    title: "Vega stok deneme veri kaynağı ayrımı",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranında gösterilen verinin demo veri mi yoksa ileride açılacak Vega read-only verisi mi olduğunu anlatan veri kaynağı bilgilendirmesi eklendi; gerçek bağlantı açılmadan modül hazırlık durumu daha net hale getirildi.",
  },
  {
    version: "v1.18.4",
    title: "Vega stok deneme ekranı test notu ve görsel sıkıştırma",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranındaki kolon eşleştirme hazırlığı daha kompakt hale getirildi ve bu ekranda yalnızca demo stok görünümü, bağlantı durumu ve kolon eşleştirme hazırlığının kontrol edileceğini anlatan güvenli test notu eklendi.",
  },
  {
    version: "v1.18.3",
    title: "Vega stok kolon eşleştirme hazırlığı",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranına stok kodu, barkod, ürün adı, marka, beden, renk, mevcut stok, alış fiyatı ve satış fiyatı alanlarının ERP karşılıklarını gösteren read-only kolon eşleştirme hazırlığı eklendi.",
  },
  {
    version: "v1.18.2",
    title: "Vega stok deneme ekranı bağlantı kontrol paneli hazırlığı",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranına read-only mod, bağlantı sürücüsü, veri yazma ve gösterilen veri durumunu açıklayan bağlantı kontrol paneli eklendi.",
  },
  {
    version: "v1.18.1",
    title: "Vega stok deneme ekranı güvenlik ve bağlantı durumu netleştirme",
    area: "Vega / Stok",
    description: "Vega Stok Deneme ekranında demo veri, bağlantı yok ve bağlantı hatası durumları daha açık hale getirildi; ekranın yalnızca read-only stok okuma hazırlığı olduğu netleştirildi.",
  },
  {
    version: "v1.18.0",
    title: "Vega stok okuma deneme ekranı",
    area: "Vega / Stok",
    description: "Vega'dan stok listesi okunabiliyor mu görmek için geçici, read-only deneme ekranı eklendi; veri yazma işlemi içermez.",
  },
  {
    version: "v1.17.6",
    title: "Dashboard final kalite kontrol ve kapanış",
    area: "Dashboard / Settings",
    description: "Dashboard v1.17 kırılımı kapanış öncesi mobil görünüm, kompakt düzen, son sürüm vurguları ve release bilgileri açısından son kez kontrol edildi.",
  },
  {
    version: "v1.17.5",
    title: "Son sürüm değişikliklerini görsel vurgulama",
    area: "Dashboard / Settings",
    description: "Son sürümde güncellenen Dashboard ve Settings bölümleri hafif çerçeve, arka plan ve YENİ etiketiyle görsel olarak işaretlenebilir hale getirildi.",
  },
  {
    version: "v1.17.4",
    title: "Dashboard mobil ve kompakt görünüm son dengeleme",
    area: "Dashboard",
    description: "Dashboard rapor önizlemesi, risk satırları, döviz ve cari detay alanları küçük ekranda taşmadan okunacak şekilde kompakt görünümde dengelendi.",
  },
  {
    version: "v1.17.3",
    title: "Gün sonu raporu önizlemesini patron diline çekme",
    area: "Dashboard",
    description: "Gün Sonu Raporu Önizleme satırları satış, tahsilat, müşteri, ürün, risk ve Patron Notu odağında daha kısa ve karar odaklı hale getirildi.",
  },
  {
    version: "v1.17.2",
    title: "Dashboard risk aksiyonlarını netleştirme",
    area: "Dashboard",
    description: "Dashboard risk satırları stok yok, limit aşımı, kritik stok ve limit yaklaşımı önceliğine göre sıralandı; aksiyon notları daha kısa ve okunur hale getirildi.",
  },
  {
    version: "v1.17.1",
    title: "Dashboard karar notlarını daha isabetli hale getirme ve öncelik sırası düzeltmesi",
    area: "Dashboard",
    description: "Dashboard’daki Patron Notu, Döviz Notu ve risk aksiyonları daha kısa, daha öncelikli ve patron kokpitine uygun karar sinyalleri verecek şekilde düzenlendi.",
  },
  {
    version: "v1.17.0",
    title: "Dashboard ticari karar ekranı güçlendirme",
    area: "Dashboard",
    description: "Dashboard seçili dönem verilerinden kısa patron notu, risk aksiyonları, müşteri/ürün yorumları ve döviz bilgilendirme notuyla daha güçlü ticari karar ekranına dönüştürüldü.",
  },
  {
    version: "v1.16.7",
    title: "Dövizli ticaret özetinde cari detay görünümünü sadeleştirme ve mobil denge kontrolü",
    area: "Dashboard",
    description: "Dövizli Ticaret Özeti altındaki Cari Detay alanı daha kompakt hale getirildi; müşteri ve tedarikçi cari detaylarının mobil görünümü dengelendi.",
  },
  {
    version: "v1.16.6",
    title: "Dövizli ticaret özetinde müşteri/tedarikçi cari detayını ayırma",
    area: "Dashboard",
    description: "Dövizli Ticaret Özeti’nde müşteri cari ve tedarikçi cari toplamları ayrı ayrı gösterilmeye hazırlandı; Net Cari hesabının iki taraf arasındaki fark olduğu daha anlaşılır hale getirildi.",
  },
  {
    version: "v1.16.5",
    title: "Dövizli ticaret özetinde Net Cari açıklaması ve müşteri/tedarikçi ayrımı hazırlığı",
    area: "Dashboard",
    description: "Dövizli Ticaret Özeti’nde cari değerler Net Cari olarak netleştirildi; müşteri - tedarikçi pozisyonu görsel olarak daha anlaşılır hale getirildi.",
  },
  {
    version: "v1.16.4",
    title: "Dövizli ticaret özeti: alış/satış/cari kırılımına genişletme",
    area: "Dashboard",
    description: "Dövizli satış özeti alış ve cari kırılımıyla genişletildi; TL / USD / EUR bazında ticaret görünürlüğü artırıldı.",
  },
  {
    version: "v1.16.3",
    title: "Dashboard dövizli satış özetini kompaktlaştırma ve döviz veri hazırlığı",
    area: "Dashboard",
    description: "Dövizli satış kartları daha kompakt hale getirildi; USD/EUR boş durumları 0 değer ve kısa notla sadeleştirildi.",
  },
  {
    version: "v1.16.2",
    title: "Dashboard dövizli satış özeti ve para birimi görünürlüğü",
    area: "Dashboard",
    description: "Ana Panel’e TL / USD / EUR dövizli satış özeti eklendi; Gün Sonu Raporu önizlemesinde para birimi bazlı satış bilgisi gösterilmeye başlandı.",
  },
  {
    version: "v1.16.1",
    title: "Dashboard Gün Sonu Raporu önizleme paneli",
    area: "Dashboard",
    description: "Gün Sonu Raporu butonu güvenli önizleme paneli açacak hale getirildi; rapor önizlemesi veri yazmadan seçili dönem ticari özetini gösterir.",
  },
  {
    version: "v1.16.0",
    title: "Patron kokpiti Dashboard ana düzeni ve ticari analiz ekranı",
    area: "Dashboard",
    description: "Dashboard patron kokpiti mantığıyla düzenlendi; satış fişi, çıkan adet, müşteri, ürün, risk ve son fiş analizleri kompakt grafiklerle güçlendirildi.",
  },
  {
    version: "v1.15.6",
    title: "Ana Panel bugünkü satış fişi ve ürün çıkış detayı güçlendirme",
    area: "Dashboard",
    description: "Satış fişi sayısı, çıkan ürün adedi ve en çok alan müşteri analizleri daha anlaşılır hale getirildi.",
  },
  {
    version: "v1.15.5",
    title: "Ana Panel dönem seçici hesaplama doğrulama ve görsel denge",
    area: "Dashboard",
    description: "Dönem seçici görünümü, KPI alt metinleri ve grafik eksenleri seçili dönemlere göre daha anlaşılır hale getirildi.",
  },
  {
    version: "v1.15.4",
    title: "Ana Panel filtre ve dönem seçimi hazırlığı",
    area: "Dashboard",
    description: "Ana Panel’e kompakt dönem seçici eklendi ve ticari analizler seçilen dönem mantığına hazır hale getirildi.",
  },
];

const liveTestGuideSteps = [
  "Sol menüde mavi nokta olan sayfayı aç.",
  "Ayarlar ekranında Sistem Durumu panelini kontrol et.",
  "Canlıya Hazırlık Kontrol Listesi'ndeki hazır / hazırlıkta / bekliyor maddelerini incele.",
  "Son Sürüm Geçmişi bölümünden bu sürümde ne değiştiğini oku.",
  "Build ve Kalite Durumu kartından build kontrolünün GitHub Actions üzerinden takip edildiğini doğrula.",
  "Eğer değişiklik depo terminaliyle ilgiliyse Depo Terminali ekranında barkod/ürün kodu testini yap.",
  "Veri yazan işlem yoksa sadece ekran kontrolü yap; stok/cari/fiş işlemi deneme.",
  "Hata görürsen ekran adını, yaptığın işlemi ve hata mesajını not al.",
];

const testFeedbackTemplate = ["Ekran:", "Yaptığım işlem:", "Beklenen sonuç:", "Gördüğüm hata:", "Tekrar oluyor mu:", "Not / ekran görüntüsü:"];

function sectionHighlightProps(sectionId) {
  const isUpdated = updatedSectionIds.includes(sectionId);

  return {
    className: isUpdated ? "section-updated-highlight" : undefined,
    id: sectionId,
  };
}

function NewReleaseBadge({ sectionId }) {
  if (!updatedSectionIds.includes(sectionId)) {
    return null;
  }

  return <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>;
}

export default function SystemStatusPanel() {
  return (
    <section className="table-panel settings-panel system-status-panel">
      <div className="section-heading">
        <ShieldCheck size={19} />
        <h2>Sistem Durumu ve Güvenli Mod</h2>
      </div>

      <p className="settings-panel-description">
        Bu ekran, ERP'nin mevcut geliştirme seviyesini ve güvenli kullanım durumunu gösterir. Buradaki bilgiler sadece
        bilgilendirme amaçlıdır; herhangi bir ayar kaydetmez.
      </p>

      <ReleaseHighlightsPanel
        releaseHighlightItems={settingsReleaseHighlights.releaseHighlightItems}
        releaseJumpLinks={settingsReleaseHighlights.releaseJumpLinks}
        testChecklist={settingsReleaseHighlights.testChecklist}
      />

      <div className="system-status-focus-card">
        <span>Bu Sürümde Test Edilecek Alan</span>
        <strong>Depo Terminali / Stok ve Barkod Kalite Kontrol Merkezi</strong>
        <p>Bu sürümde stok kalite kontrolü, barkod riskleri, sayım farkları ve sistem durumu özellikle kontrol edilmelidir.</p>
      </div>

      <div className="system-workflow-panel" {...sectionHighlightProps("system-workflow-model")}>
        <div>
          <h3>GitHub PR Kontrollü Çalışma Modeli <NewReleaseBadge sectionId="system-workflow-model" /></h3>
          <p>Geliştirme main branch'e dokunmadan, ayrı branch ve manuel PR onayıyla ilerler.</p>
        </div>
        <div className="system-workflow-grid">
          {workflowRows.map((row) => (
            <article className="system-workflow-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </article>
          ))}
        </div>
        <p className="system-workflow-safety-note">
          Gerçek veri bağlantısı, DB okuma, query, import ve veri yazma işlemleri yalnızca ayrı küçük ve açık onaylı sürümlerde ele alınır.
        </p>
      </div>

      <div className="handheld-barcode-status-panel" {...sectionHighlightProps("handheld-barcode-status")}>
        <div>
          <h3>El Terminali ve Barkod Operasyonu <NewReleaseBadge sectionId="handheld-barcode-status" /></h3>
          <p>Bu sürümde saha kullanımı için el terminali, barkod, sayım ve rapor önizleme durumu tek güvenli özet altında gösterilir.</p>
        </div>
        <div className="system-status-grid">
          {handheldBarcodeStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note">
          El terminali ve barkod modülü bu sürümde gerçek stok güncellemesi, cihaz bağlantısı veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel" {...sectionHighlightProps("stock-barcode-quality-status")}>
        <div>
          <h3>Stok ve Barkod Kalite Kontrol Durumu <NewReleaseBadge sectionId="stock-barcode-quality-status" /></h3>
          <p>Bu sürüm kalite kontrol görünürlüğünü artırır ve sahadaki risk notlarını pasif özet olarak toplar.</p>
        </div>
        <div className="system-status-grid">
          {stockBarcodeQualityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note">
          Bu sürüm kalite kontrol görünürlüğü sağlar; gerçek stok düzeltme, barkod güncelleme, cihaz bağlantısı veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="build-quality-card">
        <h3>Build ve Kalite Durumu</h3>
        <div className="build-quality-grid">
          <div>
            <span>Build kontrolü</span>
            <strong>GitHub Actions</strong>
          </div>
          <div>
            <span>Lokal kontrol</span>
            <strong>npm run build</strong>
          </div>
          <div>
            <span>Durum notu</span>
            <strong>Build sonucu GitHub Actions üzerinden takip edilir.</strong>
          </div>
        </div>
        <p>
          Build status uygulama içinde görünmüyorsa GitHub Actions ekranından kontrol edilmelidir. Build kontrolü, kodun
          çalıştırılabilir olup olmadığını doğrulamak için kullanılır. Bu bilgi stok, cari veya fiş verilerini değiştirmez.
        </p>
      </div>

      <div className="version-history-panel" {...sectionHighlightProps("latest-version-history")}>
        <div>
          <h3>
            Son Sürüm Geçmişi <NewReleaseBadge sectionId="latest-version-history" />
          </h3>
          <p>
            Bu alan, son sürümlerde hangi bölümde ne değiştiğini gösterir. Sürüm numarası değiştiğinde bu liste de
            güncel tutulmalıdır.
          </p>
        </div>

        <div className="version-history-list">
          {versionHistoryRows.map((row) => (
            <article className="version-history-card" key={row.version}>
              <div>
                <strong>
                  {row.version} · {row.title}
                </strong>
                <span>Alan: {row.area}</span>
              </div>
              <p>Açıklama: {row.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="system-status-grid">
        {statusRows.map((row) => (
          <div className="system-status-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>

      <div className="system-status-maturity" {...sectionHighlightProps("project-maturity")}>
        <h3>
          Proje Olgunluk Bilgisi <NewReleaseBadge sectionId="project-maturity" />
        </h3>
        <div className="system-status-grid">
          {maturityRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="go-live-missing-panel">
          <h3>Canlıya Geçiş İçin Eksik Ana Başlıklar</h3>
          <ul>
            {goLiveMissingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Bu liste yalnızca canlıya geçiş hazırlığını takip etmek için hazırlanmıştır. Gerçek veri işlemi veya sistem
            değişikliği yapmaz.
          </p>
        </div>
      </div>

      <div className="live-test-center-panel" {...sectionHighlightProps("live-test-center")}>
        <div>
          <h3>
            Canlı Test Merkezi <NewReleaseBadge sectionId="live-test-center" />
          </h3>
          <p>Canlı test, personel denemesi ve Vega karşılaştırma adımlarını tek merkezden takip edin.</p>
        </div>

        <p className="live-test-center-warning">
          Bu merkez yalnızca manuel test rehberidir. Vega'ya bağlanmaz, veri çekmez, veri yazmaz ve test notlarını
          kaydetmez.
        </p>

        <div className="live-test-center-grid">
          <div className="live-test-guide-panel">
            <div>
              <h3>Canlı Test Rehberi</h3>
              <p>Canlı test sırasında nereden başlayacağınızı ve hangi sırayla kontrol yapacağınızı gösterir.</p>
            </div>

            <ol>
              {liveTestGuideSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <p className="live-test-guide-note">
              Bu rehber test sırasında nereden başlayacağınızı göstermek için hazırlanmıştır. Gerçek veriyle işlem
              yapmadan önce yedekleme ve geri dönüş senaryosu ayrıca test edilmelidir.
            </p>
          </div>

          <div className="live-test-checklist-panel">
            <h3>Canlı Test Checklist</h3>
            <ul>
              {liveTestChecklistItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p>
              Bu alan yalnızca manuel test rehberidir. Personel notlarını kaydetmez, dosya oluşturmaz ve veritabanına
              yazmaz.
            </p>
          </div>

          <div className="staff-trial-notes-panel">
            <h3>Personel Deneme Notları</h3>
            <pre>{staffTrialNotesTemplate.join("\n")}</pre>
          </div>

          <div className="go-live-test-plan-panel">
            <div>
              <h3>Canlıya Geçiş Test Planı</h3>
              <p>Canlı kullanım öncesinde manuel kontrol sırasını 5 günlük sade bir plan olarak takip edin.</p>
            </div>

            <ol>
              {goLiveTestPlanSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <p className="go-live-test-plan-note">
              Bu test planı yalnızca manuel kontrol rehberidir. Vega'ya bağlanmaz, veri çekmez, veri yazmaz ve
              karşılaştırmayı otomatik yapmaz.
            </p>
          </div>

          <div className="vega-comparison-panel">
            <h3>Vega Karşılaştırma Kontrol Listesi</h3>
            <ul>
              {vegaComparisonChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="vega-result-template-panel">
            <div>
              <h3>Vega Karşılaştırma Test Sonuç Şablonu</h3>
              <p>Vega ve ERP ekranlarını karşılaştırırken sonucu aynı formatta not almak için kullanılabilir.</p>
            </div>

            <pre>{vegaComparisonResultTemplate.join("\n")}</pre>
          </div>

          <div className="vega-issue-format-panel">
            <h3>Hata Kayıt Formatı</h3>
            <pre>{vegaComparisonIssueTemplate.join("\n")}</pre>
          </div>

          <div className="test-feedback-panel">
            <div>
              <h3>Testte Hata Görürsen</h3>
              <p>
                Test sırasında hata görürseniz, hatayı tekrar üretebilmek için ekran adını, yaptığınız işlemi ve görünen
                hata mesajını not alın.
              </p>
            </div>

            <pre>{testFeedbackTemplate.join("\n")}</pre>

            <p className="test-feedback-note">
              Bu bilgileri ChatGPT'ye gönderirseniz, sorun için daha net Codex promptu hazırlanabilir.
            </p>
          </div>
        </div>

        <p className="vega-template-note">
          Bu merkezdeki şablonlar yalnızca manuel not alma rehberidir. Gerçek log kaydı, dosya kaydı, API işlemi veya
          veritabanı yazma işlemi yapmaz.
        </p>
      </div>

      <div className="system-status-guide">
        <h3>Kullanım Notu</h3>
        <p>
          Bu oranlar canlı kullanıma geçiş için yaklaşık takip değerleridir. Veri yazan işlemler devreye alınmadan önce
          yedekleme, rollback, gerçek veri testi ve personel denemesi yapılmalıdır.
        </p>
      </div>

      <p className="system-status-test-note">Sol menüdeki mavi nokta, son sürümde yenilik yapılan sayfayı gösterir.</p>

      <div className="go-live-checklist">
        <div>
          <h3>Canlıya Hazırlık Kontrol Listesi</h3>
          <p>
            Bu liste, canlı kullanıma geçmeden önce takip edilmesi gereken başlıkları gösterir. Her madde yalnızca
            bilgilendirme amaçlıdır.
          </p>
        </div>

        <div className="go-live-checklist-grid">
          {goLiveChecklistGroups.map((group) => (
            <div className={`go-live-checklist-card ${group.tone}`} key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="go-live-checklist-note">
          Mevcut aşamada sistem sınırlı test ve hazırlık seviyesindedir. Vega'dan tamamen çıkış için gerçek veri testi,
          yedekleme ve personel denemesi tamamlanmalıdır.
        </p>
      </div>
    </section>
  );
}
