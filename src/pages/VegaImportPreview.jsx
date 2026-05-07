import { useState } from "react";
import { AlertTriangle, Database, ShieldCheck } from "lucide-react";
import {
  readOnlyConnectionLocks,
  readOnlyConnectionPlan,
  readOnlyEnvironmentDecisionNotes,
  readOnlyEnvironmentPreparationItems,
  readOnlyFirstScopeRules,
  readOnlyNextPhaseBoundaries,
  readOnlyOperatorChecklist,
  readOnlyFailClosedPreparationNotes,
  readOnlyPreConnectionCleanupNotes,
} from "../config/readOnlyConnectionPlan.js";
import {
  readOnlyBlockedBehaviors,
  readOnlyFailClosedPolicy,
  readOnlyFailClosedRules,
} from "../config/readOnlyFailClosedPolicy.js";
import {
  vegaImportMapping,
  vegaImportSummary,
  vegaStockImportPreviewRows,
} from "../data/vegaImportMapping.js";
import "../vegaImport.css";

const riskRuleMap = Object.fromEntries(vegaImportMapping.riskRules.map((rule) => [rule.id, rule]));

const readonlyRoadmapStages = [
  {
    title: "Aşama 1: Hazırlık tamamlandı",
    items: [
      "Import kilidi aktif",
      "Mock önizleme hazır",
      "Mapping referansı görünür",
      "Güvenlik kartları kapalı durumda",
    ],
  },
  {
    title: "Aşama 2: İlk read-only deneme",
    items: [
      "Ayrı küçük sürümde yapılacak",
      "Manuel yedek doğrulanacak",
      "Sadece read-only kullanıcı kullanılacak",
      "Sadece 20 stok kartı okunacak",
      "Ham hata kullanıcıya gösterilmeyecek",
    ],
  },
  {
    title: "Aşama 3: Karşılaştırma",
    items: [
      "Sonuç Vega ekranıyla manuel karşılaştırılacak",
      "Barkod, stok kodu, ürün adı ve aktif/pasif tahmini kontrol edilecek",
      "Hatalar not alınacak",
      "Herhangi bir yazma/import yapılmayacak",
    ],
  },
  {
    title: "Aşama 4: Sonraki genişleme",
    items: [
      "Cari, fiş, hareket ve rapor kapsamı ayrı ayrı planlanacak",
      "Her kapsam ayrı küçük onaylı sürüm olacak",
      "Veri yazma/import en son ve ayrıca onaylı fazda ele alınacak",
    ],
  },
];

