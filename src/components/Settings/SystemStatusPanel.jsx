import { ShieldCheck } from "lucide-react";
import { APP_STAGE, APP_VERSION } from "../../config/appVersion.js";

const statusRows = [
  { label: "Uygulama sürümü", value: APP_VERSION },
  { label: "Uygulama aşaması", value: APP_STAGE },
  { label: "Build kontrolü", value: "GitHub Actions" },
  { label: "Çalışma modu", value: "Güvenli geliştirme modu" },
  { label: "Veri yazan kritik işlemler", value: "Kontrollü sürüm gerektirir" },
  { label: "El terminali durumu", value: "Okuma + sayım sepeti + rapor/CSV/JSON önizleme hazırlığı" },
  { label: "Vega geçiş durumu", value: "Kademeli geçiş hazırlığı" },
];

const maturityRows = [
  { label: "ERP genel olgunluk", value: "%53-57" },
  { label: "Canlı kullanım güvenliği", value: "%45-49" },
  { label: "El terminali hazırlığı", value: "%45-50" },
  { label: "Vega'dan geçiş hazırlığı", value: "%38-43" },
];

export default function SystemStatusPanel() {
  return (
    <section className="table-panel settings-panel system-status-panel">
      <div className="section-heading">
        <ShieldCheck size={19} />
        <h2>Sistem Durumu ve Güvenli Mod</h2>
      </div>

      <p className="settings-panel-description">
        Bu ERP halen kademeli geliştirme aşamasındadır. Stok, cari, fiş, import, yedekleme ve migration gibi veri yazan
        işlemler küçük ve kontrollü sürümlerle ilerletilmelidir.
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
    </section>
  );
}
