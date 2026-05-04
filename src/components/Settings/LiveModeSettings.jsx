import { Rocket } from "lucide-react";
import { useState } from "react";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { formatDateTR } from "../../utils/dateUtils.js";
import { canUsePersistentDatabase } from "../../utils/desktopBridge.js";

export default function LiveModeSettings() {
  const { appSettings, startLiveMode } = useErpData();
  const isElectronMode = canUsePersistentDatabase();
  const isLiveMode = appSettings.dataMode === "live";
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  async function handleStartLiveMode() {
    const confirmed = window.confirm("Gerçek kullanım moduna geçmek istediğinize emin misiniz? Bu işlem öncesinde otomatik yedek alınacaktır.");
    if (!confirmed) return;

    setIsStarting(true);
    setMessage("");
    setErrorMessage("");

    const result = await startLiveMode();
    if (result.ok) {
      setMessage(`Sistem gerçek kullanım moduna alındı. Otomatik yedek oluşturuldu: ${result.path}`);
    } else {
      setErrorMessage(result.error || "Gerçek kullanım moduna geçilemedi.");
    }

    setIsStarting(false);
  }

  return (
    <section className="table-panel settings-panel live-mode-panel">
      <div className="section-heading">
        <Rocket size={19} />
        <h2>Gerçek Kullanıma Başlangıç</h2>
      </div>

      <div className="live-mode-summary">
        <div className="data-status-card">
          <span>Veri modu</span>
          <strong>{isLiveMode ? "Gerçek Kullanım" : "Demo"}</strong>
        </div>
        <div className="data-status-card">
          <span>Kurulum tamamlandı mı?</span>
          <strong>{appSettings.setupCompleted === "true" ? "Evet" : "Hayır"}</strong>
        </div>
        {appSettings.liveStartedAt && (
          <div className="data-status-card">
            <span>Gerçek kullanım başlangıcı</span>
            <strong>{formatDateTR(appSettings.liveStartedAt)}</strong>
          </div>
        )}
        {appSettings.demoDataClearedAt && (
          <div className="data-status-card">
            <span>Demo verileri temizlenme tarihi</span>
            <strong>{formatDateTR(appSettings.demoDataClearedAt)}</strong>
          </div>
        )}
      </div>

      {isLiveMode ? (
        <p className="live-mode-info live">Sistem gerçek kullanım modunda çalışıyor.</p>
      ) : (
        <p className="form-note live-mode-note">
          Şu anda demo veri modundasınız. Gerçek kullanıma geçmeden önce veritabanı yedeği almanız önerilir.
        </p>
      )}

      {!isElectronMode && <p className="form-note live-mode-note">Bu işlem yalnızca masaüstü uygulama modunda yapılabilir.</p>}
      {message && <p className="success-message live-mode-message">{message}</p>}
      {errorMessage && <p className="error-message live-mode-message">{errorMessage}</p>}

      {!isLiveMode && (
        <button className="primary-action" type="button" disabled={!isElectronMode || isStarting} onClick={handleStartLiveMode}>
          {isStarting ? "Gerçek kullanım modu hazırlanıyor..." : "Gerçek Kullanım Moduna Geç"}
        </button>
      )}
    </section>
  );
}
