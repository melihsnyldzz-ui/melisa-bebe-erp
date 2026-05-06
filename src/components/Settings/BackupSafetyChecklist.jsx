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

const backupRequiredCases = [
  "Gerçek stok işlemi öncesi",
  "Toplu import öncesi",
  "Cari bakiye işlemleri öncesi",
  "Fiş iptal/düzeltme öncesi",
  "Migration veya veri aktarımı öncesi",
  "Yeni canlı sürüm öncesi",
];

const lastBackupCheckNotes = [
  "Son yedek tarihi biliniyor mu?",
  "Yedek dosyasının nerede olduğu biliniyor mu?",
  "Yedek test ortamında açılabiliyor mu?",
  "Yedek canlı veriyle karıştırılmayacak şekilde adlandırılmış mı?",
  "Geri dönüş prosedürü hazır mı?",
];

const backupRestoreReportTemplate = [
  "Test tarihi:",
  "Testi yapan kişi:",
  "Yedek dosya adı:",
  "Yedek tarihi:",
  "Test ortamı:",
  "Ürün sayısı kontrol edildi mi:",
  "Stok toplamı kontrol edildi mi:",
  "Cari sayısı kontrol edildi mi:",
  "Satış/alış fişi sayısı kontrol edildi mi:",
  "Rapor ekranları açıldı mı:",
  "Geri dönüş prosedürü hazır mı:",
  "Sonuç:",
  "Notlar:",
];

const testReadinessLevels = [
  {
    title: "Hazır değil",
    description: "Zorunlu kontroller tamamlanmadan geri yükleme denenmemeli.",
  },
  {
    title: "Kısmen hazır",
    description: "Temel kontroller yapılmış ancak sonuç notu eksik olabilir.",
  },
  {
    title: "Test için hazır",
    description: "Kontrol listesi ve rapor şablonu tamamlanmış, yalnızca kontrollü test ortamında denenebilir.",
  },
];

const riskSummaryItems = [
  ["Veri yazma", "Yok"],
  ["Geri yükleme işlemi", "Yok"],
  ["Dosya silme", "Yok"],
  ["Canlı veri etkisi", "Yok"],
  ["Kullanım amacı", "Test öncesi kontrol"],
];

const backupTestHistoryItems = [
  {
    date: "06.05.2026",
    description: "Test raporu şablonu eklendi",
    status: "Tamamlandı",
  },
  {
    date: "06.05.2026",
    description: "Risk özeti kontrol edildi",
    status: "Tamamlandı",
  },
  {
    date: "Sonraki test",
    description: "Test ortamında doğrulama bekleniyor",
    status: "Bekliyor",
  },
];

const preActionApprovalNotes = [
  "Canlı veritabanı kullanılmayacak.",
  "Test yedeği ile canlı yedek karıştırılmayacak.",
  "Sonuç notu yazılmadan canlıya taşınmayacak.",
  "Hata varsa işlem durdurulacak.",
  "Sorumlu kişi onayı olmadan geri yükleme denenmeyecek.",
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

      <div className="last-backup-visibility-panel">
        <div>
          <h3>Son Yedek Görünürlüğü</h3>
          <p>Canlı stok, cari veya fiş işlemlerinden önce son yedeğin tarihi ve güvenilirliği kontrol edilmelidir.</p>
        </div>

        <div className="backup-safety-grid">
          <div className="backup-safety-card">
            <h3>Yedek alınması gereken durumlar</h3>
            <ul>
              {backupRequiredCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="backup-safety-card">
            <h3>Son yedek kontrol notları</h3>
            <ul>
              {lastBackupCheckNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="last-backup-visibility-note">
          Bu alan yalnızca bilgilendirme amaçlıdır. Gerçek yedek oluşturmaz veya geri yükleme yapmaz.
        </p>
      </div>

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

      <div className="backup-restore-report-panel">
        <div>
          <h3>Yedek / Geri Yükleme Test Raporu</h3>
          <p>Bu şablon, yedekleme ve geri yükleme testinin sonucunu düzenli not almak için hazırlanmıştır.</p>
        </div>

        <pre>{backupRestoreReportTemplate.join("\n")}</pre>

        <p className="backup-restore-report-note">
          Bu alan yalnızca rapor şablonudur. Gerçek yedek oluşturmaz, geri yükleme yapmaz ve veritabanına yazmaz.
        </p>
      </div>

      <div className="backup-test-evaluation-panel">
        <div>
          <h3>Test Sonucu Değerlendirme</h3>
          <p>Yedek ve geri yükleme testine başlamadan önce hazırlık seviyesini hızlıca değerlendirin.</p>
        </div>

        <div className="backup-test-level-grid">
          {testReadinessLevels.map((level) => (
            <article className="backup-test-level-card" key={level.title}>
              <strong>{level.title}</strong>
              <span>{level.description}</span>
            </article>
          ))}
        </div>

        <p className="backup-live-warning">
          Bu değerlendirme canlı veritabanında işlem başlatmaz. Sadece test hazırlık seviyesini gösterir.
        </p>

        <div className="backup-risk-summary">
          <h3>Risk Özeti</h3>
          <dl>
            {riskSummaryItems.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="backup-test-history-panel">
        <div>
          <h3>Yedek Test Kontrol Geçmişi</h3>
          <p>Bu geçmiş yalnızca örnek bilgilendirme alanıdır. Gerçek log, kayıt veya veritabanı işlemi yapmaz.</p>
        </div>

        <div className="backup-test-history-list">
          {backupTestHistoryItems.map((item) => (
            <article className="backup-test-history-row" key={`${item.date}-${item.description}`}>
              <span>{item.date}</span>
              <strong>{item.description}</strong>
              <em>{item.status}</em>
            </article>
          ))}
        </div>

        <div className="pre-action-approval-panel">
          <h3>İşlem Öncesi Onay Notları</h3>
          <ul>
            {preActionApprovalNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
