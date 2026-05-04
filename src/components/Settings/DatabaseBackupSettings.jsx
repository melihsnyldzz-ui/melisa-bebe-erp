import { DatabaseBackup } from "lucide-react";
import { useMemo, useState } from "react";
import { canUseDatabaseBackup, exportDatabaseBackup } from "../../utils/desktopBridge.js";

export default function DatabaseBackupSettings() {
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
        setBackupError(`Yedek oluşturulamadı: ${result.error}`);
      }
    } catch (error) {
      setBackupError(`Yedek oluşturulamadı: ${error.message || "Beklenmeyen hata oluştu."}`);
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
        SQLite veritabanının güvenli bir kopyasını bilgisayarınıza kaydedin. Bu işlem özellikle gün sonu, büyük kayıt girişi veya sistem güncellemesi öncesinde önerilir.
      </p>

      {!backupAvailable && (
        <p className="form-note database-backup-note">Yedekleme özelliği yalnızca masaüstü uygulama modunda kullanılabilir.</p>
      )}

      {backupMessage && <p className="success-message database-backup-message">{backupMessage}</p>}
      {backupError && <p className="error-message database-backup-message">{backupError}</p>}

      <button className="primary-action" type="button" disabled={!backupAvailable || isBackingUp} onClick={handleExportBackup}>
        {isBackingUp ? "Yedek oluşturuluyor..." : "Veritabanı Yedeği Al"}
      </button>
    </section>
  );
}
