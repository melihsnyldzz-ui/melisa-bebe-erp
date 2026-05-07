import { AlertTriangle, Database, ShieldCheck } from "lucide-react";
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

export default function VegaImportPreview() {
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

  return (
    <>
      <section className="page-title vega-import-title">
        <div>
          <p>Read-only Operasyon Merkezi</p>
          <h1>Vega Read-only Operasyon Merkezi</h1>
          <span>Bu ekran gerçek Vega bağlantısı kurmadan, ilk read-only deneme öncesi güvenlik, saha ve kapsam kontrollerini tek yerde toplar.</span>
        </div>
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
