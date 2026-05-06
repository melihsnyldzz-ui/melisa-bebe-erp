import { ShieldAlert } from "lucide-react";

const safetyNotes = [
  "Son yedek durumu kontrol edilmeli",
  "Geri yükleme senaryosu test edilmeli",
  "Stok/cari/fiş işlemlerinden önce yedek alınmalı",
  "Canlı veriyle testten önce ayrı test yedeği oluşturulmalı",
  "Yedekten dönüş prosedürü yazılı hale getirilmeli",
];

const checklistItems = [
  "Yedek alınabiliyor mu?",
  "Yedek dosyası bulunabiliyor mu?",
  "Geri yükleme test edildi mi?",
  "Geri yükleme sonrası ürün/stok/cari bilgileri kontrol edildi mi?",
  "Test yedeği ile canlı yedek ayrımı net mi?",
];

export default function BackupSafetyChecklist() {
  return (
    <section className="table-panel settings-panel backup-safety-panel">
      <div className="section-heading">
        <ShieldAlert size={19} />
        <h2>Yedekleme Güvenlik Kontrolü</h2>
      </div>

      <p className="backup-safety-warning">
        Yedekleme ve geri yükleme testi tamamlanmadan gerçek stok/cari/fiş işlemleri canlı kullanıma açılmamalıdır.
      </p>

      <div className="backup-safety-grid">
        <div className="backup-safety-card">
          <h3>Güvenlik Notları</h3>
          <ul>
            {safetyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="backup-safety-card">
          <h3>Canlıya geçmeden önce yedek kontrol listesi</h3>
          <ul>
            {checklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="settings-panel-description">
        Bu panel yalnızca bilgilendirme amaçlıdır. Gerçek yedek alma, geri yükleme, dosya silme veya migration işlemi
        yapmaz.
      </p>
    </section>
  );
}
