const screenFocusItems = [
  "Operatör önce mock barkod alanına bakar.",
  "Barkod kalite sonucunu okur.",
  "Uyarı varsa barkodu tekrar okutur.",
  "Geçti sonucunu görünce sonraki kontrol listesine geçer.",
  "Sonuçları sistem dışı manuel not eder.",
];

const readyBarcodeScenarios = [
  "Normal barkod: 8691234567890",
  "Başında sıfır olan barkod: 0001234567890",
  "Kısa barkod: 1234567",
  "Uzun barkod: 123456789012345",
  "Hızlı tekrar okutma: aynı barkodu iki kez dene",
  "Sonda boşluk olan barkod: 8691234567890 boşluk",
];

const warehouseTrainingItems = [
  "Barkod okutunca ilk bakılacak yer kalite sonucudur.",
  "Ürün adı ve barkod eşleşmesi ayrı gözle kontrol edilir.",
  "Başındaki sıfır kaybolursa not alınır.",
  "Aynı barkod tekrar okutulursa duplicate uyarısı izlenir.",
  "Anlaşılamayan kolonlar ayrı yazılır.",
  "Test sonunda depo notları tek kişide toplanır.",
];

const commandCenterItems = [
  "Test sorumlusu ekranı açar.",
  "Depo personeli barkod denemelerini yapar.",
  "Yönetici stok ekranındaki alanları kontrol eder.",
  "Teknik kişi sadece izler ve not alır.",
  "Sorun çıkarsa test akışı durdurulur.",
  "Günün sonunda tek karar listesi hazırlanır.",
];

const feedbackItems = [
  "Hangi barkodlarda zorlanıldı?",
  "Başındaki sıfır korundu mu?",
  "Duplicate uyarısı doğru zamanda göründü mü?",
  "Stok ekranında anlaşılmayan kolon var mı?",
  "Depo kullanıcısı hangi adımda yavaşladı?",
  "Bir sonraki faz için en kritik eksik ne?",
];

function TrainingCard({ title, items }) {
  return (
    <article className="warehouse-mock-barcode-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export default function TerminalTrainingPanels() {
  return (
    <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-terminal-training-center">
      <div className="section-heading warehouse-quality-heading">
        <div>
          <h2>Terminal Eğitim ve Prova Merkezi</h2>
          <p>Mock barkod ekranını depo personeli ve yönetici için daha anlaşılır hale getiren pasif eğitim alanı.</p>
        </div>
      </div>
      <div className="warehouse-mock-barcode-layout">
        <TrainingCard title="v3.2 Ekran Odaklama" items={screenFocusItems} />
        <TrainingCard title="v3.3 Hazır Barkod Senaryoları" items={readyBarcodeScenarios} />
        <TrainingCard title="v3.4 Depo Kullanıcı Eğitimi" items={warehouseTrainingItems} />
        <TrainingCard title="v3.5 Test Günü Komuta Akışı" items={commandCenterItems} />
      </div>
      <div className="warehouse-mock-barcode-safety">
        <strong>Pilot Sonrası Geri Bildirim</strong>
        <ul>
          {feedbackItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
