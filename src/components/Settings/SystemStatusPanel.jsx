import { ShieldCheck } from "lucide-react";
import ReleaseHighlightsPanel from "../Common/ReleaseHighlightsPanel.jsx";
import { APP_STAGE, APP_VERSION } from "../../config/appVersion.js";
import { closedBetaPreparationMessage, closedBetaPreparationRows } from "../../config/closedBetaPreparation.js";
import { readOnlyConnectionPlan } from "../../config/readOnlyConnectionPlan.js";
import { readOnlyFailClosedPolicy } from "../../config/readOnlyFailClosedPolicy.js";
import { passiveVegaConnectionStatusMessage, passiveVegaConnectionStatusRows } from "../../config/vegaConnectionStatus.js";
import { vegaStockFieldMap, vegaStockFieldMapWarning } from "../../config/vegaStockFieldMap.js";
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
  { label: "Çalışma modeli", value: "Main üzerinden manuel Codex akışı" },
  { label: "Kritik işlem politikası", value: "Stok, cari, fiş, yedekleme, import ve migration işlemleri ayrı kontrollü sürümlerle açılır." },
  { label: "İlk deneme", value: "Plan aşaması" },
  { label: "Rollback prosedürü", value: "Hazırlıkta" },
  { label: "Vega teknik ön kapı", value: "Pasif hazırlık" },
  { label: "İlk test sınırı", value: "20 satır" },
  { label: "ERP genel hazırlık", value: "%96" },
  { label: "Canlı güvenlik", value: "%92" },
  { label: "Yönetici görünürlüğü", value: "Güçlü" },
  { label: "Saha hazırlığı", value: "Test bekliyor" },
  { label: "Test merkezi", value: "Pasif/mock hazırlık" },
  { label: "Personel denemesi", value: "Planlandı" },
  { label: "Yönetici onayı", value: "Bekliyor" },
  { label: "Canlıya geçiş", value: "Başlamadı" },
  { label: "Yönetici raporlama", value: "Pasif/mock hazırlık" },
  { label: "Risk raporları", value: "Önizleme" },
  { label: "Günlük karar özeti", value: "Görünür" },
  { label: "Rapor export", value: "Kapalı" },
  { label: "Gerçek veri okuma", value: "Kapalı" },
  { label: "Ticari analiz", value: "Pasif/mock hazırlık" },
  { label: "Kâr marjı kontrolü", value: "Önizleme" },
  { label: "Satış kaydı", value: "Kapalı" },
  { label: "Alış kaydı", value: "Kapalı" },
  { label: "Fiyat güncelleme", value: "Kapalı" },
  { label: "El terminali operasyonu", value: "Pasif/mock hazırlık" },
  { label: "Gerçek cihaz bağlantısı", value: "Kapalı" },
  { label: "Barkod okutma entegrasyonu", value: "Gerçek cihazla bağlı değil" },
  { label: "Sayım raporu", value: "Önizleme" },
  { label: "Stok ve barkod kalite kontrolü", value: "Pasif/mock hazırlık" },
  { label: "Cari risk takibi", value: "Pasif/mock hazırlık" },
  { label: "Tahsilat kaydı", value: "Kapalı" },
  { label: "Ödeme kaydı", value: "Kapalı" },
  { label: "ERP’ye stok yazma", value: "Kapalı" },
  { label: "Vega geçiş hazırlığı", value: "Read-only yol haritası ile kademeli hazırlık sürüyor." },
];

