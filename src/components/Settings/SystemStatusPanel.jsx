import { ShieldCheck } from "lucide-react";
import ReleaseHighlightsPanel from "../Common/ReleaseHighlightsPanel.jsx";
import { APP_STAGE, APP_VERSION } from "../../config/appVersion.js";
import {
  currentReleaseVersion,
  releaseHighlightsByPage,
} from "../../config/releaseHighlights.js";

const settingsReleaseHighlights = releaseHighlightsByPage.settings;
const updatedSectionIds = settingsReleaseHighlights.updatedSectionIds;

const statusRows = [
  { label: "Uygulama sürümü", value: APP_VERSION },
  { label: "Geliştirme aşaması", value: APP_STAGE },
  { label: "Build kontrolü", value: "GitHub Actions" },
  { label: "Çalışma modu", value: "Güvenli geliştirme modu" },
  { label: "Kritik işlem politikası", value: "Stok, cari, fiş, yedekleme, import ve migration işlemleri ayrı kontrollü sürümlerle açılır." },
  { label: "El terminali hazırlığı", value: "Okuma, son okutulanlar, sayım sepeti ve rapor/CSV/JSON önizleme hazır." },
  { label: "Vega geçiş hazırlığı", value: "Kademeli geçiş hazırlığı devam ediyor." },
];

const maturityRows = [
  { label: "ERP genel hazırlık", value: "%72-76" },
  { label: "Canlı kullanım güvenliği", value: "%65-70" },
  { label: "El terminali hazırlığı", value: "%60-65" },
  { label: "Vega'dan geçiş hazırlığı", value: "%58-63" },
];

const goLiveMissingItems = [
  "Gerçek Vega verisiyle karşılaştırmalı ürün/stok testi",
  "Yedek alma ve geri yükleme gerçek test ortamı doğrulaması",
  "Personel ile en az 1 günlük deneme kullanımı",
  "Hatalı işlem geri alma / rollback prosedürü",
  "Vega'dan bağımsız rapor doğrulama",
  "Yetki ve kullanıcı rol testleri",
  "El terminaliyle gerçek barkod/stok sayım testi",
];

const goLiveTestPlanSteps = [
  "1. Gün: Vega ürün/stok verisiyle ekran karşılaştırması",
  "2. Gün: El terminali barkod okutma ve stok sayım denemesi",
  "3. Gün: Satış/alış fişi ekranlarının sadece görüntüleme testi",
  "4. Gün: Rapor ekranlarının Vega çıktılarıyla karşılaştırılması",
  "5. Gün: Personel deneme kullanımı ve hata notlarının toplanması",
];

const vegaComparisonChecklist = [
  "Ürün sayısı Vega ile aynı mı?",
  "Barkodlar doğru eşleşiyor mu?",
  "Stok toplamları Vega ile tutarlı mı?",
  "Cari kart sayısı doğru mu?",
  "Alış/satış fişleri görüntülenebiliyor mu?",
  "Rapor toplamları Vega ile karşılaştırıldı mı?",
  "Hatalı veya eksik kayıtlar not alındı mı?",
];

const vegaComparisonResultTemplate = [
  "Test tarihi:",
  "Testi yapan kişi:",
  "Vega ekranı / raporu:",
  "ERP ekranı / raporu:",
  "Karşılaştırılan kayıt türü:",
  "Vega'daki değer:",
  "ERP'deki değer:",
  "Sonuç: Uyumlu / Fark var / Kontrol edilecek",
  "Not:",
];

const vegaComparisonIssueTemplate = [
  "Ekran adı:",
  "İşlem:",
  "Beklenen sonuç:",
  "Görülen sonuç:",
  "Vega'daki karşılığı:",
  "Tekrar ediyor mu:",
  "Önem seviyesi: Düşük / Orta / Yüksek",
  "Not / ekran görüntüsü:",
];

const liveTestChecklistItems = [
  "Uygulama doğru adresten açıldı mı?",
  "Sol menüde mavi yenilik noktası kontrol edildi mi?",
  "Ayarlar ekranındaki sürüm bilgisi kontrol edildi mi?",
  "Vega karşılaştırma test planı okundu mu?",
  "Test edilecek ekran belirlendi mi?",
  "Veri yazan işlem yapılmayacağı personele söylendi mi?",
  "Hata görülürse ekran görüntüsü alınacağı söylendi mi?",
  "Test sonunda notlar ChatGPT/Codex için hazırlanacak mı?",
];

