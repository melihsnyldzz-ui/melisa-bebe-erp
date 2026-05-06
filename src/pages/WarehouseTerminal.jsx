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

const operationSummaryItems = [
  { label: "Son okutulanlar", value: "Kontrol listesi" },
  { label: "Sayım sepeti", value: "Önizleme" },
  { label: "Rapor çıktısı", value: "CSV/JSON önizleme" },
  { label: "Gerçek stok güncelleme", value: "Kapalı" },
  { label: "ERP’ye yazma", value: "Kapalı" },
  { label: "Yönetici kontrolü", value: "Manuel" },
];

export default function WarehouseTerminal() {
  const { products, stockMovements } = useErpData();

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

      <section className="warehouse-operation-guide-grid">
        <article className="table-panel warehouse-operation-guide-card" id="warehouse-barcode-flow-summary">
          <div className="section-heading">
            <h2>Barkod Akış Özeti</h2>
          </div>
          <ol className="warehouse-operation-step-list">
            {barcodeFlowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="table-panel warehouse-operation-guide-card">
          <div className="section-heading">
            <h2>Personel Saha Rehberi</h2>
          </div>
          <ul className="warehouse-operation-check-list">
            {staffGuideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="table-panel warehouse-barcode-risk-panel" id="warehouse-barcode-risk-panel">
        <div className="section-heading">
          <h2>Barkod Riskleri</h2>
        </div>
        <div className="warehouse-barcode-risk-grid">
          {barcodeRiskCards.map((risk) => (
            <article className="warehouse-barcode-risk-card" key={risk.label}>
              <strong>{risk.label}</strong>
              <span>{risk.description}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="table-panel warehouse-operation-summary-panel">
        <div className="section-heading">
          <h2>Sayım Operasyon Özeti</h2>
        </div>
        <div className="warehouse-operation-summary-grid">
          {operationSummaryItems.map((item) => (
            <article className="warehouse-operation-summary-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <WarehouseTerminalPanel products={products} stockMovements={stockMovements} />
    </>
  );
}