const workflowRows = [
  { label: "Çalışma modeli", value: "Main üzerinden manuel Codex akışı" },
  { label: "Codex", value: "Local main üzerinde kodlama, build, commit ve push" },
  { label: "ChatGPT", value: "GitHub main kontrolü, risk raporu ve sonraki prompt" },
  { label: "Kritik veri işleri", value: "Ayrı küçük onaylı faz" },
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

const currentAccountRiskStatusRows = [
  { label: "Cari risk takibi", value: "Pasif/mock hazırlık" },
  { label: "Alacak öncelik matrisi", value: "Önizleme" },
  { label: "Tahsilat kaydı", value: "Kapalı" },
  { label: "Ödeme kaydı", value: "Kapalı" },
  { label: "Cari kart güncelleme", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
];

const commerceProfitabilityStatusRows = [
  { label: "Ticari analiz", value: "Pasif/mock hazırlık" },
  { label: "Satış kaydı", value: "Kapalı" },
  { label: "Alış kaydı", value: "Kapalı" },
  { label: "Fiyat güncelleme", value: "Kapalı" },
  { label: "Kâr marjı kontrolü", value: "Önizleme" },
  { label: "ERP’ye yazma", value: "Kapalı" },
];

const reportingDecisionStatusRows = [
  { label: "Yönetici raporlama", value: "Pasif/mock hazırlık" },
  { label: "Risk raporları", value: "Önizleme" },
  { label: "Günlük karar özeti", value: "Görünür" },
  { label: "Rapor export", value: "Kapalı" },
  { label: "Gerçek veri okuma", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
];

const preliveOperationTestStatusRows = [
  { label: "Test merkezi", value: "Pasif/mock hazırlık" },
  { label: "Personel denemesi", value: "Planlandı" },
  { label: "Yönetici onayı", value: "Bekliyor" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Canlıya geçiş", value: "Başlamadı" },
];

const moduleMaturityStatusRows = [
  { label: "ERP genel hazırlık", value: "%96" },
  { label: "Canlı güvenlik", value: "%92" },
  { label: "Yönetici görünürlüğü", value: "Güçlü" },
  { label: "Saha hazırlığı", value: "Test bekliyor" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Veri yazma", value: "Kapalı" },
];

const vegaTechnicalGateStatusRows = [
  { label: "Teknik ön kapı", value: "Pasif hazırlık" },
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "SQL/ODBC", value: "Kapalı" },
  { label: "DB okuma", value: "Kapalı" },
  { label: "İlk test sınırı", value: "20 satır" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyFirstTrialPlanStatusRows = [
  { label: "İlk deneme", value: "Plan aşaması" },
  { label: "Manuel yedek", value: "Zorunlu" },
  { label: "Rollback prosedürü", value: "Hazırlıkta" },
  { label: "İlk okuma sınırı", value: "20 satır" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyFinalDecisionStatusRows = [
  { label: "Son karar ekranı", value: "Pasif hazırlık" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Başlama kararı", value: "Bu ekrandan verilmez" },
  { label: "İlk kapsam", value: "Sadece stok kartı" },
  { label: "İlk sınır", value: "20 satır" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyFinalSecurityStatusRows = [
  { label: "Hazırlık fazı", value: "Kapanış kontrolü" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Sonraki faz", value: "Küçük read-only deneme" },
  { label: "İlk kapsam", value: "20 stok kartı" },
  { label: "Connection test", value: "Kapalı" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyConnectionSkeletonStatusRows = [
  { label: "Bağlantı altyapısı", value: "Pasif iskelet" },
  { label: "Canlı Vega bağlantısı", value: readOnlyConnectionPlan.connectionStatus },
  { label: "SQL/ODBC", value: readOnlyConnectionPlan.sqlOdbcStatus },
  { label: "DB okuma", value: readOnlyConnectionPlan.dbReadStatus },
  { label: "Connection test", value: "Kapalı" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyOperatorChecklistStatusRows = [
  { label: "Operatör checklist", value: "Pasif hazırlık" },
  { label: "Teknik kontrol", value: "Manuel" },
  { label: "Patron kararı", value: "Sonraki küçük faz" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Connection test", value: "Kapalı" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyFinalSecurityScanStatusRows = [
  { label: "Sürüm uyumu", value: "Kontrol edildi" },
  { label: "Mavi nokta sistemi", value: "Release yapısıyla uyumlu" },
  { label: "Pasif teknik iskelet", value: "Kapalı metadata" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Credential / query", value: "Yok" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyFailClosedStatusRows = [
  { label: "Fail-closed politika", value: "Pasif hazırlık" },
  { label: "Varsayılan bağlantı", value: readOnlyFailClosedPolicy.defaultConnectionState },
  { label: "DB okuma/query", value: "Yok" },
  { label: "Connection test", value: "Kapalı" },
  { label: "Credential saklama", value: "Yok" },
  { label: "ERP’ye yazma/import", value: "Kapalı" },
];

const readonlyEnvironmentPrepStatusRows = [
  { label: "Ortam bilgisi", value: "Manuel hazırlanacak" },
  { label: "Sunucu/DB bilgisi", value: "Bu ekranda tutulmaz" },
  { label: "Read-only kullanıcı", value: "Manuel hazırlanacak" },
  { label: "Test ortamı", value: "Karar bekliyor" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Credential / veri yazma", value: "Yok" },
];

const readonlyStockSmokeStatusRows = [
  { label: "Deneme yöntemi", value: "Local script" },
  { label: "Kapsam", value: "Sadece stok kartı" },
  { label: "Limit", value: "20 satır" },
  { label: "Hata sınıfları", value: "Güvenli Türkçe özet" },
  { label: "ERP arayüzünden bağlantı", value: "Yok" },
  { label: "Veri yazma/import", value: "Kapalı" },
  { label: "Sonuç yazma", value: "Yok" },
];

const readonlyStockProofStatusRows = [
  { label: "Test türü", value: "Read-only stok smoke test" },
  { label: "Sonuç", value: "Başarılı" },
  { label: "Okunan satır", value: "20" },
  { label: "Tablo kapsamı", value: "F0102TBLSTOKLAR" },
  { label: "Kolon doğrulama", value: "Başarılı" },
  { label: "Veri yazma/import", value: "Yapılmadı" },
  { label: "Dosyaya çıktı", value: "Alınmadı" },
  { label: "ERP arayüzünden bağlantı", value: "Yok" },
];

const readonlyStockPreviewStatusRows = [
  { label: "Önizleme ekranı", value: "Manuel read-only" },
  { label: "Otomatik bağlantı", value: "Yok" },
  { label: "Tablo kapsamı", value: "F0102TBLSTOKLAR" },
  { label: "Limit", value: "20 stok kartı" },
  { label: "Geçici state", value: "Ekranda tutulur" },
  { label: "Dosyaya çıktı", value: "Yok" },
  { label: "ERP’ye yazma/import", value: "Yok" },
  { label: "Cari/fiş/hareket", value: "Kapsam dışı" },
];

const readonlyStockPreviewSecurityStatusRows = [
  { label: "Önizleme sonucu", value: "Başarılı" },
  { label: "Görünen satır", value: "20" },
  { label: "Git durumu", value: "Temiz" },
  { label: "Dosyaya çıktı", value: "Yok" },
  { label: "Log sızıntısı", value: "Yok" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Import/senkron", value: "Yok" },
  { label: ".env.local", value: "Git dışında" },
  { label: "Sonraki hedef", value: "Stok önizleme kullanım iyileştirme" },
];

const readonlyStockPreviewUsabilityStatusRows = [
  { label: "Arama kutusu", value: "Eklendi" },
  { label: "Arama kapsamı", value: "Geçici 20 satır" },
  { label: "Arama alanları", value: "Stok Kodu / Ürün Adı" },
  { label: "Yeni bağlantı", value: "Başlatmaz" },
  { label: "Kolon açıklamaları", value: "Netleştirildi" },
  { label: "Fiyat gösterimi", value: "Aday format" },
  { label: "Boş değerler", value: "—" },
  { label: "Dosyaya çıktı/import", value: "Yok" },
];

const stockFieldValidationStatusRows = [
  { label: "Yüksek güven", value: "STOKKODU / MALINCINSI" },
  { label: "Teknik alan", value: "IND" },
  { label: "Doğrulanacak kod alanları", value: "KOD1 / KOD2 / KOD4 / KOD6" },
  { label: "Doğrulanacak fiyat alanları", value: "ALISFIYATI / ISKSATISFIYATI2 / ISKSATISFIYATI3" },
  { label: "KDV kontrolü", value: "KDVGRUBU" },
  { label: "Gerçek veri yazma", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
];

const stockManualValidationChecklistStatusRows = [
  { label: "Manuel doğrulama checklist’i", value: "Hazır" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Vega’ya yazma", value: "Yok" },
  { label: "Dosyaya çıktı", value: "Yok" },
  { label: "Local DB kaydı", value: "Yok" },
  { label: "Sonraki hedef", value: "Doğrulanan alanlara göre stok önizleme kolonlarını netleştirme" },
];

const stockFieldLabelingStatusRows = [
  { label: "Önerilen etiketler", value: "Hazır" },
  { label: "Kesinleşmiş alanlar", value: "STOKKODU / MALINCINSI / IND" },
  { label: "Doğrulanacak alanlar", value: "KOD1 / KOD2 / KOD4 / KOD6 / fiyat / KDV" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
];

const stockColumnVisibilityStatusRows = [
  { label: "Kolon görünürlüğü", value: "Hazır" },
  { label: "Geçici seçim", value: "Evet" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Sonraki hedef", value: "Stok önizleme ekranını sadeleştirme" },
];

const stockPreviewPanelSimplificationStatusRows = [
  { label: "Panel sadeleştirme", value: "Hazır" },
  { label: "Açılır bölümler", value: "Alan etiketleri / doğrulama notları / checklist" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Kapsam", value: "20 satır" },
  { label: "Kalıcı panel kaydı", value: "Yok" },
];

const stockPreviewUserTestStatusRows = [
  { label: "Kullanıcı testi", value: "Hazır" },
  { label: "Son okuma özeti", value: "Geçici ekran state" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Sonraki hedef", value: "Vega/stok ekranı genel sadeleştirme" },
];

const vegaStockScreenSimplificationStatusRows = [
  { label: "Vega stok ekranı sadeleştirme", value: "Hazır" },
  { label: "Gelişmiş paneller", value: "Varsayılan kapalı" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Kapsam", value: "20 satır read-only" },
  { label: "Kalıcı panel/test kaydı", value: "Yok" },
];

const stockPreviewBetaPackageStatusRows = [
  { label: "Stok önizleme beta hazırlığı", value: "Hazır" },
  { label: "Veri kapsamı", value: "20 satır read-only" },
  { label: "Paket testi", value: "Bekliyor" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Dosyaya çıktı", value: "Yok" },
];

const vegaStockFieldMapStatusRows = [
  { label: "Alan haritası", value: "Pasif dokümantasyon" },
  { label: "Kolon sayısı", value: `${vegaStockFieldMap.length} alan` },
  { label: "Yüksek güven", value: "IND / STOKKODU / MALINCINSI" },
  { label: "Orta güven", value: "Fiyat ve KDV adayları" },
  { label: "Düşük güven", value: "KOD sınıflandırmaları" },
  { label: "Kesinleştirme", value: "Örnek satır incelemesi sonrası" },
];

const passiveVegaConnectionStatusCards = passiveVegaConnectionStatusRows;

const closedBetaPreparationStatusRows = closedBetaPreparationRows;

const desktopPreparationStatusRows = [
  { label: "Uygulama modu", value: "Local Desktop" },
  { label: "Vega bağlantısı", value: "Kapalı / sadece terminal smoke test" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Canlı import", value: "Kapalı" },
  { label: ".env.local", value: "Git dışı tutulmalı" },
  { label: "Son güvenli entegrasyon", value: "v1.45.0 read-only stock smoke" },
];

const versionHistoryRows = [
  {
    version: "v1.84.1",
    title: "Vega Stok Hareket Alanları Keşif Hazırlığı",
    area: "Vega Stok Deneme / Sistem Durumu",
    description: "Top 100 stok çıkışı sorgusuna geçmeden önce stok hareket tablosu, stok kodu, çıkış miktarı, hareket yönü, hareket tarihi ve stok kartı bağlantı alanları için pasif keşif hazırlık paneli eklendi; canlı hareket verisi okunmadı, Top 100 sorgusu çalıştırılmadı, gerçek sorgu veya tablo/kolon eşlemesi eklenmedi, veri yazma, import, senkron, export, local DB kaydı, dosya üretimi veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.84.0",
    title: "Vega Top 100 Stok Çıkışı Read-only Önizleme",
    area: "Vega Stok Deneme / Dashboard / Sistem Durumu",
    description: "Vega Stok Deneme ekranına Top 100 stok çıkışı için güvenli read-only hazırlık paneli ve Dashboard'a kısa özet eklendi; hareket tablosu, stok kodu, çıkış miktarı, hareket yönü ve tarih alanları doğrulanamadığı için gerçek sorgu eklenmedi, buton kilitli bırakıldı; otomatik bağlantı, yeni veri okuma, local DB kaydı, dosya üretimi, veri yazma, form/input/localStorage, import/senkron/export veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.83.0",
    title: "Stok Ekranı Alan Etiketi Netleştirme Planı",
    area: "Dashboard / Sistem Durumu",
    description: "Stok kullanıcı test oturumu sonrası stok ekranında kullanıcıların anlayacağı iş seviyesi alan etiketleri ve etiket düzeltme planı pasif panel olarak eklendi; gerçek Vega alan eşlemesi, bağlantı denemesi, SQL sorgusu, yeni stok verisi okuma, veri yazma, form/input/localStorage, kullanıcı notu kaydı, import/senkron/export veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.82.1",
    title: "Stok Kullanıcı Test Oturumu Karar Netleştirme",
    area: "Dashboard / Sistem Durumu",
    description: "Stok önizleme kullanıcı test oturumu paneli, oturum sonunda verilecek manuel kararları Geçti, Küçük düzeltme, Ertelendi ve Durduruldu sınıflarıyla pasif olarak netleştirecek şekilde genişletildi; karar kaydı, onay alma, test çalıştırma, bağlantı açma, veri okuma/yazma, form/input/localStorage, import/senkron/export veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.82.0",
    title: "Stok Önizleme Kullanıcı Test Oturumu Paneli",
    area: "Dashboard / Sistem Durumu",
    description: "Stok önizleme kullanıcı doğrulama aşamasından sonra şirket içi manuel kullanıcı test oturumunun katılımcıları, süresi, 20 satır read-only kapsamı, sözlü/manuel not yöntemi, sistem kaydı olmadığı ve oturum akışı pasif panel olarak eklendi; test başlatma, bağlantı açma, veri okuma/yazma, form/input/localStorage, kullanıcı notu kaydı, import/senkron/export veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.81.1",
    title: "Stok Önizleme Kullanıcı Doğrulama Netleştirme",
    area: "Dashboard / Sistem Durumu",
    description: "Stok önizleme kullanıcı doğrulama akışı, kontrolde sorun görülürse izlenecek pasif karar rehberi ve doğrulama sonucunun nasıl yorumlanacağı listeleriyle genişletildi; test çalıştırma, bağlantı açma, yeni veri okuma, veri yazma, import/senkron/export, form/input/localStorage, kullanıcı notu kaydı veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.81.0",
    title: "Stok Önizleme Kullanıcı Doğrulama Akışı",
    area: "Dashboard / Sistem Durumu",
    description: "Başarılı kabul edilen 20 satırlık stok read-only smoke testten sonra kullanıcı doğrulama sırası pasif panel olarak eklendi; satır sayısı, stok kodu, ürün adı, barkod/etiket, marka/kategori, fiyat mantığı, KDV, boş alan ve son karar notu için rol, risk ve sonraki adımlar görünür hale getirildi; bağlantı denemesi, test çalıştırma, yeni veri okuma, veri yazma, import/senkron/export, form girişi, localStorage veya hassas bilgi eklenmedi.",
  },
  {
    version: "v1.80.4",
    title: "Stok Smoke Test Sonuç Özeti Paneli",
    area: "Dashboard / Sistem Durumu",
    description: "Şirket ortamındaki kontrollü stok read-only smoke test sonucunu canlı stok verisi veya hassas bağlantı bilgisi göstermeden özetleyen pasif panel eklendi; önceki başarılı bağlantı, 20 satır sınırı, stok dışı veri okunmadığı, veri yazma/import/senkron/export ve dosya çıktısı olmadığı görünür hale getirildi; test çalıştırma, bağlantı açma, SQL sorgusu veya veri okuma/yazma eklenmedi.",
  },
  {
    version: "v1.80.3",
    title: "sa ile Kontrollü Stok Read-only Test Modu",
    area: "Dashboard / Sistem Durumu",
    description: "Read-only SQL kullanıcısı ertelenirken şirket ortamında geçici sa kullanım kararını, orta-yüksek risk seviyesini, sadece stok ve 20 satır sınırını, veri yazma/import/senkron/export ile cari/sipariş/kasa-finans kapsamının kapalı olduğunu pasif panel olarak görünür hale getirdi; bağlantı denemesi, SQL sorgusu, veri okuma/yazma veya hassas bağlantı bilgisi eklenmedi.",
  },
  {
    version: "v1.80.2",
    title: "Read-only SQL Kullanıcısına Geçiş Planı",
    area: "Dashboard / Sistem Durumu",
    description: "Şirket ortamındaki tek seferlik sa smoke testinden sonra read-only SQL kullanıcısına geçiş için pasif plan paneli eklendi; hedef sadece SELECT yetkisi, sadece stok kapsamı, 20 satır limiti ve tekrar sa testi yapılmayacağı görünür hale getirildi; kullanıcı oluşturma, bağlantı denemesi, SQL sorgusu, veri okuma/yazma, import/senkron/export veya hassas bağlantı bilgisi eklenmedi.",
  },
  {
    version: "v1.80.0",
    title: "Vega Stok Read-only Şirket Ortamı Ön Test",
    area: "Dashboard / Sistem Durumu",
    description: "Gerçek Vega stok read-only smoke testinden önce şirket bilgisayarında local main, build, stash, sadece stok kapsamı, 20 satır sınırı, veri yazma kilidi ve manuel test şartları pasif panel olarak görünür hale getirildi; bağlantı denemesi, SQL sorgusu, veri okuma/yazma, import/senkron/export, dosya/export veya hassas bağlantı bilgisi eklenmedi.",
  },
  {
    version: "v1.79.0",
    title: "Barkod El Terminali Geliştirme Yol Haritası",
    area: "Dashboard / Sistem Durumu",
    description: "ERP öncelik sıralamasında ikinci sıradaki Barkod / El Terminali modülü için barkod senaryosu tanımı, barkodsuz ürün listesi hazırlığı, duplicate barkod kontrol mantığı, Honeywell okutma akışı taslağı, sayım farkı kontrol akışı, depo personel kullanım ekranı ve Vega'ya yazmadan read-only karşılaştırma fazları pasif yol haritası olarak eklendi; gerçek barkod okutma, cihaz bağlantısı, veri okuma/yazma, SQL/Vega işlemi, import/senkron/export, dosya/export veya görev/onay kaydı eklenmedi.",
  },
  {
    version: "v1.78.0",
    title: "Stok Yönetimi Geliştirme Yol Haritası",
    area: "Dashboard / Sistem Durumu",
    description: "ERP öncelik sıralamasında ilk sıradaki Stok Yönetimi için read-only bağlantı doğrulama, 20 satır kullanıcı doğrulaması, arama/filtre olgunlaştırma, barkod/duplicate kontrol hazırlığı, stok detay görünümü, stok risk etiketleri ve depo/personel kullanım ekranı fazları pasif yol haritası olarak eklendi; yeni stok verisi okuma, SQL sorgusu, veri yazma, import/senkron/export, dosya/export veya stok dışı kapsam eklenmedi.",
  },
  {
    version: "v1.77.0",
    title: "ERP Modül Öncelik Sıralaması",
    area: "Dashboard / Sistem Durumu",
    description: "ERP geliştirme sürecinde Stok Yönetimi, Barkod/El Terminali, Cari Yönetimi, Sipariş Yönetimi, Kasa/Finans, Raporlama, Rol ve Yetki ile Canlıya Geçiş modülleri için öncelik, neden önemli olduğu, risk seviyesi ve sonraki teknik adım pasif olarak görünür hale getirildi; modül açma, görev oluşturma, veri okuma/yazma, SQL/Vega işlemi, dosya/export veya onay kaydı eklenmedi.",
  },
  {
    version: "v1.76.0",
    title: "Personel Kullanım Ekranları Haritası",
    area: "Dashboard / Sistem Durumu",
    description: "ERP'nin eksik ana katmanlarından personel kullanım ekranları, depo stok kontrol, barkod/el terminali kontrol, satış sipariş takip, muhasebe cari risk, tahsilat hazırlık, yönetici gün sonu ve teknik entegrasyon ekranları için kullanacak rol, veri modu, risk seviyesi ve sonraki adımı gösteren pasif haritayla görünür hale getirildi; gerçek login, kullanıcı kaydı, görev atama, veri okuma/yazma, SQL/Vega işlemi, dosya/export veya onay kaydı eklenmedi.",
  },
  {
    version: "v1.75.0",
    title: "Veri Alan Sözlüğü",
    area: "Dashboard / Sistem Durumu",
    description: "ERP'nin eksik ana katmanlarından veri alan sözlüğü, stok, barkod, cari, sipariş, kasa/finans ve raporlama alan grupları için yalnızca iş seviyesi alan örnekleri, durum, risk seviyesi ve sonraki doğrulama adımıyla pasif olarak görünür hale getirildi; gerçek Vega tablo alanı, kesin alan eşlemesi, veri okuma/yazma, SQL sorgusu, dosya/export veya onay kaydı eklenmedi.",
  },
  {
    version: "v1.74.0",
    title: "Risk ve Uyarı Merkezi",
    area: "Dashboard / Sistem Durumu",
    description: "ERP'nin eksik ana katmanlarından risk ve uyarı merkezi, kritik stok, barkodsuz ürün, duplicate barkod, riskli cari, geciken tahsilat, düşük marj, hatalı fiyat, finansal risk ve entegrasyon riski için seviye, veri modu, sorumlu rol ve sonraki adımı gösteren pasif merkezle görünür hale getirildi; gerçek alarm, bildirim, görev kaydı, veri okuma/yazma, SQL/Vega işlemi, dosya/export veya onay kaydı eklenmedi.",
  },
  {
    version: "v1.73.0",
    title: "Günlük Operasyon İş Akışı Merkezi",
    area: "Dashboard / Sistem Durumu",
    description: "ERP'nin eksik ana katmanlarından günlük operasyon iş akışı, sabah stok kontrolü, barkod/el terminali kontrolü, cari risk, sipariş takip, tahsilat/ödeme hazırlığı ve gün sonu yönetici özeti için sorumlu rol, veri modu, risk seviyesi ve sonraki adımı gösteren pasif merkezle görünür hale getirildi; görev/kullanıcı kaydı, otomatik hatırlatma, veri okuma/yazma, SQL/Vega işlemi, dosya/export veya onay kaydı eklenmedi.",
  },
  {
    version: "v1.72.0",
    title: "Rol ve Yetki Matrisi",
    area: "Dashboard / Sistem Durumu",
    description: "ERP'nin eksik ana katmanlarından rol ve yetki yapısı, Patron/Yönetici, Muhasebe, Depo, Satış, Sadece Görüntüleme ve Teknik Admin rolleri için görünüm seviyesi, veri modu, risk seviyesi ve sonraki adımı gösteren pasif matrisle görünür hale getirildi; gerçek login, kullanıcı kaydı, yetki kaydı, veri yazma, SQL/Vega işlemi veya hassas bilgi saklama eklenmedi.",
  },
  {
    version: "v1.71.0",
    title: "ERP Ana Omurga ve Modül Haritası",
    area: "Dashboard / Sistem Durumu",
    description: "Dashboard'a ana ERP modüllerini durum, veri modu, risk seviyesi ve sonraki adımla gösteren pasif omurga paneli eklendi; eksik ana katmanlar ve bu sürümün yapmadığı güvenli işlemler veri okuma/yazma, SQL/Vega bağlantısı, tablo/sorgu, dosya/export veya onay kaydı olmadan netleştirildi.",
  },
  {
    version: "v1.70.2",
    title: "Vega Stok Read-only Local Test Hazırlığı",
    area: "Dashboard / Sistem Durumu",
    description: "Gerçek Vega stok read-only testinden önce local terminal hazırlığı pasif panel olarak eklendi; mevcut stok smoke scriptinin manuel, sadece stok ve 20 satır sınırlı, dosyasız ve hassas hata gizleyen yapısı bağlantı denemesi yapılmadan kaynak üzerinden kontrol edildi.",
  },
  {
    version: "v1.70.1",
    title: "Vega Stok Read-only Bağlantı Ön Kontrolü",
    area: "Dashboard / Sistem Durumu",
    description: "Gerçek Vega stok read-only bağlantısından önce read-only kullanıcı, manuel yedek, .env.local, 20 satır limiti ve manuel buton şartlarını bağlantı denemesi, SQL sorgusu veya veri okuma yapmadan gösteren pasif ön kontrol paneli eklendi.",
  },
  {
    version: "v1.70.0",
    title: "Vega Stok Read-only Bağlantı Sağlamlaştırma",
    area: "Dashboard / Vega Stok Deneme / Sistem Durumu",
    description: "Stok read-only kapsamı sadece stok kartı, manuel tetikleme ve 20 satır sınırıyla sağlamlaştırıldı; Vega Stok Deneme ekranındaki otomatik okuma çağrısı manuel butona taşındı ve veri yazma/import/senkron/export ile cari/sipariş/kasa-finans kapsamı kapalı tutuldu.",
  },
  {
    version: "v1.69.1",
    title: "Yönetici Sunum Özeti Netleştirme",
    area: "Dashboard / Sistem Durumu",
    description: "Yönetici Sunum Özeti Paneli, tek cümlelik özet, sunum amacı ve panelin yapmadığı işlemlerle veri okuma/yazma, dosya/rapor üretimi veya onay kaydı eklemeden pasif olarak netleştirildi.",
  },
  {
    version: "v1.69.0",
    title: "Yönetici Sunum Özeti Paneli",
    area: "Dashboard / Sistem Durumu",
    description: "Patron onay paketi paneli yakınına ERP'nin read-only hazırlık durumunu, yapılmayan işlemleri ve sıradaki yönetici kararlarını dosya/rapor üretmeden, onay kaydetmeden ve SQL/Vega işlemi başlatmadan gösteren pasif sunum özeti eklendi.",
  },
  {
    version: "v1.68.1",
    title: "Patron Onay Paketi Netleştirme",
    area: "Dashboard / Sistem Durumu",
    description: "Patron Onay Paketi Hazırlık Paneli, patrona sunulmadan önce kontrol edilecekler ve panelin yapmadığı işlemler ayrı pasif listelerle daha anlaşılır hale getirildi.",
  },
  {
    version: "v1.68.0",
    title: "Patron Onay Paketi Hazırlık Paneli",
    area: "Dashboard / Sistem Durumu",
    description: "Read-only test raporu paneli yakınına onay kaydı, dosya oluşturma, veri okuma/yazma veya SQL/Vega işlemi başlatmadan patrona sunulacak onay paketi başlıklarını gösteren pasif hazırlık paneli eklendi.",
  },
  {
    version: "v1.67.1",
    title: "Read-only Test Raporu Kontrol Netleştirme",
    area: "Dashboard / Sistem Durumu",
    description: "Read-only Test Raporu Hazırlık Paneli, panelin ne yapmadığını ve manuel test raporunda bulunması gereken karar özetini daha açık gösterecek şekilde pasif olarak genişletildi.",
  },
  {
    version: "v1.67.0",
    title: "Read-only Test Raporu Hazırlık Paneli",
    area: "Dashboard / Sistem Durumu",
    description: "Canlıya geçiş eksik listesi yakınına rapor dosyası oluşturmadan, test sonucu kaydetmeden, SQL/Vega işlemi veya veri yazma başlatmadan manuel test raporu başlıklarını gösteren pasif hazırlık paneli eklendi.",
  },
  {
    version: "v1.66.2",
    title: "Canlıya Geçiş Eksik Listesi",
    area: "Dashboard / Sistem Durumu",
    description: "Canlıya Geçiş Karar Paneli yakınına görev kaydı, onay kaydı, SQL/Vega işlemi veya veri yazma başlatmadan kalan işleri durum etiketleriyle gösteren pasif eksik listesi eklendi.",
  },
  {
    version: "v1.66.1",
    title: "Kasa Finans Hazırlık Kapısı Durum Netleştirme",
    area: "Dashboard / Sistem Durumu",
    description: "Kasa/Finans Hazırlık Kapısı patron bakışı için neden kapalı kaldığını, finans açılmadan önce gereken 5 şartı ve yalnızca iş seviyesi aday özet etiketlerini pasif güvenlik sınırlarıyla netleştirdi.",
  },
  {
    version: "v1.62.0",
    title: "Stok Önizleme Test Sonrası Temizlik ve Paket Hazırlığı",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizleme modülü kapalı beta paketi öncesi son temizlik ve hazırlık görünürlüğüne alındı; kapalı beta test notu, paket hazırlık durumu ve 20 satırlık read-only güvenlik sınırı netleştirildi.",
  },
  {
    version: "v1.61.0",
    title: "Vega Stok Ekranı Genel Sadeleştirme",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Vega Read-only Stok Önizleme ekranı günlük kullanım için sade ana akışa alındı; alan etiketleri, doğrulama notları, manuel checklist ve kullanıcı test notu tek kapalı Gelişmiş Alan Doğrulama paneli altında toplandı, yeni SQL veya veri yazma eklenmedi.",
  },
  {
    version: "v1.60.0",
    title: "Stok Önizleme Kullanıcı Testi ve Son Okuma Özeti",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizleme ekranına geçici son okuma özeti ve kullanıcı test notu alanı eklendi; sonuç/test state’i kalıcı kaydedilmez, yeni SQL, kapsam büyütme, veri yazma, import/senkron veya dosya çıktısı oluşturmaz.",
  },
  {
    version: "v1.59.0",
    title: "Stok Önizleme Panel Sadeleştirme",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizleme ekranı güvenlik mesajı, manuel çalıştırma, özet, arama, kolon görünürlüğü, tablo ve açılır destek panelleri sırasına toparlandı; panel state’i geçici kaldı, yeni SQL, kapsam büyütme, veri yazma veya import/senkron eklenmedi.",
  },
  {
    version: "v1.58.0",
    title: "Stok Önizleme Kolon Görünürlüğü Kontrolü",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizleme ekranında zaten gelen 20 satırın kolonları geçici olarak gösterilip gizlenebilir hale getirildi; görünürlük seçimi frontend state içinde kalır, local DB/dosya/Vega yazma, yeni SQL veya kapsam büyütme oluşturmaz.",
  },
  {
    version: "v1.57.0",
    title: "Doğrulama Sonrası Stok Alan Etiketleme Hazırlığı",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizleme alanları için geçici önerilen etiketler ve güven seviyeleri görünür hale getirildi; KOD, fiyat ve KDV alanları doğrulanacak aday olarak kaldı, yeni SQL, kalıcı kayıt, dosya çıktısı, veri yazma veya import/senkron eklenmedi.",
  },
  {
    version: "v1.56.0",
    title: "Stok Alan Manuel Doğrulama Checklist’i",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Vega ekranı ile uygulamadaki read-only stok önizleme alanlarını manuel karşılaştırmak için geçici checklist eklendi; durum seçimleri yalnızca frontend state içinde kalır, local DB/dosya/Vega yazma veya kalıcı kayıt oluşturmaz.",
  },
  {
    version: "v1.55.0",
    title: "Stok Alan Anlamlandırma ve Doğrulama Hazırlığı",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizlemede gelen kolonların nasıl yorumlanacağı pasif doğrulama rehberi olarak eklendi; STOKKODU ve MALINCINSI yüksek güvenli, IND teknik alan, KOD/fiyat/KDV alanları ise Vega ekranı ve örnek satırlarla doğrulanacak aday alanlar olarak gösterildi.",
  },
  {
    version: "v1.54.0",
    title: "Stok Önizleme Kullanım İyileştirme",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Read-only stok önizleme ekranında arama kutusu, kolon açıklamaları, aday fiyat formatı, boş değer gösterimi ve önizleme sonrası özet iyileştirildi; arama yalnızca ekranda gelen geçici 20 satır üzerinde çalışır ve yeni SQL/bağlantı başlatmaz.",
  },
  {
    version: "v1.53.0",
    title: "Read-only Stok Önizleme Güvenlik Teyidi",
    area: "Dashboard / Sistem Durumu / README",
    description: "Uygulama içi stok önizlemenin 20 satırla başarılı çalıştığı, sonucun geçici ekranda kaldığı, git durumunun temiz olduğu, log içinde canlı stok/veritabanı anahtar kelimeleri bulunmadığı, dosyaya çıktı alınmadığı, import/senkron ve veri yazma yapılmadığı pasif güvenlik teyidi olarak belgelendi.",
  },
  {
    version: "v1.52.0",
    title: "Vega Read-only Stok Önizleme Ekranı",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "Uygulama içinden yalnızca manuel kullanıcı aksiyonuyla çalışan, F0102TBLSTOKLAR ve 20 stok kartı sınırındaki geçici read-only stok önizleme ekranı eklendi; otomatik bağlantı, veri yazma, import/senkron, dosyaya çıktı, cari/fiş/hareket okuma veya bağlantı bilgisi gösterimi eklenmedi.",
  },
  {
    version: "v1.51.0",
    title: "İlk Başarılı Read-only Vega Stok Okuma Kanıtı",
    area: "Dashboard / Sistem Durumu / README",
    description: "İlk başarılı read-only stok smoke test sonucu canlı stok değerleri, SQL kullanıcı bilgileri veya bağlantı bilgileri repoya yazılmadan teknik metadata olarak görünür hale getirildi; 20 satır ve beklenen kolonlar doğrulandı, veri yazma/import/senkron/dosyaya çıktı yapılmadı.",
  },
  {
    version: "v1.50.0",
    title: "İlk Kapalı Beta Desktop Hazırlığı",
    area: "Dashboard / Sistem Durumu / README",
    description: "Kapalı beta hazırlık merkezi patron bilgisayarında masaüstü deneme kapsamını görünür hale getirdi; Local Desktop, Windows hedefi, build kontrolü, Electron paket doğrulaması ve canlı Vega/veri yazma/import kilitleri pasif olarak gösterildi; canlı kullanım veya arayüzden bağlantı eklenmedi.",
  },
  {
    version: "v1.49.0",
    title: "Pasif Vega Bağlantı Durumu",
    area: "Dashboard / Sistem Durumu / README",
    description: "ERP içinde canlı bağlantı başlatmayan pasif Vega Bağlantı Durumu görünürlüğü eklendi; local terminal smoke test seviyesi, F0102TBLSTOKLAR kapsamı, 20 stok kartı limiti, veri yazma/import kilitleri ve v1.48.0 alan haritası durumu gösterildi; yeni SQL, .env.local okuma veya veri çekme eklenmedi.",
  },
  {
    version: "v1.48.0",
    title: "Vega Stok Kartı Alan Haritası",
    area: "Dashboard / Sistem Durumu / README",
    description: "Read-only stok smoke test kolonları için pasif alan haritası eklendi; IND, STOKKODU, MALINCINSI, KOD alanları, fiyat adayları ve KDVGRUBU muhtemel ERP karşılıklarıyla ve güven seviyesiyle gösterildi; yeni SQL, canlı bağlantı, veri yazma veya import eklenmedi.",
  },
  {
    version: "v1.47.0",
    title: "Read-only SQL/Vega Hata Sınıflandırma Güçlendirmesi",
    area: "Local script / Sistem Durumu / README",
    description: "Read-only stok smoke test scriptinde ENV_MISSING, SQL_AUTH_FAILED, SQL_NETWORK_FAILED, SQL_PERMISSION_DENIED, SQL_TABLE_OR_COLUMN_MISMATCH, SQL_TIMEOUT ve SQL_UNKNOWN_SAFE hata sınıfları güvenli Türkçe açıklamalarla görünür hale getirildi; ham hata, credential, connection string veya veri yazma eklenmedi.",
  },
  {
    version: "v1.46.0",
    title: "Electron Desktop Güvenlik ve Hazırlık Merkezi",
    area: "Electron / Dashboard / Sistem Durumu / README",
    description: "Electron masaüstü başlığı ve local desktop görünürlüğü güçlendirildi; Desktop Hazırlık Merkezi ile Vega bağlantısı, veri yazma, import ve .env.local güvenliği pasif olarak görünür hale getirildi; ERP arayüzünden canlı bağlantı, API veya veri yazma eklenmedi.",
  },
  {
    version: "v1.45.0",
    title: "İlk Gerçek Read-only Stok Kartı Okuma Denemesi",
    area: "Local script / Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only stok kartı okuma denemesi için local terminal scripti eklendi; script yalnızca F0102TBLSTOKLAR tablosundan 20 satır okur, sonucu terminalde gösterir, ERP arayüzünden bağlantı başlatmaz ve dosyaya sonuç yazmaz.",
  },
  {
    version: "v1.44.0",
    title: "Read-only Bağlantı Ortam Bilgisi Manuel Hazırlık Merkezi",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk read-only bağlantı öncesi SQL Server, DB adı, read-only kullanıcı, manuel yedek, test bilgisayarı ve test ortamı kararları pasif rehber olarak görünür hale getirildi; gerçek bağlantı, credential, query veya veri yazma eklenmedi.",
  },
  {
    version: "v1.43.0",
    title: "İlk Read-only Bağlantı Denemesi Fail-closed Hazırlık Kabuğu",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk read-only bağlantı denemesi öncesi fail-closed güvenlik kabuğu pasif olarak hazırlandı; DB okuma, query, connection test, credential ve veri yazma kilitleri görünür hale getirildi; gerçek bağlantı, API veya veri yazma eklenmedi.",
  },
  {
    version: "v1.42.1",
    title: "Read-only Öncesi Son Güvenlik Tarama ve Temizlik",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only bağlantı öncesi sürüm uyumu, mavi nokta görünürlüğü, pasif teknik iskelet ve güvenlik metinleri son kez pasif olarak kontrol edildi; gerçek bağlantı, DB okuma, query, API, credential, connection test veya veri yazma eklenmedi.",
  },
  {
    version: "v1.42.0",
    title: "Read-only İlk Bağlantı Operatör Checklist Merkezi",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only bağlantı öncesi operatör, teknik sorumlu ve patron checklist'i pasif olarak görünür hale getirildi; manuel yedek, read-only kullanıcı, 20 satır sınırı, timeout, ham hata gizleme ve rollback sorumlusu netleştirildi; gerçek bağlantı, DB okuma, query, API, connection test veya veri yazma eklenmedi.",
  },
  {
    version: "v1.41.0",
    title: "Read-only Bağlantı Altyapısı Pasif Teknik İskeleti",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only bağlantı öncesi kapalı pasif teknik iskelet hazırlandı; bağlantı modu, güvenlik kilitleri, ilk kapsam, timeout ve hata politikası görünür hale getirildi; gerçek bağlantı, DB okuma, query, API, connection test veya veri yazma eklenmedi.",
  },
  {
    version: "v1.40.0",
    title: "Read-only Bağlantı Öncesi Final Güvenlik Kapanışı",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only bağlantı öncesi hazırlık fazı final güvenlik kapanışıyla kapatıldı; yapılmayacak işlemler, kapalı kilitler ve sonraki küçük read-only bağlantı sınırı görünür hale getirildi; gerçek bağlantı, DB okuma, query, API, connection test veya veri yazma eklenmedi.",
  },
  {
    version: "v1.39.0",
    title: "Read-only İlk Deneme Son Karar Merkezi",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only deneme öncesi son karar kriterleri, başla/başlama mantığı, kapsam sınırı ve güvenlik kilitleri pasif olarak görünür hale getirildi; gerçek bağlantı, DB okuma, query, API, connection test veya veri yazma eklenmedi.",
  },
  {
    version: "v1.38.0",
    title: "Read-only İlk Deneme Planı ve Geri Dönüş Prosedürü",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek read-only deneme öncesi manuel yedek, rollback, başarısızlık senaryoları ve test sonrası değerlendirme şablonu pasif olarak görünür hale getirildi; gerçek bağlantı, DB okuma, query, API, connection test veya veri yazma eklenmedi.",
  },
  {
    version: "v1.37.0",
    title: "Vega Read-only Teknik Ön Kapı Merkezi",
    area: "Vega Import Önizleme / Dashboard / Sistem Durumu / README",
    description: "İlk gerçek Vega read-only bağlantı öncesi manuel yedek, read-only kullanıcı, 20 satır sınırı, timeout ve ham hata gizleme şartları pasif teknik ön kapıda toplandı; gerçek bağlantı, DB okuma, query, API veya veri yazma eklenmedi.",
  },
  {
    version: "v1.36.0",
    title: "Modül Olgunluk ve Canlıya Hazırlık Skor Merkezi",
    area: "Raporlar / Dashboard / Sistem Durumu / README",
    description: "ERP modüllerinin olgunluk ve canlıya hazırlık seviyeleri yüzdeli skorlarla tek pasif/mock merkezde toplandı; gerçek bağlantı, cihaz entegrasyonu, DB okuma, kayıt oluşturma veya veri yazma eklenmedi.",
  },
  {
    version: "v1.35.0",
    title: "Canlı Kullanım Öncesi Operasyon Test Merkezi",
    area: "Raporlar / Dashboard / Sistem Durumu / README",
    description: "Patron, personel, saha ve güvenlik testleri tek pasif/mock merkezde toparlandı; gerçek Vega bağlantısı, cihaz entegrasyonu, DB okuma, kayıt oluşturma, rapor export veya veri yazma eklenmedi.",
  },
  {
    version: "v1.34.0",
    title: "Raporlama ve Yönetici Karar Merkezi",
    area: "Raporlar / Dashboard / Sistem Durumu / README",
    description: "Stok, barkod, cari, alacak, kârlılık, saha operasyonu ve Vega hazırlık durumları tek yönetici rapor mantığında pasif/mock olarak toparlandı; gerçek rapor export, DB okuma, query, kayıt oluşturma veya veri yazma eklenmedi.",
  },
  {
    version: "v1.33.0",
    title: "Alış Satış ve Kârlılık Yönetici Merkezi",
    area: "Dashboard / Sistem Durumu / README",
    description: "Alış, satış, kâr marjı, marka/kategori performansı ve ticari risk görünürlüğü pasif/mock modda güçlendirildi; gerçek satış, alış, fiyat güncelleme, DB okuma, query veya veri yazma eklenmeden main üzerinden manuel Codex çalışma modeli güncellendi.",
  },
  {
    version: "v1.32.0",
    title: "Cari ve Alacak Riskleri Yönetici Merkezi",
    area: "Müşteriler / Dashboard / Sistem Durumu",
    description: "Cari, alacak, vade ve tahsilat risk görünürlüğü pasif/mock modda güçlendirildi; gerçek tahsilat, ödeme, cari kart güncelleme, DB okuma veya veri yazma eklenmeden yönetici hazırlığı tamamlandı.",
  },
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
    description: "Patron Bakışı yönetici özeti, Vega read-only yol haritası ve manuel GitHub kontrol notları statik/pasif olarak güncellendi.",
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
        <strong>İlk Kapalı Beta Desktop Hazırlığı</strong>
        <p>Bu sürümde patron bilgisayarındaki kapalı beta deneme kapsamı, masaüstü akışı ve kapalı kalan canlı Vega/veri yazma kilitleri kontrol edilmelidir.</p>
      </div>

      <div className="system-workflow-panel" {...sectionHighlightProps("system-workflow-model")}>
        <div>
          <h3>GitHub Main Üzerinden Manuel Codex Çalışma Modeli <NewReleaseBadge sectionId="system-workflow-model" /></h3>
          <p>Kullanıcı bilgisayarda main branch'i güncel tutar; Codex değişiklikleri local main üzerinde uygular ve build başarılıysa origin main'e pushlar.</p>
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

      <div className="handheld-barcode-status-panel closed-beta-preparation-status-panel" {...sectionHighlightProps("closed-beta-preparation-status")}>
        <div>
          <h3>Kapalı Beta Hazırlık Durumu <NewReleaseBadge sectionId="closed-beta-preparation-status" /></h3>
          <p>Patron bilgisayarında yapılacak kapalı beta denemesi yalnızca masaüstü uygulama akışını, ekranları ve güvenlik kilitlerini doğrular.</p>
        </div>
        <div className="system-status-grid">
          {closedBetaPreparationStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note closed-beta-preparation-safety-note">
          {closedBetaPreparationMessage}
        </p>
      </div>

      <div className="handheld-barcode-status-panel passive-vega-connection-status-panel" {...sectionHighlightProps("passive-vega-connection-status")}>
        <div>
          <h3>Vega Bağlantı Durumu <NewReleaseBadge sectionId="passive-vega-connection-status" /></h3>
          <p>SQL/Vega entegrasyonunun mevcut güvenli seviyesi yalnızca pasif olarak gösterilir; bu panel bağlantı başlatmaz ve .env.local okumaz.</p>
        </div>
        <div className="system-status-grid">
          {passiveVegaConnectionStatusCards.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note passive-vega-connection-safety-note">
          {passiveVegaConnectionStatusMessage}
        </p>
      </div>

      <div className="handheld-barcode-status-panel vega-stock-field-map-status-panel" {...sectionHighlightProps("vega-stock-field-map-status")}>
        <div>
          <h3>Vega Stok Kartı Alan Haritası Durumu <NewReleaseBadge sectionId="vega-stock-field-map-status" /></h3>
          <p>Read-only stok smoke test kolonları ERP tarafında yalnızca pasif dokümantasyon ve güven seviyesiyle anlamlandırılır.</p>
        </div>
        <div className="system-status-grid">
          {vegaStockFieldMapStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note vega-stock-field-map-safety-note">
          {vegaStockFieldMapWarning}
        </p>
      </div>

      <div className="handheld-barcode-status-panel desktop-preparation-status-panel" {...sectionHighlightProps("desktop-preparation-status")}>
        <div>
          <h3>Desktop Hazırlık Durumu <NewReleaseBadge sectionId="desktop-preparation-status" /></h3>
          <p>Melisa Bebe ERP'nin local desktop çalışma modu, terminal smoke test sınırı ve canlı bağlantı kilitleri pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {desktopPreparationStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note desktop-preparation-safety-note">
          ERP arayüzünden canlı Vega bağlantısı başlatılmaz; .env.local git dışında kalır, veri yazma ve canlı import kapalı tutulur.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-stock-smoke-status-panel" {...sectionHighlightProps("readonly-stock-smoke-status")}>
        <div>
          <h3>İlk Read-only Stok Okuma Denemesi Durumu <NewReleaseBadge sectionId="readonly-stock-smoke-status" /></h3>
          <p>İlk gerçek okuma denemesi yalnızca local terminal scriptiyle, stok kartı ve 20 satır sınırıyla takip edilir; hata durumunda ham detay yerine güvenli sınıf gösterilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyStockSmokeStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-stock-smoke-safety-note">
          Bu sürüm yalnızca local read-only stok kartı okuma denemesi için güvenli hata sınıflandırması sağlar. ERP arayüzünden bağlantı başlatmaz, DB’ye yazmaz, import yapmaz ve sonuçları dosyaya kaydetmez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-stock-proof-status-panel" {...sectionHighlightProps("readonly-stock-proof-status")}>
        <div>
          <h3>İlk Başarılı Read-only Vega Stok Okuma Kanıtı <NewReleaseBadge sectionId="readonly-stock-proof-status" /></h3>
          <p>Başarılı stok smoke test sonucu yalnızca teknik metadata olarak tutulur; gerçek stok kodu, ürün adı, fiyat, SQL kullanıcısı veya bağlantı bilgisi gösterilmez.</p>
        </div>
        <div className="system-status-grid">
          {readonlyStockProofStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-stock-proof-safety-note">
          Sonraki canlı bağlantı fazlarından önce yalnızca okuma yetkili ayrı SQL kullanıcısına geçilmesi önerilir. Bu kanıt canlı stok değerlerini repoya yazmaz ve ERP arayüzünden bağlantı başlatmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-stock-preview-status-panel" {...sectionHighlightProps("readonly-stock-preview-status")}>
        <div>
          <h3>Vega Read-only Stok Önizleme Durumu <NewReleaseBadge sectionId="readonly-stock-preview-status" /></h3>
          <p>Uygulama içi önizleme yalnızca manuel kullanıcı aksiyonuyla çalışır; 20 stok kartı sınırını, geçici ekran sonucunu ve kapalı yazma/import kilitlerini gösterir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyStockPreviewStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-stock-preview-safety-note">
          Bu ekran Vega’dan yalnızca 20 stok kartını read-only olarak önizler. Veri yazmaz, import yapmaz, senkron başlatmaz ve bağlantı bilgilerini kullanıcıya göstermez. Sonraki fazlardan önce yalnızca okuma yetkili ayrı SQL kullanıcısı önerilir.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-stock-preview-security-status-panel" {...sectionHighlightProps("readonly-stock-preview-security-status")}>
        <div>
          <h3>Read-only Stok Önizleme Güvenlik Teyidi <NewReleaseBadge sectionId="readonly-stock-preview-security-status" /></h3>
          <p>Uygulama içi önizleme testinin geçici ekranda kaldığı, log/dosya/Git güvenlik sınırlarının korunduğu pasif teyit alanı.</p>
        </div>
        <div className="system-status-grid">
          {readonlyStockPreviewSecurityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-stock-preview-safety-note">
          Bu teyit gerçek stok değerlerini, .env.local içeriğini, SQL kullanıcı bilgisini veya bağlantı bilgisini göstermez; yeni sorgu, otomatik bağlantı, veri yazma veya import/senkron eklemez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-stock-preview-usability-status-panel" {...sectionHighlightProps("readonly-stock-preview-usability-status")}>
        <div>
          <h3>Stok Önizleme Kullanım İyileştirme <NewReleaseBadge sectionId="readonly-stock-preview-usability-status" /></h3>
          <p>Arama, kolon açıklaması, aday fiyat formatı ve boş değer görünümü yalnızca ekranda gelen geçici read-only veri üzerinde iyileştirildi.</p>
        </div>
        <div className="system-status-grid">
          {readonlyStockPreviewUsabilityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-stock-preview-safety-note">
          Bu kullanım iyileştirmesi veri kapsamını büyütmez; yeni SQL, otomatik bağlantı, veri yazma, import/senkron veya canlı veri dosyası oluşturmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-field-validation-status-panel" {...sectionHighlightProps("stock-field-validation-status")}>
        <div>
          <h3>Stok Alan Doğrulama Hazırlığı <NewReleaseBadge sectionId="stock-field-validation-status" /></h3>
          <p>Read-only stok önizleme kolonları kesin operasyon/muhasebe kararı sayılmadan önce Vega ekranı ve örnek satırlarla doğrulanacak şekilde pasif olarak sınıflandırılır.</p>
        </div>
        <div className="system-status-grid">
          {stockFieldValidationStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-field-validation-safety-note">
          Bu hazırlık gerçek stok değerlerini repoya yazmaz; yeni SQL, otomatik bağlantı, veri yazma, import/senkron veya kesin muhasebe kararı üretmez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-manual-validation-status-panel" {...sectionHighlightProps("stock-manual-validation-status")}>
        <div>
          <h3>Stok Alan Manuel Doğrulama Checklist’i <NewReleaseBadge sectionId="stock-manual-validation-status" /></h3>
          <p>Vega ekranı ile uygulamadaki alanları karşılaştırmak için geçici checklist hazırdır; seçimler kaydedilmez ve kalıcı sonuç oluşturmaz.</p>
        </div>
        <div className="system-status-grid">
          {stockManualValidationChecklistStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-manual-validation-safety-note">
          Checklist yalnızca manuel rehberdir; gerçek değerleri repoya yazmaz, local DB’ye kaydetmez, Vega’ya yazmaz, import/senkron veya yeni SQL eklemez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-field-labeling-status-panel" {...sectionHighlightProps("stock-field-labeling-status")}>
        <div>
          <h3>Doğrulama Sonrası Stok Alan Etiketleme Hazırlığı <NewReleaseBadge sectionId="stock-field-labeling-status" /></h3>
          <p>Önerilen stok alan etiketleri geçici hazırlıktır; fiyat, KOD ve KDV alanları kesinleşmiş operasyon/muhasebe kararı olarak sunulmaz.</p>
        </div>
        <div className="system-status-grid">
          {stockFieldLabelingStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-field-labeling-safety-note">
          Etiket hazırlığı yalnızca görünürlük sağlar; checklist/etiket sonucu kaydetmez, yeni SQL eklemez, canlı stok değerlerini repoya yazmaz ve Vega’ya veri yazmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-column-visibility-status-panel" {...sectionHighlightProps("stock-column-visibility-status")}>
        <div>
          <h3>Stok Önizleme Kolon Görünürlüğü Kontrolü <NewReleaseBadge sectionId="stock-column-visibility-status" /></h3>
          <p>Read-only stok önizlemede kolon göster/gizle tercihi yalnızca geçici ekran state’i olarak çalışır; veri kapsamını veya SQL sorgusunu değiştirmez.</p>
        </div>
        <div className="system-status-grid">
          {stockColumnVisibilityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-column-visibility-safety-note">
          Kolon görünürlüğü kalıcı kayıt oluşturmaz; local DB’ye/dosyaya yazmaz, Vega’ya yazmaz, yeni SQL eklemez ve 20 satırlık read-only kapsamı büyütmez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-preview-panel-simplification-status-panel" {...sectionHighlightProps("stock-preview-panel-simplification-status")}>
        <div>
          <h3>Stok Önizleme Panel Sadeleştirme <NewReleaseBadge sectionId="stock-preview-panel-simplification-status" /></h3>
          <p>Read-only stok önizleme akışı daha sade panel düzenine alındı; destek alanları geçici açılır/kapanır bölümler halinde tutulur.</p>
        </div>
        <div className="system-status-grid">
          {stockPreviewPanelSimplificationStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-preview-panel-simplification-safety-note">
          Panel sadeleştirme yalnızca frontend görünümüdür; accordion state’i kalıcı kaydedilmez, yeni SQL eklemez, veri yazmaz, import/senkron başlatmaz ve 20 satır kapsamını büyütmez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-preview-user-test-status-panel" {...sectionHighlightProps("stock-preview-user-test-status")}>
        <div>
          <h3>Stok Önizleme Kullanıcı Testi ve Son Okuma Özeti <NewReleaseBadge sectionId="stock-preview-user-test-status" /></h3>
          <p>Son okuma özeti ve kullanıcı test notları yalnızca geçici ekran state’i olarak görünür; kayıt veya veri yazma oluşturmaz.</p>
        </div>
        <div className="system-status-grid">
          {stockPreviewUserTestStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-preview-user-test-safety-note">
          Kullanıcı test notları ve son okuma özeti local DB’ye/dosyaya/Vega’ya yazılmaz; yeni SQL eklemez, import/senkron başlatmaz ve 20 satırlık read-only kapsamı büyütmez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel vega-stock-screen-simplification-status-panel" {...sectionHighlightProps("vega-stock-screen-simplification-status")}>
        <div>
          <h3>Vega Stok Ekranı Genel Sadeleştirme <NewReleaseBadge sectionId="vega-stock-screen-simplification-status" /></h3>
          <p>Read-only stok önizleme ana akışı sadeleştirildi; gelişmiş alan doğrulama panelleri varsayılan kapalı gelir.</p>
        </div>
        <div className="system-status-grid">
          {vegaStockScreenSimplificationStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note vega-stock-screen-simplification-safety-note">
          Bu sadeleştirme yalnızca ekran yerleşimidir; panel/test state’i kalıcı kaydedilmez, yeni SQL eklemez, veri yazmaz, import/senkron başlatmaz ve 20 satır read-only kapsamı büyütmez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel stock-preview-beta-package-status-panel" {...sectionHighlightProps("stock-preview-beta-package-status")}>
        <div>
          <h3>Stok Önizleme Test Sonrası Temizlik ve Paket Hazırlığı <NewReleaseBadge sectionId="stock-preview-beta-package-status" /></h3>
          <p>Stok önizleme modülü kapalı beta paketi öncesi hazır görünür; paket testi manuel doğrulama bekler.</p>
        </div>
        <div className="system-status-grid">
          {stockPreviewBetaPackageStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note stock-preview-beta-package-safety-note">
          Paket hazırlığı veri kapsamını büyütmez; yeni SQL, otomatik bağlantı, veri yazma/import veya dosyaya canlı veri çıktısı eklemez.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-environment-prep-status-panel" {...sectionHighlightProps("readonly-environment-prep-status")}>
        <div>
          <h3>Read-only Ortam Bilgisi Hazırlık Durumu <NewReleaseBadge sectionId="readonly-environment-prep-status" /></h3>
          <p>İlk bağlantı öncesi ortam başlıklarının kim tarafından manuel hazırlanacağı pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyEnvironmentPrepStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-environment-prep-safety-note">
          Bu sürüm yalnızca ortam bilgisi hazırlık rehberi sağlar; bağlantı, DB okuma, query, API, credential, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-fail-closed-status-panel" {...sectionHighlightProps("readonly-fail-closed-status")}>
        <div>
          <h3>Read-only Fail-closed Hazırlık Durumu <NewReleaseBadge sectionId="readonly-fail-closed-status" /></h3>
          <p>İlk bağlantı denemesi öncesi varsayılan kapalı duruş, bloke davranışlar ve credential/query yokluğu pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyFailClosedStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-fail-closed-safety-note">
          Bu sürüm yalnızca fail-closed güvenlik kabuğu görünürlüğü sağlar; bağlantı, DB okuma, query, API, connection test, credential veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-final-security-scan-status-panel" {...sectionHighlightProps("readonly-final-security-scan-status")}>
        <div>
          <h3>Read-only Öncesi Son Güvenlik Tarama Durumu <NewReleaseBadge sectionId="readonly-final-security-scan-status" /></h3>
          <p>İlk gerçek bağlantı öncesi sürüm, görünürlük, pasif iskelet ve kapalı güvenlik kilitleri son kez pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyFinalSecurityScanStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-final-security-scan-safety-note">
          Bu sürüm yalnızca son güvenlik tarama ve temizlik görünürlüğü sağlar; bağlantı, DB okuma, query, API, credential, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-operator-checklist-status-panel" {...sectionHighlightProps("readonly-operator-checklist-status")}>
        <div>
          <h3>Read-only Operatör Checklist Durumu <NewReleaseBadge sectionId="readonly-operator-checklist-status" /></h3>
          <p>İlk gerçek bağlantı öncesi operatör, teknik sorumlu ve patron kontrol maddeleri pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyOperatorChecklistStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-operator-checklist-safety-note">
          Bu sürüm yalnızca operatör ve teknik sorumlu checklist görünürlüğü sağlar; bağlantı, DB okuma, query, API, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-connection-skeleton-status-panel" {...sectionHighlightProps("readonly-connection-skeleton-status")}>
        <div>
          <h3>Read-only Bağlantı Altyapısı Durumu <NewReleaseBadge sectionId="readonly-connection-skeleton-status" /></h3>
          <p>İlk gerçek bağlantı öncesi pasif teknik iskelet, bağlantı modu ve kapalı altyapı kilitleri sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyConnectionSkeletonStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-connection-skeleton-safety-note">
          Bu sürüm yalnızca pasif teknik iskelet sağlar; bağlantı, DB okuma, query, API, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-final-security-status-panel" {...sectionHighlightProps("readonly-final-security-status")}>
        <div>
          <h3>Read-only Final Güvenlik Kapanışı Durumu <NewReleaseBadge sectionId="readonly-final-security-status" /></h3>
          <p>İlk gerçek bağlantı öncesi hazırlık kapanışı, kapalı kilitler ve sonraki küçük read-only sınırı pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyFinalSecurityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-final-security-safety-note">
          Bu sürüm final güvenlik kapanışı görünürlüğü sağlar; bağlantı, DB okuma, query, API, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-final-decision-status-panel" {...sectionHighlightProps("readonly-final-decision-status")}>
        <div>
          <h3>Read-only İlk Deneme Son Karar Durumu <NewReleaseBadge sectionId="readonly-final-decision-status" /></h3>
          <p>İlk gerçek read-only deneme öncesi başlama kararı, kapsam sınırı ve son güvenlik kilitleri pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyFinalDecisionStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-final-decision-safety-note">
          Bu sürüm ilk read-only deneme son karar görünürlüğü sağlar; bağlantı, DB okuma, query, API, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel readonly-first-trial-status-panel" {...sectionHighlightProps("readonly-first-trial-plan-status")}>
        <div>
          <h3>Read-only İlk Deneme Planı Durumu <NewReleaseBadge sectionId="readonly-first-trial-plan-status" /></h3>
          <p>İlk gerçek read-only deneme öncesi yedek, rollback, sınır ve güvenli raporlama akışı pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {readonlyFirstTrialPlanStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note readonly-first-trial-safety-note">
          Bu sürüm ilk read-only deneme planı ve geri dönüş görünürlüğü sağlar; bağlantı, DB okuma, query, API, connection test veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel vega-technical-gate-status-panel" {...sectionHighlightProps("vega-readonly-technical-gate-status")}>
        <div>
          <h3>Vega Read-only Teknik Ön Kapı Durumu <NewReleaseBadge sectionId="vega-readonly-technical-gate-status" /></h3>
          <p>İlk gerçek read-only bağlantı öncesi teknik şartlar ve güvenlik kilitleri pasif sistem özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {vegaTechnicalGateStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note vega-technical-gate-safety-note">
          Bu sürüm ilk gerçek read-only bağlantı öncesi teknik güvenlik görünürlüğü sağlar; bağlantı, DB okuma, query, API veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel module-maturity-status-panel" {...sectionHighlightProps("module-maturity-status")}>
        <div>
          <h3>Modül Olgunluk ve Canlıya Hazırlık Durumu <NewReleaseBadge sectionId="module-maturity-status" /></h3>
          <p>ERP modüllerinin canlıya hazırlık skoru ve gerçek bağlantı öncesi güvenli sınırları pasif yönetici özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {moduleMaturityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note module-maturity-safety-note">
          Bu sürüm modül olgunluk ve canlıya hazırlık görünürlüğü sağlar; gerçek bağlantı, cihaz entegrasyonu, DB okuma, kayıt oluşturma veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel prelive-operation-test-status-panel" {...sectionHighlightProps("prelive-operation-test-status")}>
        <div>
          <h3>Canlı Öncesi Operasyon Test Durumu <NewReleaseBadge sectionId="prelive-operation-test-status" /></h3>
          <p>Personel denemesi, yönetici onayı, saha kontrolü ve canlıya geçiş hazırlığı pasif test özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {preliveOperationTestStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note prelive-operation-test-safety-note">
          Bu sürüm canlı kullanım öncesi test görünürlüğü sağlar; gerçek bağlantı, cihaz entegrasyonu, DB okuma, kayıt oluşturma veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel reporting-decision-status-panel" {...sectionHighlightProps("reporting-decision-status")}>
        <div>
          <h3>Raporlama ve Yönetici Karar Durumu <NewReleaseBadge sectionId="reporting-decision-status" /></h3>
          <p>Stok, barkod, cari, alacak, kârlılık ve Vega hazırlık durumları pasif yönetici raporu olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {reportingDecisionStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note reporting-decision-safety-note">
          Bu sürüm yönetici raporlama görünürlüğü sağlar; gerçek rapor export, DB okuma, query, kayıt oluşturma veya veri yazma işlemi yapmaz.
        </p>
      </div>

      <div className="handheld-barcode-status-panel commerce-profitability-status-panel" {...sectionHighlightProps("commerce-profitability-status")}>
        <div>
          <h3>Alış Satış ve Kârlılık Durumu <NewReleaseBadge sectionId="commerce-profitability-status" /></h3>
          <p>Alış, satış, kâr marjı, düşük kârlı ürün ve marka/kategori performansı pasif yönetici özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {commerceProfitabilityStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note commerce-profitability-safety-note">
          Bu sürüm ticari görünürlük sağlar; gerçek satış, alış, fiyat güncelleme, DB okuma veya veri yazma işlemi yapmaz.
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

      <div className="handheld-barcode-status-panel current-account-status-panel" {...sectionHighlightProps("current-account-risk-status")}>
        <div>
          <h3>Cari ve Alacak Riskleri Durumu <NewReleaseBadge sectionId="current-account-risk-status" /></h3>
          <p>Cari, alacak, vade ve tahsilat risk görünürlüğü pasif yönetici özeti olarak takip edilir.</p>
        </div>
        <div className="system-status-grid">
          {currentAccountRiskStatusRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <p className="handheld-barcode-safety-note current-account-safety-note">
          Bu sürüm cari ve alacak risk görünürlüğü sağlar; gerçek tahsilat, ödeme, cari kart güncelleme, DB okuma veya veri yazma işlemi yapmaz.
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
