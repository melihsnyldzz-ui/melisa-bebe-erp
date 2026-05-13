const readOnlySqlUserItems = [
  "Şirket ortamında ayrı bir read-only SQL kullanıcısı hazırlanır.",
  "sa veya tam yetkili kullanıcı ile pilot başlatılmaz.",
  "Kullanıcı sadece stok okuma senaryosu için kullanılır.",
  "İlk test yalnızca stok ekranı ve 20 satır sınırıyla yapılır.",
  "Kullanıcı adı/şifre repoya veya ekrana yazılmaz.",
  "Yetki yetersizse pilot bekletilir.",
];

const envLocalPlacementItems = [
  ".env.local sadece şirket bilgisayarında tutulur.",
  ".env.local Git'e eklenmez.",
  "Bağlantı bilgisi ekranlarda gösterilmez.",
  "Hata mesajlarında bağlantı bilgisi görünmemeli.",
  "Web önizleme ortamında gerçek bağlantı bilgisi kullanılmaz.",
  "Bağlantı testi manuel onay olmadan başlatılmaz.",
];

const firstTwentyRowsItems = [
  "Uygulama açılır.",
  "Vega Stok Read-only ekranına gidilir.",
  "Manuel stok önizleme butonu kullanılır.",
  "Maksimum 20 satır kontrol edilir.",
  "Stok kodu, ürün adı, barkod, marka, beden, renk ve miktar alanları gözle incelenir.",
  "Eksik veya anlaşılmayan alanlar sistem dışı not alınır.",
  "Hata varsa test durdurulur.",
];

const resultEvaluationItems = [
  "20 satırdan fazla veri geldiyse beklet.",
  "Stok dışı veri göründüyse beklet.",
  "Hata mesajında bağlantı bilgisi görünürse beklet.",
  "Stok kodu ve ürün adı okunabiliyorsa olumlu.",
  "Barkod alanı doğru görünüyorsa terminal entegrasyonu için hazır adaydır.",
  "Eksikler az ve anlaşılırsa sınırlı read-only pilot devam edebilir.",
];

const strictStopItems = [
  "Veri yazma belirtisi",
  "Import / export / sync isteği",
  "Cari, sipariş, kasa veya finans verisi görünmesi",
  "Otomatik bağlantı denemesi",
  "20 satır limitinin aşılması",
  "Connection bilgisinin ekranda/logda görünmesi",
];

const companyComputerTestDayItems = [
  "Test şirket bilgisayarında yapılır.",
  "Local build veya web sürümü önceden doğrulanmış olmalı.",
  "Read-only kullanıcı hazır olmadan test başlatılmaz.",
  "Test sırasında yalnızca stok ekranı kullanılır.",
  "Testi başlatacak ve durduracak kişi belli olur.",
  "Sonuçlar sistem dışı tek rapor listesinde toplanır.",
];

const operatorReportFormatItems = [
  "Test tarihi:",
  "Testi yapan kişi:",
  "Görülen satır sayısı:",
  "Stok kodu okunuyor mu?",
  "Ürün adı okunuyor mu?",
  "Barkod alanı anlaşılır mı?",
  "Eksik/anlaşılmayan kolonlar:",
  "Genel sonuç: Hazır / Beklet / Dur",
];

const realStockReadyHoldItems = [
  "20 satır ve yalnızca stok geldiyse: Hazır adayı.",
  "Stok kodu/ürün adı boşsa: Beklet.",
  "Barkod alanı yoksa: Terminal entegrasyonu beklet.",
  "Stok dışı veri görünürse: Dur.",
  "Hata mesajında bağlantı bilgisi görünürse: Dur.",
  "Eksikler yönetilebilir düzeydeyse: sınırlı read-only pilot devam edebilir.",
];

const terminalIntegrationPrereqItems = [
  "Read-only stok testi başarılı olmalı.",
  "Barkod alanı doğru ve anlaşılır görünmeli.",
  "Terminal mock testinde leading zero korunmuş olmalı.",
  "Duplicate uyarısı beklenen şekilde çalışmalı.",
  "Depo tek akış anlaşılmış olmalı.",
  "İlk terminal entegrasyonu yalnızca görüntüleme amaçlı planlanmalı.",
];

const finalSqlPrepCheckItems = [
  "Read-only kullanıcı şirket bilgisayarında hazır mı?",
  "Kullanıcı tam yetkili değil mi?",
  ".env.local sadece şirket bilgisayarında mı?",
  "Bağlantı bilgisi repo, ekran veya log içinde görünmüyor mu?",
  "Testi başlatacak kişi belli mi?",
  "Dur kararını verecek kişi belli mi?",
];

const firstRealTestGateItems = [
  "Web ve local sürüm aynı olmalı.",
  "Build başarılı olmalı.",
  "Read-only kullanıcı doğrulanmış olmalı.",
  "İlk deneme sadece manuel başlatılmalı.",
  "İlk deneme sadece stok ve 20 satır olmalı.",
  "Bu şartlar sağlanmadan test başlatılmaz.",
];

const firstStockErrorScenarios = [
  "Bağlantı kurulamazsa: beklet ve ayarları kontrol et.",
  "Yetki hatası varsa: kullanıcı yetkisini kontrol et.",
  "20 satırdan fazla veri gelirse: dur.",
  "Stok dışı kolon görünürse: dur.",
  "Barkod alanı boşsa: terminal entegrasyonu beklet.",
  "Hata mesajı hassas bilgi içeriyorsa: dur ve mesajı sadeleştir.",
];

