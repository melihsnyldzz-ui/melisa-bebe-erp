import { ShieldCheck } from "lucide-react";
import { APP_STAGE, APP_VERSION } from "../../config/appVersion.js";

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
    version: "v1.13.7",
    title: "Canlıya geçiş test planı ve Vega karşılaştırma kontrol listesi",
    area: "Ayarlar",
    description: "Canlıya geçiş öncesi 5 günlük test planı ve Vega karşılaştırma kontrol listesi eklendi.",
  },
  {
    version: "v1.13.6",
    title: "Proje olgunluk oranlarını güncelleme ve canlıya geçiş eksik listesi",
    area: "Ayarlar",
    description: "Proje olgunluk oranları güncellendi ve canlıya geçiş öncesi eksik ana başlıklar görünür hale getirildi.",
  },
  {
    version: "v1.13.5",
    title: "Son sürüm geçmişi güncelleme ve yedek test kontrol geçmişi",
    area: "Ayarlar",
    description: "Son Sürüm Geçmişi v1.13.x kayıtlarıyla güncellendi ve yedek test kontrol geçmişi görünür hale getirildi.",
  },
  {
    version: "v1.13.4",
    title: "Yedek test sonucu değerlendirme ve risk özeti",
    area: "Ayarlar",
    description: "Yedek/geri yükleme hazırlık seviyesi, canlı sistem uyarısı ve risk özeti eklendi.",
  },
  {
    version: "v1.13.3",
    title: "Yedek ve geri yükleme test raporu",
    area: "Ayarlar",
    description: "Yedek ve geri yükleme testi için rapor şablonu eklendi.",
  },
  {
    version: "v1.13.2",
    title: "Yedek alma uyarıları ve son yedek görünürlüğü",
    area: "Ayarlar",
    description: "Son yedek görünürlüğü, yedek alınması gereken durumlar ve güvenlik uyarıları eklendi.",
  },
  {
    version: "v1.13.1",
    title: "Geri yükleme simülasyonu ve doğrulama listesi",
    area: "Ayarlar",
    description: "Test ortamında geri yükleme senaryosu ve canlıdan önce doğrulanacak maddeler eklendi.",
  },
  {
    version: "v1.13.0",
    title: "Yedekleme güvenlik kontrolü",
    area: "Ayarlar",
    description: "Canlı kullanıma geçmeden önce yedekleme güvenlik kontrol listesi eklendi.",
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

      <div className="version-history-panel">
        <div>
          <h3>Son Sürüm Geçmişi</h3>
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
          Bu rehber test sırasında nereden başlayacağınızı göstermek için hazırlanmıştır. Gerçek veriyle işlem yapmadan
          önce yedekleme ve geri dönüş senaryosu ayrıca test edilmelidir.
        </p>
      </div>

      <div className="test-feedback-panel">
        <div>
          <h3>Testte Hata Görürsen</h3>
          <p>
            Test sırasında hata görürseniz, hatayı tekrar üretebilmek için ekran adını, yaptığınız işlemi ve görünen hata
            mesajını not alın.
          </p>
        </div>

        <pre>{testFeedbackTemplate.join("\n")}</pre>

        <p className="test-feedback-note">
          Bu bilgileri ChatGPT'ye gönderirseniz, sorun için daha net Codex promptu hazırlanabilir.
        </p>
      </div>

      <div className="system-status-grid">
        {statusRows.map((row) => (
          <div className="system-status-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>

      <div className="system-status-maturity">
        <h3>Proje Olgunluk Bilgisi</h3>
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

          <div className="vega-comparison-panel">
            <h3>Vega Karşılaştırma Kontrol Listesi</h3>
            <ul>
              {vegaComparisonChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="go-live-test-plan-note">
            Bu test planı yalnızca manuel kontrol rehberidir. Vega'ya bağlanmaz, veri çekmez, veri yazmaz ve
            karşılaştırmayı otomatik yapmaz.
          </p>
        </div>
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
