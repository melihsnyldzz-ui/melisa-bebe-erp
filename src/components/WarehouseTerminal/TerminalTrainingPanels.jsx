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

const resultReadingGuide = [
  "Geçti: Mock barkod davranışı beklenen düzeyde.",
  "Uyarı: Barkod tekrar okutulmalı ve not alınmalı.",
  "Dur: Test akışı bekletilmeli ve sebep yazılmalı.",
  "Boş barkod veya rakam dışı karakter varsa ürün eşleştirme düşünülmemeli.",
  "Duplicate uyarısı varsa aynı ürün tekrar okutulmadan önce kontrol edilmeli.",
];

const depotIssueNoteFormat = [
  "Barkod:",
  "Ürün / raf bilgisi:",
  "Görülen durum: Geçti / Uyarı / Dur",
  "Personel notu:",
  "Yönetici kontrolü gerekiyor mu?",
  "Bir sonraki deneme sonucu:",
];

const managerDecisionPanel = [
  "Mock test başarılıysa şirket test günü planına geçilebilir.",
  "Depo notları yoğun ise önce eğitim tekrarlanır.",
  "Barkod kalite sorunu varsa terminal ayarları tekrar gözden geçirilir.",
  "ERP stok ekranı anlaşılmıyorsa kolon açıklamaları sadeleştirilir.",
  "Tüm notlar temizse sınırlı görüntüleme pilotu planlanır.",
];

const finalDaySummary = [
  "Test sorumlusu belli mi?",
  "Depo personeli hangi ekrana bakacağını biliyor mu?",
  "Hazır barkod senaryoları denendi mi?",
  "Kalite sonucu nasıl okunacak anlatıldı mı?",
  "Notlar sistem dışında tek listede toplanacak mı?",
  "Gün sonu karar toplantısı yapılacak mı?",
];

const finalSimplificationItems = [
  "İlk bakışta sadece mock barkod alanı, kalite sonucu ve eğitim merkezi takip edilir.",
  "Detaylı yol haritası ve karar merkezi ikinci sırada okunur.",
  "Operatöre tek hedef verilir: barkodu okut, kalite sonucunu oku, not al.",
  "Yöneticiye tek hedef verilir: Geçti/Uyarı/Dur sonuçlarına göre karar ver.",
  "Teknik ekip sadece izler ve sistem dışı not toplar.",
];

const scenarioCardItems = [
  "Senaryo 1: Normal barkod okut ve Geçti sonucunu kontrol et.",
  "Senaryo 2: Başında sıfır olan barkod okut ve sıfırın korunduğunu kontrol et.",
  "Senaryo 3: Kısa barkod okut ve Uyarı/Dur sonucunu kontrol et.",
  "Senaryo 4: Uzun barkod okut ve uyarıyı not al.",
  "Senaryo 5: Aynı barkodu tekrar okut ve duplicate uyarısını kontrol et.",
];

const managerOnePageSummary = [
  "Bugünkü amaç: terminal barkod davranışını ve ERP stok ekranı anlaşılabilirliğini görmek.",
  "Başarı ölçüsü: depo personeli kalite sonucunu doğru okuyabiliyor.",
  "Kritik karar: pilot devam mı, eğitim tekrar mı, ekran sadeleştirme mi?",
  "Saha notları tek listede toplanır.",
  "Bir sonraki faz yalnızca notlar temizse açılır.",
];

const roleResponsibilityItems = [
  "Depo personeli: barkodu okutur ve gördüğü sonucu söyler.",
  "Yönetici: karar paneline göre devam/tekrar/sadeleştirme kararını verir.",
  "Teknik kişi: ekran davranışını izler ve not alır.",
  "Test sorumlusu: akışı başlatır ve gerekirse durdurur.",
  "Patron: gün sonu tek karar listesini görür.",
];

const sectionOrderItems = [
  "1. Mock Barkod Test Alanı",
  "2. Barkod Kalite Durumu",
  "3. Terminal Eğitim ve Prova Merkezi",
  "4. Test Sonucu ve Karar Merkezi",
  "5. ERP + El Terminali Test Planı",
  "6. Şirket Ortamı İlk Gerçek Test Checklisti",
];

const staffQuickCardItems = [
  "Barkodu okut.",
  "Kalite sonucunu oku.",
  "Geçti ise devam et.",
  "Uyarı ise tekrar okut.",
  "Dur ise test sorumlusuna haber ver.",
  "Anlaşılmayan ürünü sistem dışı not al.",
];

const managerQuickDecisionItems = [
  "Depo personeli kalite sonucunu okuyabiliyor mu?",
  "Başındaki sıfır korunuyor mu?",
  "Duplicate uyarısı doğru çalışıyor mu?",
  "ERP stok ekranı anlaşılır mı?",
  "Notlar az ve netse pilot devam eder.",
  "Notlar yoğun ise önce eğitim veya ekran sadeleştirme yapılır.",
];