const postTestTerminalDecisionItems = [
  "Stok kodu, ürün adı ve barkod alanı okunuyorsa terminal entegrasyonu planlanabilir.",
  "Barkod alanı yoksa terminal entegrasyonu bekletilir.",
  "Depo tek akış anlaşılmadıysa eğitim tekrarlanır.",
  "Read-only testte hata çoksa entegrasyon başlamaz.",
  "İlk entegrasyon yalnızca barkoddan stok görüntüleme hedefiyle yapılır.",
];

const fieldExecutionFlowItems = [
  "Test başlamadan önce herkes görevi tekrar eder.",
  "Tek kişi uygulamada manuel stok önizlemeyi başlatır.",
  "Bir kişi sadece satır sayısını kontrol eder.",
  "Bir kişi stok kodu, ürün adı ve barkod alanlarını okur.",
  "Bir kişi eksikleri sistem dışı rapor formatına yazar.",
  "Dur kuralı oluşursa test aynı anda durdurulur.",
];

const observationNoteItems = [
  "Kaç satır geldi?",
  "Stok dışı alan var mı?",
  "Stok kodu dolu mu?",
  "Ürün adı anlaşılır mı?",
  "Barkod alanı dolu ve okunur mu?",
  "Ekran depo personeli için anlaşılır mı?",
  "Hata varsa hassas bilgi içeriyor mu?",
];

const stopRollbackItems = [
  "Test durursa yeni deneme yapılmaz.",
  "Sayfa yenilenir ama veri yazma işlemi aranmaz.",
  "Hata metni ekran görüntüsü yerine manuel özetlenir.",
  "Connection bilgisi görünürse paylaşılmaz ve test kapatılır.",
  "Bir sonraki adım için sadece eksik kategori yazılır.",
];

const nextTerminalPilotItems = [
  "Read-only stok testi temizse barkod alanı terminalle eşleştirilebilir.",
  "İlk terminal pilotu sadece okutulan barkoddan stok görüntüleme olur.",
  "Ürün bilgisi gösterilir ama kayıt yapılmaz.",
  "Depo personeli sadece doğru ürün görünüyor mu diye bakar.",
  "Yanlış eşleşme varsa terminal pilotu durur ve eşleşme alanı tekrar incelenir.",
];

function PrepCard({ title, items }) {
  return (
    <article className="system-health-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export default function ReadOnlyStockPrepSettings() {
  return (
    <section className="settings-card system-health-settings section-updated-highlight" id="settings-readonly-stock-prep">
      <div className="settings-card-header">
        <div>
          <h2>Read-only Stok Test Hazırlığı</h2>
          <p>Şirket ortamında yapılacak ilk gerçek stok okuma testi için güvenli hazırlık rehberi. Bu panel bağlantı kurmaz ve veri okumaz.</p>
        </div>
      </div>

      <div className="system-health-grid">
        <article className="system-health-status-card">
          <span>Hazırlık modu</span>
          <strong>Pasif rehber</strong>
        </article>
        <article className="system-health-status-card">
          <span>İlk test kapsamı</span>
          <strong>Stok / 20 satır</strong>
        </article>
        <article className="system-health-status-card">
          <span>Bağlantı tipi</span>
          <strong>Read-only</strong>
        </article>
        <article className="system-health-status-card">
          <span>Veri yazma</span>
          <strong>Kapalı</strong>
        </article>
      </div>

      <div className="system-health-card-grid">
        <PrepCard title="v7.1 Read-only SQL Kullanıcısı Hazırlığı" items={readOnlySqlUserItems} />
        <PrepCard title="v7.2 .env.local Güvenli Yerleşim" items={envLocalPlacementItems} />
        <PrepCard title="v7.3 İlk 20 Satır Stok Testi Planı" items={firstTwentyRowsItems} />
        <PrepCard title="v7.4 Stok Testi Sonuç Değerlendirme" items={resultEvaluationItems} />
        <PrepCard title="v7.5 Şirket Bilgisayarı Test Günü Kontrol Kartı" items={companyComputerTestDayItems} />
        <PrepCard title="v7.6 Read-only Test Operatör Rapor Formatı" items={operatorReportFormatItems} />
        <PrepCard title="v7.7 İlk Gerçek Stok Testi Hazır / Beklet Kararı" items={realStockReadyHoldItems} />
        <PrepCard title="v7.8 Terminal Entegrasyonuna Geçiş Ön Şartları" items={terminalIntegrationPrereqItems} />
        <PrepCard title="v7.9 Şirket SQL Hazırlığı Son Kontrol" items={finalSqlPrepCheckItems} />
        <PrepCard title="v8.0 İlk Gerçek Read-only Test Başlatma Kapısı" items={firstRealTestGateItems} />
        <PrepCard title="v8.1 İlk Stok Testi Hata Senaryoları" items={firstStockErrorScenarios} />
        <PrepCard title="v8.2 Test Sonrası Terminal Entegrasyon Kararı" items={postTestTerminalDecisionItems} />
        <PrepCard title="v8.3 Read-only Saha Testi Yürütme Akışı" items={fieldExecutionFlowItems} />
        <PrepCard title="v8.4 Test Gözlem Notları" items={observationNoteItems} />
        <PrepCard title="v8.5 Durma ve Geri Alma Prosedürü" items={stopRollbackItems} />
        <PrepCard title="v8.6 Sonraki Terminal Pilot Planı" items={nextTerminalPilotItems} />
        <PrepCard title="Kesin Dur Kuralları" items={strictStopItems} />
      </div>
    </section>
  );
}
