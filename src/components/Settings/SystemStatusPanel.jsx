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
  { label: "ERP genel hazırlık", value: "%62-66" },
  { label: "Canlı kullanım güvenliği", value: "%54-58" },
  { label: "El terminali hazırlığı", value: "%45-50" },
  { label: "Vega'dan geçiş hazırlığı", value: "%47-52" },
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
    version: "v1.11.9",
    title: "Canlı test hata notu ve geri bildirim alanı",
    area: "Ayarlar",
    description: "Canlı testte hata görülürse not alınacak bilgiler için sade bir şablon eklendi.",
  },
  {
    version: "v1.11.8",
    title: "Ayarlar ekranı canlı test rehberi",
    area: "Ayarlar",
    description: "Canlı test sırasında izlenecek kontrol sırası kullanıcıya gösterildi.",
  },
  {
    version: "v1.11.7",
    title: "Ayarlar ekranı sürüm geçmişi özeti",
    area: "Ayarlar",
    description: "Son sürümlerde yapılan iyileştirmeler kullanıcıya anlaşılır şekilde gösterildi.",
  },
  {
    version: "v1.11.6",
    title: "Build sonucu görünürlüğü ve kalite durumu notu",
    area: "Ayarlar",
    description: "Build kontrolünün ne işe yaradığı ve nereden takip edileceği açıklandı.",
  },
  {
    version: "v1.11.5",
    title: "Yenilik noktası yönetimi ve test odağı bilgisi",
    area: "Sol menü / Ayarlar",
    description: "Yeni özellik noktası merkezi yönetilir hale getirildi ve test odağı belirtildi.",
  },
  {
    version: "v1.11.4",
    title: "Yenilik noktası açıklama balonu ve test notu",
    area: "Sol menü / Ayarlar",
    description: "Mavi yenilik noktasının anlamı kullanıcıya açıklandı.",
  },
  {
    version: "v1.11.3",
    title: "Menü yenilik noktası ve test yönlendirmesi",
    area: "Sol menü",
    description: "Son sürümde değişen sayfayı göstermek için mavi yenilik noktası eklendi.",
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
          <p>Bu alan, son sürümlerde hangi bölümde ne değiştiğini hızlıca görmeniz için hazırlanmıştır.</p>
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