const technicalGateStatusCards = [
  { label: "Teknik ön kapı", value: "Pasif hazırlık" },
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "SQL/ODBC", value: "Kapalı" },
  { label: "DB okuma", value: "Kapalı" },
  { label: "İlk test sınırı", value: "20 satır" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const firstTrialPlanStatusCards = [
  { label: "İlk deneme modu", value: "Plan aşaması" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Manuel yedek", value: "Zorunlu" },
  { label: "Rollback planı", value: "Hazırlıkta" },
  { label: "İlk okuma sınırı", value: "20 satır" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const finalDecisionStatusCards = [
  { label: "Son karar durumu", value: "Hazırlık ekranı" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Başlama kararı", value: "Bu ekrandan verilmez" },
  { label: "İlk kapsam", value: "Sadece stok kartı" },
  { label: "İlk sınır", value: "20 satır" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const passiveConnectionSkeletonStatusCards = [
  { label: "Bağlantı modu", value: `${readOnlyConnectionPlan.connectionStatus} / Pasif plan` },
  { label: "SQL/ODBC", value: readOnlyConnectionPlan.sqlOdbcStatus },
  { label: "DB okuma", value: readOnlyConnectionPlan.dbReadStatus },
  { label: "Query", value: readOnlyConnectionPlan.queryStatus },
  { label: "Connection test", value: readOnlyConnectionPlan.connectionStatus },
  { label: "İlk kapsam", value: readOnlyConnectionPlan.firstLimit },
];

const operatorChecklistStatusCards = [
  { label: "Checklist modu", value: "Pasif hazırlık" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Operatör kontrolü", value: "Manuel" },
  { label: "Teknik kontrol", value: "Manuel" },
  { label: "Patron kararı", value: "Ayrı küçük faz" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const finalSecurityScanStatusCards = [
  { label: "Sürüm uyumu", value: "Kontrol edilecek" },
  { label: "Mavi nokta", value: "Release yapısıyla uyumlu" },
  { label: "Pasif teknik iskelet", value: "Kapalı" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Query / DB okuma", value: "Yok" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const failClosedStatusCards = [
  { label: "Politika modu", value: "Fail-closed / Pasif" },
  { label: "Varsayılan bağlantı", value: readOnlyFailClosedPolicy.defaultConnectionState },
  { label: "DB okuma", value: readOnlyFailClosedPolicy.defaultDbReadState },
  { label: "Query", value: readOnlyFailClosedPolicy.defaultQueryState },
  { label: "Connection test", value: "Kapalı" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const environmentPrepStatusCards = [
  { label: "Ortam hazırlığı", value: "Manuel" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "Sunucu/DB bilgisi", value: "Bu ekranda girilmez" },
  { label: "Read-only kullanıcı", value: "Manuel hazırlanacak" },
  { label: "Test ortamı", value: "Tercihen kopya ortam" },
  { label: "Veri yazma/import", value: "Kapalı" },
];

const stockSmokeTestStatusCards = [
  { label: "Bağlantı yöntemi", value: "Local script" },
  { label: "Kapsam", value: "Sadece stok kartı" },
  { label: "Limit", value: "20 satır" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
  { label: "Sonuç", value: "Terminal önizleme" },
];

const readOnlyStockPreviewStatusCards = [
  { label: "Çalışma modu", value: "Manuel read-only" },
  { label: "Varsayılan bağlantı", value: "Başlamaz" },
  { label: "Tablo kapsamı", value: "F0102TBLSTOKLAR" },
  { label: "Limit", value: "20 stok kartı" },
  { label: "Veri yazma", value: "Yok" },
  { label: "Import/senkron", value: "Yok" },
];

const readOnlyStockPreviewColumns = [
  { key: "IND", label: "Teknik ID", note: "Karar alanı değildir" },
  { key: "STOKKODU", label: "Stok Kodu" },
  { key: "MALINCINSI", label: "Ürün Adı" },
  { key: "KOD1", label: "KOD1", note: "Anlamı doğrulanacak Vega kod alanı" },
  { key: "KOD2", label: "KOD2", note: "Anlamı doğrulanacak Vega kod alanı" },
  { key: "KOD4", label: "KOD4", note: "Anlamı doğrulanacak Vega kod alanı" },
  { key: "KOD6", label: "KOD6", note: "Anlamı doğrulanacak Vega kod alanı" },
  { key: "ALISFIYATI", label: "Alış Fiyatı Adayı", note: "Aday fiyat alanı", type: "currencyCandidate" },
  { key: "ISKSATISFIYATI2", label: "Satış Fiyatı Adayı 2", note: "Aday fiyat alanı", type: "currencyCandidate" },
  { key: "ISKSATISFIYATI3", label: "Satış Fiyatı Adayı 3", note: "Aday fiyat alanı", type: "currencyCandidate" },
  { key: "KDVGRUBU", label: "KDV Grubu Adayı", note: "Muhasebe kontrolü gerekir" },
];

const defaultVisibleReadonlyStockColumns = [
  "STOKKODU",
  "MALINCINSI",
  "KOD1",
  "KOD2",
  "ALISFIYATI",
  "ISKSATISFIYATI2",
  "KDVGRUBU",
];

const stockFieldValidationNotes = [
  { field: "STOKKODU", meaning: "Stok kodu olarak yüksek güven", status: "Yüksek güven" },
  { field: "MALINCINSI", meaning: "Ürün adı / malın cinsi olarak yüksek güven", status: "Yüksek güven" },
  { field: "IND", meaning: "Teknik ID, kullanıcı karar alanı değildir", status: "Teknik alan" },
  { field: "KOD1", meaning: "Vega kod alanı, anlamı örnek satırlarla doğrulanmalı", status: "Doğrulanacak" },
  { field: "KOD2", meaning: "Vega kod alanı, anlamı örnek satırlarla doğrulanmalı", status: "Doğrulanacak" },
  { field: "KOD4", meaning: "Vega kod alanı, anlamı örnek satırlarla doğrulanmalı", status: "Doğrulanacak" },
  { field: "KOD6", meaning: "Vega kod alanı, anlamı örnek satırlarla doğrulanmalı", status: "Doğrulanacak" },
  { field: "ALISFIYATI", meaning: "Alış fiyatı adayı, kesin maliyet kararı değildir", status: "Doğrulanacak" },
  { field: "ISKSATISFIYATI2", meaning: "Satış fiyatı adayı 2, doğrulanmalı", status: "Doğrulanacak" },
  { field: "ISKSATISFIYATI3", meaning: "Satış fiyatı adayı 3, doğrulanmalı", status: "Doğrulanacak" },
  { field: "KDVGRUBU", meaning: "KDV grubu adayı, muhasebe kontrolü gerekir", status: "Muhasebe kontrolü" },
];

const stockSuggestedFieldLabels = [
  { field: "IND", label: "Teknik ID", confidence: "Yüksek güven", note: "Kullanıcı karar alanı değildir." },
  { field: "STOKKODU", label: "Stok Kodu", confidence: "Yüksek güven", note: "Vega stok kartı kodu ile karşılaştırılacak ana alan." },
  { field: "MALINCINSI", label: "Ürün Adı / Malın Cinsi", confidence: "Yüksek güven", note: "Ürün adı karşılığı olarak doğrulama sonrası netleşmeye en yakın alan." },
  { field: "KOD1", label: "Doğrulanacak Kod Alanı 1", confidence: "Düşük / doğrulanacak", note: "Vega ekranındaki karşılığı manuel karşılaştırma ile netleşmelidir." },
  { field: "KOD2", label: "Doğrulanacak Kod Alanı 2", confidence: "Düşük / doğrulanacak", note: "Vega ekranındaki karşılığı manuel karşılaştırma ile netleşmelidir." },
  { field: "KOD4", label: "Doğrulanacak Kod Alanı 4", confidence: "Düşük / doğrulanacak", note: "Vega ekranındaki karşılığı manuel karşılaştırma ile netleşmelidir." },
  { field: "KOD6", label: "Doğrulanacak Kod Alanı 6", confidence: "Düşük / doğrulanacak", note: "Vega ekranındaki karşılığı manuel karşılaştırma ile netleşmelidir." },
  { field: "ALISFIYATI", label: "Alış Fiyatı Adayı", confidence: "Orta güven", note: "Kesin maliyet kararı değildir; Vega ekranı ve muhasebe kontrolü gerekir." },
  { field: "ISKSATISFIYATI2", label: "Satış Fiyatı Adayı 2", confidence: "Orta güven", note: "Fiyat seviyesi manuel olarak doğrulanmalıdır." },
  { field: "ISKSATISFIYATI3", label: "Satış Fiyatı Adayı 3", confidence: "Orta güven", note: "Fiyat seviyesi manuel olarak doğrulanmalıdır." },
  { field: "KDVGRUBU", label: "KDV Grubu Adayı", confidence: "Orta güven", note: "Muhasebe kontrolü tamamlanmadan kesin kabul edilmez." },
];

const manualValidationStatuses = ["Bekliyor", "Uyumlu", "Fark var", "Emin değilim"];

const stockManualValidationChecklist = [
  "STOKKODU Vega stok kartı ekranındaki stok kodu ile aynı mı?",
  "MALINCINSI Vega’daki ürün adı / malın cinsi ile aynı mı?",
  "IND sadece teknik ID olarak mı kalıyor?",
  "KOD1 hangi Vega alanına karşılık geliyor olabilir?",
  "KOD2 hangi Vega alanına karşılık geliyor olabilir?",
  "KOD4 hangi Vega alanına karşılık geliyor olabilir?",
  "KOD6 hangi Vega alanına karşılık geliyor olabilir?",
  "ALISFIYATI Vega’daki alış fiyatı/maliyet alanıyla uyumlu mu?",
  "ISKSATISFIYATI2 hangi satış fiyatı seviyesine denk geliyor?",
  "ISKSATISFIYATI3 hangi satış fiyatı seviyesine denk geliyor?",
  "KDVGRUBU Vega’daki KDV grubu ile uyumlu mu?",
  "Boş gelen kod/fiyat alanları gerçekten Vega’da da boş mu?",
];

const stockPreviewUserTestItems = [
  "Ekran anlaşılır mı?",
  "Arama çalışıyor mu?",
  "Kolon göster/gizle işe yarıyor mu?",
  "Fiyat alanları anlaşılır mı?",
  "Kod alanları hâlâ doğrulama istiyor mu?",
  "Vega ekranı ile yan yana kontrol edildi mi?",
];

const roleEnvironmentPrepCards = [
  {
    title: "Teknik Sorumlu",
    items: [
      "SQL Server / DB bilgisini manuel tespit eder",
      "Read-only kullanıcıyı hazırlar veya yetkisini doğrular",
      "Yazma yetkisi olmadığını manuel kontrol eder",
      "Test bilgisayarını belirler",
    ],
  },
  {
    title: "Operatör",
    items: [
      "Manuel yedek alındığını teyit eder",
      "Test sırasında hata ve ekran notu tutar",
      "Başarısızlıkta tekrar deneme yapmaz",
      "Sonucu yöneticiye bildirir",
    ],
  },
  {
    title: "Patron / Yönetici",
    items: [
      "Testin canlı mı kopya ortamda mı yapılacağına karar verir",
      "İlk kapsamın sadece 20 stok kartı olduğunu onaylar",
      "Test saatini ve sorumluları belirler",
      "Başarı/başarısızlık sonrası ikinci faz kararını verir",
    ],
  },
];

const testEnvironmentDecisionGroups = [
  {
    title: "Canlı dışı / kopya ortam tercih edilir çünkü",
    items: [
      "Risk daha düşüktür",
      "Hata durumunda iş akışı etkilenmez",
      "Bağlantı ve yetki testleri daha güvenli yapılır",
      "Sonuçlar manuel karşılaştırma için izole olur",
    ],
  },
  {
    title: "Canlı ortam ancak şu şartlarla düşünülür",
    items: [
      "Manuel yedek kesin doğrulanmışsa",
      "Read-only kullanıcı kesin doğrulanmışsa",
      "İlk kapsam 20 stok kartı ile sınırlıysa",
      "Yazma yetkisi kesinlikle kapalıysa",
      "Test düşük riskli saatte yapılacaksa",
    ],
  },
];

const failClosedRuleItems = [
  "Manuel yedek doğrulanmadıysa bağlantı denenmez.",
  "Read-only kullanıcı doğrulanmadıysa bağlantı denenmez.",
  "İlk kapsam 20 stok kartını aşacaksa bağlantı denenmez.",
  "Ham hata gizleme politikası hazır değilse bağlantı denenmez.",
  "Yazma yetkisi şüphesi varsa bağlantı denenmez.",
  "Timeout politikası net değilse bağlantı denenmez.",
  "Başarısızlıkta tekrar deneme yapılmaz, önce rapor hazırlanır.",
  ...readOnlyFailClosedPreparationNotes,
];

const blockedBehaviorRows = readOnlyBlockedBehaviors.map((label) => ({
  label,
  value: "Bloke",
}));

const firstRealConnectionBoundaryItems = [
  "Bir sonraki faz küçük ve ayrı olmalıdır.",
  "Sadece read-only bağlantı denenebilir.",
  `İlk kapsam ${readOnlyFailClosedPolicy.firstAttemptScope}.`,
  `İlk limit ${readOnlyFailClosedPolicy.firstAttemptLimit}.`,
  "Query üretimi bu sürümde yoktur.",
  "Connection test bu sürümde yoktur.",
  "Credential bu sürümde yoktur.",
  "Veri yazma ve import kapalı kalır.",
  "Başarısızlıkta tekrar deneme yapılmaz.",
];

const finalSecurityCleanupItems = [
  "appVersion ve releaseHighlights uyumlu olmalı",
  "Sidebar mavi nokta sistemi releaseHighlightsByPage ile uyumlu kalmalı",
  "readOnlyConnectionPlan sadece statik metadata içermeli",
  "Connection string, server adı, database adı, username veya password olmamalı",
  "SQL/ODBC, DB okuma, query veya connection test logic olmamalı",
  "API/backend endpoint eklenmemeli",
  "LocalStorage veya form state eklenmemeli",
  "Veri yazma, import, export veya gerçek işlem butonu olmamalı",
  "Eski otomasyon kalıntıları geri gelmemeli",
  "Bir sonraki faz küçük ve sadece read-only bağlantı denemesi olmalı",
  ...readOnlyPreConnectionCleanupNotes,
];

const operatorFinalChecklistItems = [
  "Manuel yedek alındığı teyit edildi",
  "Read-only kullanıcı yetkisi teknik sorumlu tarafından doğrulanacak",
  "İlk test sadece stok kartı ile sınırlı kalacak",
  "İlk test en fazla 20 satır olacak",
  "Cari, fiş, hareket, tahsilat, ödeme kapsam dışı kalacak",
  "Ham hata kullanıcıya gösterilmeyecek",
  "Timeout hedefi 3000 ms olarak korunacak",
  "Retry kapalı kalacak",
  "Başarısızlıkta tekrar deneme yapılmayacak, rapor hazırlanacak",
  "Veri yazma ve import kapalı kalacak",
];

const roleBasedControlCards = [
  {
    title: "Operatör",
    items: ["Yedek teyidini alır", "Test sırasında not tutar", "Hata görürse ekran adı ve işlem notu hazırlar", "Tekrar deneme yapmaz"],
  },
  {
    title: "Teknik Sorumlu",
    items: ["Read-only kullanıcıyı doğrular", "Timeout ve ham hata politikasını kontrol eder", "Yazma yetkisi şüphesinde testi durdurur", "Sonucu Vega ekranıyla karşılaştırır"],
  },
  {
    title: "Patron / Yönetici",
    items: ["İlk kapsamı onaylar", "Test saatini ve sorumluları belirler", "Başarısızlıkta yeniden deneme kararını erteler", "Sonraki kapsam kararını ayrı fazda verir"],
  },
];

const nextSmallPhasePrepItems = [
  readOnlyNextPhaseBoundaries[0],
  readOnlyNextPhaseBoundaries[1],
  readOnlyNextPhaseBoundaries[2],
  "Ham hata gizli",
  "Retry kapalı",
  "Veri yazma yok",
  "Import yok",
  "Başarısızlıkta tekrar deneme yok",
];

const technicalInfrastructureLocks = [
  { label: "Canlı bağlantı kilidi", value: readOnlyConnectionLocks[0].value },
  { label: "ODBC/SQL kilidi", value: readOnlyConnectionLocks[1].value },
  { label: "DB okuma kilidi", value: readOnlyConnectionLocks[2].value },
  { label: "Query kilidi", value: "Kapalı" },
  { label: "API/backend kilidi", value: readOnlyConnectionPlan.apiStatus },
  { label: "Connection test kilidi", value: readOnlyConnectionLocks[4].value },
  { label: "Veri yazma kilidi", value: readOnlyConnectionPlan.writePolicy },
  { label: "Import kilidi", value: readOnlyConnectionPlan.importPolicy },
];

const firstConnectionScopeLimitItems = [
  "Sadece read-only bağlantı hedeflenir.",
  readOnlyFirstScopeRules[0],
  readOnlyFirstScopeRules[1],
  "Cari, fiş, hareket, tahsilat, ödeme ve import kapsam dışıdır.",
  "Veri yazma ve güncelleme yapılmayacaktır.",
  readOnlyFirstScopeRules[3],
  readOnlyFirstScopeRules[4],
];

const finalSecurityClosureStatusCards = [
  { label: "Hazırlık fazı", value: "Kapanış kontrolü" },
  { label: "Gerçek bağlantı", value: "Kapalı" },
  { label: "İlk bağlantı fazı", value: "Sonraki küçük sürüm" },
  { label: "İlk kapsam", value: "Sadece 20 stok kartı" },
  { label: "Veri yazma/import", value: "Kapalı" },
  { label: "Karar", value: "Ayrı bağlantı fazına hazırlanıyor" },
];

const closedSecurityLockRows = [
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "SQL/ODBC", value: "Kapalı" },
  { label: "DB okuma", value: "Kapalı" },
  { label: "Query üretimi", value: "Kapalı" },
  { label: "Query çalıştırma", value: "Kapalı" },
  { label: "API/backend", value: "Kapalı" },
  { label: "Connection test", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
  { label: "LocalStorage", value: "Kapalı" },
  { label: "Gerçek işlem butonu", value: "Yok" },
  { label: "Cihaz/scanner bağlantısı", value: "Kapalı" },
];

const notToDoItems = [
  "Vega’ya bağlanılmayacak",
  "SQL/ODBC açılmayacak",
  "DB okunmayacak",
  "Query yazılmayacak veya çalıştırılmayacak",
  "Bağlantı testi yapılmayacak",
  "Cari/fiş/hareket/tahsilat/ödeme okunmayacak",
  "ERP’ye veri yazılmayacak",
  "Import yapılmayacak",
  "Rapor export yapılmayacak",
  "Dosya indirilmeyecek",
  "Cihaz/scanner entegrasyonu yapılmayacak",
  "Form/input/onay state’i eklenmeyecek",
];

const completedPreparationCards = [
  { title: "Dashboard / Patron kokpiti", note: "Yönetici görünürlüğü hazır" },
  { title: "Raporlama / Karar merkezi", note: "Pasif rapor mantığı hazır" },
  { title: "Modül olgunluk skoru", note: "Canlıya hazırlık görünür" },
  { title: "El terminali / barkod", note: "Saha akışı hazır" },
  { title: "Stok / barkod kalite", note: "Risk matrisi hazır" },
  { title: "Cari / alacak riskleri", note: "Yönetici risk sınıfları hazır" },
  { title: "Alış / satış / kârlılık", note: "Ticari karar mantığı hazır" },
  { title: "Vega read-only hazırlığı", note: "Teknik ön kapı ve son karar ekranı hazır" },
];

const nextSmallPhaseBoundaryItems = [
  "Sadece read-only bağlantı",
  "Sadece stok kartı",
  "En fazla 20 satır",
  "Timeout 3000 ms",
  "Retry kapalı",
  "Ham hata gizli",
  "Veri yazma yok",
  "Import yok",
  "Cari/fiş/hareket kapsam dışı",
  "Başarısızlıkta tekrar deneme yok, önce rapor",
];

const startStopDecisionGroups = [
  {
    title: "Başlamaya Yakın Görünen Şartlar",
    items: [
      "Main branch güncel ve build başarılı",
      "Manuel yedek prosedürü hazır",
      "Read-only kullanıcı manuel doğrulanacak",
      "İlk kapsam sadece stok kartı",
      "20 satır sınırı net",
      "Ham hata gizleme politikası hazır",
      "Veri yazma/import kapalı",
    ],
  },
  {
    title: "Başlamayı Engelleyen Durumlar",
    items: [
      "Yedek alınmadıysa",
      "Read-only kullanıcı kesin değilse",
      "Yazma yetkisi şüphesi varsa",
      "Test kapsamı 20 satırı aşacaksa",
      "Ham hata gizleme net değilse",
      "Rollback sorumlusu belli değilse",
      "Canlıda riskli saat/dönem ise",
    ],
  },
];

const finalDecisionMatrixRows = [
  { control: "Manuel yedek hazır mı?", expected: "Hazır olmalı", decision: "Hazır değilse başlama" },
  { control: "Read-only kullanıcı doğrulandı mı?", expected: "Doğrulanmalı", decision: "Doğrulanmadıysa başlama" },
  { control: "İlk kapsam sadece stok kartı mı?", expected: "Sadece stok kartı", decision: "Değilse başlama" },
  { control: "20 satır sınırı korunuyor mu?", expected: "En fazla 20 satır", decision: "Korunmuyorsa başlama" },
  { control: "Timeout/ham hata politikası hazır mı?", expected: "Hazır olmalı", decision: "Hazır değilse başlama" },
  { control: "Rollback sorumlusu belli mi?", expected: "Sorumlu belli olmalı", decision: "Belli değilse başlama" },
  { control: "Veri yazma/import kapalı mı?", expected: "Kapalı kalmalı", decision: "Kapalı değilse başlama" },
  { control: "Test sonucu kim değerlendirecek?", expected: "Değerlendiren kişi belli olmalı", decision: "Belirsizse başlama" },
];

const scopeBoundaryGroups = [
  {
    title: "Kapsam içinde",
    items: [
      "Sadece stok kartı okuma",
      "En fazla 20 satır",
      "Sadece read-only kullanıcı",
      "Sadece manuel karşılaştırma",
      "Sadece gözlem/hata notu",
    ],
  },
  {
    title: "Kapsam dışında",
    items: [
      "Cari okuma",
      "Fiş okuma",
      "Hareket okuma",
      "Tahsilat/ödeme okuma",
      "Import",
      "Veri yazma",
      "Fiyat/stok/cari güncelleme",
      "Rapor export",
      "Otomatik aktarım",
    ],
  },
];

const finalSecurityLockRows = [
  { label: "Canlı Vega bağlantısı", value: "Bu sürümde kapalı" },
  { label: "SQL/ODBC", value: "Bu sürümde kapalı" },
  { label: "DB okuma", value: "Bu sürümde kapalı" },
  { label: "Query", value: "Bu sürümde yok" },
  { label: "API/backend", value: "Yok" },
  { label: "Connection test", value: "Yok" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
  { label: "LocalStorage", value: "Yok" },
  { label: "Gerçek işlem butonu", value: "Yok" },
];

const afterFinalDecisionSteps = [
  "Bu ekran yalnızca son karar rehberidir.",
  "Gerçek ilk deneme ayrı küçük sürümde yapılır.",
  "O küçük sürümde sadece read-only bağlantı açılır.",
  "İlk test sadece 20 stok kartı ile sınırlandırılır.",
  "Başarısızlıkta tekrar denenmez, rapor hazırlanır.",
  "Başarı sonrası ikinci kapsam yine ayrı küçük sürümde planlanır.",
  "Veri yazma ve import uzun süre kapalı kalır.",
];

const firstTrialTimelineStages = [
  {
    title: "Aşama 1: Test Öncesi",
    items: [
      "Main branch güncel ve build başarılı olmalı",
      "Manuel yedek alınmalı",
      "Read-only kullanıcı doğrulanmalı",
      "İlk 20 stok kartı kriteri belirlenmeli",
      "Ham hata gizleme ve timeout politikası gözden geçirilmeli",
    ],
  },
  {
    title: "Aşama 2: İlk Okuma",
    items: [
      "Sadece stok kartı okunacak",
      "Sadece 20 satır hedeflenecek",
      "Cari, fiş, hareket, ödeme, tahsilat kapsam dışı olacak",
      "Veri yazma/import kapalı kalacak",
      "Başarısızlıkta tekrar deneme yapılmayacak, önce raporlanacak",
    ],
  },
  {
    title: "Aşama 3: Karşılaştırma",
    items: [
      "Sonuç Vega ekranıyla manuel karşılaştırılacak",
      "Stok kodu, barkod, ürün adı ve aktif/pasif tahmini kontrol edilecek",
      "Fark varsa hata notu alınacak",
      "Ham hata kullanıcıya gösterilmeyecek",
    ],
  },
  {
    title: "Aşama 4: Karar",
    items: [
      "Başarılıysa ikinci küçük kapsam planlanacak",
      "Başarısızsa bağlantı denemesi durdurulacak",
      "Hata nedeni raporlanacak",
      "Veri yazma/import hâlâ açılmayacak",
    ],
  },
];

const rollbackProcedureGroups = [
  { title: "Yedek Kontrolü", items: ["Test öncesi manuel yedek alınır", "Yedek konumu yazılı olarak bilinir", "Geri dönüşten sorumlu kişi belirlenir", "Bu ekranda yedek alınmaz"] },
  { title: "Başarısız Bağlantı", items: ["Tekrar tekrar deneme yapılmaz", "Hata notu hazırlanır", "Ham hata kullanıcıya gösterilmez", "Teknik değerlendirme ayrı fazda yapılır"] },
  { title: "Veri Tutarsızlığı", items: ["Vega ekranıyla fark karşılaştırılır", "Farklı kayıtlar not alınır", "Import/veri yazma yapılmaz", "Kapsam büyütülmez"] },
  { title: "Acil Durdurma", items: ["Test iptal edilir", "Veri yazma kilidi kapalı tutulur", "Son durum raporlanır", "Yeni deneme için ayrı küçük sürüm hazırlanır"] },
];

const postTestTemplateRows = [
  "Test tarihi:",
  "Testi yapan kişi:",
  "Test ortamı:",
  "Okunan kayıt türü:",
  "Okunan satır sayısı:",
  "Beklenen sonuç:",
  "Görülen sonuç:",
  "Vega ekranıyla uyum:",
  "Hata var mı:",
  "Ham hata kullanıcıya gösterildi mi:",
  "Veri yazma/import kapalı kaldı mı:",
  "Son karar:",
  "Sonraki öneri:",
];

const failureScenarioCards = [
  { title: "Bağlantı zaman aşımı", action: "Deneme durdurulur, timeout not edilir, tekrar denenmez." },
  { title: "Yetki hatası", action: "Read-only kullanıcı yetkisi manuel kontrol edilir." },
  { title: "Beklenmeyen ham hata", action: "Ham hata kullanıcıya gösterilmez, güvenli hata notu hazırlanır." },
  { title: "Eksik/yanlış veri", action: "Vega ekranıyla manuel karşılaştırma yapılır." },
  { title: "20 satır sınırı aşımı", action: "Test başarısız sayılır, kapsam tekrar daraltılır." },
  { title: "Yazma yetkisi şüphesi", action: "Test iptal edilir, kullanıcı yetkisi yeniden doğrulanır." },
];

const requiredConditionGroups = [
  {
    title: "Manuel Yedek",
    items: [
      "Vega verisi için manuel yedek alınmalı",
      "Yedek konumu yetkili kişi tarafından doğrulanmalı",
      "Testten önce geri dönüş planı bilinmeli",
      "Bu ekrandan yedek alınmaz",
    ],
  },
  {
    title: "Read-only Kullanıcı",
    items: [
      "Kullanıcı sadece okuma yetkisine sahip olmalı",
      "Yazma, silme, güncelleme yetkileri kapalı olmalı",
      "Kullanıcı yetkisi manuel doğrulanmalı",
      "Bu ekranda kullanıcı bilgisi girilmez",
    ],
  },
  {
    title: "Sınırlandırılmış İlk Okuma",
    items: [
      "İlk deneme sadece stok kartı kapsamında olmalı",
      "İlk sınır 20 satır olmalı",
      "Cari, fiş, hareket, tahsilat, ödeme kapsam dışı olmalı",
      "Veri yazma/import olmamalı",
    ],
  },
  {
    title: "Hata ve Timeout Politikası",
    items: [
      "Timeout hedefi 3000 ms",
      "Retry kapalı",
      "Ham hata kullanıcıya gösterilmez",
      "Güvenli hata mesajı gösterilir",
    ],
  },
];

const technicalLockRows = [
  { label: "Bağlantı parametresi alma", value: "Kapalı" },
  { label: "SQL/ODBC sürücüsü kullanımı", value: "Kapalı" },
  { label: "DB okuma", value: "Kapalı" },
  { label: "Query üretimi", value: "Kapalı" },
  { label: "Query çalıştırma", value: "Kapalı" },
  { label: "API/backend", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Import", value: "Kapalı" },
  { label: "LocalStorage", value: "Kapalı" },
  { label: "Gerçek işlem butonu", value: "Yok" },
];

const firstReadonlyProcedureSteps = [
  "Manuel yedek doğrulanır.",
  "Read-only kullanıcı yetkisi doğrulanır.",
  "Test kapsamı sadece stok kartı olarak sınırlandırılır.",
  "İlk okuma 20 satır ile sınırlandırılır.",
  "Timeout ve ham hata gizleme politikası uygulanır.",
  "Sonuç Vega ekranıyla manuel karşılaştırılır.",
  "Fark varsa hata notu hazırlanır.",
  "Başarısız olursa bağlantı tekrar denenmez, önce raporlanır.",
  "Veri yazma ve import kapalı kalır.",
  "Bir sonraki faz için sadece gözlem notu hazırlanır.",
];

const connectionDecisionCards = [
  "Test canlı Vega üzerinde mi, kopya ortamda mı yapılacak?",
  "Read-only kullanıcıyı kim doğrulayacak?",
  "Manuel yedeği kim alacak?",
  "İlk 20 stok kartı hangi kritere göre seçilecek?",
  "Hata notlarını kim toplayacak?",
  "Başarılı test sonrası ikinci kapsam ne olacak?",
  "Veri yazma/import ne kadar süre kapalı kalacak?",
];

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

function formatPreviewCellValue(value, column) {
  if (value === null || value === undefined || value === "") return "—";

  if (column.type === "currencyCandidate") {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return "—";
    return new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
      currency: "TRY",
    }).format(numericValue);
  }

  return String(value);
}

export default function VegaImportPreview() {
  const [readonlyPreviewState, setReadonlyPreviewState] = useState({
    errorClass: "",
    items: [],
    message: "Henüz önizleme çalıştırılmadı.",
    status: "idle",
  });
  const [readonlyPreviewSearch, setReadonlyPreviewSearch] = useState("");
  const [visibleReadonlyStockColumns, setVisibleReadonlyStockColumns] = useState(defaultVisibleReadonlyStockColumns);
  const [openReadonlySupportPanels, setOpenReadonlySupportPanels] = useState({
    fieldLabels: true,
    validationNotes: false,
    manualChecklist: false,
  });
  const [stockPreviewUserTestState, setStockPreviewUserTestState] = useState(() =>
    Object.fromEntries(stockPreviewUserTestItems.map((item) => [item, false]))
  );
  const [manualValidationState, setManualValidationState] = useState(() =>
    Object.fromEntries(stockManualValidationChecklist.map((item) => [item, "Bekliyor"]))
  );

  const summaryCards = [
    { label: "Firma", value: vegaImportSummary.company },
    { label: "Stok kartı", value: formatNumber(vegaImportSummary.stockCardCount) },
    { label: "Dolu barkod", value: formatNumber(vegaImportSummary.filledBarcodeCount) },
    { label: "Benzersiz barkod", value: formatNumber(vegaImportSummary.uniqueBarcodeCount) },
    { label: "Duplicate barkod riski", value: formatNumber(vegaImportSummary.duplicateBarcodeRisk), tone: "danger" },
    { label: "Çoklu barkodlu stok", value: formatNumber(vegaImportSummary.multiBarcodeStockCount), tone: "warning" },
  ];

  const securityStatusCards = [
    { label: "Canlı Vega bağlantısı", value: "Kapalı" },
    { label: "SQL/ODBC okuma", value: "Kapalı" },
    { label: "ERP’ye yazma", value: "Kapalı" },
    { label: "Import işlemi", value: "Kapalı" },
  ];

  const operationStatusCards = [
    { label: "Sistem modu", value: "Pasif hazırlık" },
    { label: "Vega bağlantısı", value: "Kapalı" },
    { label: "İlk deneme kapsamı", value: "Sadece stok kartı" },
    { label: "Veri yazma/import", value: "Kapalı" },
  ];

  const operationGroups = [
    {
      title: "Güvenlik Kapısı",
      items: [
        "Manuel yedek zorunlu",
        "Read-only kullanıcı zorunlu",
        "Yazma yetkisi kapalı",
        "Ham hata gizli",
        "Retry kapalı",
        "Timeout hedefi 3000 ms",
      ],
    },
    {
      title: "İlk Deneme Kapsamı",
      items: [
        "Sadece stok kartı",
        "İlk sınır 20 satır",
        "Cari, fiş, hareket, ödeme, tahsilat yok",
        "Import yok",
        "Stok mutasyonu yok",
        "Sonuç Vega ekranıyla manuel karşılaştırılacak",
      ],
    },
    {
      title: "Saha Doğrulama",
      items: [
        "Testi yapacak kişi belirlenecek",
        "Vega ekranında karşılaştırılacak stok listesi hazırlanacak",
        "Hata görülürse ekran görüntüsü alınacak",
        "Test sonucu notu hazırlanacak",
        "Son karar bu ekrandan verilmeyecek",
      ],
    },
    {
      title: "Sonraki Faz",
      items: [
        "Gerçek read-only bağlantı ayrı küçük sürümde yapılacak",
        "İlk bağlantı sadece okuma amaçlı olacak",
        "20 satır sınırı korunacak",
        "Başarılı testten sonra cari/fiş/hareket kapsamı ayrıca planlanacak",
        "Veri yazma/import çok daha sonraki ayrı onaylı fazda ele alınacak",
      ],
    },
  ];

  const ownerSummaryItems = [
    "Sistem şu an güvenli hazırlık modunda.",
    "Gerçek Vega bağlantısı başlamadı.",
    "İlk gerçek deneme için önce manuel yedek ve read-only kullanıcı doğrulanmalı.",
    "İlk gerçek deneme sadece 20 stok kartı okuma ile yapılmalı.",
    "Veri yazma ve import bu fazın konusu değildir.",
  ];

  const normalizedPreviewSearch = readonlyPreviewSearch.trim().toLocaleLowerCase("tr-TR");
  const filteredReadonlyPreviewItems = normalizedPreviewSearch
    ? readonlyPreviewState.items.filter((row) =>
        [row.STOKKODU, row.MALINCINSI]
          .filter((value) => value !== null && value !== undefined)
          .some((value) => String(value).toLocaleLowerCase("tr-TR").includes(normalizedPreviewSearch))
      )
    : readonlyPreviewState.items;
  const visibleReadonlyPreviewColumns = readOnlyStockPreviewColumns.filter((column) =>
    visibleReadonlyStockColumns.includes(column.key)
  );
  const lastReadResultLabel =
    readonlyPreviewState.status === "success"
      ? "Başarılı"
      : readonlyPreviewState.status === "error"
        ? "Hata"
        : "Henüz çalışmadı";

  const toggleReadonlyPreviewColumn = (columnKey) => {
    setVisibleReadonlyStockColumns((current) =>
      current.includes(columnKey)
        ? current.filter((key) => key !== columnKey)
        : [...current, columnKey]
    );
  };

  const toggleReadonlySupportPanel = (panelKey) => {
    setOpenReadonlySupportPanels((current) => ({
      ...current,
      [panelKey]: !current[panelKey],
    }));
  };

  const setManualValidationStatus = (item, status) => {
    setManualValidationState((current) => ({
      ...current,
      [item]: status,
    }));
  };

  const toggleStockPreviewUserTestItem = (item) => {
    setStockPreviewUserTestState((current) => ({
      ...current,
      [item]: !current[item],
    }));
  };

  const handleReadOnlyStockPreview = async () => {
    const listStock = window.electronAPI?.vegaReadOnly?.listStock;
    if (!listStock) {
      setReadonlyPreviewState({
        errorClass: "DESKTOP_API_UNAVAILABLE",
        items: [],
        message: "Electron güvenli köprüsü bulunamadı. Önizleme yalnızca desktop uygulamada çalışır.",
        status: "error",
      });
      return;
    }

    setReadonlyPreviewState({
      errorClass: "",
      items: [],
      message: "Read-only stok önizleme çalışıyor...",
      status: "loading",
    });
    setReadonlyPreviewSearch("");

    try {
      const result = await listStock();
      setReadonlyPreviewState({
        errorClass: result?.errorClass || "",
        items: Array.isArray(result?.items) ? result.items : [],
        message: result?.message || "Önizleme tamamlandı.",
        status: result?.status === "success" ? "success" : "error",
      });
    } catch {
      setReadonlyPreviewState({
        errorClass: "SQL_UNKNOWN_SAFE",
        items: [],
        message: "Önizleme güvenli şekilde tamamlanamadı. Ham hata gizlendi.",
        status: "error",
      });
    }
  };

  return (
    <>
      <section className="page-title vega-import-title">
        <div>
          <p>Read-only Operasyon Merkezi</p>
          <h1>Vega Read-only Operasyon Merkezi</h1>
          <span>Bu ekran gerçek Vega bağlantısı kurmadan, ilk read-only deneme öncesi güvenlik, saha ve kapsam kontrollerini tek yerde toplar.</span>
        </div>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-stock-smoke-test">
        <div className="vega-technical-gate-hero">
          <p>Local read-only smoke test</p>
          <h2>İlk Gerçek Read-only Stok Kartı Okuma Denemesi</h2>
          <span>
            Bu sürümde ilk gerçek bağlantı yalnızca local script üzerinden, sadece read-only, sadece stok kartı ve en fazla 20 satır ile denenebilir. ERP ekranı veri yazmaz, import yapmaz ve bağlantıyı arayüzden başlatmaz.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {stockSmokeTestStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel">
          <h3>Local Terminal Deneme Notu</h3>
          <p>Bu ekranda bağlantı başlatılmaz. Deneme yalnızca local terminalde npm run vega:readonly-stock-smoke komutuyla yapılır.</p>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-stock-preview">
        <div className="vega-technical-gate-hero">
          <p>Manuel read-only önizleme</p>
          <h2>Vega Read-only Stok Önizleme</h2>
          <span>
            Bu ekran Vega’dan yalnızca 20 stok kartını read-only olarak önizler. Veri yazmaz, import yapmaz, senkron başlatmaz ve sonucu dosyaya kaydetmez.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {readOnlyStockPreviewStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <p className="vega-readonly-preview-security-box">
          Read-only · 20 satır · Yazma yok · Import yok · Dosyaya çıktı yok. Önizleme otomatik başlamaz; sadece butonla çalışır.
        </p>

        <section className="vega-technical-gate-panel">
          <div className="vega-readonly-preview-action">
            <div>
              <h3>Geçici Stok Önizleme</h3>
              <p>Önizleme otomatik başlamaz. Butona basılınca sadece F0102TBLSTOKLAR kapsamındaki 20 stok kartı geçici olarak ekranda gösterilir.</p>
            </div>
            <button type="button" onClick={handleReadOnlyStockPreview} disabled={readonlyPreviewState.status === "loading"}>
              {readonlyPreviewState.status === "loading" ? "Önizleniyor..." : "Read-only 20 stok kartı önizle"}
            </button>
          </div>
          <p className={`vega-readonly-preview-message ${readonlyPreviewState.status}`}>
            {readonlyPreviewState.message}
            {readonlyPreviewState.errorClass ? ` Hata sınıfı: ${readonlyPreviewState.errorClass}` : ""}
          </p>
        </section>

        <section className="vega-stock-last-read-summary" id="vega-stock-last-read-summary">
          <div>
            <h3>Son Okuma Özeti</h3>
            <p>Bu özet yalnızca geçici ekran state’idir; local DB’ye, dosyaya veya Vega’ya yazılmaz.</p>
          </div>
          <div className="vega-readonly-preview-result-grid">
            <article className="vega-import-summary-card">
              <span>Son önizleme sonucu</span>
              <strong>{lastReadResultLabel}</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Gelen satır sayısı</span>
              <strong>{readonlyPreviewState.items.length}</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Görünen/filtrelenen satır</span>
              <strong>{filteredReadonlyPreviewItems.length}</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Görünür kolon sayısı</span>
              <strong>{visibleReadonlyPreviewColumns.length}</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Veri yazma</span>
              <strong>Yok</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Import/senkron</span>
              <strong>Yok</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Dosyaya çıktı</span>
              <strong>Yok</strong>
            </article>
            <article className="vega-import-summary-card">
              <span>Bağlantı bilgisi gösterimi</span>
              <strong>Yok</strong>
            </article>
          </div>
        </section>

        {readonlyPreviewState.items.length > 0 && (
          <section className="vega-import-table-panel">
            <div className="vega-import-table-heading">
              <div>
                <h2>Read-only Stok Önizleme Sonucu</h2>
                <p>Bu tablo geçici ekrandır; canlı stok verileri repoya, local dosyaya veya import kaydına yazılmaz.</p>
              </div>
              <span><ShieldCheck size={14} /> {readonlyPreviewState.items.length} satır · read-only</span>
            </div>

            <div className="vega-readonly-preview-filter">
              <label htmlFor="vega-readonly-stock-search">Stok kodu veya ürün adı ara</label>
              <input
                id="vega-readonly-stock-search"
                type="search"
                value={readonlyPreviewSearch}
                onChange={(event) => setReadonlyPreviewSearch(event.target.value)}
                placeholder="Gelen 20 satır içinde ara"
              />
              <p>Arama yalnızca ekranda görünen geçici 20 satır üzerinde çalışır; yeni bağlantı veya SQL sorgusu başlatmaz.</p>
            </div>

            <section className="vega-readonly-column-visibility" id="vega-stock-column-visibility">
              <div>
                <h3>Kolon Görünürlüğü</h3>
                <p>Kolon görünürlüğü yalnızca geçici ekran tercihidir. Veri kaydetmez, Vega’ya yazmaz ve SQL sorgusunu değiştirmez.</p>
              </div>
              <div className="vega-readonly-column-toggle-grid">
                {readOnlyStockPreviewColumns.map((column) => (
                  <label className="vega-readonly-column-toggle" key={column.key}>
                    <input
                      type="checkbox"
                      checked={visibleReadonlyStockColumns.includes(column.key)}
                      onChange={() => toggleReadonlyPreviewColumn(column.key)}
                    />
                    <span>{column.label}</span>
                    <small>{defaultVisibleReadonlyStockColumns.includes(column.key) ? "Varsayılan görünür" : "Varsayılan gizli / açılabilir"}</small>
                  </label>
                ))}
              </div>
            </section>

            <div className="vega-readonly-preview-result-grid">
              <article className="vega-import-summary-card">
                <span>Gelen satır</span>
                <strong>{readonlyPreviewState.items.length}</strong>
              </article>
              <article className="vega-import-summary-card">
                <span>Görünen / filtrelenen satır</span>
                <strong>{filteredReadonlyPreviewItems.length}</strong>
              </article>
              <article className="vega-import-summary-card">
                <span>Veri yazma</span>
                <strong>Yok</strong>
              </article>
              <article className="vega-import-summary-card">
                <span>Import/senkron</span>
                <strong>Yok</strong>
              </article>
              <article className="vega-import-summary-card">
                <span>Dosyaya çıktı</span>
                <strong>Yok</strong>
              </article>
              <article className="vega-import-summary-card">
                <span>Görünür kolon</span>
                <strong>{visibleReadonlyPreviewColumns.length}</strong>
              </article>
            </div>

            <div className="vega-import-table-wrap">
              <table className="vega-import-table">
                <thead>
                  <tr>
                    {visibleReadonlyPreviewColumns.map((column) => (
                      <th key={column.key}>
                        <span>{column.label}</span>
                        {column.note && <small>{column.note}</small>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleReadonlyPreviewColumns.length > 0 && filteredReadonlyPreviewItems.map((row, rowIndex) => (
                    <tr key={`${row.IND ?? "row"}-${rowIndex}`}>
                      {visibleReadonlyPreviewColumns.map((column) => (
                        <td key={column.key}>{formatPreviewCellValue(row[column.key], column)}</td>
                      ))}
                    </tr>
                  ))}
                  {filteredReadonlyPreviewItems.length === 0 && (
                    <tr>
                      <td colSpan={Math.max(visibleReadonlyPreviewColumns.length, 1)}>Arama sonucunda eşleşen geçici satır bulunamadı.</td>
                    </tr>
                  )}
                  {filteredReadonlyPreviewItems.length > 0 && visibleReadonlyPreviewColumns.length === 0 && (
                    <tr>
                      <td>Gösterilecek kolon seçilmedi. Kolon görünürlüğü bölümünden en az bir kolon açılabilir.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="vega-readonly-preview-security-box">
              Bu önizleme yalnızca geçici 20 satırlık read-only gösterimdir. Veri yazmaz, import yapmaz, dosyaya kaydetmez.
            </p>

            <section className="vega-stock-user-test-notes" id="vega-stock-user-test-notes">
              <div>
                <h3>Kullanıcı Test Notu</h3>
                <p>Bu işaretler yalnızca ekranda geçici kalır; sayfa yenilenince veya uygulama kapanınca kalıcı kayıt oluşmaz.</p>
              </div>
              <div className="vega-stock-user-test-grid">
                {stockPreviewUserTestItems.map((item) => (
                  <label className="vega-stock-user-test-item" key={item}>
                    <input
                      type="checkbox"
                      checked={stockPreviewUserTestState[item]}
                      onChange={() => toggleStockPreviewUserTestItem(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </section>
          </section>
        )}

        <p className="vega-import-warning-panel">
          Bu önizleme yüksek yetkili kullanıcıyla kalıcı kullanım için tasarlanmamıştır. Sonraki fazlardan önce yalnızca okuma yetkili ayrı SQL kullanıcısına geçilmesi önerilir.
        </p>

        <section className="vega-stock-preview-support-panels" id="vega-stock-preview-support-panels">
          <div className="vega-stock-support-panel">
            <button type="button" onClick={() => toggleReadonlySupportPanel("fieldLabels")}>
              <span>Alan Etiketleri</span>
              <strong>{openReadonlySupportPanels.fieldLabels ? "Kapat" : "Aç"}</strong>
            </button>
            {openReadonlySupportPanels.fieldLabels && (
              <div className="vega-stock-support-panel-body" id="vega-stock-suggested-field-labels">
                <p>Geçici öneridir; manuel Vega karşılaştırması tamamlanmadan kesin operasyon veya muhasebe kararı olarak kullanılmaz.</p>
                <div className="vega-stock-suggested-label-grid">
                  {stockSuggestedFieldLabels.map((item) => (
                    <article className="vega-stock-suggested-label-card" key={item.field}>
                      <span>{item.field}</span>
                      <strong>{item.label}</strong>
                      <small>{item.confidence}</small>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="vega-stock-support-panel">
            <button type="button" onClick={() => toggleReadonlySupportPanel("validationNotes")}>
              <span>Doğrulama Notları</span>
              <strong>{openReadonlySupportPanels.validationNotes ? "Kapat" : "Aç"}</strong>
            </button>
            {openReadonlySupportPanels.validationNotes && (
              <div className="vega-stock-support-panel-body" id="vega-stock-field-validation-notes">
                <p>Alan yorumları kesin operasyon/muhasebe kararı değildir; Vega ekranı ve örnek satırlarla doğrulanacaktır.</p>
                <div className="vega-stock-field-validation-grid">
                  {stockFieldValidationNotes.map((note) => (
                    <article className="vega-technical-lock-row" key={note.field}>
                      <span>{note.field}</span>
                      <strong>{note.meaning}</strong>
                      <small>{note.status}</small>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="vega-stock-support-panel">
            <button type="button" onClick={() => toggleReadonlySupportPanel("manualChecklist")}>
              <span>Manuel Checklist</span>
              <strong>{openReadonlySupportPanels.manualChecklist ? "Kapat" : "Aç"}</strong>
            </button>
            {openReadonlySupportPanels.manualChecklist && (
              <div className="vega-stock-support-panel-body" id="vega-stock-manual-validation-checklist">
                <p>Checklist yalnızca manuel rehberdir. Seçimler kaydedilmez, Vega’ya yazılmaz ve uygulama kapatıldığında kalıcı sonuç oluşturmaz.</p>
                <div className="vega-stock-manual-checklist">
                  {stockManualValidationChecklist.map((item) => (
                    <article className="vega-stock-manual-checklist-row" key={item}>
                      <strong>{item}</strong>
                      <div className="vega-stock-manual-status-list">
                        {manualValidationStatuses.map((status) => (
                          <button
                            className={manualValidationState[item] === status ? "active" : ""}
                            key={status}
                            type="button"
                            onClick={() => setManualValidationStatus(item, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-environment-prep-center">
        <div className="vega-technical-gate-hero">
          <p>Pasif ortam hazırlığı</p>
          <h2>Read-only Bağlantı Ortam Bilgisi Manuel Hazırlık Merkezi</h2>
          <span>
            İlk gerçek read-only bağlantıdan önce gerekli SQL Server, veritabanı, read-only kullanıcı, yedek, test bilgisayarı ve test ortamı bilgilerinin gerçek veri girişi yapılmadan manuel olarak kim tarafından hazırlanacağını gösteren pasif rehber ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {environmentPrepStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-environment-prep-table">
          <h3>Ortam Bilgisi Hazırlık Tablosu</h3>
          <div className="vega-technical-gate-lock-grid">
            {readOnlyEnvironmentPreparationItems.map((row) => (
              <article className="vega-technical-lock-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.owner}</strong>
                <small>{row.status}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-role-environment-prep">
          <h3>Rol Bazlı Ortam Hazırlığı</h3>
          <div className="vega-technical-gate-card-grid">
            {roleEnvironmentPrepCards.map((card) => (
              <article className="vega-operation-group-card" key={card.title}>
                <h3>{card.title}</h3>
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-test-environment-decision-guide">
          <h3>Test Ortamı Karar Rehberi</h3>
          <div className="vega-technical-gate-card-grid">
            {testEnvironmentDecisionGroups.map((group) => (
              <article className="vega-operation-group-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="vega-technical-gate-card-grid">
            {readOnlyEnvironmentDecisionNotes.map((note) => (
              <article className="vega-owner-summary-row" key={note}>
                <ShieldCheck size={14} />
                <span>{note}</span>
              </article>
            ))}
          </div>
          <p>Bu sürümde canlı veya kopya ortama bağlantı açılmaz. Sadece karar rehberi sunulur.</p>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-fail-closed-shell">
        <div className="vega-technical-gate-hero">
          <p>Pasif fail-closed kabuk</p>
          <h2>Read-only Fail-closed Hazırlık Kabuğu</h2>
          <span>
            İlk gerçek read-only bağlantı denemesi öncesinde sistemin varsayılan olarak kapalı kalacağını, eksik şartlarda bağlantının denenmeyeceğini ve veri yazma/import kilitlerinin kapalı olduğunu gösteren pasif güvenlik kabuğu.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {failClosedStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-fail-closed-rules">
          <h3>Fail-closed Kuralları</h3>
          <div className="vega-technical-gate-card-grid">
            {failClosedRuleItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-blocked-behaviors">
          <h3>Bloke Edilen Davranışlar</h3>
          <div className="vega-technical-gate-lock-grid">
            {blockedBehaviorRows.map((row) => (
              <article className="vega-technical-lock-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </article>
            ))}
          </div>
          <p>Bu sürümde hiçbir blok kaldırılmaz. Bu bölüm yalnızca fail-closed güvenlik görünürlüğü sağlar.</p>
        </section>

        <section className="vega-technical-gate-panel" id="vega-first-real-connection-boundary">
          <h3>İlk Gerçek Bağlantıya Geçiş Öncesi Teknik Sınır</h3>
          <div className="vega-technical-gate-card-grid">
            {firstRealConnectionBoundaryItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-final-security-scan">
        <div className="vega-technical-gate-hero">
          <p>Pasif son tarama</p>
          <h2>Read-only Öncesi Son Güvenlik Tarama ve Temizlik</h2>
          <span>
            İlk gerçek read-only bağlantı fazına geçmeden önce sürüm, mavi nokta, kapalı kilitler, pasif teknik iskelet ve eski otomasyon kalıntılarını kontrol eden son pasif güvenlik ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {finalSecurityScanStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-final-security-cleanup-list">
          <h3>Son Güvenlik Kontrol Listesi</h3>
          <div className="vega-technical-gate-card-grid">
            {finalSecurityCleanupItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-operator-checklist-center">
        <div className="vega-technical-gate-hero">
          <p>Pasif operatör checklist</p>
          <h2>Read-only İlk Bağlantı Operatör Checklist Merkezi</h2>
          <span>
            İlk gerçek read-only bağlantıdan önce operatör, teknik sorumlu ve patronun manuel olarak kontrol edeceği son şartları gerçek bağlantı açmadan gösteren pasif checklist ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {operatorChecklistStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-operator-final-checklist">
          <h3>Operatör Son Kontrol Listesi</h3>
          <div className="vega-technical-gate-card-grid">
            {operatorFinalChecklistItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-role-based-control-panel">
          <h3>Rol Bazlı Kontrol Paneli</h3>
          <div className="vega-technical-gate-card-grid">
            {roleBasedControlCards.map((card) => (
              <article className="vega-operation-group-card" key={card.title}>
                <h3>{card.title}</h3>
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="vega-technical-gate-lock-grid">
            {readOnlyOperatorChecklist.map((row) => (
              <article className="vega-technical-lock-row" key={`${row.role}-${row.item}`}>
                <span>{row.role}</span>
                <strong>{row.status}</strong>
                <small>{row.item}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-next-small-phase-prep">
          <h3>Sonraki Küçük Faz Hazırlığı</h3>
          <p>Bu ekrandan bağlantı başlatılmaz. Bir sonraki küçük faz yalnızca ilk read-only bağlantı denemesi için hazırlanacaktır.</p>
          <div className="vega-technical-gate-card-grid">
            {nextSmallPhasePrepItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-connection-skeleton">
        <div className="vega-technical-gate-hero">
          <p>Kapalı teknik iskelet</p>
          <h2>Read-only Bağlantı Altyapısı Pasif Teknik İskeleti</h2>
          <span>
            İlk gerçek bağlantıdan önce bağlantı modunun kapalı olduğunu, SQL/ODBC ve DB okumanın başlamadığını, ilk kapsamın sadece 20 stok kartı ile sınırlı olacağını gösteren pasif teknik hazırlık alanı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {passiveConnectionSkeletonStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-technical-infrastructure-locks">
          <h3>Teknik Altyapı Kilitleri</h3>
          <div className="vega-technical-gate-lock-grid">
            {technicalInfrastructureLocks.map((row) => (
              <article className="vega-technical-lock-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </article>
            ))}
          </div>
          <p>Bu kilitler bu sürümde açılmaz. Bu bölüm yalnızca ileride açılacak küçük bağlantı fazı öncesi görünürlük sağlar.</p>
        </section>

        <section className="vega-technical-gate-panel" id="vega-first-connection-scope-limit">
          <h3>İlk Bağlantı Kapsam Sınırı</h3>
          <div className="vega-technical-gate-card-grid">
            {firstConnectionScopeLimitItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-final-security-closure">
        <div className="vega-technical-gate-hero">
          <p>Pasif final güvenlik kapanışı</p>
          <h2>Read-only Bağlantı Öncesi Final Güvenlik Kapanışı</h2>
          <span>
            İlk gerçek Vega read-only bağlantıdan önce hazırlık fazını kapatan, kapalı kilitleri, yapılmayacak işlemleri ve sonraki küçük bağlantı fazının sınırlarını gösteren pasif final güvenlik ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {finalSecurityClosureStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-closed-security-locks">
          <h3>Kapatılan Güvenlik Kilitleri</h3>
          <div className="vega-technical-gate-lock-grid">
            {closedSecurityLockRows.map((row) => (
              <article className="vega-technical-lock-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </article>
            ))}
          </div>
          <p>Bu sürüm hiçbir kilidi açmaz. Sadece kapalı kilitleri final güvenlik kapanışı olarak görünür hale getirir.</p>
        </section>

        <section className="vega-technical-gate-panel" id="vega-not-to-do-list">
          <h3>Bu Fazda Yapılmayacak İşlemler</h3>
          <div className="vega-technical-gate-card-grid">
            {notToDoItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel">
          <h3>Hazırlığı Tamamlanan Alanlar</h3>
          <div className="vega-technical-gate-card-grid">
            {completedPreparationCards.map((card) => (
              <article className="vega-operation-group-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-next-small-phase-boundary">
          <h3>Sonraki Küçük Faz Sınırı</h3>
          <p>Bundan sonraki faz artık büyük frontend hazırlık fazı değil, ayrı küçük ve kontrollü ilk read-only bağlantı denemesi olabilir.</p>
          <div className="vega-technical-gate-card-grid">
            {nextSmallPhaseBoundaryItems.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
          <p>Bu sürümde bağlantı açılmaz. Bu yalnızca sonraki küçük fazın sınırlarını gösterir.</p>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-final-decision-center">
        <div className="vega-technical-gate-hero">
          <p>Pasif son karar ekranı</p>
          <h2>Read-only İlk Deneme Son Karar Merkezi</h2>
          <span>
            İlk gerçek Vega read-only bağlantı açılmadan önce başla/başlama kararının hangi şartlarla verileceğini, kapsam sınırlarını ve güvenlik kilitlerini pasif olarak gösteren son hazırlık ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {finalDecisionStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-start-stop-decision-logic">
          <h3>Başla / Başlama Karar Mantığı</h3>
          <div className="vega-technical-gate-card-grid">
            {startStopDecisionGroups.map((group) => (
              <article className="vega-operation-group-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-final-decision-matrix">
          <h3>Son Karar Kontrol Matrisi</h3>
          <div className="vega-technical-gate-lock-grid">
            {finalDecisionMatrixRows.map((row) => (
              <article className="vega-technical-lock-row" key={row.control}>
                <span>{row.control}</span>
                <strong>{row.expected}</strong>
                <small>{row.decision}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel">
          <h3>İlk Deneme Kapsam Sınırı</h3>
          <div className="vega-technical-gate-card-grid">
            {scopeBoundaryGroups.map((group) => (
              <article className="vega-operation-group-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-final-security-lock">
          <h3>Son Güvenlik Kilidi</h3>
          <div className="vega-technical-gate-lock-grid">
            {finalSecurityLockRows.map((row) => (
              <article className="vega-technical-lock-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </article>
            ))}
          </div>
          <p>Bu panel son karar görünürlüğü sağlar. Gerçek bağlantı, test başlatma, kayıt oluşturma veya veri yazma işlemi yapmaz.</p>
        </section>

        <section className="vega-technical-gate-panel">
          <h3>Son Karar Sonrası Yol</h3>
          <ol className="vega-technical-gate-step-list">
            {afterFinalDecisionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-first-trial-plan">
        <div className="vega-technical-gate-hero">
          <p>Pasif ilk deneme planı</p>
          <h2>Read-only İlk Deneme Planı ve Geri Dönüş Prosedürü</h2>
          <span>
            İlk gerçek Vega read-only bağlantı açılmadan önce test sırası, manuel yedek, başarısızlık senaryosu, rollback düşüncesi ve test sonrası değerlendirme akışını pasif olarak gösteren hazırlık ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {firstTrialPlanStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-first-trial-timeline">
          <h3>İlk Deneme Zaman Çizelgesi</h3>
          <div className="vega-technical-gate-card-grid">
            {firstTrialTimelineStages.map((stage) => (
              <article className="vega-operation-group-card" key={stage.title}>
                <h3>{stage.title}</h3>
                <ul>
                  {stage.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-rollback-procedure">
          <h3>Geri Dönüş ve Rollback Prosedürü</h3>
          <div className="vega-technical-gate-card-grid">
            {rollbackProcedureGroups.map((group) => (
              <article className="vega-operation-group-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-post-test-template">
          <h3>Test Sonrası Değerlendirme Şablonu</h3>
          <div className="vega-post-test-template-grid">
            {postTestTemplateRows.map((row) => (
              <article className="vega-technical-lock-row" key={row}>
                <span>{row}</span>
                <strong>Not alınacak</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel">
          <h3>Başarısızlık Senaryoları</h3>
          <div className="vega-technical-gate-card-grid">
            {failureScenarioCards.map((card) => (
              <article className="vega-operation-group-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>Yapılacak: {card.action}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="vega-technical-gate-center section-updated-highlight" id="vega-readonly-technical-gate-center">
        <div className="vega-technical-gate-hero">
          <p>Pasif teknik hazırlık</p>
          <h2>Vega Read-only Teknik Ön Kapı Merkezi</h2>
          <span>
            İlk gerçek Vega read-only bağlantıdan önce tamamlanması gereken teknik şartları, güvenlik kilitlerini ve ilk deneme sınırlarını gerçek bağlantı açmadan gösteren pasif hazırlık ekranı.
          </span>
        </div>

        <div className="vega-technical-gate-status-grid">
          {technicalGateStatusCards.map((card) => (
            <article className="vega-import-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <section className="vega-technical-gate-panel" id="vega-readonly-required-conditions">
          <h3>İlk Bağlantı Öncesi Zorunlu Şartlar</h3>
          <div className="vega-technical-gate-card-grid">
            {requiredConditionGroups.map((group) => (
              <article className="vega-operation-group-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="vega-technical-gate-panel" id="vega-technical-lock-matrix">
          <h3>Teknik Kilit Matrisi</h3>
          <div className="vega-technical-gate-lock-grid">
            {technicalLockRows.map((row) => (
              <article className="vega-technical-lock-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </article>
            ))}
          </div>
          <p>Bu kilitler açılmadan ilk gerçek bağlantı denenemez. Bu sürüm kilitleri sadece görünür hale getirir.</p>
        </section>

        <section className="vega-technical-gate-panel" id="vega-first-readonly-procedure">
          <h3>İlk Read-only Deneme Taslak Prosedürü</h3>
          <ol className="vega-technical-gate-step-list">
            {firstReadonlyProcedureSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="vega-technical-gate-panel">
          <h3>Gerçek Bağlantıya Geçmeden Önce Bekleyen Kararlar</h3>
          <div className="vega-technical-gate-card-grid">
            {connectionDecisionCards.map((item) => (
              <article className="vega-owner-summary-row" key={item}>
                <ShieldCheck size={14} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="vega-operation-status-grid">
        {operationStatusCards.map((card) => (
          <div className="vega-operation-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="vega-import-warning-panel section-updated-highlight" id="vega-import-preview-panel">
        <AlertTriangle size={18} />
        <div>
          <strong>Import Kilidi Aktif</strong>
          <p>Bu ekran canlı Vega bağlantısı kurmaz, SQL/ODBC okuması yapmaz, query çalıştırmaz, ERP’ye kayıt yazmaz ve import başlatmaz.</p>
        </div>
      </section>

      <section className="vega-import-summary-grid">
        {securityStatusCards.map((card) => (
          <div className="vega-import-summary-card warning" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="vega-import-summary-grid">
        {summaryCards.map((card) => (
          <div className={`vega-import-summary-card ${card.tone || ""}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="vega-import-map-panel">
        <div className="vega-import-map-header">
          <Database size={18} />
          <div>
            <h2>Doğrulanmış Vega Kaynak Bilgisi</h2>
            <p>Mapping bilgileri yalnızca teknik referanstır. Bu bilgiler query çalıştırmaz, bağlantı açmaz ve canlı veri çekmez.</p>
          </div>
        </div>
        <div className="vega-import-map-grid">
          <div><span>Firma</span><strong>F0102 · {vegaImportMapping.companyPrefixes.F0102}</strong></div>
          <div><span>Muhasebe</span><strong>F0103 · {vegaImportMapping.companyPrefixes.F0103}</strong></div>
          <div><span>Fatura</span><strong>F0104 · {vegaImportMapping.companyPrefixes.F0104}</strong></div>
          <div><span>Dönem</span><strong>D0007 · {vegaImportMapping.periods.D0007}</strong></div>
          <div><span>Stok tablosu</span><strong>{vegaImportMapping.stockMapping.sourceTable}</strong></div>
          <div><span>Barkod / Birim tablosu</span><strong>{vegaImportMapping.barcodeMapping.sourceTable}</strong></div>
          <div><span>Barkod join</span><strong>{vegaImportMapping.barcodeMapping.join}</strong></div>
          <div><span>Müşteri cari</span><strong>{vegaImportMapping.customerMapping.sourceTable}</strong></div>
          <div><span>Tedarikçi cari</span><strong>{vegaImportMapping.supplierMapping.sourceTable}</strong></div>
          <div><span>Cari bakiye kuralı</span><strong>Hareketlerden hesaplanacak</strong></div>
        </div>
      </section>

      <section className="vega-import-tabs">
        <button className="active" type="button">Stok Önizleme</button>
        <button type="button" disabled>Müşteri Cari · Kapalı · Sonra</button>
        <button type="button" disabled>Tedarikçi Cari · Kapalı · Sonra</button>
      </section>

      <section className="vega-import-table-panel">
        <div className="vega-import-table-heading">
          <div>
            <h2>Stok Önizleme</h2>
            <p>Bu tablo mock veriyle çalışır. Canlı Vega’dan veri çekmez.</p>
          </div>
          <span><ShieldCheck size={14} /> Pasif önizleme · Gerçek import yok</span>
        </div>

        <div className="vega-import-table-wrap">
          <table className="vega-import-table">
            <thead>
              <tr>
                <th>Stok kodu</th>
                <th>Ürün adı</th>
                <th>Marka</th>
                <th>Kategori</th>
                <th>Beden/Yaş</th>
                <th>Sezon/Malzeme</th>
                <th>Barkod</th>
                <th>Birim</th>
                <th>Alış fiyat aralığı</th>
                <th>Satış fiyat aralığı</th>
                <th>KDV grubu</th>
                <th>Aktif/Pasif tahmini</th>
                <th>Uyarılar</th>
              </tr>
            </thead>
            <tbody>
              {vegaStockImportPreviewRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.stockCode || "Eksik"}</td>
                  <td>{row.productName || "Eksik"}</td>
                  <td>{row.brand || "-"}</td>
                  <td>{row.category || "-"}</td>
                  <td>{row.sizeAge || "-"}</td>
                  <td>{row.seasonMaterial || "-"}</td>
                  <td>{row.barcode || "Barkodsuz"}</td>
                  <td>{row.unit || "-"}</td>
                  <td>{row.purchasePriceRange || "-"}</td>
                  <td>{row.salePriceRange || "-"}</td>
                  <td>{row.taxGroup || "-"}</td>
                  <td>{row.activePassiveEstimate || "Kural bekliyor"}</td>
                  <td>
                    <div className="vega-risk-chip-list">
                      {row.warnings.length === 0 && <span className="vega-risk-chip low">Risk yok</span>}
                      {row.warnings.map((warningId) => {
                        const rule = riskRuleMap[warningId];
                        return (
                          <span className={`vega-risk-chip ${rule?.severity || "medium"}`} key={warningId}>
                            {rule?.label || warningId}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="vega-import-quality-note section-updated-highlight" id="vega-import-quality-note">
        <ShieldCheck size={18} />
        <div>
          <h2>Vega Import Kalite Kontrol Notu</h2>
          <ul>
            <li>Bu ekrandaki riskler gerçek import başlatmaz.</li>
            <li>Barkod ve stok riskleri önce pasif olarak gözlemlenir.</li>
            <li>Duplicate barkod, eksik stok kodu ve barkodsuz ürünler ilk saha kontrol listesine alınır.</li>
            <li>Gerçek import/veri yazma ayrı ve onaylı fazda değerlendirilir.</li>
          </ul>
        </div>
      </section>

      <section className="vega-import-risk-panel">
        <h2>Risk Kuralları</h2>
        <p>Bu kurallar yalnızca ön kontrol içindir; kayıt oluşturmaz, veriyi değiştirmez ve import başlatmaz.</p>
        <div className="vega-import-risk-grid">
          {vegaImportMapping.riskRules.map((rule) => (
            <span className={`vega-risk-chip ${rule.severity}`} key={rule.id}>{rule.label}</span>
          ))}
        </div>
      </section>

      <section className="vega-operation-center-panel">
        <div className="vega-operation-center-header">
          <h2>Read-only Hazırlık Grupları</h2>
          <p>İlk gerçek deneme öncesi güvenlik, kapsam, saha ve sonraki faz kararları tek yerde özetlenir.</p>
        </div>
        <div className="vega-operation-group-grid">
          {operationGroups.map((group) => (
            <article className="vega-operation-group-card" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="vega-owner-summary-panel">
        <h2>Patron Özeti</h2>
        <div className="vega-owner-summary-list">
          {ownerSummaryItems.map((item) => (
            <div className="vega-owner-summary-row" key={item}>
              <ShieldCheck size={14} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="vega-readonly-roadmap-panel" id="vega-readonly-roadmap">
        <div className="vega-readonly-roadmap-header">
          <h2>Read-only Yol Haritası</h2>
          <p>Gerçek bağlantıya geçmeden önce manuel ve küçük fazlı ilerleme sırası.</p>
        </div>
        <div className="vega-readonly-roadmap-grid">
          {readonlyRoadmapStages.map((stage) => (
            <article className="vega-readonly-roadmap-card" key={stage.title}>
              <h3>{stage.title}</h3>
              <ul>
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
