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

const restoreSimulationSteps = [
  "Test yedeği seçilir.",
  "Canlı veri yerine test ortamında geri yükleme denenir.",
  "Ürün sayısı kontrol edilir.",
  "Stok toplamı kontrol edilir.",
  "Cari sayısı kontrol edilir.",
  "Satış/alış fişi sayısı kontrol edilir.",
  "Geri yükleme sonrası rapor ekranları açılır.",
  "Hata varsa işlem canlıya taşınmaz.",
];

const restoreValidationItems = [
  "Yedek dosyası doğru tarihli mi?",
  "Test ortamında açılıyor mu?",
  "Ürün/stok/cari verileri beklenen sayıda mı?",
  "Rapor ekranları hata vermeden açılıyor mu?",
  "Eski veriye dönüş prosedürü yazılı mı?",
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

      <div className="restore-simulation-panel">
        <div>
          <h3>Geri Yükleme Simülasyonu</h3>
          <p>Bu alan sadece simülasyon planıdır. Gerçek geri yükleme işlemi yapmaz.</p>
        </div>

        <div className="backup-safety-grid">
          <div className="backup-safety-card">
            <h3>Simülasyon adımları</h3>
            <ul>
              {restoreSimulationSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="backup-safety-card">
            <h3>Canlıdan önce doğrulanacaklar</h3>
            <ul>
              {restoreValidationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
