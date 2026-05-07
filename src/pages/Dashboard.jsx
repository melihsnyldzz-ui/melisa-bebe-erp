import { AlertTriangle, Banknote, Boxes, ClipboardList, ReceiptText, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import CommerceInsights from "../components/Dashboard/CommerceInsights.jsx";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import { APP_STAGE, APP_VERSION } from "../config/appVersion.js";
import { closedBetaPreparationMessage, closedBetaPreparationRows } from "../config/closedBetaPreparation.js";
import { readOnlyConnectionPlan, readOnlyEnvironmentPreparationItems, readOnlyOperatorChecklist } from "../config/readOnlyConnectionPlan.js";
import { readOnlyFailClosedPolicy } from "../config/readOnlyFailClosedPolicy.js";
import { currentReleaseVersion, releaseHighlightsByPage } from "../config/releaseHighlights.js";
import { passiveVegaConnectionStatusMessage, passiveVegaConnectionStatusRows } from "../config/vegaConnectionStatus.js";
import { vegaStockFieldMap, vegaStockFieldMapWarning } from "../config/vegaStockFieldMap.js";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { formatCurrency, formatNumber } from "../utils/formatters.js";

const dashboardPeriodOptions = [
  { id: "today", label: "Bugün" },
  { id: "month", label: "Bu Ay" },
  { id: "last7", label: "Son 7 Gün" },
  { id: "last30", label: "Son 30 Gün" },
];

const dashboardReleaseHighlights = releaseHighlightsByPage.dashboard;
const dashboardUpdatedSectionIds = dashboardReleaseHighlights.updatedSectionIds;
const ownerViewCards = [
  { label: "Günlük operasyon durumu", value: "Takipte" },
  { label: "Stok görünürlüğü", value: "Hazırlıkta" },
  { label: "Stok kalite kontrolü", value: "Hazırlıkta" },
  { label: "Cari risk takibi", value: "Hazırlıkta" },
  { label: "Alacak önceliği", value: "Yönetici kontrolünde" },
  { label: "Gecikmiş tahsilatlar", value: "İzlenecek" },
  { label: "Gerçek tahsilat kaydı", value: "Kapalı" },
  { label: "Alış / satış özeti", value: "Geliştiriliyor" },
  { label: "Ticari kârlılık", value: "Hazırlıkta" },
  { label: "Düşük marj kontrolü", value: "İzlenecek" },
  { label: "Marka performansı", value: "Önizleme" },
  { label: "Fiyat güncelleme", value: "Kapalı" },
  { label: "Yönetici raporlama", value: "Önizleme" },
  { label: "Risk raporları", value: "Hazırlıkta" },
  { label: "Günlük karar özeti", value: "Aktif görünüm" },
  { label: "Rapor export", value: "Kapalı" },
  { label: "Canlı öncesi test", value: "Hazırlıkta" },
  { label: "Personel denemesi", value: "Planlandı" },
  { label: "Yönetici onayı", value: "Bekliyor" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Modül olgunluk skoru", value: "%96" },
  { label: "Canlı güvenlik skoru", value: "%92" },
  { label: "Vega teknik ön kapı", value: "Hazırlıkta" },
  { label: "İlk bağlantı sınırı", value: "20 satır" },
  { label: "Read-only kullanıcı", value: "Manuel doğrulama bekliyor" },
  { label: "Veri yazma/import", value: "Kapalı" },
  { label: "İlk read-only deneme", value: "Plan aşamasında" },
  { label: "Rollback prosedürü", value: "Hazırlıkta" },
  { label: "Manuel yedek", value: "Zorunlu" },
  { label: "İlk read-only son karar", value: "Hazırlıkta" },
  { label: "Başlama şartları", value: "Kontrol edilecek" },
  { label: "Başlamayı engelleyenler", value: "Görünür" },
  { label: "Son karar veri yazma/import", value: "Kapalı" },
  { label: "Final güvenlik kapanışı", value: "Tamamlanıyor" },
  { label: "İlk bağlantı fazı", value: "Sonraki küçük sürüm" },
  { label: "Final ilk kapsam", value: "20 stok kartı" },
  { label: "Final veri yazma/import", value: "Kapalı" },
  { label: "Read-only altyapı iskeleti", value: "Pasif hazırlık" },
  { label: "Altyapı bağlantı modu", value: "Kapalı" },
  { label: "Altyapı ilk kapsam", value: "20 stok kartı" },
  { label: "Altyapı connection test", value: "Kapalı" },
  { label: "Operatör checklist", value: "Hazırlıkta" },
  { label: "Teknik kontrol", value: "Manuel" },
  { label: "Patron kararı", value: "Sonraki küçük faz" },
  { label: "Checklist veri yazma/import", value: "Kapalı" },
  { label: "Son güvenlik taraması", value: "Kontrol edildi" },
  { label: "Credential / query", value: "Yok" },
  { label: "Son tarama gerçek bağlantı", value: "Kapalı" },
  { label: "Sonraki faz", value: "Küçük read-only deneme" },
  { label: "Fail-closed politika", value: "Pasif hazırlık" },
  { label: "Varsayılan bağlantı", value: "Kapalı" },
  { label: "Fail-closed credential / query", value: "Yok" },
  { label: "Fail-closed sonraki faz", value: "Küçük read-only deneme" },
  { label: "Ortam hazırlığı", value: "Manuel" },
  { label: "Ortam read-only kullanıcı", value: "Hazırlanacak" },
  { label: "Test ortamı kararı", value: "Bekliyor" },
  { label: "Ortam gerçek bağlantı", value: "Kapalı" },
  { label: "İlk read-only deneme", value: "Local script ile sınırlı" },
  { label: "Smoke test kapsamı", value: "20 stok kartı" },
  { label: "Smoke test ERP’ye yazma", value: "Kapalı" },
  { label: "Smoke test import", value: "Kapalı" },
  { label: "Kapalı beta", value: "Patron bilgisayarı" },
  { label: "Beta canlı kullanım", value: "Değil" },
  { label: "Vega bağlantı durumu", value: "Kapalı" },
  { label: "ERP bağlantı başlatma", value: "Yok" },
  { label: "Stok alan haritası", value: "Pasif dokümantasyon" },
  { label: "Alan eşleştirme kararı", value: "Kesin değil" },
  { label: "İlk stok okuma kanıtı", value: "Başarılı" },
  { label: "Kanıt kapsamı", value: "20 satır / kolon doğrulandı" },
  { label: "Read-only stok önizleme", value: "Manuel ekran" },
  { label: "Önizleme limiti", value: "20 stok kartı" },
  { label: "Stok önizleme teyidi", value: "Başarılı" },
  { label: "Log / dosya sızıntısı", value: "Yok" },
  { label: "Önizleme araması", value: "Geçici 20 satır" },
  { label: "Fiyat gösterimi", value: "Aday format" },
  { label: "Stok alan doğrulama", value: "Hazırlıkta" },
  { label: "Kesin alan kararı", value: "Vega kontrolü sonrası" },
  { label: "Manuel doğrulama checklist’i", value: "Hazır" },
  { label: "Checklist kalıcı kayıt", value: "Yok" },
  { label: "Desktop uygulama modu", value: "Local Desktop" },
  { label: "Desktop Vega bağlantısı", value: "Kapalı / terminal smoke test" },
  { label: "Desktop veri yazma", value: "Kapalı" },
  { label: "Desktop canlı import", value: "Kapalı" },
  { label: "Barkod operasyonu", value: "Hazırlıkta" },
  { label: "Barkod kalite kontrolü", value: "Öncelikli" },
  { label: "Riskli barkodlar", value: "İzlenecek" },
  { label: "Sayım akışı", value: "Önizleme" },
  { label: "Sayım farkları", value: "Manuel kontrol" },
  { label: "El terminali bağlantısı", value: "Kapalı" },
  { label: "Stok güncelleme", value: "Kapalı" },
  { label: "Vega read-only geçişi", value: "Hazırlık kapısında" },
];

const ownerTodayItems = [
  "El terminali sayım akışı gözden geçirilecek",
  "Duplicate barkod riskleri gözden geçirilecek",
  "Barkodsuz ürün listesi personelle kontrol edilecek",
  "Sayım farkı senaryoları not alınacak",
  "Stok kartı eksikleri kalite listesine alınacak",
  "Barkodsuz ve duplicate barkod riskleri kontrol edilecek",
  "Personelin okutma sonrası kontrol adımları netleştirilecek",
  "Read-only geçiş güvenlik şartları gözden geçirilecek",
  "Gecikmiş alacak riskleri gözden geçirilecek",
  "Yakın vade müşterileri manuel takip listesine alınacak",
  "Kritik cari riskler yöneticiye bildirilecek",
  "Tahsilat kaydı yapılmadan önce bakiye doğrulama kuralı netleştirilecek",
  "Düşük marjlı ürünler manuel kontrol listesine alınacak",
  "Yüksek stoklu yavaş ürünler gözden geçirilecek",
  "Marka/kategori performansı yönetici notuna eklenecek",
  "Fiyat güncellemesi yapılmadan önce maliyet doğrulama kuralı netleştirilecek",
  "Stok/barkod risk raporu gözden geçirilecek",
  "Cari/alacak risk raporu yöneticiyle kontrol edilecek",
  "Kârlılık riskleri patron karar listesine alınacak",
  "El terminali saha notları rapor görünümünde değerlendirilecek",
  "Personel deneme planı gözden geçirilecek",
  "Canlı öncesi eksikler listesi kontrol edilecek",
  "Yönetici onay matrisi okunacak",
  "Vega read-only ilk deneme şartları tekrar doğrulanacak",
  "Modül olgunluk skorları gözden geçirilecek",
  "Personel testinden önce eksik alanlar not alınacak",
  "Veri yazma kapalı kalacak",
  "Vega read-only teknik ön kapısı gözden geçirilecek",
  "Manuel yedek sorumlusu belirlenecek",
  "Read-only kullanıcı yetkisi doğrulanacak",
  "İlk 20 stok kartı test kriteri netleştirilecek",
  "İlk read-only deneme planı gözden geçirilecek",
  "Manuel yedek sorumlusu netleştirilecek",
  "Rollback prosedürü kontrol edilecek",
  "Test sonrası değerlendirme şablonu okunacak",
  "Son karar kontrol matrisi gözden geçirilecek",
  "Başlamayı engelleyen durumlar kontrol edilecek",
  "İlk deneme kapsam sınırı tekrar doğrulanacak",
  "Veri yazma/import kilidi kapalı kalacak",
  "Final güvenlik kapanışı gözden geçirilecek",
  "Yapılmayacak işlemler listesi kontrol edilecek",
  "Sonraki küçük read-only bağlantı fazı sınırları okunacak",
  "Final veri yazma/import kilidi kapalı kalacak",
  "Read-only pasif altyapı iskeleti gözden geçirilecek",
  "İlk kapsamın sadece stok kartı olduğu doğrulanacak",
  "Connection test ve DB okuma kilitlerinin kapalı kaldığı kontrol edilecek",
  "Operatör son kontrol listesi gözden geçirilecek",
  "Teknik sorumlu read-only kullanıcıyı doğrulayacak",
  "İlk 20 stok kartı sınırı tekrar teyit edilecek",
  "Başarısızlıkta tekrar deneme yapılmayacağı netleştirilecek",
  "Son güvenlik tarama paneli kontrol edilecek",
  "readOnlyConnectionPlan dosyasının pasif kaldığı doğrulanacak",
  "Credential ve query bulunmadığı kontrol edilecek",
  "Sonraki küçük read-only deneme fazı sınırları okunacak",
  "Fail-closed kuralları gözden geçirilecek",
  "Bloke edilen davranışlar kontrol edilecek",
  "Read-only kullanıcı ve manuel yedek olmadan bağlantı denenmeyeceği teyit edilecek",
  "Sonraki küçük bağlantı fazı sınırları okunacak",
  "SQL Server / DB bilgisi teknik sorumlu tarafından manuel tespit edilecek",
  "Read-only kullanıcı yetkisi hazırlanacak veya doğrulanacak",
  "Test ortamı canlı mı kopya mı olacak kararı verilecek",
  "Test bilgisayarı ve test saati belirlenecek",
  "Personel kullanım notları toplanacak",
  "Gerçek veri bağlantısı için yedek ve yetki kontrolü hazırlanacak",
];

const ownerDecisionItems = [
  "Gerçek Vega bağlantısına geçilmedi",
  "İlk gerçek deneme sadece read-only olacak",
  "İlk kapsam sadece stok kartı olacak",
  "Veri yazma ve import ayrı fazda değerlendirilecek",
  "Kritik riskli müşterilerde yeni satış kararı yöneticiye bağlıdır",
  "Gerçek tahsilat/ödeme kaydı bu fazın konusu değildir",
  "Cari risk görünürlüğü gerçek veri bağlantısından önce pasif olarak olgunlaştırılır",
  "Yüksek stoklu ve yavaş satan ürünlerde kampanya kararı patrona bağlıdır",
  "Düşük marjlı çok satan ürünlerde fiyat/maliyet kontrolü yapılmadan karar verilmez",
  "Gerçek fiyat güncelleme bu fazın konusu değildir",
  "Gerçek rapor export bu fazın konusu değildir.",
  "Yönetici raporları şu an pasif/mock görünürlük sağlar.",
  "Gerçek veri okuma ve veri yazma ayrı küçük onaylı fazlarda ele alınır.",
  "Canlı kullanıma geçmeden önce personel denemesi yapılmalıdır.",
  "Gerçek read-only bağlantı ayrı küçük sürümde açılmalıdır.",
  "Veri yazma ve import bu fazın konusu değildir.",
  "İlk gerçek bağlantı sadece read-only ve 20 satır sınırıyla yapılmalıdır.",
  "Veri yazma ve import hâlâ kapalı kalmalıdır.",
  "İlk gerçek bağlantı ayrı küçük onaylı sürümde açılmalıdır.",
  "Başarısızlıkta tekrar deneme yapılmadan önce rapor hazırlanmalıdır.",
  "Bu ekrandan gerçek bağlantı başlatılmaz.",
  "İlk gerçek bağlantı ayrı küçük sürümde açılmalıdır.",
  "Başlama kararı yedek, read-only kullanıcı ve 20 satır sınırı doğrulandıktan sonra verilmelidir.",
  "Bu sürüm bağlantı açmaz.",
  "Sonraki faz küçük ve sadece read-only stok okuma olmalıdır.",
  "Veri yazma, import, cari/fiş/hareket kapsamı hâlâ kapalı kalmalıdır.",
  "Ana hedef: güvenli geçiş, hızlı kontrol, hatasız stok görünürlüğü",
];

const readonlyFinalSecuritySummaryCards = [
  { label: "Hazırlık fazı", value: "Kapanış kontrolü" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "İlk bağlantı fazı", value: "Sonraki küçük sürüm" },
  { label: "İlk kapsam", value: "20 stok kartı" },
  { label: "Veri yazma/import", value: "Kapalı" },
  { label: "Karar", value: "Ayrı bağlantı fazına hazırlık" },
];

const readonlyConnectionSkeletonSummaryCards = [
  { label: "Bağlantı altyapısı", value: "Pasif iskelet" },
  { label: "Bağlantı modu", value: readOnlyConnectionPlan.connectionStatus },
  { label: "İlk kapsam", value: readOnlyConnectionPlan.firstLimit },
  { label: "SQL/ODBC", value: readOnlyConnectionPlan.sqlOdbcStatus },
  { label: "DB okuma", value: readOnlyConnectionPlan.dbReadStatus },
  { label: "Connection test", value: "Kapalı" },
];

const readonlyOperatorChecklistSummaryCards = [
  { label: "Operatör checklist", value: "Pasif hazırlık" },
  { label: "Teknik kontrol", value: "Manuel" },
  { label: "Patron kararı", value: "Sonraki küçük faz" },
  { label: "Kontrol maddesi", value: `${readOnlyOperatorChecklist.length} statik madde` },
  { label: "Connection test", value: "Kapalı" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const readonlyFinalSecurityScanSummaryCards = [
  { label: "Son güvenlik taraması", value: "Kontrol edildi" },
  { label: "Mavi nokta", value: "Release yapısıyla uyumlu" },
  { label: "Pasif teknik iskelet", value: "Kapalı metadata" },
  { label: "Credential / query", value: "Yok" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Sonraki faz", value: "Küçük read-only deneme" },
];

const readonlyFailClosedSummaryCards = [
  { label: "Fail-closed politika", value: "Pasif hazırlık" },
  { label: "Varsayılan bağlantı", value: readOnlyFailClosedPolicy.defaultConnectionState },
  { label: "DB okuma/query", value: "Yok" },
  { label: "Connection test", value: "Kapalı" },
  { label: "Credential", value: "Yok" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const readonlyEnvironmentPrepSummaryCards = [
  { label: "Ortam hazırlığı", value: "Manuel" },
  { label: "Hazırlık başlığı", value: `${readOnlyEnvironmentPreparationItems.length} statik madde` },
  { label: "Read-only kullanıcı", value: "Hazırlanacak" },
  { label: "Test ortamı kararı", value: "Bekliyor" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Credential / veri yazma", value: "Yok" },
];

const readonlyStockSmokeSummaryCards = [
  { label: "Deneme yöntemi", value: "Local script" },
  { label: "Kapsam", value: "20 stok kartı" },
  { label: "Tablo", value: "F0102TBLSTOKLAR" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
  { label: "Sonuç", value: "Terminal önizleme" },
];

const successfulStockReadProofCards = [
  { label: "Test türü", value: "Read-only stok smoke test" },
  { label: "Sonuç", value: "Başarılı" },
  { label: "Okunan satır", value: "20" },
  { label: "Tablo kapsamı", value: "F0102TBLSTOKLAR" },
  { label: "Kolon doğrulama", value: "Başarılı" },
  { label: "Veri yazma", value: "Yapılmadı" },
  { label: "Import/senkron", value: "Yapılmadı" },
  { label: "Dosyaya çıktı", value: "Alınmadı" },
  { label: "ERP arayüzünden bağlantı", value: "Yok" },
  { label: "Sonraki hedef", value: "Read-only stok önizleme hazırlığı" },
];

const successfulStockReadProofColumns = [
  "IND",
  "STOKKODU",
  "MALINCINSI",
  "KOD1",
  "KOD2",
  "KOD4",
  "KOD6",
  "ALISFIYATI",
  "ISKSATISFIYATI2",
  "ISKSATISFIYATI3",
  "KDVGRUBU",
];

const readOnlyStockPreviewSummaryCards = [
  { label: "Önizleme modu", value: "Manuel read-only" },
  { label: "Otomatik bağlantı", value: "Yok" },
  { label: "Tablo", value: "F0102TBLSTOKLAR" },
  { label: "Limit", value: "20 stok kartı" },
  { label: "Sonuç saklama", value: "Geçici ekran" },
  { label: "Veri yazma/import", value: "Yok" },
];

const stockPreviewSecurityConfirmationCards = [
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

const stockPreviewUsabilityCards = [
  { label: "Arama kapsamı", value: "Gelen 20 satır" },
  { label: "Arama alanları", value: "Stok Kodu / Ürün Adı" },
  { label: "Yeni bağlantı", value: "Başlatmaz" },
  { label: "Fiyat alanları", value: "Aday format" },
  { label: "Boş değerler", value: "—" },
  { label: "Veri yazma/import", value: "Yok" },
];

const stockFieldValidationPrepCards = [
  { label: "Yüksek güven", value: "STOKKODU / MALINCINSI" },
  { label: "Teknik alan", value: "IND" },
  { label: "Doğrulanacak kod alanları", value: "KOD1 / KOD2 / KOD4 / KOD6" },
  { label: "Doğrulanacak fiyat alanları", value: "ALISFIYATI / ISKSATISFIYATI2 / ISKSATISFIYATI3" },
  { label: "KDV kontrolü", value: "KDVGRUBU" },
  { label: "Gerçek veri yazma", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
];

const stockManualValidationChecklistCards = [
  { label: "Manuel doğrulama checklist’i", value: "Hazır" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Vega’ya yazma", value: "Yok" },
  { label: "Dosyaya çıktı", value: "Yok" },
  { label: "Durum seçenekleri", value: "Bekliyor / Uyumlu / Fark var / Emin değilim" },
  { label: "Sonraki hedef", value: "Doğrulanan alanlara göre kolonları netleştirme" },
];

const stockFieldLabelingPrepCards = [
  { label: "Önerilen etiketler", value: "Hazır" },
  { label: "Kesinleşmiş alanlar", value: "STOKKODU / MALINCINSI / IND" },
  { label: "Doğrulanacak alanlar", value: "KOD1 / KOD2 / KOD4 / KOD6 / fiyat / KDV" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
];

const passiveVegaConnectionSummaryCards = passiveVegaConnectionStatusRows.slice(0, 10);

const closedBetaPreparationCards = closedBetaPreparationRows;

const vegaStockFieldMapSummaryCards = [
  { label: "Harita modu", value: "Pasif dokümantasyon" },
  { label: "Kolon sayısı", value: `${vegaStockFieldMap.length} alan` },
  { label: "Yüksek güven", value: "IND, STOKKODU, MALINCINSI" },
  { label: "Orta güven", value: "Fiyat/KDV adayları" },
  { label: "Düşük güven", value: "KOD sınıflandırmaları" },
  { label: "Kesin karar", value: "Örnek satır sonrası" },
];

const desktopPreparationCards = [
  { label: "Uygulama modu", value: "Local Desktop" },
  { label: "Vega bağlantısı", value: "Kapalı / sadece terminal smoke test" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Canlı import", value: "Kapalı" },
  { label: ".env.local", value: "Git dışı tutulmalı" },
  { label: "Son güvenli entegrasyon", value: "v1.45.0 read-only stock smoke" },
];

const readonlyFinalDecisionSummaryCards = [
  { label: "Son karar durumu", value: "Hazırlık ekranı" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Başlama kararı", value: "Bu ekrandan verilmez" },
  { label: "İlk kapsam", value: "Sadece stok kartı" },
  { label: "İlk sınır", value: "20 satır" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const readonlyFirstTrialSummaryCards = [
  { label: "İlk deneme modu", value: "Plan aşaması" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Manuel yedek", value: "Zorunlu" },
  { label: "Rollback planı", value: "Hazırlıkta" },
  { label: "İlk okuma sınırı", value: "20 satır" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const vegaTechnicalGateSummaryCards = [
  { label: "Teknik ön kapı", value: "Pasif hazırlık" },
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "İlk test sınırı", value: "20 satır" },
  { label: "Read-only kullanıcı", value: "Manuel doğrulama" },
  { label: "Timeout hedefi", value: "3000 ms" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const moduleMaturityScoreCards = [
  { label: "ERP genel hazırlık", value: "%96" },
  { label: "Canlı kullanım güvenliği", value: "%92" },
  { label: "Yönetici kokpiti", value: "%94" },
  { label: "Saha/barkod hazırlığı", value: "%85" },
  { label: "Vega read-only hazırlığı", value: "%90" },
  { label: "Gerçek bağlantı / veri yazma", value: "%0" },
];

const preliveTestStatusCards = [
  { label: "Test modu", value: "Pasif/mock hazırlık" },
  { label: "Gerçek veri bağlantısı", value: "Kapalı" },
  { label: "Personel denemesi", value: "Hazırlıkta" },
  { label: "Saha kontrolü", value: "Önizleme" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Canlıya geçiş", value: "Başlamadı" },
];

const preliveTestCards = [
  { title: "Patron", text: "Günlük karar özeti, risk raporları ve yönetici karar alanı okunabilirlik açısından kontrol edilir." },
  { title: "Personel", text: "Ekran dili, el terminali akışı ve barkod/sayım mantığı gerçek işlem yapmadan değerlendirilir." },
  { title: "Saha", text: "Barkodsuz ürün, duplicate barkod, sayım farkı ve personel notu akışı pasif olarak gözden geçirilir." },
  { title: "Güvenlik", text: "Gerçek bağlantı, cihaz entegrasyonu, veri yazma, import ve rapor export kilitleri açıkça kapalı tutulur." },
];

const reportingDecisionStatusCards = [
  { label: "Raporlama modu", value: "Pasif/mock hazırlık" },
  { label: "Gerçek veri bağlantısı", value: "Kapalı" },
  { label: "Rapor export", value: "Kapalı" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Yönetici karar özeti", value: "Önizleme" },
  { label: "Günlük kontrol akışı", value: "Hazırlıkta" },
];

const reportingDecisionCards = [
  { title: "Stok / Barkod", text: "Barkodsuz ürün, duplicate barkod ve sayım farkı riskleri izlenecek." },
  { title: "Cari / Alacak", text: "Gecikmiş alacak, yakın vade ve kritik müşteri riskleri yönetici kontrolünde tutulacak." },
  { title: "Alış / Satış", text: "Düşük marjlı çok satan ürünler ve yüksek stoklu yavaş ürünler kontrol edilecek." },
  { title: "El Terminali", text: "Sayım sepeti, son okutulanlar ve personel saha notları manuel değerlendirilecek." },
  { title: "Vega Read-only", text: "İlk gerçek deneme henüz başlamadı; read-only hazırlık güvenli kapıda tutulacak." },
  { title: "Genel Karar", text: "Gerçek veri bağlantısı ve veri yazma ayrı küçük onaylı fazda ele alınacak." },
];

const commerceStatusCards = [
  { label: "Ticari analiz modu", value: "Pasif/mock hazırlık" },
  { label: "Satış kaydı", value: "Kapalı" },
  { label: "Alış kaydı", value: "Kapalı" },
  { label: "Fiyat/stok güncelleme", value: "Kapalı" },
];

const commercePerformanceClasses = [
  {
    title: "Güçlü Performans",
    items: ["Yüksek satış hacmi", "Sağlıklı kâr marjı", "Düzenli stok devri", "Satın alma tekrar planlanabilir"],
  },
  {
    title: "İzlenecek Ürünler",
    items: ["Satış var ama marj düşük", "Stok devri yavaşlıyor", "Kampanya veya fiyat kontrolü gerekebilir", "Yönetici kontrolü önerilir"],
  },
  {
    title: "Riskli Ürünler",
    items: ["Düşük satış", "Düşük veya belirsiz kâr marjı", "Stokta bekleme riski", "Yeni alış kararı dikkatli verilmeli"],
  },
  {
    title: "Kritik Ticari Risk",
    items: ["Yüksek stok / düşük satış", "Yanlış fiyat veya eksik maliyet riski", "Marka/kategori performansı zayıf", "Patron kararı gerekir"],
  },
];

const profitabilityPriorityRows = [
  { risk: "Düşük marjlı çok satan ürün", action: "Maliyet ve satış fiyatını manuel karşılaştır", ownerDecision: "Evet", priority: "Yüksek Öncelik" },
  { risk: "Yüksek stoklu yavaş ürün", action: "Kampanya veya vitrin önerisine al", ownerDecision: "Evet", priority: "Yüksek Öncelik" },
  { risk: "Maliyeti belirsiz ürün", action: "Maliyet doğrulaması tamamlanana kadar fiyat kararını beklet", ownerDecision: "Evet", priority: "Yüksek Öncelik" },
  { risk: "Orta marjlı ürün", action: "Satış hızı ve stok devrini haftalık takip et", ownerDecision: "Hayır", priority: "Orta Öncelik" },
  { risk: "Kampanya ihtiyacı olan ürün", action: "Yönetici notuna kampanya önerisi olarak ekle", ownerDecision: "Evet", priority: "Orta Öncelik" },
  { risk: "Sezon geçiş ürünü", action: "Kategori performansını dönemsel olarak izle", ownerDecision: "Hayır", priority: "Orta Öncelik" },
  { risk: "Sağlıklı marjlı ürün", action: "Standart takipte bırak", ownerDecision: "Hayır", priority: "Düşük Öncelik" },
  { risk: "Hızlı dönen ürün", action: "Stok devrini rutin yönetici özetinde göster", ownerDecision: "Hayır", priority: "Düşük Öncelik" },
  { risk: "Düşük riskli kategori", action: "Normal takip listesinde tut", ownerDecision: "Hayır", priority: "Düşük Öncelik" },
];

const brandCategoryPerformanceCards = [
  { title: "Güçlü marka grubu", note: "Satış ve marj dengesi izlenecek" },
  { title: "Yavaşlayan marka grubu", note: "Stok ve satış hızı kontrol edilecek" },
  { title: "Sezonluk kategori", note: "Dönemsel takip yapılacak" },
  { title: "Riskli kategori", note: "Stok bekleme ve düşük marj kontrol edilecek" },
];

const priceMarginGuideItems = [
  "Satış fiyatı değerlendirilmeden önce alış maliyeti manuel kontrol edilir.",
  "Düşük marjlı ürünler ayrı listeye alınır.",
  "Yüksek stoklu ürünlerde kampanya kararı patron tarafından verilir.",
  "Maliyeti belirsiz ürünlerde fiyat güncellemesi yapılmaz.",
  "Bu ekranda fiyat güncelleme, satış kaydı veya alış kaydı oluşturulmaz.",
  "Gerçek fiyat/marj işlemleri ayrı fazda planlanır.",
];


export default function Dashboard() {
  const erpData = useErpData();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isEndOfDayReportOpen, setIsEndOfDayReportOpen] = useState(false);
  const dashboardData = useMemo(() => buildDashboardData(erpData, selectedPeriod), [erpData, selectedPeriod]);
  const selectedPeriodLabel = dashboardPeriodOptions.find((option) => option.id === selectedPeriod)?.label || "Bu Ay";
  const reportPreview = buildReportPreview(dashboardData, selectedPeriodLabel);

  return (
    <>
      <section className="page-title dashboard-title">
        <div>
          <span className="version-badge">
            {APP_VERSION} · {APP_STAGE}
          </span>
          <p>Canlı özet</p>
          <h1>Melisa Bebe Yönetim Paneli</h1>
          <span>Satış, tahsilat, stok ve müşteri performansını tek ekrandan takip edin.</span>
        </div>
        <button className="primary-action" onClick={() => setIsEndOfDayReportOpen((isOpen) => !isOpen)} type="button">
          <ClipboardList size={18} />
          {isEndOfDayReportOpen ? "Raporu Gizle" : "Gün Sonu Raporu"}
        </button>
      </section>

      <div className="dashboard-period-selector" aria-label="Ana Panel dönem seçimi">
        {dashboardPeriodOptions.map((option) => (
          <button
            aria-pressed={selectedPeriod === option.id}
            className={selectedPeriod === option.id ? "active" : ""}
            key={option.id}
            onClick={() => setSelectedPeriod(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
        <span className="dashboard-period-summary" title="Seçili dönem ticari özeti">
          <strong>Seçili dönem: {selectedPeriodLabel}</strong>
          <small>
            {formatNumber(dashboardData.periodSummary.salesSlipCount)} fiş · {formatNumber(dashboardData.periodSummary.soldQuantity)} adet ·{" "}
            {formatCurrency(dashboardData.periodSummary.salesTotal)} satış · {formatCurrency(dashboardData.periodSummary.collectionsTotal)} tahsilat
          </small>
        </span>
      </div>

      <section className={`dashboard-decision-note ${dashboardData.patronNoteTone}`} aria-label="Patron Notu">
        <strong>Patron Notu</strong>
        <span>{dashboardData.patronNote}</span>
      </section>

      <OwnerView />

      <ClosedBetaPreparationCenter />

      <DesktopPreparationCenter />

      <ReadonlyStockSmokeSummary />

      <ReadOnlyStockPreviewSummary />

      <StockPreviewSecurityConfirmation />

      <StockPreviewUsabilitySummary />

      <StockFieldValidationPrepSummary />

      <StockManualValidationChecklistSummary />

      <StockFieldLabelingPrepSummary />

      <SuccessfulStockReadProof />

      <PassiveVegaConnectionStatus />

      <VegaStockFieldMapSummary />

      <ReadonlyEnvironmentPrepSummary />

      <ReadonlyFailClosedSummary />

      <ReadonlyFinalSecurityScanSummary />

      <ReadonlyOperatorChecklistSummary />

      <ReadonlyConnectionSkeletonSummary />

      <ReadonlyFinalSecuritySummary />

      <ReadonlyFinalDecisionSummary />

      <ReadonlyFirstTrialSummary />

      <VegaTechnicalGateSummary />

      <ModuleMaturityScoreCenter />

      <PreliveOperationTestCenter />

      <ReportingDecisionCenter />

      <CommerceProfitabilityCenter />

      <section className={`kpi-grid dashboard-compact-kpis ${dashboardSectionClass("dashboard-daily-operation")}`} id="dashboard-daily-operation">
        <DashboardNewReleaseBadge sectionId="dashboard-daily-operation" />
        {dashboardData.kpis.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <CurrencyTradeSummary summary={dashboardData.currencyTradeSummary} />

      {isEndOfDayReportOpen && <EndOfDayReportPreview report={reportPreview} />}

      <CommerceInsights data={dashboardData.commerceInsights} sectionClass={dashboardSectionClass("dashboard-commerce-insights")}>
        <DashboardNewReleaseBadge sectionId="dashboard-commerce-insights" />
      </CommerceInsights>
    </>
  );
}

function DesktopPreparationCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-desktop-preparation-center")}`} id="dashboard-desktop-preparation-center">
      <DashboardNewReleaseBadge sectionId="dashboard-desktop-preparation-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Melisa Bebe Tekstil San. ve Tic. Ltd. Şti.</p>
          <h2>Desktop Hazırlık Merkezi</h2>
          <span>ERP arayüzünden canlı Vega bağlantısı başlatılmaz; güvenli entegrasyon seviyesi local desktop ve terminal smoke test görünürlüğünde tutulur.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {desktopPreparationCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ClosedBetaPreparationCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-closed-beta-preparation")}`} id="dashboard-closed-beta-preparation">
      <DashboardNewReleaseBadge sectionId="dashboard-closed-beta-preparation" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Melisa Bebe Tekstil San. ve Tic. Ltd. Şti.</p>
          <h2>Kapalı Beta Hazırlık Merkezi</h2>
          <span>Patron bilgisayarında masaüstü akışı, ekranlar ve güvenlik kilitleri test edilir; canlı kullanım veya arayüzden Vega bağlantısı başlatılmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {closedBetaPreparationCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <p className="commerce-profitability-safety-note">{closedBetaPreparationMessage}</p>
    </section>
  );
}

function ReadonlyStockSmokeSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-stock-smoke-summary")}`} id="dashboard-readonly-stock-smoke-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-stock-smoke-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Local read-only smoke test</p>
          <h2>İlk Read-only Stok Okuma Özeti</h2>
          <span>İlk gerçek okuma yalnızca local terminal scriptiyle, stok kartı ve 20 satır sınırıyla görünür; ERP arayüzü bağlantı başlatmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyStockSmokeSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadOnlyStockPreviewSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-stock-preview")}`} id="dashboard-readonly-stock-preview">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-stock-preview" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Manuel read-only ekran</p>
          <h2>Vega Read-only Stok Önizleme</h2>
          <span>
            Uygulama içinden yalnızca kullanıcı isteğiyle çalışan, 20 stok kartı sınırındaki geçici read-only önizleme durumu. Otomatik bağlantı, dosyaya çıktı, import veya veri yazma içermez.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readOnlyStockPreviewSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreviewSecurityConfirmation() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-security-confirmation")}`} id="dashboard-stock-preview-security-confirmation">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-security-confirmation" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Güvenlik teyidi</p>
          <h2>Stok Önizleme Güvenlik Teyidi</h2>
          <span>
            Uygulama içi read-only stok önizleme 20 satırla doğrulandı; canlı stok değerleri, bağlantı bilgileri, dosya çıktısı veya import/senkron izi repoya yazılmadı.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockPreviewSecurityConfirmationCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreviewUsabilitySummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-usability")}`} id="dashboard-stock-preview-usability">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-usability" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Kullanım iyileştirme</p>
          <h2>Stok Önizleme Kullanım İyileştirme</h2>
          <span>
            Read-only stok önizleme ekranında arama, kolon açıklamaları, aday fiyat formatı ve boş değer gösterimi yalnızca ekranda gelen geçici 20 satır üzerinde iyileştirildi.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockPreviewUsabilityCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockFieldValidationPrepSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-field-validation-prep")}`} id="dashboard-stock-field-validation-prep">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-field-validation-prep" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Alan doğrulama hazırlığı</p>
          <h2>Stok Alan Doğrulama Hazırlığı</h2>
          <span>
            Read-only stok önizlemede gelen kolonların nasıl yorumlanacağı pasif rehber olarak gösterilir; alanlar Vega ekranı ve örnek satırlarla doğrulanmadan kesin karar sayılmaz.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockFieldValidationPrepCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockManualValidationChecklistSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-manual-validation-checklist")}`} id="dashboard-stock-manual-validation-checklist">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-manual-validation-checklist" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Manuel karşılaştırma</p>
          <h2>Stok Alan Manuel Doğrulama Checklist’i</h2>
          <span>
            Vega ekranı ile uygulamadaki 20 satırlık read-only önizleme alanlarını karşılaştırmak için geçici checklist hazırdır; seçimler kaydedilmez ve veri yazma başlatmaz.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockManualValidationChecklistCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockFieldLabelingPrepSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-field-labeling-prep")}`} id="dashboard-stock-field-labeling-prep">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-field-labeling-prep" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Geçici etiket hazırlığı</p>
          <h2>Doğrulama Sonrası Stok Alan Etiketleme Hazırlığı</h2>
          <span>
            Stok önizleme kolonları için önerilen etiketler ve güven seviyeleri görünürdür; KOD, fiyat ve KDV alanları kesinleşmiş karar olarak sunulmaz.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockFieldLabelingPrepCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function SuccessfulStockReadProof() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-successful-stock-read-proof")}`} id="dashboard-successful-stock-read-proof">
      <DashboardNewReleaseBadge sectionId="dashboard-successful-stock-read-proof" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Güvenli teknik kanıt</p>
          <h2>İlk Başarılı Stok Okuma Kanıtı</h2>
          <span>
            İlk read-only Vega stok smoke test başarısı yalnızca teknik metadata olarak gösterilir; gerçek stok kodu, ürün adı, fiyat veya bağlantı bilgisi bu ekranda yer almaz.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {successfulStockReadProofCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel
        title="Doğrulanan Kolonlar"
        note="Bu liste sadece kolon adlarını gösterir; canlı stok satır değerleri repoya veya uygulama koduna yazılmaz."
      >
        <div className="brand-category-performance-grid">
          {successfulStockReadProofColumns.map((column) => (
            <article className="brand-category-performance-card" key={column}>
              <strong>{column}</strong>
              <span>Kolon geldi</span>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">
        Sonraki canlı bağlantı fazlarından önce yalnızca okuma yetkili ayrı SQL kullanıcısına geçilmesi önerilir. Bu kanıt veri yazma, import, senkron, dosyaya çıktı veya ERP arayüzünden bağlantı başlatma içermez.
      </p>
    </section>
  );
}

function PassiveVegaConnectionStatus() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-passive-vega-connection-status")}`} id="dashboard-passive-vega-connection-status">
      <DashboardNewReleaseBadge sectionId="dashboard-passive-vega-connection-status" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif entegrasyon görünürlüğü</p>
          <h2>Vega Bağlantı Durumu</h2>
          <span>ERP içinde canlı bağlantı başlatmadan, SQL/Vega entegrasyonunun hangi güvenli seviyede tutulduğunu gösteren pasif durum ekranı.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {passiveVegaConnectionSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <p className="commerce-profitability-safety-note">{passiveVegaConnectionStatusMessage}</p>
    </section>
  );
}

function VegaStockFieldMapSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-stock-field-map")}`} id="dashboard-vega-stock-field-map">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-stock-field-map" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Read-only stok kartı dokümantasyonu</p>
          <h2>Vega Stok Kartı Alan Haritası</h2>
          <span>Smoke test kolonlarının muhtemel ERP karşılıklarını güven seviyesiyle gösteren pasif görünürlük alanı; canlı bağlantı veya veri çekme başlatmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaStockFieldMapSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="commerce-profitability-class-grid">
        {vegaStockFieldMap.map((field) => (
          <article className="commerce-profitability-class-card" key={field.column}>
            <span>{field.column}</span>
            <strong>{field.erpMeaning}</strong>
            <p>Güven: {field.confidence}</p>
            <p>{field.note}</p>
          </article>
        ))}
      </div>

      <p className="commerce-profitability-safety-note">{vegaStockFieldMapWarning}</p>
    </section>
  );
}

function ReadonlyEnvironmentPrepSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-environment-prep-summary")}`} id="dashboard-readonly-environment-prep-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-environment-prep-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif ortam hazırlığı</p>
          <h2>Read-only Ortam Bilgisi Hazırlık Özeti</h2>
          <span>Teknik sorumlu, operatör ve patronun bağlantı öncesi manuel hazırlayacağı ortam bilgileri gerçek veri girişi olmadan görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyEnvironmentPrepSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyFailClosedSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-fail-closed-summary")}`} id="dashboard-readonly-fail-closed-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-fail-closed-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif fail-closed görünürlük</p>
          <h2>Read-only Fail-closed Hazırlık Özeti</h2>
          <span>Eksik yedek, doğrulanmamış read-only kullanıcı veya kapsam aşımında bağlantının kapalı kalacağı yönetici özetinde görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyFailClosedSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyFinalSecurityScanSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-final-security-scan-summary")}`} id="dashboard-readonly-final-security-scan-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-final-security-scan-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif son güvenlik taraması</p>
          <h2>Read-only Öncesi Son Güvenlik Özeti</h2>
          <span>Sürüm uyumu, mavi nokta görünürlüğü, pasif metadata ve kapalı bağlantı kilitleri ilk bağlantıdan önce son kez görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyFinalSecurityScanSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyOperatorChecklistSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-operator-checklist-summary")}`} id="dashboard-readonly-operator-checklist-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-operator-checklist-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif operatör checklist</p>
          <h2>Read-only İlk Bağlantı Checklist Özeti</h2>
          <span>Operatör, teknik sorumlu ve patron kontrol maddeleri gerçek bağlantı açılmadan kısa yönetici özeti olarak görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyOperatorChecklistSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyConnectionSkeletonSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-connection-skeleton-summary")}`} id="dashboard-readonly-connection-skeleton-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-connection-skeleton-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif teknik iskelet</p>
          <h2>Read-only Bağlantı Altyapısı Özeti</h2>
          <span>Bağlantı modu, DB okuma kilidi ve ilk 20 stok kartı sınırı gerçek bağlantı açılmadan görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyConnectionSkeletonSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyFinalSecuritySummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-final-security-summary")}`} id="dashboard-readonly-final-security-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-final-security-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif final güvenlik kapanışı</p>
          <h2>Read-only Bağlantı Öncesi Final Güvenlik Özeti</h2>
          <span>Hazırlık fazı kapanırken kapalı kilitler, yapılmayacak işlemler ve sonraki küçük read-only sınırı tek bakışta görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyFinalSecuritySummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyFinalDecisionSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-final-decision-summary")}`} id="dashboard-readonly-final-decision-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-final-decision-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif son karar görünürlüğü</p>
          <h2>Read-only İlk Deneme Son Karar Özeti</h2>
          <span>Başlama şartları, kapsam sınırı ve güvenlik kilitleri gerçek bağlantı açılmadan patron kararına hazır görünür.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyFinalDecisionSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadonlyFirstTrialSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-first-trial-summary")}`} id="dashboard-readonly-first-trial-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-first-trial-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Read-only ilk deneme planı</p>
          <h2>İlk Deneme ve Geri Dönüş Özeti</h2>
          <span>
            İlk gerçek bağlantı açılmadan önce manuel yedek, rollback, başarısızlık senaryosu ve test sonrası değerlendirme akışını pasif olarak görünür tutar.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlyFirstTrialSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function VegaTechnicalGateSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-technical-gate-summary")}`} id="dashboard-vega-technical-gate-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-technical-gate-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Vega read-only ön kapı</p>
          <h2>Vega Read-only Teknik Ön Kapı Özeti</h2>
          <span>
            İlk gerçek bağlantıdan önce manuel yedek, read-only kullanıcı, 20 satır sınırı ve veri yazma kilitlerinin görünür kaldığı pasif yönetici özeti.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaTechnicalGateSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModuleMaturityScoreCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-module-maturity-score-center")}`} id="dashboard-module-maturity-score-center">
      <DashboardNewReleaseBadge sectionId="dashboard-module-maturity-score-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif canlıya hazırlık skoru</p>
          <h2>Modül Olgunluk ve Canlıya Hazırlık Skor Merkezi</h2>
          <span>
            ERP’nin hangi modüllerinin canlı kullanıma ne kadar hazır olduğunu, hangi alanların hâlâ pasif/mock hazırlıkta kaldığını ve gerçek bağlantıya geçmeden önce hangi kararların beklediğini gösteren yönetici skor ekranı.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {moduleMaturityScoreCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function PreliveOperationTestCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-prelive-operation-test-center")}`} id="dashboard-prelive-operation-test-center">
      <DashboardNewReleaseBadge sectionId="dashboard-prelive-operation-test-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif canlı öncesi test</p>
          <h2>Canlı Kullanım Öncesi Operasyon Test Merkezi</h2>
          <span>
            ERP’nin gerçek kullanıma geçmeden önce patron, personel, saha ve güvenlik açısından nasıl kontrol edileceğini gerçek işlem yapmadan gösteren pasif test merkezi.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {preliveTestStatusCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Canlı Öncesi Kontrol Özeti">
        <div className="reporting-decision-card-grid">
          {preliveTestCards.map((card) => (
            <article className="brand-category-performance-card reporting-decision-card" key={card.title}>
              <strong>{card.title}</strong>
              <span>{card.text}</span>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function ReportingDecisionCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-reporting-decision-center")}`} id="dashboard-reporting-decision-center">
      <DashboardNewReleaseBadge sectionId="dashboard-reporting-decision-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif raporlama hazırlığı</p>
          <h2>Raporlama ve Yönetici Karar Merkezi</h2>
          <span>
            Stok, barkod, cari, alacak, kârlılık, el terminali ve Vega hazırlık durumlarını gerçek veri yazmadan yönetici seviyesinde tek rapor akışında özetleyen pasif hazırlık ekranı.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {reportingDecisionStatusCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Patron Günlük Karar Özeti">
        <div className="reporting-decision-card-grid">
          {reportingDecisionCards.map((card) => (
            <article className="brand-category-performance-card reporting-decision-card" key={card.title}>
              <strong>{card.title}</strong>
              <span>{card.text}</span>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function CommerceProfitabilityCenter() {
  return (
    <section className={`commerce-profitability-center ${dashboardSectionClass("dashboard-commerce-profitability-center")}`} id="dashboard-commerce-profitability-center">
      <DashboardNewReleaseBadge sectionId="dashboard-commerce-profitability-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif yönetici hazırlığı</p>
          <h2>Alış Satış ve Kârlılık Yönetici Merkezi</h2>
          <span>
            Alış, satış, kâr marjı, düşük kârlı ürünler ve marka/kategori performansını gerçek veri yazmadan yönetici seviyesinde görünür hale getiren pasif hazırlık ekranı.
          </span>
        </div>
      </div>

      <div className="commerce-profitability-status-grid">
        {commerceStatusCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Ticari Performans Sınıfları">
        <div className="commerce-performance-grid">
          {commercePerformanceClasses.map((group) => (
            <article className="commerce-performance-card" key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kârlılık Öncelik Matrisi">
        <div className="profitability-priority-grid">
          {profitabilityPriorityRows.map((row) => (
            <article className="profitability-priority-card" key={`${row.priority}-${row.risk}`}>
              <span>{row.priority}</span>
              <strong>{row.risk}</strong>
              <p>{row.action}</p>
              <small>Patron kararı gerekir mi? {row.ownerDecision}</small>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Marka ve Kategori Performansı" note="Bu panel gerçek veri okumaz, sadece yönetici takip mantığını hazırlar.">
        <div className="brand-category-performance-grid">
          {brandCategoryPerformanceCards.map((card) => (
            <article className="brand-category-performance-card" key={card.title}>
              <strong>{card.title}</strong>
              <span>{card.note}</span>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Fiyat ve Marj Kontrol Rehberi">
        <ul className="price-margin-guide-list">
          {priceMarginGuideItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CommercePanel>
    </section>
  );
}

function CommercePanel({ children, note, title }) {
  return (
    <article className="commerce-profitability-panel">
      <div className="commerce-profitability-panel-heading">
        <h3>{title}</h3>
        {note && <p>{note}</p>}
      </div>
      {children}
    </article>
  );
}

function OwnerView() {
  return (
    <section className={`dashboard-owner-view ${dashboardSectionClass("dashboard-owner-view")}`} id="dashboard-owner-view">
      <DashboardNewReleaseBadge sectionId="dashboard-owner-view" />
      <div className="dashboard-owner-heading">
        <div>
          <h2>Patron Bakışı</h2>
          <p>Bugünkü operasyon, riskler, hazırlık seviyesi ve sonraki adımlar tek ekranda özetlenir.</p>
        </div>
        <span>Pasif yönetici özeti</span>
      </div>

      <div className="dashboard-owner-card-grid">
        {ownerViewCards.map((card) => (
          <article className="dashboard-owner-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-owner-panel-grid">
        <OwnerChecklistPanel title="Bugün Bakılacaklar" items={ownerTodayItems} />
        <OwnerChecklistPanel title="Patron Karar Alanı" items={ownerDecisionItems} tone="decision" />
      </div>
    </section>
  );
}

function OwnerChecklistPanel({ items, title, tone = "today" }) {
  return (
    <article className={`dashboard-owner-list-panel ${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function CurrencyTradeSummary({ summary }) {
  return (
    <section className={`dashboard-currency-summary ${dashboardSectionClass("dashboard-currency-summary")}`} id="dashboard-currency-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-currency-summary" />
      <div>
        <h2>Dövizli Ticaret Özeti</h2>
        <p>Satış, alış ve net cari pozisyon seçili döneme göre para birimi bazında gösterilir.</p>
      </div>

      <div className="dashboard-currency-grid">
        {buildCurrencyTradeCards(summary).map((row) => (
          <article className="dashboard-currency-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
            {row.note && <small>{row.note}</small>}
          </article>
        ))}
      </div>

      <div className="dashboard-currency-detail" aria-label="Cari Detay">
        <div>
          <h3>Cari Detay</h3>
          <p>Müşteri ve tedarikçi cari toplamları ayrı gösterilir.</p>
        </div>
        <div className="dashboard-currency-detail-grid">
          {buildCurrencyCurrentDetailCards(summary).map((row) => (
            <article className="dashboard-currency-detail-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </article>
          ))}
        </div>
      </div>

      <p className="dashboard-currency-note">
        <strong>Döviz Notu:</strong> {summary?.currencyNote}
      </p>
    </section>
  );
}

function dashboardSectionClass(sectionId) {
  return dashboardUpdatedSectionIds.includes(sectionId) ? "section-updated-highlight dashboard-updated-section" : "";
}

function DashboardNewReleaseBadge({ sectionId }) {
  if (!dashboardUpdatedSectionIds.includes(sectionId)) return null;
  return <span className="new-release-badge dashboard-release-badge">YENİ · {currentReleaseVersion}</span>;
}

function EndOfDayReportPreview({ report }) {
  return (
    <section className="dashboard-report-preview chart-panel" aria-live="polite">
      <div>
        <h2>Gün Sonu Raporu Önizleme</h2>
        <p>Bu alan yalnızca önizlemedir. Dosya oluşturmaz, kayıt açmaz ve veri yazmaz.</p>
      </div>

      <div className="dashboard-report-grid">
        {report.rows.map((row) => (
          <div key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildDashboardData({ collections, customers, products, purchaseSlips, salesSlips, suppliers }, selectedPeriod) {
  const today = getTodayISO();
  const periodRange = getPeriodRange(selectedPeriod, today);
  const activeSalesSlips = salesSlips.filter(isActiveRecord);
  const activePurchaseSlips = purchaseSlips.filter(isActiveRecord);
  const activeCollections = collections.filter(isActiveRecord);
  const criticalProducts = products.filter((product) => toNumber(product.stockQuantity) <= toNumber(product.criticalStockLevel));
  const monthKey = today.slice(0, 7);
  const monthlySalesSlips = activeSalesSlips.filter((slip) => getRecordDate(slip).startsWith(monthKey));
  const monthlyCollections = activeCollections.filter((collection) => getRecordDate(collection).startsWith(monthKey));
  const periodSalesSlips = activeSalesSlips.filter((slip) => isDateInRange(getRecordDate(slip), periodRange));
  const periodPurchaseSlips = activePurchaseSlips.filter((slip) => isDateInRange(getRecordDate(slip), periodRange));
  const periodCollections = activeCollections.filter((collection) => isDateInRange(getRecordDate(collection), periodRange));
  const periodSales = sumBy(periodSalesSlips, "grandTotal");
  const periodCollectionsTotal = sumBy(periodCollections, "amount");
  const monthlySalesTotal = sumBy(monthlySalesSlips, "grandTotal");
  const monthlyCollectionsTotal = sumBy(monthlyCollections, "amount");
  const periodSoldQuantity = sumSlipQuantity(periodSalesSlips);
  const monthlySoldQuantity = sumSlipQuantity(monthlySalesSlips);
  const periodSummary = {
    collectionsTotal: periodCollectionsTotal,
    salesSlipCount: periodSalesSlips.length,
    salesTotal: periodSales,
    soldQuantity: periodSoldQuantity,
  };
  const currencyTradeSummary = {
    current: buildCurrentCurrencyTotals(customers, suppliers),
    customerCurrent: buildCurrencyTotals(customers, "currentBalance"),
    purchases: buildCurrencyTotals(periodPurchaseSlips, "grandTotal"),
    sales: buildCurrencyTotals(periodSalesSlips, "grandTotal"),
    supplierCurrent: buildCurrencyTotals(suppliers, "currentBalance"),
  };

  return {
    kpis: [
      buildKpi(selectedPeriod === "today" ? "Bugünkü fiş" : "Satış fişi", periodSalesSlips.length, monthlySalesSlips.length, "count", ReceiptText, "dark", "Seçili dönemde açılan satış fişi"),
      buildKpi("Çıkan adet", periodSoldQuantity, monthlySoldQuantity, "quantity", Boxes, "green", "Satış fişlerindeki toplam ürün adedi"),
      buildKpi("Satış", periodSales, monthlySalesTotal, "currency", ShoppingBag, "red", "Seçili dönem satış toplamı"),
      buildKpi("Tahsilat", periodCollectionsTotal, monthlyCollectionsTotal, "currency", Banknote, "amber", "Seçili dönem tahsilat toplamı"),
    ],
    commerceInsights: {
      monthlySalesTrend: buildSalesTrend(periodSalesSlips, periodRange),
      monthlyTopProducts: buildMonthlyTopProducts(periodSalesSlips),
      topCustomersByRevenue: buildTopCustomers(periodSalesSlips),
      categoryAgeDistribution: buildCategoryAgeDistribution(periodSalesSlips, products),
      riskRows: buildRiskRows({ criticalProducts, customers }),
      latestSlips: buildLatestSlipRows({ activePurchaseSlips, activeSalesSlips }),
    },
    currencyTradeSummary: {
      ...currencyTradeSummary,
      currencyNote: buildCurrencyNote(currencyTradeSummary),
    },
    ...buildPatronNote(periodSummary, criticalProducts),
    periodSummary,
  };
}

function buildReportPreview({ commerceInsights, currencyTradeSummary, patronNote, periodSummary }, periodLabel) {
  const topCustomer = commerceInsights.topCustomersByRevenue[0];
  const topProduct = commerceInsights.monthlyTopProducts[0];
  const riskNote = commerceInsights.riskRows[0];
  const salesSlipText = `${formatNumber(periodSummary.salesSlipCount)} fiş`;
  const soldQuantityText = `${formatNumber(periodSummary.soldQuantity)} adet`;

  return {
    rows: [
      { label: "Seçili dönem", value: periodLabel },
      { label: "Satış hareketi", value: salesSlipText },
      { label: "Çıkan ürün", value: soldQuantityText },
      { label: "Satış cirosu", value: formatCurrency(periodSummary.salesTotal) },
      { label: "Kasaya giren", value: formatCurrency(periodSummary.collectionsTotal) },
      ...buildCurrencyTradeReportRows(currencyTradeSummary).map((row) => ({
        label: row.label,
        value: row.value,
      })),
      {
        label: "En güçlü müşteri",
        value: topCustomer ? `${topCustomer.name} · ${formatCurrency(topCustomer.revenue)}` : "Müşteri hareketi yok",
      },
      {
        label: "En çok çıkan ürün",
        value: topProduct ? `${topProduct.name} · ${formatNumber(topProduct.quantity)} adet` : "Ürün hareketi yok",
      },
      {
        label: "Risk notu",
        value: riskNote ? `${riskNote.label} · ${riskNote.actionNote}` : "Kritik risk görünmüyor.",
      },
      {
        label: "Patron Notu",
        value: patronNote,
      },
    ],
  };
}

function buildPatronNote(periodSummary, criticalProducts = []) {
  const hasSalesSlip = toNumber(periodSummary.salesSlipCount) > 0;
  const hasSalesActivity = hasSalesSlip || toNumber(periodSummary.salesTotal) > 0;
  const hasCollection = toNumber(periodSummary.collectionsTotal) > 0;
  const hasCriticalStock = criticalProducts.length > 0;

  if (!hasSalesSlip) return createPatronNote("Seçili dönemde satış fişi görünmüyor.", "no-sales");
  if (hasSalesActivity && !hasCollection) return createPatronNote("Satış var, tahsilat takibi kontrol edilmeli.", "collection-warning");
  if (hasCriticalStock) return createPatronNote("Kritik stokta ürün var, satın alma kontrol edilmeli.", "stock-warning");
  if (hasSalesActivity && hasCollection) return createPatronNote("Satış ve tahsilat hareketi oluşmuş, dönem aktif görünüyor.", "active");
  return createPatronNote("Seçili dönem ticari hareketleri izleniyor.", "neutral");
}

function createPatronNote(message, tone) {
  return {
    patronNote: message,
    patronNoteTone: `dashboard-decision-note-${tone}`,
  };
}

function buildCurrencyTradeCards(summary) {
  return [
    ...buildCurrencyGroupCards("Satış", summary?.sales),
    ...buildCurrencyGroupCards("Alış", summary?.purchases),
    ...buildCurrencyGroupCards("Net Cari", summary?.current, "Müşteri - tedarikçi"),
  ];
}

function buildCurrencyCurrentDetailCards(summary) {
  return [
    ...buildCurrencyDetailGroupCards("Müşteri Cari", summary?.customerCurrent),
    ...buildCurrencyDetailGroupCards("Tedarikçi Cari", summary?.supplierCurrent),
  ];
}

function buildCurrencyDetailGroupCards(label, totals = createCurrencyTotals()) {
  return ["TRY", "USD", "EUR"].map((currencyCode) => ({
    label: `${label} ${getCurrencyLabel(currencyCode)}`,
    value: formatCurrencyByCode(totals[currencyCode] || 0, currencyCode),
  }));
}

function buildCurrencyGroupCards(label, totals = createCurrencyTotals(), fixedNote) {
  return ["TRY", "USD", "EUR"].map((currencyCode) => {
    const value = totals[currencyCode] || 0;
    return {
      label: `${label} ${getCurrencyLabel(currencyCode)}`,
      note: fixedNote || (currencyCode === "TRY" || value !== 0 ? label : "Dövizli kayıt yok"),
      value: formatCurrencyByCode(value, currencyCode),
    };
  });
}

function buildCurrencyTradeReportRows(summary) {
  return [
    { label: "Satış", value: formatCurrencyTradeLine(summary?.sales) },
    { label: "Alış", value: formatCurrencyTradeLine(summary?.purchases) },
    { label: "Net Cari", value: formatCurrencyTradeLine(summary?.current) },
  ];
}

function buildCurrencyNote(summary) {
  return hasForeignCurrencyMovement(summary)
    ? "Dövizli hareket var; kur çevrimi yapılmadan gösterilir."
    : "Dövizli kayıt yok; TL varsayılan para birimidir.";
}

function hasForeignCurrencyMovement(summary) {
  return [summary?.sales, summary?.purchases, summary?.current, summary?.customerCurrent, summary?.supplierCurrent].some((totals) =>
    ["USD", "EUR"].some((currencyCode) => Math.abs(toNumber(totals?.[currencyCode])) > 0)
  );
}

function formatCurrencyTradeLine(totals = createCurrencyTotals()) {
  return ["TRY", "USD", "EUR"].map((currencyCode) => formatCurrencyByCode(totals[currencyCode] || 0, currencyCode)).join(" / ");
}

function buildCurrencyTotals(records = [], totalKey) {
  return records.reduce((summary, record) => {
    const currency = getRecordCurrency(record);
    if (!currency) return summary;

    summary[currency] += toNumber(record[totalKey] ?? record.grandTotal ?? record.total ?? record.amount);
    if (hasCurrencyField(record)) {
      summary.hasCurrencyData = true;
    }
    return summary;
  }, createCurrencyTotals());
}

function buildCurrentCurrencyTotals(customers = [], suppliers = []) {
  const summary = createCurrencyTotals();
  addCurrentBalances(summary, customers, 1);
  addCurrentBalances(summary, suppliers, -1);
  return summary;
}

function addCurrentBalances(summary, records = [], direction) {
  records.forEach((record) => {
    const currency = getRecordCurrency(record);
    if (!currency) return;

    summary[currency] += toNumber(record.currentBalance) * direction;
    if (hasCurrencyField(record)) {
      summary.hasCurrencyData = true;
    }
  });
}

function createCurrencyTotals() {
  return { EUR: 0, TRY: 0, USD: 0, hasCurrencyData: false };
}

function getRecordCurrency(record) {
  const currencyValue = getCurrencyFieldValue(record);
  if (!currencyValue) return "TRY";
  return normalizeCurrency(currencyValue);
}

function getCurrencyFieldValue(record) {
  return record.currency || record.currencyCode || record.currencyType || record.paraBirimi || record.currencySymbol || "";
}

function hasCurrencyField(record) {
  return Boolean(getCurrencyFieldValue(record));
}

function normalizeCurrency(value) {
  const normalized = String(value || "")
    .trim()
    .toLocaleUpperCase("tr-TR");
  if (!normalized) return "TRY";
  if (["TRY", "TL", "₺", "TÜRK LİRASI", "TURK LIRASI"].includes(normalized)) return "TRY";
  if (["USD", "$", "US DOLLAR", "DOLAR"].includes(normalized)) return "USD";
  if (["EUR", "€", "EURO"].includes(normalized)) return "EUR";
  return null;
}

function getCurrencyLabel(currencyCode) {
  if (currencyCode === "TRY") return "TL";
  return currencyCode;
}

function formatCurrencyByCode(value, currencyCode) {
  const suffixMap = {
    EUR: "€",
    TRY: "₺",
    USD: "$",
  };
  return `${formatNumber(value)} ${suffixMap[currencyCode] || ""}`.trim();
}

function buildKpi(label, currentValueRaw, monthValue, type, icon, tone, helperText) {
  const monthTotal = Math.max(toNumber(monthValue), 0);
  const currentValue = Math.max(toNumber(currentValueRaw), 0);
  const percent = monthTotal > 0 ? Math.min((currentValue / monthTotal) * 100, 100) : 0;

  return {
    icon,
    label,
    monthValue: helperText || `Bu ay: ${formatInsightValue(monthTotal, type)}`,
    percent,
    tone,
    value: formatInsightValue(currentValue, type),
  };
}

function formatInsightValue(value, type) {
  if (type === "currency") return formatCurrency(value);
  if (type === "quantity") return `${formatNumber(value)} adet`;
  return formatNumber(value);
}

function buildSalesTrend(salesSlips, range) {
  const dates = getDateKeysInRange(range);

  return dates.map((date) => ({
    day: formatTrendLabel(date),
    value: sumByDate(salesSlips, date, "grandTotal"),
  }));
}

function buildMonthlyTopProducts(salesSlips) {
  const productMap = new Map();

  salesSlips.forEach((slip) => {
    (slip.items || []).forEach((item) => {
      const key = item.productId || item.productCode || item.barcode || item.productName;
      const current = productMap.get(key) || { name: item.productName || "-", quantity: 0, revenue: 0 };
      productMap.set(key, {
        ...current,
        quantity: current.quantity + toNumber(item.quantity),
        revenue: current.revenue + getItemRevenue(item),
      });
    });
  });

  return [...productMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((item) => ({ ...item, name: shortenLabel(item.name) }));
}

function buildTopCustomers(salesSlips) {
  const customerMap = new Map();

  salesSlips.forEach((slip) => {
    const key = slip.customerId || slip.customerName || "Müşteri";
    const current = customerMap.get(key) || { name: slip.customerName || "Müşteri", quantity: 0, revenue: 0 };
    customerMap.set(key, {
      ...current,
      quantity: current.quantity + sumSlipQuantity([slip]),
      revenue: current.revenue + toNumber(slip.grandTotal),
    });
  });

  return [...customerMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((item) => ({ ...item, name: shortenLabel(item.name) }));
}

function buildCategoryAgeDistribution(salesSlips, products) {
  const productMap = buildProductLookup(products);
  const distributionMap = new Map();

  salesSlips.forEach((slip) => {
    (slip.items || []).forEach((item) => {
      const product = findProductForItem(productMap, item);
      const category = product?.category || product?.categoryName;
      const ageGroup = product?.ageGroup;
      if (!category && !ageGroup) return;

      const key = `${category || "Kategori yok"} / ${ageGroup || "Yaş grubu yok"}`;
      distributionMap.set(key, (distributionMap.get(key) || 0) + toNumber(item.quantity));
    });
  });

  const rows = [...distributionMap.entries()]
    .map(([name, quantity]) => ({ name: shortenLabel(name, 34), quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);
  const maxQuantity = Math.max(...rows.map((row) => row.quantity), 0);

  return rows.map((row) => ({
    ...row,
    percent: maxQuantity > 0 ? Math.max((row.quantity / maxQuantity) * 100, 4) : 0,
  }));
}

function buildRiskRows({ criticalProducts, customers }) {
  const stockRows = criticalProducts
    .slice()
    .sort((a, b) => toNumber(a.stockQuantity) - toNumber(b.stockQuantity))
    .map((product) => ({
      actionNote: toNumber(product.stockQuantity) <= 0 ? "Acil tedarik" : "Satın alma kontrolü",
      label: product.name || product.code || "Ürün",
      meta: `${formatNumber(product.stockQuantity)} adet`,
      priority: toNumber(product.stockQuantity) <= 0 ? 0 : 2,
      riskTone: toNumber(product.stockQuantity) <= 0 ? "risk-stock-empty" : "risk-stock-critical",
      status: toNumber(product.stockQuantity) <= 0 ? "Stok yok" : "Kritik",
    }));
  const customerRows = buildRiskCustomers(customers)
    .slice(0, 2)
    .map((customer) => ({
      actionNote: customer.riskLabel === "Limit Aşıldı" ? "Tahsilat kontrolü" : "Limit yaklaşıyor",
      label: customer.name,
      meta: formatCurrency(customer.currentBalance),
      priority: customer.riskLabel === "Limit Aşıldı" ? 1 : 3,
      riskTone: customer.riskLabel === "Limit Aşıldı" ? "risk-limit-exceeded" : "risk-limit-near",
      status: customer.riskLabel,
    }));

  return [...stockRows, ...customerRows].sort((a, b) => a.priority - b.priority).slice(0, 3);
}

function buildLatestSlipRows({ activePurchaseSlips, activeSalesSlips }) {
  return [
    ...activeSalesSlips.map((slip) => ({
      no: slip.slipNo,
      party: slip.customerName,
      total: toNumber(slip.grandTotal),
      type: "Satış",
      when: slip.createdAt || slip.date,
    })),
    ...activePurchaseSlips.map((slip) => ({
      no: slip.slipNo,
      party: slip.supplierName,
      total: toNumber(slip.grandTotal),
      type: "Alış",
      when: slip.createdAt || slip.date,
    })),
  ]
    .sort((a, b) => getSortTime(b) - getSortTime(a))
    .slice(0, 3);
}

function buildProductLookup(products) {
  const lookup = new Map();
  products.forEach((product) => {
    [product.id, product.productId, product.code, product.barcode, product.name].filter(Boolean).forEach((key) => {
      lookup.set(String(key), product);
    });
  });
  return lookup;
}

function findProductForItem(productMap, item) {
  const keys = [item.productId, item.id, item.productCode, item.code, item.barcode, item.productName].filter(Boolean);
  return keys.map((key) => productMap.get(String(key))).find(Boolean);
}

function sumSlipQuantity(slips) {
  return slips.reduce((total, slip) => total + (slip.items || []).reduce((itemTotal, item) => itemTotal + toNumber(item.quantity), 0), 0);
}

function getItemRevenue(item) {
  const directTotal = item.lineTotal ?? item.total ?? item.netTotal ?? item.amount;
  if (directTotal !== undefined && directTotal !== null && directTotal !== "") return toNumber(directTotal);

  const quantity = toNumber(item.quantity);
  const unitPrice = toNumber(item.unitPrice || item.price || item.salePrice);
  const discountRate = toNumber(item.discountRate);
  return quantity * unitPrice * (1 - discountRate / 100);
}

function getRecordDate(record) {
  return String(record.date || record.createdAt || "").slice(0, 10);
}

function shortenLabel(value, maxLength = 24) {
  const text = String(value || "-");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function sumByDate(items, date, key) {
  return items.filter((item) => getRecordDate(item) === date).reduce((total, item) => total + toNumber(item[key]), 0);
}

function getPeriodRange(periodId, todayISO) {
  const today = parseISODate(todayISO);
  const end = todayISO;

  if (periodId === "today") return { end, start: todayISO };
  if (periodId === "last7") return { end, start: toISODate(addDays(today, -6)) };
  if (periodId === "last30") return { end, start: toISODate(addDays(today, -29)) };

  return { end, start: `${todayISO.slice(0, 7)}-01` };
}

function getDateKeysInRange({ start, end }) {
  const startDate = parseISODate(start);
  const endDate = parseISODate(end);
  const dates = [];

  for (let cursor = startDate; cursor <= endDate; cursor = addDays(cursor, 1)) {
    dates.push(toISODate(cursor));
  }

  return dates;
}

function isDateInRange(date, { start, end }) {
  return Boolean(date) && date >= start && date <= end;
}

function formatTrendLabel(date) {
  return String(Number(date.slice(8, 10)));
}

function parseISODate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isActiveRecord(record) {
  return record.status !== "İptal";
}

function sumBy(items, key) {
  return items.reduce((total, item) => total + toNumber(item[key]), 0);
}

function buildRiskCustomers(customers) {
  return customers
    .map((customer) => {
      const balance = toNumber(customer.currentBalance);
      const riskLimit = toNumber(customer.riskLimit);
      const riskRatio = riskLimit > 0 ? balance / riskLimit : 0;

      return {
        ...customer,
        riskRatio,
        riskLabel: riskRatio >= 1 ? "Limit Aşıldı" : "Yakın",
      };
    })
    .filter((customer) => toNumber(customer.riskLimit) > 0 && customer.riskRatio >= 0.8)
    .sort((a, b) => b.riskRatio - a.riskRatio);
}

function getSortTime(item) {
  return new Date(item.when || item.createdAt || item.date || 0).getTime();
}

function toNumber(value) {
  return Number(value) || 0;
}
