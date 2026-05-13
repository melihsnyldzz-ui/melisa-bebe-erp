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
        <PrepCard title="Kesin Dur Kuralları" items={strictStopItems} />
      </div>
    </section>
  );
}
