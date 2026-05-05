import { DatabaseBackup, FolderArchive, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { formatBackupDate, getBackupStatusClass, getBackupStatusLabel } from "../../utils/backupUtils.js";
import { canUseDatabaseBackup } from "../../utils/desktopBridge.js";

export default function DatabaseBackupSettings() {
  const { appSettings, exportDatabaseBackup } = useErpData();
  const backupAvailable = useMemo(() => canUseDatabaseBackup(), []);
  const [backupMessage, setBackupMessage] = useState("");
  const [backupError, setBackupError] = useState("");
  const [isBackingUp, setIsBackingUp] = useState(false);

  async function handleExportBackup() {
    setIsBackingUp(true);
    setBackupMessage("");
    setBackupError("");

    try {
      const result = await exportDatabaseBackup();
      if (result.ok) {
        setBackupMessage(`Veritabanı yedeği oluşturuldu: ${result.path}`);
      } else {
        setBackupError(result.error || "Yedek oluşturulamadı.");
      }
    } catch (error) {
      setBackupError(error.message || "Yedek oluşturulamadı.");
    } finally {
      setIsBackingUp(false);
    }
  }

  return (
    <section className="table-panel settings-panel database-backup-panel">
      <div className="section-heading">
        <DatabaseBackup size={19} />
        <h2>Veritabanı Yedekleme</h2>
      </div>

      <p className="settings-panel-description">
        Yedekleme işlemi mevcut ERP veritabanının güvenli bir kopyasını oluşturur. Varsayılan yedek klasörü masaüstü uygulamanın güvenli veri klasörü altındadır.
      </p>

      {!backupAvailable && (
        <p className="form-note database-backup-note">Yedekleme özelliği yalnızca masaüstü uygulama modunda kullanılabilir.</p>
      )}

      {backupMessage && <p className="success-message database-backup-message">{backupMessage}</p>}
      {backupError && <p className="error-message database-backup-message">{backupError}</p>}

      <div className="backup-history-grid">
        <div className="backup-history-card">
          <span>Son yedek zamanı</span>
          <strong>{formatBackupDate(appSettings.lastBackupAt)}</strong>
        </div>
        <div className="backup-history-card">
          <span>Son yedek durumu</span>
          <strong className={`status ${getBackupStatusClass(appSettings.lastBackupStatus)}`}>
            {getBackupStatusLabel(appSettings.lastBackupStatus)}
          </strong>
        </div>
        <div className="backup-history-card backup-path-card">
          <span>Son yedek dosyası</span>
          <strong>{appSettings.lastBackupPath || "-"}</strong>
        </div>
      </div>

      {appSettings.lastBackupStatus === "failed" && appSettings.lastBackupError && (
        <p className="error-message database-backup-message">{appSettings.lastBackupError}</p>
      )}

      <button className="primary-action" type="button" disabled={!backupAvailable || isBackingUp} onClick={handleExportBackup}>
        <FolderArchive size={18} />
        {isBackingUp ? "Yedek oluşturuluyor..." : "Veritabanı Yedeği Al"}
      </button>

      <p className="form-note database-backup-note">
        <Info size={16} />
        Yedekten geri yükleme işlemi sonraki sürümde güvenli kapatma/açma akışıyla eklenecektir.
      </p>
    </section>
  );
}
