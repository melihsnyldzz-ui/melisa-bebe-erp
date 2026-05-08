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

const vegaReadonlyOperationCards = [
  { label: "Stok Önizleme", status: "Hazır", connection: "Manuel read-only", write: "Yok", nextStep: "Kullanıcı doğrulaması" },
  { label: "Cari Önizleme", status: "Planlandı", connection: "Yok", write: "Yok", nextStep: "Tablo/kapsam analizi" },
  { label: "Sipariş Önizleme", status: "Planlandı", connection: "Yok", write: "Yok", nextStep: "Read-only kapsam taslağı" },
  { label: "Kasa/Finans Özeti", status: "Planlandı", connection: "Yok", write: "Yok", nextStep: "Sadece raporlama kapsamı" },
  { label: "Export Hazırlığı", status: "Pasif/Kilitli", connection: "Yok", write: "Yok", nextStep: "Önce mock export tasarımı" },
];

const vegaReadonlySafetyNotes = [
  "Tüm Vega bağlantıları manuel tetiklenir.",
  "Bu sürümde veri yazma/import/senkron/export yoktur.",
  "Okunan veri frontend state içinde geçicidir.",
  ".env.local Git dışında kalır.",
];
const erpBackboneModuleCards = [
  { module: "Stok Yönetimi", status: "Read-only hazırlık / Manuel test", dataMode: "Stok read-only sınırı", risk: "Orta", nextStep: "Local test ve kullanıcı doğrulaması" },
  { module: "Barkod / El Terminali", status: "Hazırlıkta", dataMode: "Pasif tasarım", risk: "Orta", nextStep: "Operasyon senaryosu çıkarılacak" },
  { module: "Cari Yönetimi", status: "Pasif hazırlık", dataMode: "Veri okuma yok", risk: "Yüksek", nextStep: "Maskeleme ve kapsam kararı" },
  { module: "Sipariş Yönetimi", status: "Pasif hazırlık", dataMode: "Veri okuma yok", risk: "Yüksek", nextStep: "Read-only sınır taslağı" },
  { module: "Kasa / Finans", status: "Pasif hazırlık / Çok hassas", dataMode: "Kapalı", risk: "Çok yüksek", nextStep: "Patron onaylı güvenlik kapsamı" },
  { module: "Raporlama", status: "Pasif yönetici görünümü", dataMode: "Hazırlık özeti", risk: "Orta", nextStep: "Manuel test raporu disiplini" },
  { module: "Ayarlar / Yetkiler", status: "Rol matrisi hazırlanacak", dataMode: "Kayıt yok", risk: "Yüksek", nextStep: "Rol ve yetki matrisi" },
  { module: "Vega Entegrasyon", status: "Stok read-only sınırında", dataMode: "Manuel tetikleme", risk: "Yüksek", nextStep: "20 satır stok ön kontrolü" },
];
const erpBackboneMissingLayers = [
  "Rol ve yetki matrisi",
  "Günlük operasyon iş akışı",
  "Risk ve uyarı merkezi",
  "Veri alan sözlüğü",
  "Test ve onay kayıt disiplini",
  "Personel kullanım ekranları",
];
const erpBackboneNoActionItems = [
  "Veri okumaz.",
  "Veri yazmaz.",
  "SQL/Vega bağlantısı başlatmaz.",
  "Tablo/sorgu eklemez.",
  "Dosya/export üretmez.",
  "Onay kaydetmez.",
];
const rolePermissionMatrixRows = [
  { role: "Patron / Yönetici", visibility: "Tüm read-only özetleri görebilir", dataMode: "Veri yazamaz", risk: "Yüksek", nextStep: "Yönetici görünüm sınırı netleşecek" },
  { role: "Muhasebe", visibility: "Cari ve finans özetleri ileride sınırlı görebilir", dataMode: "Veri yazamaz", risk: "Çok yüksek", nextStep: "Maskeleme ve read-only kapsam kararı" },
  { role: "Depo", visibility: "Stok ve barkod ekranları", dataMode: "Veri yazamaz", risk: "Orta", nextStep: "Depo operasyon ekranları tasarlanacak" },
  { role: "Satış", visibility: "Cari/sipariş özetleri ileride sınırlı", dataMode: "Veri yazamaz", risk: "Yüksek", nextStep: "Sipariş ve cari özet sınırı belirlenecek" },
  { role: "Sadece Görüntüleme", visibility: "Özet ekranlar", dataMode: "Veri yazamaz", risk: "Düşük", nextStep: "Salt görüntüleme kapsamı hazırlanacak" },
  { role: "Teknik Admin", visibility: "Bağlantı ve test rehberleri", dataMode: "Gerçek şifre görmez", risk: "Yüksek", nextStep: "Secret görünmezlik kuralı korunacak" },
];
const rolePermissionNoActionItems = [
  "Gerçek login yok.",
  "Kullanıcı kaydı yok.",
  "Yetki kaydı yok.",
  "Şifre saklama yok.",
  "Veri yazma yok.",
  "SQL/Vega işlemi yok.",
];
const dailyOperationWorkflowCards = [
  { task: "Sabah stok kontrolü", responsibleRole: "Depo", dataMode: "Read-only stok", risk: "Orta", nextStep: "20 satır test sonrası genişletilecek" },
  { task: "Barkod / el terminali kontrolü", responsibleRole: "Depo", dataMode: "Pasif hazırlık", risk: "Orta", nextStep: "Barkod senaryosu netleşecek" },
  { task: "Cari risk kontrolü", responsibleRole: "Muhasebe + Yönetici", dataMode: "Pasif hazırlık", risk: "Yüksek", nextStep: "Maskeleme kuralı belirlenecek" },
  { task: "Sipariş takip kontrolü", responsibleRole: "Satış", dataMode: "Pasif hazırlık", risk: "Yüksek", nextStep: "Sipariş kapsamı belirlenecek" },
  { task: "Tahsilat / ödeme hazırlığı", responsibleRole: "Muhasebe", dataMode: "Pasif hazırlık", risk: "Çok yüksek", nextStep: "Finans güvenlik kuralı netleşecek" },
  { task: "Gün sonu yönetici özeti", responsibleRole: "Yönetici", dataMode: "Pasif rapor", risk: "Orta", nextStep: "Manuel test raporu hazırlanacak" },
];
const dailyOperationWorkflowNoActionItems = [
  "Görev kaydı yok.",
  "Kullanıcı ataması yok.",
  "Otomatik hatırlatma yok.",
  "Veri okuma/yazma yok.",
  "SQL/Vega işlemi yok.",
  "Dosya/export yok.",
];
const riskWarningCenterCards = [
  { risk: "Kritik stok riski", level: "Orta", dataMode: "Stok read-only sonrası", responsibleRole: "Depo + Yönetici", nextStep: "Eşik belirleme" },
  { risk: "Barkodsuz ürün riski", level: "Orta", dataMode: "Pasif hazırlık", responsibleRole: "Depo", nextStep: "Barkod senaryosu" },
  { risk: "Duplicate barkod riski", level: "Yüksek", dataMode: "Pasif hazırlık", responsibleRole: "Depo + Teknik Admin", nextStep: "Kalite kontrol" },
  { risk: "Riskli cari", level: "Yüksek", dataMode: "Pasif hazırlık", responsibleRole: "Muhasebe + Yönetici", nextStep: "Maskeleme kuralı" },
  { risk: "Geciken tahsilat", level: "Yüksek", dataMode: "Pasif hazırlık", responsibleRole: "Muhasebe", nextStep: "Cari kapsam" },
  { risk: "Düşük marj", level: "Orta", dataMode: "Pasif raporlama", responsibleRole: "Yönetici", nextStep: "Fiyat kontrol mantığı" },
  { risk: "Hatalı fiyat", level: "Yüksek", dataMode: "Pasif hazırlık", responsibleRole: "Yönetici", nextStep: "Fiyat alan doğrulaması" },
  { risk: "Finansal risk", level: "Çok yüksek", dataMode: "Kapalı", responsibleRole: "Patron + Muhasebe", nextStep: "Finans güvenlik kapsamı" },
  { risk: "Entegrasyon riski", level: "Yüksek", dataMode: "Manuel test", responsibleRole: "Teknik Admin", nextStep: "Test raporu" },
];
const riskWarningCenterNoActionItems = [
  "Gerçek alarm yok.",
  "Bildirim yok.",
  "Görev kaydı yok.",
  "Veri okuma/yazma yok.",
  "SQL/Vega işlemi yok.",
  "Dosya/export yok.",
];
const dataFieldDictionaryGroups = [
  { group: "Stok alanları", examples: "Stok kodu, ürün adı, barkod, marka, beden, renk, alış fiyatı, satış fiyatı, KDV", status: "İş seviyesi sözlük", risk: "Orta", nextStep: "Read-only örnek satırla doğrulanacak" },
  { group: "Barkod alanları", examples: "Barkod, stok kodu, okutma durumu, duplicate kontrol etiketi", status: "Pasif hazırlık", risk: "Orta", nextStep: "Barkod senaryosu netleşecek" },
  { group: "Cari alanları", examples: "Cari kodu, kısa unvan, risk sınıfı, bakiye durumu, tahsilat önceliği", status: "Maskeleme bekliyor", risk: "Yüksek", nextStep: "Cari maskeleme kuralı belirlenecek" },
  { group: "Sipariş alanları", examples: "Sipariş no, tarih, cari kısa etiket, sipariş durumu, ürün adedi, tutar durumu", status: "Pasif hazırlık", risk: "Yüksek", nextStep: "Sipariş kapsamı doğrulanacak" },
  { group: "Kasa/Finans alanları", examples: "Günlük kasa yönü, tahsilat durumu, ödeme durumu, net bakiye yönü", status: "Kapalı", risk: "Çok yüksek", nextStep: "Finans güvenlik kapsamı onaylanacak" },
  { group: "Raporlama alanları", examples: "Test tarihi, test edilen modül, beklenen sonuç, görülen sonuç, patron kararı", status: "Manuel rapor sözlüğü", risk: "Orta", nextStep: "Test raporu şablonu netleşecek" },
];
const dataFieldDictionaryNoActionItems = [
  "Gerçek Vega tablo alanı değildir.",
  "Kesin alan eşlemesi değildir.",
  "Veri okumaz.",
  "SQL sorgusu çalıştırmaz.",
  "Dosya/export üretmez.",
  "Onay kaydetmez.",
];
const staffUsageScreenMapCards = [
  { screen: "Depo Stok Kontrol Ekranı", role: "Depo", dataMode: "Read-only stok", risk: "Orta", nextStep: "Manuel stok test sonrası" },
  { screen: "Barkod / El Terminali Kontrol Ekranı", role: "Depo", dataMode: "Pasif hazırlık", risk: "Orta", nextStep: "Barkod senaryosu netleşecek" },
  { screen: "Satış Sipariş Takip Ekranı", role: "Satış", dataMode: "Pasif hazırlık", risk: "Yüksek", nextStep: "Sipariş maskeleme kararı" },
  { screen: "Muhasebe Cari Risk Ekranı", role: "Muhasebe", dataMode: "Pasif hazırlık", risk: "Yüksek", nextStep: "Cari maskeleme kararı" },
  { screen: "Muhasebe Tahsilat Hazırlık Ekranı", role: "Muhasebe", dataMode: "Pasif hazırlık", risk: "Çok yüksek", nextStep: "Finans güvenlik kapsamı" },
  { screen: "Yönetici Gün Sonu Özet Ekranı", role: "Yönetici", dataMode: "Pasif rapor", risk: "Orta", nextStep: "Test raporu disiplini" },
  { screen: "Teknik Entegrasyon Kontrol Ekranı", role: "Teknik Admin", dataMode: "Manuel test rehberi", risk: "Yüksek", nextStep: "Bağlantı test protokolü" },
];
const staffUsageScreenMapNoActionItems = [
  "Gerçek personel login yok.",
  "Kullanıcı kaydı yok.",
  "Görev atama yok.",
  "Veri okuma/yazma yok.",
  "SQL/Vega işlemi yok.",
  "Dosya/export yok.",
];
const erpModulePriorityRows = [
  { priority: "1. Stok Yönetimi", reason: "İlk güvenli read-only bağlantı alanı", risk: "Orta", nextStep: "Şirket ortamı smoke test" },
  { priority: "2. Barkod / El Terminali", reason: "Depo operasyonunun kalbi", risk: "Orta", nextStep: "Barkod senaryosu" },
  { priority: "3. Cari Yönetimi", reason: "Müşteri ve bakiye hassas", risk: "Yüksek", nextStep: "Maskeleme kuralı" },
  { priority: "4. Sipariş Yönetimi", reason: "Satış takibi için kritik", risk: "Yüksek", nextStep: "Kapsam analizi" },
  { priority: "5. Kasa / Finans", reason: "En hassas alan", risk: "Çok yüksek", nextStep: "Patron onaylı sınır" },
  { priority: "6. Raporlama", reason: "Yönetici kararlarının ortak görünümü", risk: "Orta", nextStep: "Manuel test raporu disiplini" },
  { priority: "7. Rol ve Yetki", reason: "Ekran erişim sınırlarını belirler", risk: "Yüksek", nextStep: "Pasif rol matrisi doğrulaması" },
  { priority: "8. Canlıya Geçiş", reason: "Tüm güvenlik şartları kapandıktan sonra ele alınır", risk: "Çok yüksek", nextStep: "Eksik listesi ve patron onayı" },
];
const erpModulePriorityNoActionItems = [
  "Modül açmaz.",
  "Veri okumaz.",
  "Görev oluşturmaz.",
  "SQL/Vega işlemi başlatmaz.",
  "Dosya/export üretmez.",
];
const stockManagementRoadmapPhases = [
  { phase: "Faz 1: Stok read-only bağlantı doğrulama", status: "Hazırlık tamamlanıyor", dataMode: "Manuel read-only", risk: "Orta", nextStep: "Şirket ortamı smoke test" },
  { phase: "Faz 2: 20 satır kullanıcı doğrulaması", status: "Sıradaki kontrol", dataMode: "Geçici 20 satır", risk: "Orta", nextStep: "Patron/depo kullanıcı teyidi" },
  { phase: "Faz 3: Stok arama ve filtre olgunlaştırma", status: "Planlandı", dataMode: "Read-only ekran davranışı", risk: "Orta", nextStep: "Arama ve filtre kullanım senaryosu" },
  { phase: "Faz 4: Barkod/duplicate kontrol hazırlığı", status: "Pasif hazırlık", dataMode: "İş seviyesi etiket", risk: "Yüksek", nextStep: "Barkod kalite kuralı" },
  { phase: "Faz 5: Stok detay görünümü", status: "Planlandı", dataMode: "Read-only detay taslağı", risk: "Orta", nextStep: "Gösterilecek alan sınırı" },
  { phase: "Faz 6: Stok risk etiketleri", status: "Planlandı", dataMode: "Pasif risk etiketi", risk: "Orta", nextStep: "Kritik stok eşik kararı" },
  { phase: "Faz 7: Depo/personel kullanım ekranı", status: "Sonraki faz", dataMode: "Pasif ekran haritası", risk: "Orta", nextStep: "Depo kullanım akışı" },
];
const stockManagementRoadmapNoActionItems = [
  "Yeni stok verisi okuma yok.",
  "SQL sorgusu yok.",
  "Veri yazma yok.",
  "Import/senkron/export yok.",
  "Dosya/export yok.",
  "Stok dışı kapsam yok.",
];
const topStockOutPreviewSummaryCards = [
  { label: "Top 100 stok çıkışı görünümü", value: "Hazırlık / Manuel read-only" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Stok dışı kapsam", value: "Kapalı" },
  { label: "Dönem filtresi", value: "Tarih alanı doğrulanırsa son 30 gün" },
];
const topStockOutPreviewSummaryNotes = [
  "Hareket tablosu ve çıkış miktarı alanı doğrulanmadan çalıştırılmaz.",
  "Gerçek sorgu bu sürümde eklenmedi.",
  "Sonuç ileride sadece geçici ekran state içinde gösterilecek.",
  "Local DB kaydı veya dosya üretimi yapılmayacak.",
];
const companyReadonlyPretestCards = [
  { label: "Ortam", value: "Şirket bilgisayarı" },
  { label: "Local main", value: "GitHub ile güncel" },
  { label: "Build", value: "Başarılı" },
  { label: "Stash", value: "Yok" },
  { label: "Test kapsamı", value: "Sadece stok" },
  { label: "Satır limiti", value: "20" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Bağlantı", value: "Henüz denenmedi" },
];
const companyReadonlyRequiredConditions = [
  "Read-only SQL kullanıcısı hazır.",
  "sa kullanılmayacak.",
  "Manuel yedek alındı.",
  ".env.local Git dışında.",
  "Uygulama açılışta otomatik bağlanmıyor.",
  "Test sadece manuel buton veya terminal ile yapılacak.",
  "Test sadece stok ve 20 satırla sınırlı olacak.",
];
const companyReadonlyStopConditions = [
  "Read-only kullanıcı yoksa dur.",
  "sa kullanılıyorsa dur.",
  "Yedek yoksa dur.",
  ".env.local Git'e giriyorsa dur.",
  "Otomatik bağlantı varsa dur.",
  "20 satır limiti yoksa dur.",
];
const companyReadonlySafetyNotes = [
  "Bu sürüm bağlantı denemesi yapmaz.",
  "Veri okumaz/yazmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Import/senkron/export yapmaz.",
  "Sadece şirket ortamı ön test hazırlığıdır.",
];
const readonlySqlUserTransitionCards = [
  { label: "Son smoke test", value: "Başarılı" },
  { label: "Kullanılan kullanıcı", value: "sa / geçici" },
  { label: "Risk seviyesi", value: "Orta-yüksek" },
  { label: "Hedef kullanıcı", value: "Read-only SQL kullanıcısı" },
  { label: "Plan durumu", value: "Ertelendi / sonraki güvenlik iyileştirmesi" },
  { label: "Hedef yetki", value: "Sadece SELECT" },
  { label: "İlk kapsam", value: "Sadece stok" },
  { label: "İlk limit", value: "20 satır" },
  { label: "Tekrar sa testi", value: "Yapılmayacak" },
];
const readonlySqlUserTransitionSteps = [
  "SQL Server üzerinde ayrı read-only kullanıcı oluşturulacak.",
  "Kullanıcıya sadece stok okuma için SELECT yetkisi verilecek.",
  ".env.local yeni read-only kullanıcıyla güncellenecek.",
  "Uygulama açılışında otomatik bağlantı olmadığı tekrar doğrulanacak.",
  "Aynı 20 satır stok smoke test read-only kullanıcıyla tekrar yapılacak.",
  "Test sonrası sa kullanımı kapatılacak veya sadece admin/yedek durumuna bırakılacak.",
];
const readonlySqlUserTransitionForbiddenItems = [
  "sa ile tekrar smoke test yapılmaz.",
  "Veri yazma yapılmaz.",
  "Import yapılmaz.",
  "Senkron yapılmaz.",
  "Export yapılmaz.",
  "Cari/sipariş/kasa-finans okunmaz.",
  "Connection bilgisi repoya yazılmaz.",
];
const readonlySqlUserTransitionSafetyNotes = [
  "Bu sürüm kullanıcı oluşturmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Bağlantı denemesi yapmaz.",
  "Veri okumaz/yazmaz.",
  "Sadece geçiş planıdır.",
];
const saControlledStockReadonlyCards = [
  { label: "SQL kullanıcısı", value: "sa" },
  { label: "Kullanım tipi", value: "Geçici test" },
  { label: "Risk seviyesi", value: "Orta-yüksek" },
  { label: "Test kapsamı", value: "Sadece stok" },
  { label: "Satır limiti", value: "20" },
  { label: "Veri yazma", value: "Kesin kapalı" },
  { label: "Import/Senkron/Export", value: "Kesin kapalı" },
  { label: "Stok dışı modüller", value: "Kapalı" },
];
const saControlledStockReadonlyRules = [
  "Manuel yedek alınmış olmalı.",
  "Uygulama açılışta otomatik bağlanmamalı.",
  "Test sadece manuel buton veya terminal ile yapılmalı.",
  "Sadece stok okunmalı.",
  "Maksimum 20 satır okunmalı.",
  "Test tekrarı gereksiz yapılmamalı.",
  "Hata halinde otomatik tekrar denenmemeli.",
  "Hassas bağlantı bilgisi loglanmamalı.",
];
const saControlledStockReadonlyForbiddenItems = [
  "INSERT yok.",
  "UPDATE yok.",
  "DELETE yok.",
  "ALTER/DROP yok.",
  "Import yok.",
  "Senkron yok.",
  "Export yok.",
  "Cari okunmaz.",
  "Sipariş okunmaz.",
  "Kasa/finans okunmaz.",
  "Connection string repoya yazılmaz.",
];
const saControlledStockReadonlySafetyNotes = [
  "Bu sürüm bağlantı denemesi yapmaz.",
  "Veri okumaz/yazmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Sadece sa kullanım riskini ve sınırlarını görünür yapar.",
];
const stockSmokeTestResultSummaryCards = [
  { label: "Test türü", value: "Stok read-only smoke test" },
  { label: "Test ortamı", value: "Şirket bilgisayarı" },
  { label: "SQL kullanıcısı", value: "sa / geçici" },
  { label: "Risk seviyesi", value: "Orta-yüksek" },
  { label: "Bağlantı sonucu", value: "Önceki testte başarılı" },
  { label: "Dönen satır", value: "20" },
  { label: "Satır limiti", value: "Korundu" },
  { label: "Stok dışı veri", value: "Okunmadı" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Dosya çıktısı", value: "Yok" },
  { label: "Hassas bilgi", value: "Raporlanmadı" },
];
const stockSmokeTestSuccessCriteria = [
  "Bağlantı sadece manuel tetiklendi.",
  "En fazla 20 satır döndü.",
  "Stok dışında veri okunmadı.",
  "Veri yazma yapılmadı.",
  "Import/senkron/export yapılmadı.",
  "Dosyaya çıktı alınmadı.",
  "Hassas bağlantı bilgisi görünmedi.",
];
const stockSmokeTestNextDecisions = [
  "sa ile tekrar gereksiz test yapılmayacak.",
  "Stok ekranı kullanıcı doğrulaması yapılacak.",
  "Read-only SQL kullanıcısı sonraki güvenlik iyileştirmesi olarak bekleyecek.",
  "Cari/sipariş/kasa-finans hâlâ kapalı kalacak.",
];
const stockSmokeTestNoActionItems = [
  "Test çalıştırmaz.",
  "Bağlantı açmaz.",
  "Veri okumaz.",
  "Veri yazmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Dosya/export üretmez.",
];
const stockPreviewUserValidationSteps = [
  {
    step: "1. Satır sayısı kontrolü",
    purpose: "20 satır limiti korundu mu",
    role: "Teknik Admin",
    risk: "Orta",
    nextStep: "Test raporuna işlenecek",
  },
  {
    step: "2. Stok kodu kontrolü",
    purpose: "Ürünle uyumlu mu",
    role: "Depo",
    risk: "Orta",
    nextStep: "Kullanıcı doğrulaması",
  },
  {
    step: "3. Ürün adı okunabilirlik kontrolü",
    purpose: "Okunabilir mi",
    role: "Depo + Yönetici",
    risk: "Orta",
    nextStep: "Alan etiketi doğrulama",
  },
  {
    step: "4. Barkod/etiket kontrolü",
    purpose: "Barkod alanı net mi",
    role: "Depo",
    risk: "Yüksek",
    nextStep: "Barkod senaryosu",
  },
  {
    step: "5. Marka/kategori tahmini kontrolü",
    purpose: "Ürün grubu anlaşılabilir mi",
    role: "Depo + Yönetici",
    risk: "Orta",
    nextStep: "Kategori etiketi kararı",
  },
  {
    step: "6. Alış/satış fiyat mantık kontrolü",
    purpose: "Alış/satış mantıklı mı",
    role: "Yönetici",
    risk: "Yüksek",
    nextStep: "Fiyat kontrol kuralı",
  },
  {
    step: "7. KDV alanı kontrolü",
    purpose: "Alan doğru yorumlanıyor mu",
    role: "Muhasebe",
    risk: "Orta",
    nextStep: "KDV doğrulama",
  },
  {
    step: "8. Şüpheli/boş alan kontrolü",
    purpose: "Boş veya şüpheli alan var mı",
    role: "Depo + Teknik Admin",
    risk: "Yüksek",
    nextStep: "Alan eşleştirme notu",
  },
  {
    step: "9. Son karar notu",
    purpose: "Stok önizleme kullanıcıya anlaşılır mı",
    role: "Patron + Yönetici",
    risk: "Orta",
    nextStep: "Sonraki güvenli faz kararı",
  },
];
const stockPreviewUserValidationNoActionItems = [
  "Test çalıştırmaz.",
  "Bağlantı açmaz.",
  "Yeni veri okumaz.",
  "Veri yazmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Form/input/localStorage eklemez.",
  "Dosya/export üretmez.",
  "Kullanıcı notu kaydetmez.",
];
const stockPreviewUserValidationIssueActions = [
  { issue: "Satır sayısı 20 değilse", action: "Test durdurulur, teknik kontrol yapılır." },
  { issue: "Stok kodu anlamsız görünüyorsa", action: "Depo ve teknik ekip birlikte alan doğrulaması yapar." },
  { issue: "Ürün adı okunamıyorsa", action: "Alan etiketi ve karakter görünümü kontrol edilir." },
  { issue: "Barkod/etiket alanı net değilse", action: "Barkod senaryosu ayrı faza bırakılır." },
  { issue: "Marka/kategori tahmini yapılamıyorsa", action: "Bu alanlar kesin eşleme yapılmadan kullanılmaz." },
  { issue: "Fiyat mantıklı değilse", action: "Yönetici onayı olmadan fiyat yorumu yapılmaz." },
  { issue: "KDV alanı belirsizse", action: "Muhasebe doğrulaması beklenir." },
  { issue: "Boş/şüpheli alan varsa", action: "Canlıya geçiş kararı ertelenir." },
];
const stockPreviewUserValidationResultInterpretations = [
  "Tüm kontroller temizse: Stok read-only ekranı kullanıcı doğrulamasına hazır kabul edilir.",
  "Küçük etiket sorunu varsa: Alan etiketi düzeltme fazına alınır.",
  "Fiyat/KDV/barkod sorunu varsa: Canlı kullanım ertelenir.",
  "Stok dışı veri ihtiyacı çıkarsa: Bu sürümde açılmaz, ayrı faz planlanır.",
];
const stockPreviewUserTestSessionCards = [
  { label: "Test türü", value: "Manuel kullanıcı testi" },
  { label: "Katılımcılar", value: "Depo + Yönetici + Teknik Admin" },
  { label: "Süre", value: "10-15 dakika" },
  { label: "Kapsam", value: "20 satır stok önizleme" },
  { label: "Test modu", value: "Read-only" },
  { label: "Kayıt yöntemi", value: "Sözlü / manuel not" },
  { label: "Sistem kaydı", value: "Yok" },
  { label: "Stok dışı kapsam", value: "Kapalı" },
];
const stockPreviewUserTestSessionFlow = [
  "Uygulama açılır, otomatik bağlantı olmadığı doğrulanır.",
  "Manuel stok önizleme ekranı açılır.",
  "20 satır limiti kontrol edilir.",
  "Stok kodu ve ürün adı birlikte kontrol edilir.",
  "Barkod/etiket alanı gözle incelenir.",
  "Fiyat/KDV alanları yönetici ve muhasebe bakışıyla yorumlanır.",
  "Boş/şüpheli alanlar sözlü not edilir.",
  "Canlıya geçiş kararı verilmez, sadece kullanıcı doğrulama sonucu konuşulur.",
];
const stockPreviewUserTestSessionExpectedDecisions = [
  "Stok ekranı anlaşılır mı?",
  "Alan adları kullanıcıya yeterince açık mı?",
  "20 satır örnek kontrol için yeterli mi?",
  "Fiyat/KDV/barkod alanları ayrı faz gerektiriyor mu?",
  "Depo personeli bu ekranı kullanabilir mi?",
];
const stockPreviewUserTestSessionNoActionItems = [
  "Karar kaydetmez.",
  "Onay almaz.",
  "Test çalıştırmaz.",
  "Bağlantı açmaz.",
  "Veri okumaz/yazmaz.",
  "Form/input/localStorage eklemez.",
  "Dosya/export üretmez.",
];
const stockPreviewUserTestSessionDecisionClasses = [
  {
    title: "Geçti",
    meaning: "Stok ekranı anlaşılır ve 20 satır kontrol için yeterli.",
    owner: "Depo + Yönetici + Teknik Admin",
    nextStep: "Stok ekranı kullanıcı doğrulaması hazır kabul edilir.",
    risk: "Düşük",
  },
  {
    title: "Küçük düzeltme",
    meaning: "Etiket veya alan adı netleştirilecek.",
    owner: "Yönetici + Teknik Admin",
    nextStep: "Alan etiketi düzeltme fazına alınır.",
    risk: "Orta",
  },
  {
    title: "Ertelendi",
    meaning: "Fiyat/KDV/barkod yorumu net değil.",
    owner: "Yönetici + Muhasebe + Depo",
    nextStep: "Fiyat, KDV veya barkod ayrı fazda netleştirilir.",
    risk: "Yüksek",
  },
  {
    title: "Durduruldu",
    meaning: "Stok dışı veri ihtiyacı veya güvenlik şüphesi var.",
    owner: "Patron + Teknik Admin",
    nextStep: "Canlı kullanım ve kapsam genişletme durdurulur.",
    risk: "Çok yüksek",
  },
];
const stockPreviewUserTestSessionDecisionNotes = [
  "Canlıya geçiş kararı bu oturumda verilmez.",
  "Sadece stok ekranı anlaşılabilirliği değerlendirilir.",
  "Fiyat/KDV/barkod sorunları ayrı faza alınır.",
  "Cari/sipariş/finans talepleri bu oturumda açılmaz.",
  "sa kullanımı nedeniyle teknik güvenlik notu korunur.",
];
const stockFieldLabelClarificationCards = [
  { label: "Stok Kodu", purpose: "Ürünün stok ekranındaki kısa takip anahtarını kullanıcıya anlaşılır göstermek.", role: "Depo + Teknik Admin", risk: "Orta", nextStep: "Kullanıcı doğrulamasında okunabilirlik kontrolü" },
  { label: "Ürün Adı", purpose: "Ürünün kullanıcı tarafından hızlı tanınmasını sağlamak.", role: "Depo + Yönetici", risk: "Orta", nextStep: "Alan etiketi ve karakter görünümü kontrolü" },
  { label: "Barkod", purpose: "Etiket ve okutma akışı için barkod bilgisinin iş seviyesinde ayrılmasını sağlamak.", role: "Depo", risk: "Yüksek", nextStep: "Barkod fazında netleştirme" },
  { label: "Marka", purpose: "Ürün grubunu kullanıcı gözünde ayırmaya yardımcı olmak.", role: "Yönetici", risk: "Orta", nextStep: "Kesin eşleme öncesi iş etiketi kontrolü" },
  { label: "Kategori", purpose: "Ürün ailesi veya raf grubu yorumunu sadeleştirmek.", role: "Depo + Yönetici", risk: "Orta", nextStep: "Kategori adlandırma kararı" },
  { label: "Beden", purpose: "Beden bilgisini satış ve depo kontrolünde okunur hale getirmek.", role: "Depo", risk: "Orta", nextStep: "Kullanıcı ekranı doğrulaması" },
  { label: "Renk", purpose: "Renk ayrımını stok kontrolünde görünür kılmak.", role: "Depo", risk: "Orta", nextStep: "Etiket tutarlılığı kontrolü" },
  { label: "Alış Fiyatı", purpose: "Maliyet yorumu için yönetici kontrolüne aday alanı ayırmak.", role: "Yönetici", risk: "Yüksek", nextStep: "Yönetici doğrulaması olmadan kesinleştirme yok" },
  { label: "Satış Fiyatı", purpose: "Satış fiyatı yorumunun yönetici kontrolünde ele alınmasını sağlamak.", role: "Yönetici", risk: "Yüksek", nextStep: "Fiyat kontrol kuralı" },
  { label: "KDV", purpose: "Vergi yorumunun muhasebe doğrulamasıyla yapılmasını sağlamak.", role: "Muhasebe", risk: "Orta", nextStep: "KDV doğrulama fazı" },
  { label: "Şüpheli / Boş Alan", purpose: "Boş veya anlamı net olmayan alanların canlıya geçiş öncesi işaretlenmesini sağlamak.", role: "Teknik Admin + Yönetici", risk: "Yüksek", nextStep: "Canlı kullanım öncesi karar bekletme" },
];
const stockFieldLabelClarificationPrinciples = [
  "Teknik alan adı yerine iş dilinde anlaşılır etiket kullanılacak.",
  "Kesin Vega alan eşlemesi yapılmadan canlı yorum yapılmayacak.",
  "Fiyat/KDV alanları yönetici ve muhasebe doğrulaması olmadan kesinleştirilmeyecek.",
  "Barkod alanı ayrı barkod fazında netleştirilecek.",
  "Boş veya şüpheli alanlar canlıya geçiş öncesi işaretlenecek.",
];
const stockFieldLabelClarificationNoActionItems = [
  "Gerçek alan eşlemesi yapmaz.",
  "Veri okumaz.",
  "Veri yazmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Form/input/localStorage eklemez.",
  "Kullanıcı notu kaydetmez.",
  "Dosya/export üretmez.",
];
const barcodeHandheldRoadmapPhases = [
  { phase: "Faz 1: Barkod senaryosu tanımı", status: "Hazırlıkta", dataMode: "Pasif iş akışı", risk: "Orta", nextStep: "Depo senaryosu netleşecek" },
  { phase: "Faz 2: Barkodsuz ürün listesi hazırlığı", status: "Planlandı", dataMode: "Pasif liste taslağı", risk: "Orta", nextStep: "Barkodsuz ürün etiketi tanımı" },
  { phase: "Faz 3: Duplicate barkod kontrol mantığı", status: "Planlandı", dataMode: "İş seviyesi kontrol", risk: "Yüksek", nextStep: "Duplicate kalite kuralı" },
  { phase: "Faz 4: Honeywell okutma akışı taslağı", status: "Pasif taslak", dataMode: "Cihaz bağlantısı yok", risk: "Yüksek", nextStep: "Okutma ekran akışı çizilecek" },
  { phase: "Faz 5: Sayım farkı kontrol akışı", status: "Sonraki faz", dataMode: "Pasif karşılaştırma", risk: "Yüksek", nextStep: "Sayım farkı karar kuralı" },
  { phase: "Faz 6: Depo personel kullanım ekranı", status: "Hazırlıkta", dataMode: "Pasif ekran haritası", risk: "Orta", nextStep: "Depo rol ekranı doğrulanacak" },
  { phase: "Faz 7: Vega'ya yazmadan read-only karşılaştırma", status: "Güvenlik kapısı", dataMode: "Read-only karşılaştırma adayı", risk: "Çok yüksek", nextStep: "Yazmasız kontrol sınırı" },
];
const barcodeHandheldRoadmapNoActionItems = [
  "Gerçek barkod okutma yok.",
  "Cihaz bağlantısı yok.",
  "Vega'ya yazma yok.",
  "Stok güncelleme yok.",
  "Dosya/export yok.",
  "SQL/Vega işlemi yok.",
];
const vegaReadonlyModuleMatrixRows = [
  { module: "Stok", status: "Hazır", read: "Manuel read-only", write: "Yok", risk: "Orta", nextStep: "Kullanıcı doğrulaması" },
  { module: "Cari", status: "Hazırlık", read: "Yok", write: "Yok", risk: "Yüksek", nextStep: "Kapsam analizi" },
  { module: "Sipariş", status: "Hazırlık", read: "Yok", write: "Yok", risk: "Yüksek", nextStep: "Kapsam analizi" },
  { module: "Kasa/Finans", status: "Planlandı", read: "Yok", write: "Yok", risk: "Çok yüksek", nextStep: "Raporlama sınırı" },
  { module: "Export", status: "Kilitli", read: "Yok", write: "Yok", risk: "Yüksek", nextStep: "Mock tasarım" },
];
const vegaReadonlyModuleMatrixSafetyNotes = [
  "Bu matris veri okumaz.",
  "SQL/Vega bağlantısı başlatmaz.",
  "Gerçek tablo/sorgu içermez.",
  "Veri yazma/import/senkron/export yoktur.",
];
const liveDecisionStatusCards = [
  { label: "Genel durum", value: "Hazırlık / Canlı değil" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Otomatik bağlantı", value: "Kapalı" },
  { label: "Read-only kapsam", value: "Sınırlı" },
  { label: "Patron onayı", value: "Bekliyor" },
  { label: "Canlı geçiş kararı", value: "Henüz verilmedi" },
];
const liveDecisionRequiredItems = [
  "Read-only kullanıcı yetkisi doğrulandı.",
  "Stok önizleme kullanıcı doğrulaması tamamlandı.",
  "Cari kapsam ve maskeleme kuralı netleşti.",
  "Sipariş kapsam ve maskeleme kuralı netleşti.",
  "Manuel yedek prosedürü yazıldı.",
  "Test sonucunda hata/uyarı raporu hazırlandı.",
  "Patron onayı alındı.",
];
const liveDecisionBlockerItems = [
  "Veri yazma kapalı değilse.",
  "Otomatik bağlantı kontrolsüz çalışıyorsa.",
  "Read-only kullanıcı doğrulanmadıysa.",
  "Yedek prosedürü yoksa.",
  "Cari/sipariş maskeleme kuralları yoksa.",
  "Test sonucu raporlanmadıysa.",
  "Patron onayı yoksa.",
];
const liveDecisionSafetyNotes = [
  "Bu panel karar rehberidir.",
  "Canlı bağlantı açmaz.",
  "Veri yazmaz.",
  "Onay kaydetmez.",
  "SQL/Vega işlemi başlatmaz.",
];
const liveMissingListItems = [
  { task: "Read-only SQL kullanıcısı oluşturulacak.", status: "Bekliyor" },
  { task: "Stok önizleme kullanıcı doğrulaması tamamlanacak.", status: "Manuel kontrol" },
  { task: "Cari maskeleme kuralı belirlenecek.", status: "Manuel kontrol" },
  { task: "Sipariş maskeleme kuralı belirlenecek.", status: "Manuel kontrol" },
  { task: "Finans maskeleme kuralı belirlenecek.", status: "Sonraki faz" },
  { task: "Manuel yedek prosedürü yazılacak.", status: "Bekliyor" },
  { task: "Test sonucu raporu hazırlanacak.", status: "Bekliyor" },
  { task: "Patron onayı alınacak.", status: "Sonraki faz" },
];
const liveMissingListSafetyNotes = [
  "Bu panel görev kaydı tutmaz.",
  "Onay kaydetmez.",
  "SQL/Vega işlemi başlatmaz.",
  "Veri yazmaz.",
];
const readonlyTestReportPrepItems = [
  { title: "Test tarihi", status: "Manuel doldurulacak" },
  { title: "Testi yapan kişi", status: "Manuel doldurulacak" },
  { title: "Test edilen modül", status: "Manuel doldurulacak" },
  { title: "Veri kaynağı", status: "Bekliyor" },
  { title: "Satır/özet limiti", status: "Bekliyor" },
  { title: "Beklenen sonuç", status: "Manuel doldurulacak" },
  { title: "Görülen sonuç", status: "Sonraki faz" },
  { title: "Hata/uyarı var mı", status: "Sonraki faz" },
  { title: "Patron kararı", status: "Sonraki faz" },
];
const readonlyTestReportPrepSafetyNotes = [
  "Bu panel rapor dosyası oluşturmaz.",
  "Test sonucu kaydetmez.",
  "SQL/Vega işlemi başlatmaz.",
  "Veri yazmaz.",
];
const readonlyTestReportPrepNoActionItems = [
  "Rapor dosyası oluşturmaz.",
  "Test sonucu kaydetmez.",
  "Veri okumaz.",
  "SQL/Vega işlemi başlatmaz.",
  "Onay almaz.",
];
const readonlyTestReportDecisionSummaryItems = [
  "Test başarılı mı?",
  "Hangi modül test edildi?",
  "Kaç satır/özet kontrol edildi?",
  "Hata/uyarı var mı?",
  "Canlıya geçişe engel var mı?",
  "Patron kararı nedir?",
];
const ownerApprovalPackageItems = [
  { title: "Read-only test raporu", status: "Hazırlanacak" },
  { title: "Canlıya geçiş eksik listesi", status: "Manuel kontrol" },
  { title: "Modül durum matrisi", status: "Manuel kontrol" },
  { title: "Finans/kasa güvenlik notu", status: "Bekliyor" },
  { title: "Cari/sipariş maskeleme notu", status: "Bekliyor" },
  { title: "Manuel yedek prosedürü", status: "Hazırlanacak" },
  { title: "Son karar: Bekliyor", status: "Bekliyor" },
];
const ownerApprovalPackageSafetyNotes = [
  "Bu panel onay kaydetmez.",
  "Dosya oluşturmaz.",
  "Veri okumaz/yazmaz.",
  "SQL/Vega işlemi başlatmaz.",
];
const ownerApprovalPackagePrecheckItems = [
  "Tüm modüllerin durum matrisi güncel mi?",
  "Read-only test raporu manuel hazır mı?",
  "Canlıya geçiş eksik listesi kapandı mı?",
  "Finans/kasa güvenlik notu okundu mu?",
  "Cari/sipariş maskeleme notu hazır mı?",
  "Manuel yedek prosedürü hazır mı?",
  "Son karar toplantısı planlandı mı?",
];
const ownerApprovalPackageNoActionItems = [
  "Onay kaydetmez.",
  "İmza almaz.",
  "Dosya oluşturmaz.",
  "Veri okumaz/yazmaz.",
  "SQL/Vega işlemi başlatmaz.",
];
const managementPresentationSummaryCards = [
  { title: "Genel durum", value: "Read-only hazırlık" },
  { title: "Stok", value: "Manuel read-only önizleme hazır" },
  { title: "Cari", value: "Hazırlık kapısı" },
  { title: "Sipariş", value: "Hazırlık kapısı" },
  { title: "Kasa/Finans", value: "Hazırlık kapısı" },
  { title: "Canlı geçiş", value: "Bekliyor" },
];
const managementPresentationNotDoingItems = [
  "Veri yazma yok.",
  "Otomatik bağlantı yok.",
  "SQL sorgusu yok.",
  "Tablo adı yok.",
  "Export/import/senkron yok.",
  "Onay kaydı yok.",
];
const managementPresentationNextDecisionItems = [
  "Read-only test raporu manuel hazırlanacak.",
  "Eksik listesi kapatılacak.",
  "Maskeleme kuralları belirlenecek.",
  "Manuel yedek prosedürü netleşecek.",
  "Patron onayı alınmadan canlıya geçilmeyecek.",
];
const managementPresentationOneSentenceSummary =
  "Sistem şu anda canlı değil; güvenli read-only hazırlık, test ve onay aşamasındadır.";
const managementPresentationPurposeItems = [
  "ERP'nin mevcut hazırlık seviyesini göstermek.",
  "Hangi modüllerin kapalı olduğunu göstermek.",
  "Canlıya geçiş için kalan kararları netleştirmek.",
  "Riskli finans/cari/sipariş alanlarının neden kapalı olduğunu anlatmak.",
];
const managementPresentationNoActionItems = [
  "Veri okumaz.",
  "Veri yazmaz.",
  "SQL/Vega işlemi başlatmaz.",
  "Dosya/rapor üretmez.",
  "Onay kaydetmez.",
];
const financePreviewPrepGateCards = [
  { label: "Finans kapsam", value: "Planlandı" },
  { label: "Bağlantı", value: "Yok" },
  { label: "Veri okuma", value: "Yok" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Tablo/sorgu", value: "Eklenmedi" },
  { label: "Sonraki adım", value: "Finans raporlama sınırı analizi" },
];
const financePreviewWhyClosedItems = [
  "Finans verisi kasa, banka, tahsilat, ödeme ve bakiye bilgisi içerdiği için en hassas modüldür.",
  "Önce raporlama sınırı ve maskeleme kuralı belirlenmelidir.",
  "İlk deneme sadece read-only ve küçük özet kapsamıyla yapılmalıdır.",
  "Patron onayı olmadan finans görünümü açılmamalıdır.",
];
const financePreviewPrepChecklist = [
  "Read-only kullanıcı yetkisi doğrulandı.",
  "Finans raporlama kapsamı netleşti.",
  "İlk özet/satır limiti belirlendi.",
  "Finansal veri maskeleme kuralı belirlendi.",
  "Patron onayı alındı.",
];
const financePreviewCandidateLabels = [
  "Günlük kasa yönü",
  "Tahsilat toplam durumu",
  "Ödeme toplam durumu",
  "Net bakiye yönü",
  "Riskli hareket etiketi",
  "Son işlem tarihi",
];
const financePreviewPrepSafetyNotes = [
  "Bu sürümde finans verisi okunmaz.",
  "SQL sorgusu yoktur.",
  "Tablo adı yoktur.",
  "Kasa/banka/tahsilat/ödeme/bakiye verisi repoya yazılmaz.",
  "Veri yazma/import/senkron/export yoktur.",
];
const financePreviewForbiddenItems = [
  "Finans verisi okunmayacak.",
  "Gerçek finans tablo adı eklenmeyecek.",
  "SQL sorgusu eklenmeyecek veya çalıştırılmayacak.",
  "Kasa, banka, tahsilat, ödeme, bakiye veya hareket verisi gösterilmeyecek.",
  "Export, import, senkron, write, update veya delete işlemi eklenmeyecek.",
  "SQL/Vega otomatik bağlantısı başlatılmayacak.",
  "Patron onayı olmadan finans görünümü açılmayacak.",
];

const currentPreviewPrepGateCards = [
  { label: "Cari kapsam", value: "Planlandı" },
  { label: "Bağlantı", value: "Yok" },
  { label: "Veri okuma", value: "Yok" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Tablo/sorgu", value: "Eklenmedi" },
  { label: "Sonraki adım", value: "Cari tablo/kapsam analizi" },
];

const currentPreviewPrepChecklist = [
  "Cari tablo adı doğrulanacak.",
  "Read-only kullanıcı yetkisi doğrulanacak.",
  "İlk deneme satır limiti belirlenecek.",
  "Müşteri bilgisi maskeleme kuralı belirlenecek.",
  "Cari bakiye alanları ayrıca doğrulanacak.",
  "Riskli/veresiye müşteri görünümü ayrı fazda ele alınacak.",
];

const currentPreviewPrepSafetyNotes = [
  "Bu sürümde cari verisi okunmaz.",
  "SQL sorgusu yoktur.",
  "Tablo adı yoktur.",
  "Müşteri/cari verisi repoya yazılmaz.",
  "Veri yazma/import/senkron/export yoktur.",
];
const currentPreviewWhyClosedItems = [
  "Cari verisi müşteri ve bakiye bilgisi içerdiği için stoktan daha hassastır.",
  "Önce tablo/kapsam doğrulaması yapılmalıdır.",
  "İlk cari deneme sadece read-only ve küçük satır limitiyle yapılmalıdır.",
  "Müşteri bilgisi maskeleme kuralı belirlenmeden canlı cari gösterimi açılmamalıdır.",
];
const currentPreviewRequiredConditions = [
  "Read-only kullanıcı yetkisi doğrulandı.",
  "Cari tablo/kapsam doğrulandı.",
  "İlk satır limiti belirlendi.",
  "Müşteri bilgisi maskeleme kuralı belirlendi.",
  "Patron onayı alındı.",
];
const currentPreviewCandidateLabels = [
  "Cari kodu",
  "Kısa unvan",
  "Risk sınıfı",
  "Bakiye durumu",
  "Son işlem tarihi",
  "Tahsilat önceliği",
];
const currentPreviewForbiddenItems = [
  "Cari verisi okuma yok.",
  "SQL sorgusu yok.",
  "Tablo adı yok.",
  "Müşteri adı yok.",
  "Bakiye verisi yok.",
  "Export/import/senkron yok.",
  "Vega'ya veri yazma yok.",
];

const orderPreviewPrepGateCards = [
  { label: "Sipariş kapsam", value: "Planlandı" },
  { label: "Bağlantı", value: "Yok" },
  { label: "Veri okuma", value: "Yok" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Tablo/sorgu", value: "Eklenmedi" },
  { label: "Sonraki adım", value: "Sipariş tablo/kapsam analizi" },
];

const orderPreviewPrepChecklist = [
  "Sipariş kapsamı netleştirilecek.",
  "Read-only kullanıcı yetkisi doğrulanacak.",
  "İlk satır limiti belirlenecek.",
  "Müşteri/sipariş bilgisi maskeleme kuralı belirlenecek.",
  "Sipariş durumu alanları ayrıca doğrulanacak.",
  "Riskli/iade/iptal sipariş görünümü ayrı fazda ele alınacak.",
];

const orderPreviewCandidateLabels = [
  "Sipariş no",
  "Tarih",
  "Cari kısa etiket",
  "Sipariş durumu",
  "Ürün adedi",
  "Tutar durumu",
  "Teslimat/termin durumu",
];

const orderPreviewPrepSafetyNotes = [
  "Bu sürümde sipariş verisi okunmaz.",
  "SQL sorgusu yoktur.",
  "Tablo adı yoktur.",
  "Müşteri/sipariş verisi repoya yazılmaz.",
  "Veri yazma/import/senkron/export yoktur.",
];

const orderPreviewForbiddenItems = [
  "Sipariş verisi okuma yok.",
  "SQL sorgusu yok.",
  "Tablo adı yok.",
  "Müşteri adı yok.",
  "Sipariş numarası yok.",
  "Tutar verisi yok.",
  "Export/import/senkron yok.",
  "Vega'ya veri yazma yok.",
];

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

const vegaStockReadonlyHardeningCards = [
  { label: "Kapsam", value: "Sadece stok kartı" },
  { label: "Bağlantı", value: "Manuel tetikleme" },
  { label: "Satır limiti", value: "20" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Import/Senkron", value: "Kapalı" },
  { label: "Export", value: "Kapalı" },
  { label: "Cari/Sipariş/Finans", value: "Kapalı" },
];

const vegaStockReadonlyPreConnectionChecks = [
  "Read-only SQL kullanıcısı hazır mı?",
  "SQL kullanıcısında sadece SELECT yetkisi var mı?",
  "Manuel yedek alındı mı?",
  ".env.local Git dışında mı?",
  "Satır limiti 20 olarak korunuyor mu?",
  "Bağlantı yalnızca manuel butonla mı çalışıyor?",
  "Hata halinde otomatik tekrar deneme kapalı mı?",
];

const vegaStockReadonlyForbiddenItems = [
  "sa kullanıcısı ile test yapılmaz.",
  "Veri yazma yapılmaz.",
  "Import yapılmaz.",
  "Senkron yapılmaz.",
  "Export yapılmaz.",
  "Cari okunmaz.",
  "Sipariş okunmaz.",
  "Kasa/finans okunmaz.",
  "Connection string repoya yazılmaz.",
];

const vegaStockReadonlyPrecheckCards = [
  { label: "Read-only SQL kullanıcısı", value: "Manuel doğrulanacak" },
  { label: "sa kullanımı", value: "Yasak" },
  { label: "Manuel yedek", value: "Zorunlu" },
  { label: ".env.local", value: "Git dışında" },
  { label: "İlk kapsam", value: "Sadece stok" },
  { label: "İlk limit", value: "20 satır" },
  { label: "Bağlantı şekli", value: "Sadece manuel buton" },
];

const vegaStockReadonlyStopConditions = [
  "Read-only kullanıcı yoksa dur.",
  "Manuel yedek yoksa dur.",
  "sa kullanılıyorsa dur.",
  ".env.local Git'e giriyorsa dur.",
  "Uygulama açılışta otomatik bağlanıyorsa dur.",
  "Satır limiti 20 değilse dur.",
];

const vegaStockReadonlyPrecheckSafetyNotes = [
  "Bu sürüm bağlantı denemesi yapmaz.",
  "Veri okumaz.",
  "Veri yazmaz.",
  "SQL sorgusu çalıştırmaz.",
  "Sadece ön kontrol rehberidir.",
];

const vegaStockReadonlyLocalTestPrepCards = [
  { label: "Test yöntemi", value: "Local terminal" },
  { label: "Kapsam", value: "Sadece stok" },
  { label: "Kullanıcı", value: "Read-only SQL kullanıcısı" },
  { label: "Limit", value: "20 satır" },
  { label: "Otomatik çalışma", value: "Yok" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Export/dosya çıktısı", value: "Yok" },
];

const vegaStockReadonlyLocalTestManualChecks = [
  "Read-only kullanıcı hazır.",
  "sa kullanılmıyor.",
  "Manuel yedek alındı.",
  ".env.local Git dışında.",
  "Bağlantı bilgileri repoda yok.",
  "Stok limiti 20.",
  "Test sadece terminalden manuel çalışacak.",
];

const vegaStockReadonlyLocalTestScriptChecks = [
  "Mevcut stok smoke scripti otomatik çalışmaz.",
  "Script sadece read-only stok ve 20 satır kapsamıyla sınırlıdır.",
  "Script dosyaya çıktı almaz.",
  "Script hassas ham hata mesajı göstermez.",
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

const stockColumnVisibilityCards = [
  { label: "Kolon görünürlüğü", value: "Hazır" },
  { label: "Geçici seçim", value: "Evet" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Sonraki hedef", value: "Stok önizleme ekranını sadeleştirme" },
];

const stockPreviewPanelSimplificationCards = [
  { label: "Panel sadeleştirme", value: "Hazır" },
  { label: "Açılır bölümler", value: "Alan etiketleri / doğrulama notları / checklist" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Kapsam", value: "20 satır" },
  { label: "Kalıcı panel kaydı", value: "Yok" },
];

const stockPreviewUserTestCards = [
  { label: "Kullanıcı testi", value: "Hazır" },
  { label: "Son okuma özeti", value: "Geçici ekran state" },
  { label: "Kalıcı kayıt", value: "Yok" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Sonraki hedef", value: "Vega/stok ekranı genel sadeleştirme" },
];

const vegaStockScreenSimplificationCards = [
  { label: "Vega stok ekranı sadeleştirme", value: "Hazır" },
  { label: "Gelişmiş paneller", value: "Varsayılan kapalı" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Kapsam", value: "20 satır read-only" },
  { label: "Kalıcı panel/test kaydı", value: "Yok" },
];

const stockPreviewBetaPackageCards = [
  { label: "Stok önizleme beta hazırlığı", value: "Hazır" },
  { label: "Veri kapsamı", value: "20 satır read-only" },
  { label: "Paket testi", value: "Bekliyor" },
  { label: "Yeni SQL", value: "Yok" },
  { label: "Veri yazma/import", value: "Yok" },
  { label: "Dosyaya çıktı", value: "Yok" },
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

      <ErpMainBackboneModuleMap />

      <RolePermissionMatrixPanel />

      <DailyOperationWorkflowCenter />

      <StaffUsageScreenMapPanel />

      <ErpModulePriorityOrderPanel />

      <StockManagementRoadmapPanel />

      <TopStockOutPreviewSummaryPanel />

      <StockPreviewUserValidationFlowPanel />

      <StockPreviewUserTestSessionPanel />

      <CompanyReadonlyPretestPanel />

      <SaControlledStockReadonlyModePanel />

      <StockSmokeTestResultSummaryPanel />

      <ReadonlySqlUserTransitionPlan />

      <BarcodeHandheldRoadmapPanel />

      <RiskWarningCenter />

      <DataFieldDictionaryPanel />

      <StockFieldLabelClarificationPlanPanel />

      <VegaReadonlyOperationCenter />

      <VegaReadonlyModuleMatrix />

      <LiveDecisionPanel />

      <LiveMissingListPanel />

      <ReadonlyTestReportPrepPanel />

      <OwnerApprovalPackagePrepPanel />

      <ManagementPresentationSummaryPanel />

      <FinancePreviewPrepGate />

      <CurrentPreviewPrepGate />

      <OrderPreviewPrepGate />

      <ClosedBetaPreparationCenter />

      <DesktopPreparationCenter />

      <ReadonlyStockSmokeSummary />

      <ReadOnlyStockPreviewSummary />

      <VegaStockReadonlyHardeningPanel />

      <VegaStockReadonlyPrecheckPanel />

      <VegaStockReadonlyLocalTestPrepPanel />

      <StockPreviewSecurityConfirmation />

      <StockPreviewUsabilitySummary />

      <StockFieldValidationPrepSummary />

      <StockManualValidationChecklistSummary />

      <StockFieldLabelingPrepSummary />

      <StockColumnVisibilitySummary />

      <StockPreviewPanelSimplificationSummary />

      <StockPreviewUserTestSummary />

      <VegaStockScreenSimplificationSummary />

      <StockPreviewBetaPackageSummary />

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

function VegaReadonlyOperationCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-readonly-operation-center")}`} id="dashboard-vega-readonly-operation-center">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-readonly-operation-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Read-only hazırlık merkezi</p>
          <h2>Vega Read-only Operasyon Merkezi</h2>
          <span>Stok, cari, sipariş, kasa/finans ve export hazırlığı tek merkezde pasif izlenir; bu panel bağlantı, veri okuma veya kayıt işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaReadonlyOperationCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.status}</strong>
            <span>Bağlantı: {card.connection}</span>
            <span>Veri yazma: {card.write}</span>
            <span>Sonraki adım: {card.nextStep}</span>
          </article>
        ))}
      </div>

      <p className="commerce-profitability-safety-note">{vegaReadonlySafetyNotes.join(" · ")}</p>
    </section>
  );
}

function ErpMainBackboneModuleMap() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-erp-main-backbone-module-map")}`} id="dashboard-erp-main-backbone-module-map">
      <DashboardNewReleaseBadge sectionId="dashboard-erp-main-backbone-module-map" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif ERP ana omurga</p>
          <h2>ERP Ana Omurga ve Modül Haritası</h2>
          <span>Ana modüllerin durum, veri modu, risk seviyesi ve sonraki adımı tek haritada görünür olur; bu panel bağlantı, veri işlemi, dosya üretimi veya onay kaydı başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {erpBackboneModuleCards.map((card) => (
          <article className="profitability-priority-card" key={card.module}>
            <span>{card.module}</span>
            <strong>{card.status}</strong>
            <p>Veri modu: {card.dataMode}</p>
            <p>Risk seviyesi: {card.risk}</p>
            <small>Sonraki adım: {card.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="ERP'de Eksik Ana Katmanlar" note="Bu liste mimari görünürlük içindir; görev kaydı veya onay oluşturmaz.">
        <div className="commerce-performance-grid">
          {erpBackboneMissingLayers.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Sürüm Ne Yapmaz?" note="Bu güvenlik kutusu pasif sınırı netleştirir; işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {erpBackboneNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function RolePermissionMatrixPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-role-permission-matrix")}`} id="dashboard-role-permission-matrix">
      <DashboardNewReleaseBadge sectionId="dashboard-role-permission-matrix" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif rol ve yetki taslağı</p>
          <h2>Rol ve Yetki Matrisi</h2>
          <span>ERP modüllerinde hangi rolün hangi görünüm seviyesine yaklaşacağını mimari seviyede gösterir; gerçek login, kullanıcı kaydı veya yetki kaydı oluşturmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {rolePermissionMatrixRows.map((row) => (
          <article className="profitability-priority-card" key={row.role}>
            <span>{row.role}</span>
            <strong>{row.visibility}</strong>
            <p>Veri modu: {row.dataMode}</p>
            <p>Risk seviyesi: {row.risk}</p>
            <small>Sonraki adım: {row.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu rol-yetki taslağının pasif sınırını gösterir; login, kayıt veya veri işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {rolePermissionNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function DailyOperationWorkflowCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-daily-operation-workflow-center")}`} id="dashboard-daily-operation-workflow-center">
      <DashboardNewReleaseBadge sectionId="dashboard-daily-operation-workflow-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif günlük iş akışı</p>
          <h2>Günlük Operasyon İş Akışı Merkezi</h2>
          <span>Melisa Bebe'de günlük kontrollerin hangi sırayla ele alınacağını gösterir; görev kaydı, kullanıcı ataması, otomasyon veya veri işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {dailyOperationWorkflowCards.map((card) => (
          <article className="profitability-priority-card" key={card.task}>
            <span>{card.task}</span>
            <strong>Sorumlu rol: {card.responsibleRole}</strong>
            <p>Veri modu: {card.dataMode}</p>
            <p>Risk seviyesi: {card.risk}</p>
            <small>Sonraki adım: {card.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu günlük akış merkezinin pasif sınırını gösterir; görev, otomasyon veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {dailyOperationWorkflowNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function StaffUsageScreenMapPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-staff-usage-screen-map")}`} id="dashboard-staff-usage-screen-map">
      <DashboardNewReleaseBadge sectionId="dashboard-staff-usage-screen-map" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif personel ekran haritası</p>
          <h2>Personel Kullanım Ekranları Haritası</h2>
          <span>İleride hangi personel rolünün hangi ekranı kullanacağını mimari seviyede gösterir; gerçek login, kullanıcı kaydı, görev atama veya veri işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {staffUsageScreenMapCards.map((card) => (
          <article className="profitability-priority-card" key={card.screen}>
            <span>{card.screen}</span>
            <strong>Kullanacak rol: {card.role}</strong>
            <p>Veri modu: {card.dataMode}</p>
            <p>Risk seviyesi: {card.risk}</p>
            <small>Sonraki adım: {card.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu personel ekran haritasının pasif sınırını gösterir; login, kayıt, görev veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {staffUsageScreenMapNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function ErpModulePriorityOrderPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-erp-module-priority-order")}`} id="dashboard-erp-module-priority-order">
      <DashboardNewReleaseBadge sectionId="dashboard-erp-module-priority-order" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif geliştirme önceliği</p>
          <h2>ERP Modül Öncelik Sıralaması</h2>
          <span>Patron ve teknik ekip için hangi ERP modülünün önce tamamlanması gerektiğini gösterir; modül açmaz, görev oluşturmaz, bağlantı veya veri işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {erpModulePriorityRows.map((row) => (
          <article className="profitability-priority-card" key={row.priority}>
            <span>{row.priority}</span>
            <strong>{row.reason}</strong>
            <p>Risk seviyesi: {row.risk}</p>
            <small>Sonraki teknik adım: {row.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu öncelik sıralamasının pasif sınırını gösterir; modül, görev, bağlantı veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {erpModulePriorityNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function StockManagementRoadmapPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-management-roadmap")}`} id="dashboard-stock-management-roadmap">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-management-roadmap" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif stok geliştirme yol haritası</p>
          <h2>Stok Yönetimi Geliştirme Yol Haritası</h2>
          <span>ERP öncelik sıralamasında ilk sıradaki stok modülünün hangi fazlarla tamamlanacağını gösterir; stok verisi okumaz, SQL sorgusu eklemez ve veri yazmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {stockManagementRoadmapPhases.map((phase) => (
          <article className="profitability-priority-card" key={phase.phase}>
            <span>{phase.phase}</span>
            <strong>{phase.status}</strong>
            <p>Veri modu: {phase.dataMode}</p>
            <p>Risk seviyesi: {phase.risk}</p>
            <small>Sonraki adım: {phase.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu stok yol haritasının pasif sınırını gösterir; sorgu, veri, import, senkron veya export işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {stockManagementRoadmapNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function StockPreviewUserValidationFlowPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-user-validation-flow")}`} id="dashboard-stock-preview-user-validation-flow">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-user-validation-flow" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif kullanıcı doğrulama sırası</p>
          <h2>Stok Önizleme Kullanıcı Doğrulama Akışı</h2>
          <span>20 satırlık stok read-only önizlemenin kullanıcı tarafından hangi sırayla kontrol edileceğini gösterir; yeni veri okumaz, bağlantı açmaz ve kullanıcı notu kaydetmez.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {stockPreviewUserValidationSteps.map((item) => (
          <article className="profitability-priority-card" key={item.step}>
            <span>{item.step}</span>
            <strong>Kontrol amacı: {item.purpose}</strong>
            <p>Sorumlu rol: {item.role}</p>
            <p>Risk seviyesi: {item.risk}</p>
            <small>Sonraki adım: {item.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Doğrulama Akışı Ne Yapmaz?" note="Bu kutu pasif doğrulama akışının güvenlik sınırlarını gösterir; form, kayıt veya işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {stockPreviewUserValidationNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kontrolde Sorun Görülürse Ne Yapılır?" note="Bu karar rehberi yalnızca yorumlama içindir; test, kayıt veya görev oluşturmaz.">
        <div className="commerce-performance-grid">
          {stockPreviewUserValidationIssueActions.map((item) => (
            <article className="commerce-performance-card" key={item.issue}>
              <h4>{item.issue}</h4>
              <strong>{item.action}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Doğrulama Sonucu Nasıl Yorumlanır?" note="Sonuçlar canlı veri veya kullanıcı notu olarak kaydedilmez; yalnızca sonraki güvenli faz kararını yönlendirir.">
        <div className="commerce-performance-grid">
          {stockPreviewUserValidationResultInterpretations.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function StockPreviewUserTestSessionPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-user-test-session")}`} id="dashboard-stock-preview-user-test-session">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-user-test-session" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif manuel kullanıcı test oturumu</p>
          <h2>Stok Önizleme Kullanıcı Test Oturumu Paneli</h2>
          <span>Depo, yönetici ve teknik ekibin stok önizlemeyi nasıl birlikte değerlendireceğini gösterir; test başlatmaz, bağlantı açmaz ve kullanıcı notu kaydetmez.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockPreviewUserTestSessionCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Test Oturumu Akışı" note="Bu akış yalnızca toplantı düzenini gösterir; uygulama içinden test, bağlantı veya kayıt başlatmaz.">
        <div className="commerce-performance-grid">
          {stockPreviewUserTestSessionFlow.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Oturum Sonunda Beklenen Kararlar" note="Kararlar sistemde saklanmaz; sözlü/manuel değerlendirme için görünür rehberdir.">
        <div className="commerce-performance-grid">
          {stockPreviewUserTestSessionExpectedDecisions.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Oturum Sonu Karar Sınıfları" note="Bu sınıflar manuel değerlendirme dilini netleştirir; karar veya onay kaydetmez.">
        <div className="profitability-priority-grid">
          {stockPreviewUserTestSessionDecisionClasses.map((item) => (
            <article className="profitability-priority-card" key={item.title}>
              <span>{item.title}</span>
              <strong>Anlamı: {item.meaning}</strong>
              <p>Kim karar verir: {item.owner}</p>
              <p>Risk seviyesi: {item.risk}</p>
              <small>Sonraki adım: {item.nextStep}</small>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Karar Verilirken Dikkat Edilecekler" note="Bu uyarılar kapsam büyümesini ve erken canlı kararını engellemek için görünür tutulur.">
        <div className="commerce-performance-grid">
          {stockPreviewUserTestSessionDecisionNotes.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Netleştirme Ne Yapmaz?" note="Bu kutu karar netleştirmenin pasif sınırlarını gösterir; form, kayıt veya işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {stockPreviewUserTestSessionNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function CompanyReadonlyPretestPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-company-readonly-pretest")}`} id="dashboard-company-readonly-pretest">
      <DashboardNewReleaseBadge sectionId="dashboard-company-readonly-pretest" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Şirket ortamı ön test hazırlığı</p>
          <h2>Vega Stok Read-only Şirket Ortamı Ön Test</h2>
          <span>Gerçek Vega stok read-only smoke testinden önce şirket bilgisayarındaki güvenli başlangıç şartlarını gösterir; bağlantı denemesi yapmaz, SQL sorgusu çalıştırmaz ve veri okumaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {companyReadonlyPretestCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Gerçek Testten Önce Zorunlu Şartlar" note="Bu liste yalnızca manuel ön test kontrolüdür; onay kaydı, bağlantı veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {companyReadonlyRequiredConditions.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Testi Durduracak Durumlar" note="Bu durumlardan biri görülürse gerçek read-only smoke test başlatılmamalıdır.">
        <div className="commerce-performance-grid">
          {companyReadonlyStopConditions.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{companyReadonlySafetyNotes.join(" · ")}</p>
    </section>
  );
}

function SaControlledStockReadonlyModePanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-sa-controlled-stock-readonly-mode")}`} id="dashboard-sa-controlled-stock-readonly-mode">
      <DashboardNewReleaseBadge sectionId="dashboard-sa-controlled-stock-readonly-mode" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Geçici sa kontrollü test modu</p>
          <h2>sa ile Kontrollü Stok Read-only Test Modu</h2>
          <span>Read-only SQL kullanıcısı ertelenirken şirket ortamındaki geçici sa kararının riskini ve sınırlarını pasif olarak gösterir; bağlantı denemesi, SQL sorgusu veya veri işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {saControlledStockReadonlyCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="sa ile Devam Edilecekse Zorunlu Güvenlik Kuralları" note="Bu liste manuel kontrol içindir; test, bağlantı, sorgu veya kayıt başlatmaz.">
        <div className="commerce-performance-grid">
          {saControlledStockReadonlyRules.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kesin Yasaklar" note="Bu sınırlar stok read-only test modunun dışına çıkılmasını engellemek için görünür tutulur.">
        <div className="commerce-performance-grid">
          {saControlledStockReadonlyForbiddenItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{saControlledStockReadonlySafetyNotes.join(" · ")}</p>
    </section>
  );
}

function StockSmokeTestResultSummaryPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-smoke-test-result-summary")}`} id="dashboard-stock-smoke-test-result-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-smoke-test-result-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Güvenli smoke test özeti</p>
          <h2>Stok Smoke Test Sonuç Özeti Paneli</h2>
          <span>Şirket ortamındaki stok read-only smoke test sonucunu canlı stok verisi veya bağlantı bilgisi göstermeden özetler; test çalıştırmaz, bağlantı açmaz ve dosya üretmez.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockSmokeTestResultSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Test Başarı Kriterleri" note="Bu kriterler önceki kontrollü smoke testin güvenli özetidir; canlı satır veya bağlantı bilgisi göstermez.">
        <div className="commerce-performance-grid">
          {stockSmokeTestSuccessCriteria.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Devam Etmeden Önce Karar" note="Bu kararlar sonraki adımları sınırlar; cari, sipariş ve finans kapsamı kapalı kalır.">
        <div className="commerce-performance-grid">
          {stockSmokeTestNextDecisions.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Panel Ne Yapmaz?" note="Bu kutu panelin pasif sınırlarını gösterir; işlem başlatan komut veya buton içermez.">
        <div className="commerce-performance-grid">
          {stockSmokeTestNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function TopStockOutPreviewSummaryPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-top-100-stock-out-preview-summary")}`} id="dashboard-top-100-stock-out-preview-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-top-100-stock-out-preview-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Manuel read-only stok çıkış hazırlığı</p>
          <h2>Vega Top 100 Stok Çıkışı Read-only Önizleme</h2>
          <span>En çok çıkış yapılan stok kodlarını ileride read-only görmek için güvenli hazırlık özetidir; hareket tablosu ve alanlar doğrulanmadan bağlantı veya sorgu başlatmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {topStockOutPreviewSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Çalıştırma Kilidi" note="Bu özet kartı sadece Dashboard görünürlüğü sağlar; test, bağlantı, veri okuma veya kayıt başlatmaz.">
        <div className="commerce-performance-grid">
          {topStockOutPreviewSummaryNotes.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function ReadonlySqlUserTransitionPlan() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-sql-user-transition-plan")}`} id="dashboard-readonly-sql-user-transition-plan">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-sql-user-transition-plan" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Güvenli kullanıcıya geçiş planı</p>
          <h2>Read-only SQL Kullanıcısına Geçiş Planı</h2>
          <span>Tek seferlik sa smoke testinden sonra aynı stok kapsamını read-only SQL kullanıcısıyla sürdürülebilir hale getirmek için pasif geçiş adımlarını gösterir; bağlantı denemesi veya SQL işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {readonlySqlUserTransitionCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Geçiş Adımları" note="Bu liste yalnızca teknik hazırlık planıdır; kullanıcı oluşturmaz, .env.local değiştirmez ve bağlantı açmaz.">
        <div className="commerce-performance-grid">
          {readonlySqlUserTransitionSteps.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kesin Yasaklar" note="Bu panel sa tekrarını ve kapsam genişlemesini kapalı tutan güvenlik sınırını gösterir.">
        <div className="commerce-performance-grid">
          {readonlySqlUserTransitionForbiddenItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{readonlySqlUserTransitionSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function BarcodeHandheldRoadmapPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-barcode-handheld-roadmap")}`} id="dashboard-barcode-handheld-roadmap">
      <DashboardNewReleaseBadge sectionId="dashboard-barcode-handheld-roadmap" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif barkod ve el terminali yol haritası</p>
          <h2>Barkod / El Terminali Geliştirme Yol Haritası</h2>
          <span>ERP öncelik sıralamasında ikinci sıradaki barkod modülünün hangi fazlarla tamamlanacağını gösterir; cihaz bağlantısı kurmaz, barkod okutmaz ve Vega işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {barcodeHandheldRoadmapPhases.map((phase) => (
          <article className="profitability-priority-card" key={phase.phase}>
            <span>{phase.phase}</span>
            <strong>{phase.status}</strong>
            <p>Veri modu: {phase.dataMode}</p>
            <p>Risk seviyesi: {phase.risk}</p>
            <small>Sonraki adım: {phase.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu barkod/el terminali yol haritasının pasif sınırını gösterir; cihaz, okutma, yazma veya export işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {barcodeHandheldRoadmapNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function RiskWarningCenter() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-risk-warning-center")}`} id="dashboard-risk-warning-center">
      <DashboardNewReleaseBadge sectionId="dashboard-risk-warning-center" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif risk ve uyarı haritası</p>
          <h2>Risk ve Uyarı Merkezi</h2>
          <span>Melisa Bebe için takip edilecek risk başlıklarını mimari seviyede gösterir; alarm üretmez, bildirim göndermez, görev açmaz ve veri işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {riskWarningCenterCards.map((card) => (
          <article className="profitability-priority-card" key={card.risk}>
            <span>{card.risk}</span>
            <strong>Risk seviyesi: {card.level}</strong>
            <p>Veri modu: {card.dataMode}</p>
            <p>Sorumlu rol: {card.responsibleRole}</p>
            <small>Sonraki adım: {card.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sürümde Olmayanlar" note="Bu kutu risk merkezinin pasif sınırını gösterir; alarm, bildirim, görev veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {riskWarningCenterNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function DataFieldDictionaryPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-data-field-dictionary")}`} id="dashboard-data-field-dictionary">
      <DashboardNewReleaseBadge sectionId="dashboard-data-field-dictionary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif iş seviyesi sözlük</p>
          <h2>Veri Alan Sözlüğü</h2>
          <span>ERP modülleri için iş seviyesindeki alan örneklerini ve doğrulama notlarını gösterir; gerçek Vega verisi okumaz, tablo/sorgu eklemez ve kesin alan eşlemesi yapmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {dataFieldDictionaryGroups.map((group) => (
          <article className="profitability-priority-card" key={group.group}>
            <span>{group.group}</span>
            <strong>{group.examples}</strong>
            <p>Durum: {group.status}</p>
            <p>Risk seviyesi: {group.risk}</p>
            <small>Sonraki doğrulama adımı: {group.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Sözlük Ne Değildir?" note="Bu kutu sözlüğün pasif sınırını gösterir; tablo, sorgu, veri okuma veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {dataFieldDictionaryNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function StockFieldLabelClarificationPlanPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-field-label-clarification-plan")}`} id="dashboard-stock-field-label-clarification-plan">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-field-label-clarification-plan" />
      <div className="commerce-profitability-hero">
        <div>
          <p>İş seviyesi stok etiketi planı</p>
          <h2>Stok Ekranı Alan Etiketi Netleştirme Planı</h2>
          <span>Stok ekranındaki alanların kullanıcı dilinde nasıl adlandırılacağını planlar; gerçek Vega alan eşlemesi yapmaz, yeni veri okumaz ve kayıt oluşturmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {stockFieldLabelClarificationCards.map((item) => (
          <article className="profitability-priority-card" key={item.label}>
            <span>Kullanıcıya görünen etiket: {item.label}</span>
            <strong>Kontrol amacı: {item.purpose}</strong>
            <p>Sorumlu rol: {item.role}</p>
            <p>Risk seviyesi: {item.risk}</p>
            <small>Sonraki adım: {item.nextStep}</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Etiketleme İlkeleri" note="Bu ilkeler iş seviyesi adlandırmayı netleştirir; teknik alan eşlemesi veya canlı yorum değildir.">
        <div className="commerce-performance-grid">
          {stockFieldLabelClarificationPrinciples.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Plan Ne Yapmaz?" note="Bu kutu planın pasif sınırlarını gösterir; form, kayıt veya işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {stockFieldLabelClarificationNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function VegaReadonlyModuleMatrix() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-readonly-module-matrix")}`} id="dashboard-vega-readonly-module-matrix">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-readonly-module-matrix" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif modül matrisi</p>
          <h2>Vega Read-only Modül Durum Matrisi</h2>
          <span>Read-only hazırlık modüllerinin durum, veri okuma, veri yazma, risk ve sonraki adım bilgileri tek bakışta gösterilir.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {vegaReadonlyModuleMatrixRows.map((row) => (
          <article className="profitability-priority-card" key={row.module}>
            <span>{row.module}</span>
            <strong>{row.status}</strong>
            <p>Veri okuma: {row.read}</p>
            <p>Veri yazma: {row.write}</p>
            <small>Risk: {row.risk} · Sonraki adım: {row.nextStep}</small>
          </article>
        ))}
      </div>

      <p className="commerce-profitability-safety-note">{vegaReadonlyModuleMatrixSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function LiveDecisionPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-live-decision-panel")}`} id="dashboard-live-decision-panel">
      <DashboardNewReleaseBadge sectionId="dashboard-live-decision-panel" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif karar rehberi</p>
          <h2>Canlıya Geçiş Karar Paneli</h2>
          <span>ERP'nin canlıya ne kadar hazır olduğunu patron seviyesinde özetler; veri okumaz, bağlantı açmaz ve onay kaydetmez.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {liveDecisionStatusCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Canlıya Yaklaşmak İçin Gereken Şartlar" note="Bu maddeler bu ekranda onaylanmaz; sadece karar öncesi görünür kılınır.">
        <div className="commerce-performance-grid">
          {liveDecisionRequiredItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kesin Canlıya Geçiş Engelleri" note="Bu engellerden biri varsa canlıya geçiş kararı ayrı kontrollü faza bırakılır.">
        <div className="commerce-performance-grid">
          {liveDecisionBlockerItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{liveDecisionSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function LiveMissingListPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-live-missing-list")}`} id="dashboard-live-missing-list">
      <DashboardNewReleaseBadge sectionId="dashboard-live-missing-list" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif eksik listesi</p>
          <h2>Canlıya Geçiş Eksik Listesi</h2>
          <span>Canlıya geçiş öncesi kalan işleri patron seviyesinde gösterir; görev kaydı tutmaz, onay almaz, bağlantı açmaz ve veri yazmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {liveMissingListItems.map((item) => (
          <article className="profitability-priority-card" key={item.task}>
            <span>{item.status}</span>
            <strong>{item.task}</strong>
            <small>Pasif takip etiketi</small>
          </article>
        ))}
      </div>

      <p className="commerce-profitability-safety-note">{liveMissingListSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function ReadonlyTestReportPrepPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-readonly-test-report-prep")}`} id="dashboard-readonly-test-report-prep">
      <DashboardNewReleaseBadge sectionId="dashboard-readonly-test-report-prep" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif test raporu hazırlığı</p>
          <h2>Read-only Test Raporu Hazırlık Paneli</h2>
          <span>Read-only test raporu için manuel hazırlanacak başlıkları gösterir; rapor üretmez, dosya oluşturmaz, veri okumaz ve veri yazmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {readonlyTestReportPrepItems.map((item) => (
          <article className="profitability-priority-card" key={item.title}>
            <span>{item.status}</span>
            <strong>{item.title}</strong>
            <small>Rapor başlığı hazırlığı</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Bu Panel Ne Yapmaz?" note="Bu açıklama yalnızca güvenli sınırı netleştirir; işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {readonlyTestReportPrepNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Manuel Test Raporunda Bulunması Gereken Karar Özeti" note="Bu liste rapor üretmez; manuel hazırlanacak karar başlıklarını görünür kılar.">
        <div className="commerce-performance-grid">
          {readonlyTestReportDecisionSummaryItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{readonlyTestReportPrepSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function OwnerApprovalPackagePrepPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-owner-approval-package-prep")}`} id="dashboard-owner-approval-package-prep">
      <DashboardNewReleaseBadge sectionId="dashboard-owner-approval-package-prep" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif patron onay paketi hazırlığı</p>
          <h2>Patron Onay Paketi Hazırlık Paneli</h2>
          <span>Patrona sunulacak onay paketi başlıklarını gösterir; onay almaz, kayıt tutmaz, dosya oluşturmaz ve veri işlemi başlatmaz.</span>
        </div>
      </div>

      <div className="profitability-priority-grid">
        {ownerApprovalPackageItems.map((item) => (
          <article className="profitability-priority-card" key={item.title}>
            <span>{item.status}</span>
            <strong>{item.title}</strong>
            <small>Onay paketi hazırlık başlığı</small>
          </article>
        ))}
      </div>

      <CommercePanel title="Patrona Sunulmadan Önce Kontrol Edilecekler" note="Bu liste yalnızca manuel sunum öncesi kontrol içindir; kayıt veya onay oluşturmaz.">
        <div className="commerce-performance-grid">
          {ownerApprovalPackagePrecheckItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Panel Ne Yapmaz?" note="Bu güvenlik kutusu pasif sınırı netleştirir; işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {ownerApprovalPackageNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{ownerApprovalPackageSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function ManagementPresentationSummaryPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-management-presentation-summary")}`} id="dashboard-management-presentation-summary">
      <DashboardNewReleaseBadge sectionId="dashboard-management-presentation-summary" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif yönetici sunum özeti</p>
          <h2>Yönetici Sunum Özeti Paneli</h2>
          <span>Patrona ve şirket içine anlatılacak ERP durumunu tek sayfalık özet gibi gösterir; veri okumaz, dosya oluşturmaz ve rapor üretmez.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {managementPresentationSummaryCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.title}>
            <span>{card.title}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Yöneticiye Tek Cümlelik Özet" note="Bu alan yalnızca sunum metnidir; veri okumaz veya kayıt oluşturmaz.">
        <div className="commerce-performance-grid">
          <article className="commerce-performance-card">
            <strong>{managementPresentationOneSentenceSummary}</strong>
          </article>
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Sunumun Amacı" note="Bu liste ERP durumunu anlatmak içindir; işlem başlatmaz.">
        <div className="commerce-performance-grid">
          {managementPresentationPurposeItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Şu An Yapılmayanlar" note="Bu liste güvenli sınırları görünür kılar; işlem veya kayıt başlatmaz.">
        <div className="commerce-performance-grid">
          {managementPresentationNotDoingItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Panel Ne Yapmaz?" note="Bu güvenlik kutusu pasif sınırı netleştirir.">
        <div className="commerce-performance-grid">
          {managementPresentationNoActionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Sıradaki Yönetici Kararı" note="Bu liste yalnızca manuel karar hazırlığıdır; onay kaydetmez.">
        <div className="commerce-performance-grid">
          {managementPresentationNextDecisionItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function FinancePreviewPrepGate() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-finance-preview-prep-gate")}`} id="dashboard-finance-preview-prep-gate">
      <DashboardNewReleaseBadge sectionId="dashboard-finance-preview-prep-gate" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif kasa/finans hazırlık kapısı</p>
          <h2>Kasa/Finans Özeti Hazırlık Kapısı</h2>
          <span>Finans özeti için yalnızca güvenli raporlama kapsamı hazırlanır; bağlantı açılmaz, tablo adı veya sorgu eklenmez, finans verisi okunmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {financePreviewPrepGateCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Neden Finans Verisi Henüz Okunmuyor?" note="Bu alan yalnızca karar gerekçesini açıklar; finans bağlantısı veya veri okuma işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {financePreviewWhyClosedItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Finans Açılmadan Önce Gereken Şartlar" note="Bu liste sadece manuel kapsam hazırlığı içindir; onay veya kayıt tutmaz.">
        <div className="commerce-performance-grid">
          {financePreviewPrepChecklist.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="İlk Read-only Finans Önizlemede Gösterilebilecek Aday Alanlar" note="Bu liste gerçek tablo alanı değildir; yalnızca iş seviyesi aday etiketleri gösterir.">
        <div className="commerce-performance-grid">
          {financePreviewCandidateLabels.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kesin Yasaklar" note="Bu panel pasif kalır; bağlantı, sorgu, finans verisi okuma veya kayıt işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {financePreviewForbiddenItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{financePreviewPrepSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function CurrentPreviewPrepGate() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-current-preview-prep-gate")}`} id="dashboard-current-preview-prep-gate">
      <DashboardNewReleaseBadge sectionId="dashboard-current-preview-prep-gate" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif cari hazırlık kapısı</p>
          <h2>Cari Önizleme Hazırlık Kapısı</h2>
          <span>Cari önizleme modülü için yalnızca güvenli kapsam hazırlığı gösterilir; bağlantı açılmaz, tablo adı veya sorgu eklenmez, veri okunmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {currentPreviewPrepGateCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Hazırlık Kontrol Listesi" note="Bu liste sadece manuel kapsam hazırlığı içindir; onay veya kayıt tutmaz.">
        <div className="commerce-performance-grid">
          {currentPreviewPrepChecklist.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Neden Henüz Cari Verisi Okunmuyor?" note="Cari önizleme, stok önizlemeden daha hassas veri sınıfına girer ve ayrı güvenlik kararları gerektirir.">
        <div className="commerce-performance-grid">
          {currentPreviewWhyClosedItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Cari Açılmadan Önce Gereken 5 Şart" note="Bu şartlar bu ekranda onaylanmaz; sadece sonraki read-only faz öncesi görünür kılınır.">
        <div className="commerce-performance-grid">
          {currentPreviewRequiredConditions.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="İlk Read-only Cari Önizlemede Gösterilebilecek Aday Alanlar" note="Bu liste gerçek tablo alanı değildir; yalnızca iş seviyesi aday etiketleri gösterir.">
        <div className="commerce-performance-grid">
          {currentPreviewCandidateLabels.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kesin Yasaklar" note="Bu panel pasif kalır; bağlantı, sorgu, veri okuma veya kayıt işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {currentPreviewForbiddenItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{currentPreviewPrepSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function OrderPreviewPrepGate() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-order-preview-prep-gate")}`} id="dashboard-order-preview-prep-gate">
      <DashboardNewReleaseBadge sectionId="dashboard-order-preview-prep-gate" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Pasif sipariş hazırlık kapısı</p>
          <h2>Sipariş Önizleme Hazırlık Kapısı</h2>
          <span>Sipariş önizleme modülü için yalnızca güvenli kapsam hazırlığı gösterilir; bağlantı açılmaz, tablo adı veya sorgu eklenmez, veri okunmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {orderPreviewPrepGateCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Sipariş Açılmadan Önce Gereken Şartlar" note="Bu liste sadece manuel kapsam hazırlığı içindir; onay veya kayıt tutmaz.">
        <div className="commerce-performance-grid">
          {orderPreviewPrepChecklist.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="İlk Read-only Sipariş Önizlemede Gösterilebilecek Aday Alanlar" note="Bu liste gerçek tablo alanı değildir; yalnızca iş seviyesi aday etiketleri gösterir.">
        <div className="commerce-performance-grid">
          {orderPreviewCandidateLabels.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Kesin Yasaklar" note="Bu panel pasif kalır; bağlantı, sorgu, veri okuma veya kayıt işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {orderPreviewForbiddenItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{orderPreviewPrepSafetyNotes.join(" · ")}</p>
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

function VegaStockReadonlyHardeningPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-stock-readonly-hardening")}`} id="dashboard-vega-stock-readonly-hardening">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-stock-readonly-hardening" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Stok read-only sağlamlaştırma</p>
          <h2>Vega Stok Read-only Bağlantı Sağlamlaştırma</h2>
          <span>Bu faz tam canlı entegrasyon değildir; yalnızca stok kartı için manuel tetiklenen, 20 satır limitli read-only bağlantı güvenliğini görünür kılar.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaStockReadonlyHardeningCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Bağlantı Öncesi Zorunlu Kontroller" note="Bu liste manuel güvenlik kontrolüdür; bağlantı, kayıt veya dosya işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {vegaStockReadonlyPreConnectionChecks.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Bu Fazda Kesin Yasaklar" note="Stok dışı kapsam, yazma işlemi ve hassas bağlantı bilgisi bu fazın dışında kalır.">
        <div className="commerce-performance-grid">
          {vegaStockReadonlyForbiddenItems.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
    </section>
  );
}

function VegaStockReadonlyPrecheckPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-stock-readonly-precheck")}`} id="dashboard-vega-stock-readonly-precheck">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-stock-readonly-precheck" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Bağlantı öncesi güvenli kontrol</p>
          <h2>Bağlantı Ön Kontrol Paneli</h2>
          <span>Gerçek Vega stok read-only bağlantısından önce local projenin hazır olup olmadığını gösterir; bağlantı denemesi, SQL sorgusu veya veri okuma yapmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaStockReadonlyPrecheckCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Başlamadan Önce Durduracak Şartlar" note="Bu liste manuel ön kontrol içindir; bağlantı veya kayıt işlemi başlatmaz.">
        <div className="commerce-performance-grid">
          {vegaStockReadonlyStopConditions.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <p className="commerce-profitability-safety-note">{vegaStockReadonlyPrecheckSafetyNotes.join(" · ")}</p>
    </section>
  );
}

function VegaStockReadonlyLocalTestPrepPanel() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-stock-readonly-local-test-prep")}`} id="dashboard-vega-stock-readonly-local-test-prep">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-stock-readonly-local-test-prep" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Local terminal test hazırlığı</p>
          <h2>Local Test Hazırlığı</h2>
          <span>Gerçek Vega stok read-only testinden önce local terminalden manuel çalıştırılacak güvenli test hazırlığını gösterir; bu panel bağlantı denemesi yapmaz.</span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaStockReadonlyLocalTestPrepCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <CommercePanel title="Local Testten Önce Manuel Doğrula" note="Bu liste terminal testinden önce manuel kontrol içindir; test veya bağlantı başlatmaz.">
        <div className="commerce-performance-grid">
          {vegaStockReadonlyLocalTestManualChecks.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>

      <CommercePanel title="Mevcut Script Güvenlik Kontrolü" note="Bu bölüm kaynak kontrol özetidir; script çalıştırılmaz ve dosya üretmez.">
        <div className="commerce-performance-grid">
          {vegaStockReadonlyLocalTestScriptChecks.map((item) => (
            <article className="commerce-performance-card" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </CommercePanel>
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

function StockColumnVisibilitySummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-column-visibility")}`} id="dashboard-stock-column-visibility">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-column-visibility" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Geçici ekran tercihi</p>
          <h2>Stok Önizleme Kolon Görünürlüğü Kontrolü</h2>
          <span>
            Read-only önizlemede zaten gelen 20 satırın kolonları ekranda geçici olarak gösterilip gizlenebilir; seçimler kaydedilmez ve SQL kapsamını değiştirmez.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockColumnVisibilityCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreviewPanelSimplificationSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-panel-simplification")}`} id="dashboard-stock-preview-panel-simplification">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-panel-simplification" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Sade önizleme akışı</p>
          <h2>Stok Önizleme Panel Sadeleştirme</h2>
          <span>
            Read-only stok önizleme ekranı güvenlik mesajı, manuel çalıştırma, özet, arama, kolon görünürlüğü, tablo ve açılır destek panelleri sırasına toparlandı.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockPreviewPanelSimplificationCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreviewUserTestSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-user-test")}`} id="dashboard-stock-preview-user-test">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-user-test" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Geçici test özeti</p>
          <h2>Stok Önizleme Kullanıcı Testi ve Son Okuma Özeti</h2>
          <span>
            Son okuma bilgileri ve kullanıcı test işaretleri yalnızca ekran state’i olarak tutulur; kayıt, dosya çıktısı, yeni SQL veya veri yazma oluşturmaz.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockPreviewUserTestCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function VegaStockScreenSimplificationSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-vega-stock-screen-simplification")}`} id="dashboard-vega-stock-screen-simplification">
      <DashboardNewReleaseBadge sectionId="dashboard-vega-stock-screen-simplification" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Günlük kullanım düzeni</p>
          <h2>Vega Stok Ekranı Genel Sadeleştirme</h2>
          <span>
            Stok önizleme ana akışı sade tutulur; gelişmiş alan doğrulama panelleri varsayılan kapalı gelir ve seçimler kalıcı kaydedilmez.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {vegaStockScreenSimplificationCards.map((card) => (
          <article className="commerce-profitability-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function StockPreviewBetaPackageSummary() {
  return (
    <section className={`commerce-profitability-center reporting-decision-center ${dashboardSectionClass("dashboard-stock-preview-beta-package")}`} id="dashboard-stock-preview-beta-package">
      <DashboardNewReleaseBadge sectionId="dashboard-stock-preview-beta-package" />
      <div className="commerce-profitability-hero">
        <div>
          <p>Kapalı beta hazırlığı</p>
          <h2>Stok Önizleme Test Sonrası Temizlik ve Paket Hazırlığı</h2>
          <span>
            Stok önizleme modülü kapalı beta paketi öncesi hazır gösterilir; veri kapsamı ve güvenlik sınırları değişmeden kalır.
          </span>
        </div>
      </div>

      <div className="reporting-decision-status-grid">
        {stockPreviewBetaPackageCards.map((card) => (
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
