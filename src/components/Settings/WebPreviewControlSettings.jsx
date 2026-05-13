const webPreviewStatusRows = [
  { label: "Web önizleme linki", value: "GitHub Pages" },
  { label: "Beklenen sürüm", value: "v5.0.0+" },
  { label: "Yayın tipi", value: "Statik önizleme" },
  { label: "Canlı veri", value: "Kapalı" },
  { label: "Yerel build", value: "Ayrı kontrol edilmeli" },
  { label: "Cache kontrolü", value: "Gizli sekme / ?v= parametresi" },
];

const pagesChecklist = [
  "Repo Settings > Pages alanında Source: GitHub Actions seçili olmalı.",
  "Actions sekmesinde Deploy static ERP preview workflow'u çalışmış olmalı.",
  "Workflow build adımı başarılı olmalı.",
  "Deploy adımı başarılı olmalı.",
  "Açılan web linkinde sol menüde güncel sürüm rozeti görünmeli.",
  "Eski sürüm görünürse cache kırmak için ?v=5.0 veya gizli sekme denenmeli.",
];

const webTestLinks = [
  "https://melihsnyldzz-ui.github.io/melisa-bebe-erp/",
  "https://melihsnyldzz-ui.github.io/melisa-bebe-erp/?v=5.0",
  "https://melihsnyldzz-ui.github.io/melisa-bebe-erp/?cache=clear",
];

const versionConsistencyChecks = [
  "Ayarlar sayfasındaki sürüm rozeti güncel mi?",
  "Bu Sürümde Yenilenen Alanlar paneli güncel mi?",
  "El Terminali ekranında Hazır / Beklet Karar Merkezi görünüyor mu?",
  "Test Günü Tek Sayfa Özet Paneli görünüyor mu?",
  "Mock Barkod Test Alanı ve Barkod Kalite Durumu aynı sayfada mı?",
  "Webde görünen sürüm local main ile aynı mı?",
];

const publishDecisionItems = [
  "Webde eski sürüm görünüyorsa: Pages workflow tekrar çalıştırılır.",
  "Workflow hiç görünmüyorsa: Pages Source ayarı kontrol edilir.",
  "Build hatası varsa: kod değil önce workflow logu incelenir.",
  "Web sürümü güncelse: test linki ekibe gönderilebilir.",
  "Gerçek şirket testi başlamadan önce local build ayrıca doğrulanır.",
];

function InfoCard({ title, items }) {
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

export default function WebPreviewControlSettings() {
  return (
    <section className="settings-card system-health-settings section-updated-highlight" id="settings-web-preview-control">
      <div className="settings-card-header">
        <div>
          <h2>Web Önizleme Kontrol Paneli</h2>
          <p>GitHub Pages üzerinden açılan ERP önizlemesinin güncel sürümü gösterip göstermediğini kontrol etmek için pasif rehber.</p>
        </div>
      </div>

      <div className="system-health-grid">
        {webPreviewStatusRows.map((row) => (
          <article className="system-health-status-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </article>
        ))}
      </div>

      <div className="system-health-card-grid">
        <InfoCard title="v5.1 GitHub Pages Yayın Kontrolü" items={pagesChecklist} />
        <InfoCard title="v5.2 Web Test Linkleri" items={webTestLinks} />
        <InfoCard title="v5.3 Web / Local Sürüm Uyumu" items={versionConsistencyChecks} />
        <InfoCard title="v5.4 Yayın Karar Akışı" items={publishDecisionItems} />
      </div>
    </section>
  );
}