const staffTrialNotesTemplate = [
  "Personel adı:",
  "Test tarihi:",
  "Test edilen ekran:",
  "Anlaşılan kısımlar:",
  "Zorlanılan kısımlar:",
  "Görülen hata:",
  "Öneri:",
  "Genel değerlendirme:",
];

const goLiveChecklistGroups = [
  {
    title: "Hazır",
    tone: "ready",
    items: [
      "GitHub Actions build kontrolü aktif",
      "El terminali okuma modu hazır",
      "Son okutulanlar geçmişi hazır",
      "Sayım sepeti önizleme hazır",
      "Sayım raporu JSON/CSV önizleme hazır",
      "README ve proje özeti düzenli",
    ],
  },
  {
    title: "Hazırlıkta",
    tone: "progress",
    items: ["Gerçek veriyle uzun test bekleniyor", "Yedekleme / geri yükleme testi bekleniyor", "Rollback senaryosu bekleniyor"],
  },
  {
    title: "Bekliyor",
    tone: "waiting",
    items: ["Personel deneme kullanımı bekleniyor", "Vega karşılaştırmalı doğrulama bekleniyor"],
  },
];

const versionHistoryRows = [
  {
    version: "v1.14.4",
    title: "Yenilik sistemi için sayfa bazlı test ve görünürlük kontrolü",
    area: "Ayarlar / Ortak Bileşen",
    description: "Yenilik paneline görünürlük kontrol listesi eklendi ve Ayarlar sayfası releaseHighlightsByPage settings yapısından beslenecek hale getirildi.",
  },
  {
    version: "v1.14.3",
    title: "Yenilik merkezi panelini tüm sayfalara yaymaya hazırlık",
    area: "Ayarlar / Ortak Bileşen",
    description: "Bu Sürümde Yenilenen Alanlar paneli tekrar kullanılabilir ortak bileşene taşındı ve sayfa bazlı yenilik yapısı için hazırlık eklendi.",
  },
  {
    version: "v1.14.2",
    title: "Yenilik etiketlerini sayfa bazlı merkezi yönetme sistemi",
    area: "Ayarlar",
    description: "Sayfa içi yenilik paneli, YENİ etiketleri ve hızlı geçiş bilgileri merkezi konfigürasyonla yönetilebilir hale getirildi.",
  },
  {
    version: "v1.14.1",
    title: "Sayfa içi yenilik vurgusu, YENİ etiketi ve hızlı geçiş paneli",
    area: "Ayarlar",
    description: "Kullanıcının yeni eklenen alanları kolay bulması için sayfa içi yenilik paneli, YENİ etiketi ve hızlı geçiş linkleri eklendi.",
  },
  {
    version: "v1.14.0",
    title: "Ayarlar ekranı sadeleştirme ve canlı test merkezi düzeni",
    area: "Ayarlar",
    description: "Canlı test, Vega karşılaştırma ve personel deneme alanları Canlı Test Merkezi altında daha düzenli hale getirildi.",
  },
  {
    version: "v1.13.9",
    title: "Canlı test checklist sayfası ve personel deneme notları",
    area: "Ayarlar",
    description: "Personelin canlı test sırasında takip edeceği checklist ve deneme notları şablonu eklendi.",
  },
  {
    version: "v1.13.8",
    title: "Vega karşılaştırma test sonuç şablonu ve hata kayıt formatı",
    area: "Ayarlar",
    description: "Vega karşılaştırma testleri için sonuç şablonu ve hata kayıt formatı eklendi.",
  },
  {
    version: "v1.13.7",
    title: "Canlıya geçiş test planı ve Vega karşılaştırma kontrol listesi",
    area: "Ayarlar",
    description: "Canlıya geçiş öncesi 5 günlük test planı ve Vega karşılaştırma kontrol listesi eklendi.",
  },
];

const liveTestGuideSteps = [
  "Sol menüde mavi nokta olan sayfayı aç.",
  "Ayarlar ekranında Sistem Durumu panelini kontrol et.",
  "Canlıya Hazırlık Kontrol Listesi'ndeki hazır / hazırlıkta / bekliyor maddelerini incele.",
  "Son Sürüm Geçmişi bölümünden bu sürümde ne değiştiğini oku.",
  "Build ve Kalite Durumu kartından build kontrolünün GitHub Actions üzerinden takip edildiğini doğrula.",
  "Eğer değişiklik depo terminaliyle ilgiliyse Depo Terminali ekranında barkod/ürün kodu testini yap.",
  "Veri yazan işlem yoksa sadece ekran kontrolü yap; stok/cari/fiş işlemi deneme.",
  "Hata görürsen ekran adını, yaptığın işlemi ve hata mesajını not al.",
];

