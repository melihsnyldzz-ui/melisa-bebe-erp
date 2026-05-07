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
