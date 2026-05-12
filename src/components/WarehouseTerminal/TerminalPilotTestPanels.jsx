const erpTerminalStartConditions = [
  "ERP stok read-only 20 satır testi başarılı olmalı.",
  "Read-only kullanıcı hazır olmalı.",
  "El terminali barkodu temiz okuyabilmeli.",
  "Leading zero korunmalı.",
  "Suffix/boşluk problemi çözülmüş olmalı.",
  "Duplicate guard çalışmalı.",
  "Stok dışı modüller kapalı kalmalı.",
];

const erpTerminalTestSequence = [
  "Önce ERP stok read-only ekranı açılır.",
  "Manuel 20 satır stok testi yapılır.",
  "Sonra el terminali mock barkod ekranında barkod okutulur.",
  "Barkod normalize sonucu kontrol edilir.",
  "Sonra entegrasyon için hangi alanların eşleşeceği not edilir.",
  "Gerçek bağlantı ayrı şirket ortamı fazına bırakılır.",
];

const erpTerminalMatchingFields = ["Barkod", "Stok kodu", "Ürün adı", "Marka", "Beden", "Renk", "Stok miktarı"];

const erpTerminalStopRules = [
  "Otomatik bağlantı başlarsa dur.",
  "Stok dışı veri görünürse dur.",
  "Veri yazma ihtimali varsa dur.",
  "Barkod başındaki sıfır kaybolursa dur.",
  "Duplicate okutma hatalı sonuç verirse dur.",
  "Bağlantı bilgisi ekranda/logda görünürse dur.",
];

const companyPreTestItems = [
  "Read-only kullanıcı hazır.",
  "Yedek alındı.",
  "Bağlantı bilgisi repoda yok.",
  "Uygulama açılışta otomatik bağlanmıyor.",
  "Testi yapacak kişi belli.",
  "Testi durduracak kişi belli.",
];

const companyRealTestSequence = [
  "Uygulamayı aç.",
  "Stok read-only ekranına git.",
  "Güvenlik kapısını kontrol et.",
  "Manuel stok önizleme butonuna bas.",
  "Maksimum 20 satır sonucu kontrol et.",
  "Stok kodu, ürün adı, barkod, marka, beden, renk, miktar alanlarını kontrol et.",
  "Eksikleri sistem dışı manuel not al.",
  "Hata varsa dur.",
];

const terminalSeparateTestSequence = [
  "Mock barkod ekranını aç.",
  "Honeywell/el terminali ile barkod okut.",
  "Leading zero korunuyor mu kontrol et.",
  "Sonda boşluk/suffix temizleniyor mu kontrol et.",
  "Duplicate guard çalışıyor mu kontrol et.",
  "Gerçek stok aramasına geçme.",
];

const combinedTestEntryConditions = [
  "ERP 20 satır stok testi başarılı.",
  "Terminal barkod kalite testi başarılı.",
  "Read-only kullanıcı doğrulandı.",
  "Stok dışı veri görünmedi.",
  "Hassas bilgi görünmedi.",
  "Veri yazma yok.",
];

const companyStopRules = [
  "20 satırdan fazla veri gelirse dur.",
  "Stok dışı veri gelirse dur.",
  "Hata mesajında bağlantı bilgisi görünürse dur.",
  "Yazma/import/export/sync belirtisi varsa dur.",
  "Top 100 veya metadata otomatik çalışırsa dur.",
];

const terminalMockImprovements = [
  "Operatör önce Mock Barkod Test Alanı'na odaklanır.",
  "Barkod kalite sonucu Dur ise test tekrarlanır.",
  "Uyarı varsa barkod tekrar okutulur ve sonuç not alınır.",
  "Geçti sonucu alınmadan birlikte test planına geçilmez.",
  "Sonuçlar sadece ekranda geçici olarak değerlendirilir.",
];

