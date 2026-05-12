import { useMemo, useState } from "react";
import TerminalBarcodeQualityPanel from "../components/WarehouseTerminal/TerminalBarcodeQualityPanel.jsx";
import TerminalPilotTestPanels from "../components/WarehouseTerminal/TerminalPilotTestPanels.jsx";
import TerminalTrainingPanels from "../components/WarehouseTerminal/TerminalTrainingPanels.jsx";
import WarehouseTerminalPanel from "../components/WarehouseTerminal/WarehouseTerminalPanel.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";

const operationStatusCards = [
  { label: "Operasyon modu", value: "Pasif/mock hazırlık" },
  { label: "Cihaz bağlantısı", value: "Kapalı" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Sayım raporu", value: "Önizleme" },
];

const barcodeFlowSteps = [
  "Ürün barkodu okutulur.",
  "Son okutulanlar listesinde kontrol edilir.",
  "Sayım sepetine eklenmeden önce ürün adı/stok kodu/barkod kontrol edilir.",
  "Sayım raporu önizlenir.",
  "Gerçek kayıt veya stok güncelleme yapılmaz.",
  "Hatalı barkodlar not alınır.",
];

const staffGuideItems = [
  "Her okutma sonrası ürün adı ve barkod kontrol edilir.",
  "Barkod eksikse veya ürün eşleşmiyorsa not alınır.",
  "Aynı barkod birden fazla üründe görünüyorsa yöneticiye bildirilir.",
  "Sayım bitmeden veri aktarımı yapılmaz.",
  "Bu ekranda gerçek stok güncellemesi yapılmaz.",
  "Rapor sadece önizleme amaçlıdır.",
];

const barcodeRiskCards = [
  { label: "Barkodsuz ürün", description: "Okutma yapılamaz; ürün etiketi ve stok kartı manuel kontrol ister." },
  { label: "Duplicate barkod", description: "Aynı barkod birden fazla üründe görünürse sayım güvenilirliği düşer." },
  { label: "Eksik stok kodu", description: "Ürün adı doğru görünse bile rapor karşılaştırması zorlaşır." },
  { label: "Yanlış ürün eşleşmesi", description: "Okutulan barkod farklı ürünle eşleşirse personel notu gerekir." },
  { label: "Çoklu barkodlu stok", description: "Aynı stok kartında birden fazla barkod varsa yönetici kontrolü istenir." },
  { label: "Sayım farkı", description: "Sistem stoğu ile sayılan adet farklıysa raporda sadece önizleme yapılır." },
];

const qualityControlGroups = [
  {
    title: "Barkod Kalitesi",
    items: [
      "Barkodsuz ürünler kontrol edilecek",
      "Duplicate barkodlar yöneticiye bildirilecek",
      "Yanlış ürün eşleşmeleri not alınacak",
      "Çoklu barkodlu stoklar ayrıca kontrol edilecek",
    ],
  },
  {
    title: "Stok Kartı Kalitesi",
    items: [
      "Eksik stok kodu kontrol edilecek",
      "Ürün adı boş olan kayıtlar not alınacak",
      "Marka/kategori/beden alanları karşılaştırılacak",
      "Aktif/pasif durumu ayrıca değerlendirilecek",
    ],
  },
  {
    title: "Sayım Kalitesi",
    items: [
      "Son okutulanlar listesi kontrol edilecek",
      "Sayım sepeti manuel gözden geçirilecek",
      "Sayım farkı varsa rapora not düşülecek",
      "Gerçek stok güncellemesi yapılmayacak",
    ],
  },
  {
    title: "Yönetici Kontrolü",
    items: [
      "Riskli barkodlar listelenecek",
      "Personel notları toplanacak",
      "Vega ekranıyla manuel karşılaştırma yapılacak",
      "Son karar ayrı fazda verilecek",
    ],
  },
];

const riskPriorityRows = [
  { level: "Yüksek", tone: "high", risk: "Duplicate barkod", staffAction: "Ürünü ayır, not al, yöneticiyi bilgilendir", managerCheck: "Evet" },
  { level: "Yüksek", tone: "high", risk: "Eksik stok kodu", staffAction: "Stok kartı bilgisini ayır ve ürün adıyla kontrol notu oluştur", managerCheck: "Evet" },
  { level: "Yüksek", tone: "high", risk: "Yanlış ürün eşleşmesi", staffAction: "Okutmayı durdur, ürünü ayır ve eşleşme notu al", managerCheck: "Evet" },
  { level: "Orta", tone: "medium", risk: "Barkodsuz ürün", staffAction: "Etiket/stok kartı kontrolü yap", managerCheck: "Evet" },
  { level: "Orta", tone: "medium", risk: "Çoklu barkodlu stok", staffAction: "Barkodları ürünle birlikte manuel karşılaştır", managerCheck: "Evet" },
  { level: "Orta", tone: "medium", risk: "Sayım farkı", staffAction: "Sepeti ve son okutulanları tekrar gözden geçir", managerCheck: "Evet" },
  { level: "Düşük", tone: "low", risk: "Eksik kategori", staffAction: "Not al, sonraki düzenleme listesine ekle", managerCheck: "Hayır" },
  { level: "Düşük", tone: "low", risk: "Eksik marka", staffAction: "Marka bilgisini not listesine ekle", managerCheck: "Hayır" },
  { level: "Düşük", tone: "low", risk: "Aktif/pasif belirsizliği", staffAction: "Durumu not al ve sonraki kontrol listesine bırak", managerCheck: "Hayır" },
];

const operationSummaryItems = [
  { label: "Son okutulanlar", value: "Kontrol listesi" },
  { label: "Sayım sepeti", value: "Önizleme" },
  { label: "Rapor çıktısı", value: "CSV/JSON önizleme" },
  { label: "Gerçek stok güncelleme", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Yönetici kontrolü", value: "Manuel" },
];

const mockBarcodePurposeItems = [
  "Barkod okutma davranışını evde güvenli şekilde test etmek.",
  "Leading zero korunuyor mu görmek.",
  "Sonda gelen boşluk/enter/suffix problemi var mı görmek.",
  "Aynı barkod hızlı tekrar okutulursa duplicate guard mantığını göstermek.",
  "Gerçek Vega bağlantısı yapmamak.",
];

const mockBarcodeSafetyItems = [
  "Bu ekran gerçek stok sonucu değildir.",
  "SQL/Vega bağlantısı yoktur.",
  "Veri yazmaz.",
  "Sadece barkod yakalama ve ekran davranışı testidir.",
];

function normalizeMockBarcode(rawBarcode) {
  return rawBarcode.replace(/[\s\r\n\t]+$/g, "");
}

export default function WarehouseTerminal() {
  const { products, stockMovements } = useErpData();
  const [mockBarcodeInput, setMockBarcodeInput] = useState("");
  const [lastMockBarcode, setLastMockBarcode] = useState(null);
  const [previousMockBarcode, setPreviousMockBarcode] = useState("");

  const mockProductRows = useMemo(() => {
    if (!lastMockBarcode?.normalizedBarcode) return [];

    return [
      { label: "Stok kodu", value: "MOCK-STOK-001" },
      { label: "Ürün adı", value: "Mock Bebek Ürünü" },
      { label: "Barkod", value: lastMockBarcode.normalizedBarcode },
      { label: "Marka", value: "Mock Marka" },
      { label: "Beden", value: "Mock Beden" },
      { label: "Renk", value: "Mock Renk" },
      { label: "Stok miktarı", value: "Mock / gerçek değil" },
    ];
  }, [lastMockBarcode]);

  function handleMockBarcodeSubmit(event) {
    event.preventDefault();

    const rawBarcode = mockBarcodeInput;
    const normalizedBarcode = normalizeMockBarcode(rawBarcode);
    const trailingSuffixCleaned = rawBarcode !== normalizedBarcode;
    const hasLeadingZero = normalizedBarcode.startsWith("0");
    const isDuplicate = Boolean(normalizedBarcode) && normalizedBarcode === previousMockBarcode;

    setLastMockBarcode({
      rawBarcode,
      normalizedBarcode,
      length: normalizedBarcode.length,
      hasLeadingZero,
      trailingSuffixCleaned,
      isDuplicate,
    });
    setPreviousMockBarcode(normalizedBarcode);
    setMockBarcodeInput("");
  }

  return (
    <>
      <section className="page-title warehouse-terminal-title" id="warehouse-barcode-operation-center">
        <div>
          <p>El terminali</p>
          <h1>El Terminali ve Barkod Operasyon Merkezi</h1>
          <span>
            Personelin barkod okutma, sayım sepeti, son okutulanlar ve rapor önizleme akışını güvenli şekilde takip etmesi için hazırlanmış pasif operasyon ekranı.
          </span>
        </div>
      </section>

      <section className="warehouse-operation-status-grid" aria-label="El terminali operasyon durumu">
        {operationStatusCards.map((card) => (
          <article className="warehouse-operation-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-mock-barcode-test">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Mock Barkod Test Alanı</h2>
            <p>Honeywell/el terminali okutma davranışını gerçek Vega veya SQL bağlantısı olmadan, sadece geçici ekran state'iyle kontrol eder.</p>
          </div>
        </div>

        <div className="warehouse-mock-barcode-layout">
          <article className="warehouse-mock-barcode-card">
            <h3>Test Amacı</h3>
            <ul>
              {mockBarcodePurposeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="warehouse-mock-barcode-card">
            <h3>Barkod Giriş Alanı</h3>
            <form className="warehouse-mock-barcode-form" onSubmit={handleMockBarcodeSubmit}>
              <label className="filter-field warehouse-mock-barcode-field">
                <span>Mock barkod</span>
                <input
                  value={mockBarcodeInput}
                  onChange={(event) => setMockBarcodeInput(event.target.value)}
                  placeholder="Örn. 0001234567890"
                  autoComplete="off"
                  inputMode="text"
                />
                <small>
                  Giriş string olarak tutulur. Başındaki sıfırlar korunur; sonda gelen boşluk, enter veya suffix karakterleri sadece ekran testi için temizlenir.
                </small>
              </label>
              <button className="primary-action warehouse-mock-barcode-submit" type="submit">
                Mock barkodu test et
              </button>
            </form>
          </article>
        </div>

        <div className="warehouse-mock-barcode-result-grid">
          <article className="warehouse-mock-barcode-card">
            <h3>Son Okunan Barkod</h3>
            <dl className="warehouse-mock-barcode-detail-grid">
              <div><dt>Ham barkod</dt><dd>{lastMockBarcode?.rawBarcode || "-"}</dd></div>
              <div><dt>Normalize edilmiş barkod</dt><dd>{lastMockBarcode?.normalizedBarcode || "-"}</dd></div>
              <div><dt>Uzunluk</dt><dd>{lastMockBarcode ? lastMockBarcode.length : "-"}</dd></div>
              <div><dt>Leading zero var mı?</dt><dd>{lastMockBarcode ? (lastMockBarcode.hasLeadingZero ? "Evet" : "Hayır") : "-"}</dd></div>
              <div><dt>Sonda boşluk temizlendi mi?</dt><dd>{lastMockBarcode ? (lastMockBarcode.trailingSuffixCleaned ? "Evet" : "Hayır") : "-"}</dd></div>
              <div><dt>Duplicate mı?</dt><dd>{lastMockBarcode ? (lastMockBarcode.isDuplicate ? "Evet" : "Hayır") : "-"}</dd></div>
            </dl>
          </article>

          <article className="warehouse-mock-barcode-card">
            <h3>Mock Ürün Sonucu</h3>
            {mockProductRows.length > 0 ? (
              <dl className="warehouse-mock-barcode-detail-grid">
                {mockProductRows.map((row) => (
                  <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
                ))}
              </dl>
            ) : (
              <p className="warehouse-mock-barcode-empty">Henüz mock barkod okutulmadı.</p>
            )}
          </article>
        </div>

        <TerminalBarcodeQualityPanel lastMockBarcode={lastMockBarcode} />

        <div className="warehouse-mock-barcode-safety">
          <strong>Güvenlik Notu</strong>
          <ul>
            {mockBarcodeSafetyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <TerminalTrainingPanels />
      <TerminalPilotTestPanels />

      <section className="warehouse-operation-guide-grid">
        <article className="table-panel warehouse-operation-guide-card" id="warehouse-barcode-flow-summary">
          <div className="section-heading"><h2>Barkod Akış Özeti</h2></div>
          <ol className="warehouse-operation-step-list">
            {barcodeFlowSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>

        <article className="table-panel warehouse-operation-guide-card">
          <div className="section-heading"><h2>Personel Saha Rehberi</h2></div>
          <ul className="warehouse-operation-check-list">
            {staffGuideItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </section>

      <section className="table-panel warehouse-barcode-risk-panel" id="warehouse-barcode-risk-panel">
        <div className="section-heading"><h2>Barkod Riskleri</h2></div>
        <div className="warehouse-barcode-risk-grid">
          {barcodeRiskCards.map((risk) => (
            <article className="warehouse-barcode-risk-card" key={risk.label}>
              <strong>{risk.label}</strong><span>{risk.description}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="table-panel warehouse-quality-center-panel section-updated-highlight" id="warehouse-stock-barcode-quality-center">
        <div className="section-heading warehouse-quality-heading">
          <div><h2>Stok ve Barkod Kalite Kontrol Merkezi</h2><p>Sayım ve barkod operasyonu öncesinde riskli stok ve barkod kayıtlarını pasif/mock düzeyde görünür hale getiren kontrol alanı.</p></div>
        </div>
        <div className="warehouse-quality-card-grid">
          {qualityControlGroups.map((group) => (
            <article className="warehouse-quality-card" key={group.title}>
              <h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="table-panel warehouse-risk-priority-panel section-updated-highlight" id="warehouse-risk-priority-matrix">
        <div className="section-heading warehouse-quality-heading"><div><h2>Risk Öncelik Matrisi</h2><p>Personelin sahada neyi ayıracağını ve yöneticinin hangi risklerde devreye gireceğini statik olarak özetler.</p></div></div>
        <div className="warehouse-risk-priority-grid">
          {riskPriorityRows.map((row) => (
            <article className={`warehouse-risk-priority-card ${row.tone}`} key={`${row.level}-${row.risk}`}>
              <span>{row.level}</span><strong>{row.risk}</strong><p>{row.staffAction}</p><small>Yönetici kontrolü: {row.managerCheck}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="table-panel warehouse-operation-summary-panel">
        <div className="section-heading"><h2>Sayım Operasyon Özeti</h2></div>
        <div className="warehouse-operation-summary-grid">
          {operationSummaryItems.map((item) => (
            <article className="warehouse-operation-summary-card" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>
          ))}
        </div>
      </section>

      <WarehouseTerminalPanel products={products} stockMovements={stockMovements} />
    </>
  );
}
