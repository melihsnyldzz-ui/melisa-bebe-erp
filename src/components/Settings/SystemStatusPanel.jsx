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
  { label: "ERP genel hazırlık", value: "%54-58" },
  { label: "Canlı kullanım güvenliği", value: "%46-50" },
  { label: "El terminali hazırlığı", value: "%45-50" },
  { label: "Vega'dan geçiş hazırlığı", value: "%39-44" },
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
    </section>
  );
}
