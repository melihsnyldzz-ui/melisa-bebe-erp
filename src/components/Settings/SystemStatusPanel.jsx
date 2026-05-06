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
  { label: "ERP genel hazırlık", value: "%58-62" },
  { label: "Canlı kullanım güvenliği", value: "%50-54" },
  { label: "El terminali hazırlığı", value: "%45-50" },
  { label: "Vega'dan geçiş hazırlığı", value: "%43-48" },
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