const testFeedbackTemplate = ["Ekran:", "Yaptığım işlem:", "Beklenen sonuç:", "Gördüğüm hata:", "Tekrar oluyor mu:", "Not / ekran görüntüsü:"];

function sectionHighlightProps(sectionId) {
  const isUpdated = updatedSectionIds.includes(sectionId);

  return {
    className: isUpdated ? "section-updated-highlight" : undefined,
    id: sectionId,
  };
}

function NewReleaseBadge({ sectionId }) {
  if (!updatedSectionIds.includes(sectionId)) {
    return null;
  }

  return <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>;
}

export default function SystemStatusPanel() {
  return (
    <section className="table-panel settings-panel system-status-panel">
      <div className="section-heading">
        <ShieldCheck size={19} />
        <h2>Sistem Durumu ve Güvenli Mod</h2>
      </div>

      <p className="settings-panel-description">
        Bu ekran, ERP'nin mevcut geliştirme seviyesini ve güvenli kullanım durumunu gösterir. Buradaki bilgiler sadece
        bilgilendirme amaçlıdır; herhangi bir ayar kaydetmez.
      </p>

      <ReleaseHighlightsPanel
        releaseHighlightItems={settingsReleaseHighlights.releaseHighlightItems}
        releaseJumpLinks={settingsReleaseHighlights.releaseJumpLinks}
        testChecklist={settingsReleaseHighlights.testChecklist}
      />

      <div className="system-status-focus-card">
        <span>Bu Sürümde Test Edilecek Alan</span>
        <strong>Ayarlar / Sistem Durumu ve Canlıya Hazırlık Kontrol Listesi</strong>
        <p>Sol menüde mavi nokta görünen sayfa, bu sürümde özellikle kontrol edilmesi gereken alandır.</p>
      </div>

      <div className="build-quality-card">
        <h3>Build ve Kalite Durumu</h3>
        <div className="build-quality-grid">
          <div>
            <span>Build kontrolü</span>
            <strong>GitHub Actions</strong>
          </div>
          <div>
            <span>Lokal kontrol</span>
            <strong>npm run build</strong>
          </div>
          <div>
            <span>Durum notu</span>
            <strong>Build sonucu GitHub Actions üzerinden takip edilir.</strong>
          </div>
        </div>
        <p>
          Build status uygulama içinde görünmüyorsa GitHub Actions ekranından kontrol edilmelidir. Build kontrolü, kodun
          çalıştırılabilir olup olmadığını doğrulamak için kullanılır. Bu bilgi stok, cari veya fiş verilerini değiştirmez.
        </p>
      </div>

      <div className="version-history-panel" {...sectionHighlightProps("latest-version-history")}>
        <div>
          <h3>
            Son Sürüm Geçmişi <NewReleaseBadge sectionId="latest-version-history" />
          </h3>
          <p>
            Bu alan, son sürümlerde hangi bölümde ne değiştiğini gösterir. Sürüm numarası değiştiğinde bu liste de
            güncel tutulmalıdır.
          </p>
        </div>

        <div className="version-history-list">
          {versionHistoryRows.map((row) => (
            <article className="version-history-card" key={row.version}>
              <div>
                <strong>
                  {row.version} · {row.title}
                </strong>
                <span>Alan: {row.area}</span>
              </div>
              <p>Açıklama: {row.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="system-status-grid">
        {statusRows.map((row) => (
          <div className="system-status-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>

      <div className="system-status-maturity" {...sectionHighlightProps("project-maturity")}>
        <h3>
          Proje Olgunluk Bilgisi <NewReleaseBadge sectionId="project-maturity" />
        </h3>
        <div className="system-status-grid">
          {maturityRows.map((row) => (
            <div className="system-status-card" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="go-live-missing-panel">
          <h3>Canlıya Geçiş İçin Eksik Ana Başlıklar</h3>
          <ul>
            {goLiveMissingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Bu liste yalnızca canlıya geçiş hazırlığını takip etmek için hazırlanmıştır. Gerçek veri işlemi veya sistem
            değişikliği yapmaz.
          </p>
        </div>
      </div>

      <div className="live-test-center-panel" {...sectionHighlightProps("live-test-center")}>
        <div>
          <h3>
            Canlı Test Merkezi <NewReleaseBadge sectionId="live-test-center" />
          </h3>
          <p>Canlı test, personel denemesi ve Vega karşılaştırma adımlarını tek merkezden takip edin.</p>
        </div>

        <p className="live-test-center-warning">
          Bu merkez yalnızca manuel test rehberidir. Vega'ya bağlanmaz, veri çekmez, veri yazmaz ve test notlarını
          kaydetmez.
        </p>

        <div className="live-test-center-grid">
          <div className="live-test-guide-panel">
            <div>
              <h3>Canlı Test Rehberi</h3>
              <p>Canlı test sırasında nereden başlayacağınızı ve hangi sırayla kontrol yapacağınızı gösterir.</p>
            </div>

            <ol>
              {liveTestGuideSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <p className="live-test-guide-note">
              Bu rehber test sırasında nereden başlayacağınızı göstermek için hazırlanmıştır. Gerçek veriyle işlem
              yapmadan önce yedekleme ve geri dönüş senaryosu ayrıca test edilmelidir.
            </p>
          </div>

          <div className="live-test-checklist-panel">
            <h3>Canlı Test Checklist</h3>
            <ul>
              {liveTestChecklistItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p>
              Bu alan yalnızca manuel test rehberidir. Personel notlarını kaydetmez, dosya oluşturmaz ve veritabanına
              yazmaz.
            </p>
          </div>

          <div className="staff-trial-notes-panel">
            <h3>Personel Deneme Notları</h3>
            <pre>{staffTrialNotesTemplate.join("\n")}</pre>
          </div>

          <div className="go-live-test-plan-panel">
            <div>
              <h3>Canlıya Geçiş Test Planı</h3>
              <p>Canlı kullanım öncesinde manuel kontrol sırasını 5 günlük sade bir plan olarak takip edin.</p>
            </div>

            <ol>
              {goLiveTestPlanSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <p className="go-live-test-plan-note">
              Bu test planı yalnızca manuel kontrol rehberidir. Vega'ya bağlanmaz, veri çekmez, veri yazmaz ve
              karşılaştırmayı otomatik yapmaz.
            </p>
          </div>

          <div className="vega-comparison-panel">
            <h3>Vega Karşılaştırma Kontrol Listesi</h3>
            <ul>
              {vegaComparisonChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="vega-result-template-panel">
            <div>
              <h3>Vega Karşılaştırma Test Sonuç Şablonu</h3>
              <p>Vega ve ERP ekranlarını karşılaştırırken sonucu aynı formatta not almak için kullanılabilir.</p>
            </div>

            <pre>{vegaComparisonResultTemplate.join("\n")}</pre>
          </div>

          <div className="vega-issue-format-panel">
            <h3>Hata Kayıt Formatı</h3>
            <pre>{vegaComparisonIssueTemplate.join("\n")}</pre>
          </div>

          <div className="test-feedback-panel">
            <div>
              <h3>Testte Hata Görürsen</h3>
              <p>
                Test sırasında hata görürseniz, hatayı tekrar üretebilmek için ekran adını, yaptığınız işlemi ve görünen
                hata mesajını not alın.
              </p>
            </div>

            <pre>{testFeedbackTemplate.join("\n")}</pre>

            <p className="test-feedback-note">
              Bu bilgileri ChatGPT'ye gönderirseniz, sorun için daha net Codex promptu hazırlanabilir.
            </p>
          </div>
        </div>

        <p className="vega-template-note">
          Bu merkezdeki şablonlar yalnızca manuel not alma rehberidir. Gerçek log kaydı, dosya kaydı, API işlemi veya
          veritabanı yazma işlemi yapmaz.
        </p>
      </div>

      <div className="system-status-guide">
        <h3>Kullanım Notu</h3>
        <p>
          Bu oranlar canlı kullanıma geçiş için yaklaşık takip değerleridir. Veri yazan işlemler devreye alınmadan önce
          yedekleme, rollback, gerçek veri testi ve personel denemesi yapılmalıdır.
        </p>
      </div>

      <p className="system-status-test-note">Sol menüdeki mavi nokta, son sürümde yenilik yapılan sayfayı gösterir.</p>

      <div className="go-live-checklist">
        <div>
          <h3>Canlıya Hazırlık Kontrol Listesi</h3>
          <p>
            Bu liste, canlı kullanıma geçmeden önce takip edilmesi gereken başlıkları gösterir. Her madde yalnızca
            bilgilendirme amaçlıdır.
          </p>
        </div>

        <div className="go-live-checklist-grid">
          {goLiveChecklistGroups.map((group) => (
            <div className={`go-live-checklist-card ${group.tone}`} key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="go-live-checklist-note">
          Mevcut aşamada sistem sınırlı test ve hazırlık seviyesindedir. Vega'dan tamamen çıkış için gerçek veri testi,
          yedekleme ve personel denemesi tamamlanmalıdır.
        </p>
      </div>
    </section>
  );
}