const passiveBridgeDesign = [
  "Barkod normalize sonucu ileride read-only stok arama anahtarı olur.",
  "İlk eşleşme alanı barkod olmalı; stok kodu ikinci kontrol alanı olmalı.",
  "Ürün adı, marka, beden, renk ve miktar sadece görüntüleme alanı olmalı.",
  "Eşleşme bulunamazsa kullanıcıya yazma işlemi olmadan uyarı gösterilmeli.",
  "Bu sürüm köprü tasarımıdır; gerçek arama veya endpoint eklemez.",
];

const pilotStartGate = [
  "Read-only kullanıcı hazır değilse pilot başlamaz.",
  "ERP 20 satır testi başarılı değilse pilot başlamaz.",
  "Terminal kalite sonucu Geçti değilse pilot başlamaz.",
  "Stok dışı veri gerekiyorsa pilot başlamaz.",
  "Yazma/import/export/sync ihtiyacı varsa pilot başlamaz.",
  "Tüm şartlar sağlanırsa yalnızca görüntüleme amaçlı sınırlı pilot başlar.",
];

const feedbackPlanItems = [
  "Depo kullanıcısı hangi barkodlarda zorlandı?",
  "Başındaki sıfır kaybı görüldü mü?",
  "Duplicate uyarısı doğru zamanda geldi mi?",
  "ERP stok ekranında anlaşılmayan kolon var mı?",
  "Ürün eşleşmesi beklenen şekilde okunabildi mi?",
  "Hata halinde durma kuralı uygulandı mı?",
  "Bir sonraki faz için en kritik eksik ne?",
];

function ChecklistCard({ title, items }) {
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

export default function TerminalPilotTestPanels() {
  return (
    <>
      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-terminal-next-roadmap">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Terminal ve ERP Pilot Yol Haritası</h2>
            <p>Mock testten şirket pilotuna geçişi dört güvenli adımda gösterir; bağlantı başlatmaz ve kayıt tutmaz.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <ChecklistCard title="v2.8 Mock Kullanım İyileştirme" items={terminalMockImprovements} />
          <ChecklistCard title="v2.9 Barkoddan Stok Köprüsü Tasarımı" items={passiveBridgeDesign} />
          <ChecklistCard title="v3.0 Pilot Başlatma Kapısı" items={pilotStartGate} />
          <ChecklistCard title="v3.1 Pilot Sonrası Geri Bildirim" items={feedbackPlanItems} />
        </div>
      </section>

      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-erp-terminal-test-plan">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>ERP + El Terminali Test Planı</h2>
            <p>Gerçek entegrasyon yapmadan, ERP stok read-only ekranı ile mock barkod ekranının birlikte hangi sırayla test edileceğini gösterir.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <ChecklistCard title="Birlikte Teste Başlama Şartları" items={erpTerminalStartConditions} />
          <ChecklistCard title="Test Sırası" items={erpTerminalTestSequence} />
          <ChecklistCard title="Eşleşecek Alanlar" items={erpTerminalMatchingFields} />
          <ChecklistCard title="Stop / Dur Kuralları" items={erpTerminalStopRules} />
        </div>
      </section>

      <section className="table-panel warehouse-mock-barcode-panel section-updated-highlight" id="warehouse-company-first-real-test-checklist">
        <div className="section-heading warehouse-quality-heading">
          <div>
            <h2>Şirket Ortamı İlk Gerçek Test Checklisti</h2>
            <p>Şirkette yapılacak ilk gerçek read-only stok testi için pasif kontrol listesidir; bağlantı kurmaz, veri okumaz ve kayıt tutmaz.</p>
          </div>
        </div>
        <div className="warehouse-mock-barcode-layout">
          <ChecklistCard title="Test Başlamadan Önce" items={companyPreTestItems} />
          <ChecklistCard title="İlk Gerçek Test Sırası" items={companyRealTestSequence} />
          <ChecklistCard title="Terminal Ayrı Test Sırası" items={terminalSeparateTestSequence} />
          <ChecklistCard title="Birlikte Teste Geçme Şartı" items={combinedTestEntryConditions} />
        </div>
        <div className="warehouse-mock-barcode-safety">
          <strong>Stop / Dur</strong>
          <ul>
            {companyStopRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