const onePageTestSummaryItems = [
  "Amaç: terminal barkod davranışını ve ERP stok ekranını birlikte gözlemlemek.",
  "Kapsam: mock barkod, kalite sonucu, 20 satır stok kontrolü ve manuel notlar.",
  "Başarı ölçüsü: depo kullanıcısı ekrandaki sonucu doğru yorumlar.",
  "Durdurma sebebi: belirsiz barkod, yanlış yorum, yoğun hata notu veya anlaşılmayan stok alanı.",
  "Gün sonu çıktı: devam / eğitim tekrar / ekran sadeleştirme / teknik kontrol kararı.",
];

const localBuildPrecheckItems = [
  "Git pull sonrası uygulama açılmadan önce npm run build çalıştırılır.",
  "Build hatası varsa yeni ekran testi yapılmaz.",
  "Sadece mevcut büyük chunk uyarısı kabul edilebilir.",
  "El Terminali ve Barkod Operasyon Merkezi sayfası ilk kontrol ekranıdır.",
  "Package sürümü farklı görünürse appVersion ekranı esas alınır.",
];

const orderedScreenTestItems = [
  "1. Sol menüden El Terminali ekranını aç.",
  "2. Mock Barkod Test Alanı'nı kontrol et.",
  "3. Barkod Kalite Durumu panelini kontrol et.",
  "4. Test Günü Tek Sayfa Özet Paneli'ni oku.",
  "5. Terminal Pilot Final Sadeleştirme Merkezi'ni oku.",
  "6. ERP + El Terminali Test Planı'nı kontrol et.",
  "7. Şirket Ortamı İlk Gerçek Test Checklisti'ni son kontrol olarak oku.",
];

const readyHoldDecisionItems = [
  "Build başarılıysa ve ekranlar görünüyorsa: Hazır.",
  "Barkod kalite paneli görünmüyorsa: Beklet.",
  "Mock barkod sonucu başındaki sıfırı korumuyorsa: Beklet.",
  "Duplicate uyarısı çalışmıyorsa: Beklet.",
  "Depo personeli akışı anlamıyorsa: Eğitim tekrar.",
  "Yönetici karar veremiyorsa: Tek sayfa özet sadeleştirilsin.",
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
    <>
      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-ready-hold-decision-center">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Şirket Pilot Hazır / Beklet Karar Merkezi</h2>
            <p>Local build sonrası ekran kontrolünde hazır mı beklet mi kararını tek yerde toplar.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <TrainingCard title="v4.8 Local Build Öncesi Son Kontrol" items={localBuildPrecheckItems} />
          <TrainingCard title="v4.9 Test Edilecek Ekranlar Sırası" items={orderedScreenTestItems} />
          <TrainingCard title="v5.0 Hazır / Beklet Kararı" items={readyHoldDecisionItems} />
          <TrainingCard title="Test Günü Tek Sayfa Özeti" items={onePageTestSummaryItems} />
        </div>
      </section>

      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-one-page-test-summary">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Test Günü Tek Sayfa Özet Paneli</h2>
            <p>Depo, yönetici ve teknik ekip için test gününde okunacak en kısa akışı tek yerde toplar.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <TrainingCard title="v4.4 Ekran Bölüm Sıralaması" items={sectionOrderItems} />
          <TrainingCard title="v4.5 Depo Hızlı Kullanım Kartı" items={staffQuickCardItems} />
          <TrainingCard title="v4.6 Yönetici Hızlı Karar Kartı" items={managerQuickDecisionItems} />
          <TrainingCard title="v4.7 Test Günü Tek Sayfa Özeti" items={onePageTestSummaryItems} />
        </div>
      </section>

      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-terminal-final-simplification-center">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Terminal Pilot Final Sadeleştirme Merkezi</h2>
            <p>Test günü ekranda kimin neye bakacağını sadeleştirir ve rol bazlı takip akışını görünür yapar.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <TrainingCard title="v4.0 Final Sadeleştirme" items={finalSimplificationItems} />
          <TrainingCard title="v4.1 Barkod Senaryo Kartları" items={scenarioCardItems} />
          <TrainingCard title="v4.2 Yönetici Tek Sayfa Özeti" items={managerOnePageSummary} />
          <TrainingCard title="v4.3 Roller ve Sorumluluklar" items={roleResponsibilityItems} />
        </div>
      </section>

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

      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-terminal-final-control-center">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Terminal Test Sonucu ve Karar Merkezi</h2>
            <p>Test sonucunun nasıl okunacağını, depo hata notlarının nasıl yazılacağını ve yöneticinin nasıl karar vereceğini özetler.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <TrainingCard title="v3.6 Test Sonucu Okuma Rehberi" items={resultReadingGuide} />
          <TrainingCard title="v3.7 Depo Hata Notları Formatı" items={depotIssueNoteFormat} />
          <TrainingCard title="v3.8 Yönetici Pilot Karar Paneli" items={managerDecisionPanel} />
          <TrainingCard title="v3.9 Şirket Test Günü Son Kontrol" items={finalDaySummary} />
        </div>
      </section>
    </>
  );
}
