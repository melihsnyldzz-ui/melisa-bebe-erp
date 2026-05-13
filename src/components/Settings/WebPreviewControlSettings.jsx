const webPreviewStatusRows = [
  { label: "Web önizleme linki", value: "GitHub Pages" },
  { label: "Beklenen sürüm", value: "v6.2.0" },
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
  "Eski sürüm görünürse cache kırmak için ?v=6.2 veya gizli sekme denenmeli.",
];

const webTestLinks = [
  "https://melihsnyldzz-ui.github.io/melisa-bebe-erp/",
  "https://melihsnyldzz-ui.github.io/melisa-bebe-erp/?v=6.2",
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

const homeQuickCheckItems = [
  "Web linki açılınca sol menüde sürüm rozeti görünmeli.",
  "Ayarlar sayfasına girilip Web Önizleme Kontrol Paneli kontrol edilmeli.",
  "El Terminali ekranına geçilip Mock Barkod Test Alanı açılmalı.",
  "0001234567890 örneğiyle leading zero kontrol edilmeli.",
  "Aynı barkod tekrar girilerek duplicate uyarısı kontrol edilmeli.",
  "Hazır / Beklet Karar Merkezi görünüyorsa web önizleme kabul edilebilir.",
];

const oldVersionFixItems = [
  "Önce gizli sekmede web linki açılır.",
  "Sonra ?v=6.2 parametreli link denenir.",
  "Hâlâ eski görünüyorsa Actions > Pages workflow tekrar çalıştırılır.",
  "Workflow başarılı ama eski görünüyorsa tarayıcı cache temizlenir.",
  "Ayarlar sayfasındaki sürüm rozeti son kontrol olarak okunur.",
];

const sourceCompareItems = [
  "GitHub main: appVersion.js sürümü kontrol edilir.",
  "GitHub Pages: webde görünen sürüm kontrol edilir.",
  "Local: npm run build sonrası açılan sürüm kontrol edilir.",
  "Üçü aynıysa pilot öncesi web kontrol tamamdır.",
  "Fark varsa önce web/cache/deploy sırası incelenir.",
];

const technicalReadinessItems = [
  "Web linki güncel sürümü gösteriyor.",
  "Local build ayrı doğrulanacak.",
  "Ayarlar ve El Terminali ekranları açılıyor.",
  "Web önizleme sadece mock/statik kontrol için kullanılıyor.",
  "Gerçek şirket testinden önce read-only stok testi ayrıca planlanacak.",
];

const webNoteDesignItems = [
  "Webden kontrol eden kişi ekran adını yazar.",
  "Gördüğü sürümü not eder.",
  "Eksik görünen panel varsa başlığını yazar.",
  "Barkod testindeki sonucu Geçti / Uyarı / Dur olarak not eder.",
  "Notlar sistem dışında tek listede toplanır.",
];

const pilotFeedbackItems = [
  "Ayarlar sayfası anlaşılır mı?",
  "El Terminali ekranı ilk bakışta kalabalık mı?",
  "Mock barkod testi kolay anlaşılıyor mu?",
  "Hazır / Beklet kararı yeterince net mi?",
  "Web önizleme linki ekip için kullanılabilir mi?",
  "Şirket testinden önce hangi ekran sadeleşmeli?",
];

const managerWebSummaryItems = [
  "Webde güncel sürüm görünüyor.",
  "Ayarlar ve El Terminali ekranları kontrol edilebilir.",
  "Saha eğitimi için hızlı kartlar hazır.",
  "Hazır / Beklet kararı ekranda görünüyor.",
  "Local build ve şirket testi ayrıca yapılacak.",
];

const postPreviewDecisionItems = [
  "Webde v6.2 görünüyorsa önizleme kabul edilir.",
  "Ekip ekranları okuyabiliyorsa eğitim aşamasına geçilir.",
  "El Terminali ekranı karışık gelirse sadeleştirme paketi açılır.",
  "Ayarlar sayfası yeterliyse web kontrol paneli sabit bırakılır.",
  "Local build tamamlanmadan şirket pilotu başlamaz.",
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
        <InfoCard title="v5.5 Web Ana Sayfa Hızlı Kontrol" items={homeQuickCheckItems} />
        <InfoCard title="v5.6 Eski Sürüm Görünürse" items={oldVersionFixItems} />
        <InfoCard title="v5.7 Yayın / Local / GitHub Karşılaştırması" items={sourceCompareItems} />
        <InfoCard title="v5.8 Pilot Öncesi Teknik Hazırlık" items={technicalReadinessItems} />
        <InfoCard title="v5.9 Web Üzerinden Test Notu Toplama Tasarımı" items={webNoteDesignItems} />
        <InfoCard title="v6.0 Pilot Test Geri Bildirim Paneli" items={pilotFeedbackItems} />
        <InfoCard title="v6.1 Yönetici Web Kontrol Özeti" items={managerWebSummaryItems} />
        <InfoCard title="v6.2 Web Önizleme Sonrası Pilot Karar Paneli" items={postPreviewDecisionItems} />
      </div>
    </section>
  );
}
