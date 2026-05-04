import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { canUsePersistentDatabase } from "../../utils/desktopBridge.js";

export default function DemoDataResetSettings() {
  const { currentRole, hasPermission } = useAuth();
  const { resetDemoData } = useErpData();
  const isElectronMode = canUsePersistentDatabase();
  const canResetData = currentRole === "owner" || hasPermission("system.resetData");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  async function handleResetDemoData() {
    const confirmed = window.confirm(
      "Bu işlem tüm ürün, müşteri, tedarikçi, fiş, tahsilat, ödeme ve stok hareketi kayıtlarını temizleyecektir. Devam etmek istiyor musunuz?",
    );
    if (!confirmed) return;

    const typedValue = window.prompt('"DEVAM" yazmadan işlem başlamaz.');
    if (typedValue !== "DEVAM") return;

    setIsResetting(true);
    setMessage("");
    setErrorMessage("");

    const result = await resetDemoData();
    if (result.ok) {
      setMessage(`Demo verileri temizlendi. Otomatik yedek oluşturuldu: ${result.path}`);
    } else {
      setErrorMessage(`Demo verileri temizlenemedi: ${result.error}`);
    }

    setIsResetting(false);
  }

  return (
    <section className="table-panel settings-panel live-mode-panel">
      <div className="section-heading">
        <ShieldAlert size={19} />
        <h2>Demo Verileri Temizleme</h2>
      </div>

      <p className="form-note live-mode-note">
        Bu işlem ürün, müşteri, tedarikçi, fiş, tahsilat, ödeme ve stok hareketlerini temizler. Sistem ayarları ve temel tanımlar korunur.
      </p>

      {!isElectronMode && <p className="form-note live-mode-note">Bu işlem yalnızca masaüstü uygulama modunda yapılabilir.</p>}
      {!canResetData && <p className="form-note live-mode-note">Demo verileri temizleme işlemi yalnızca Patron yetkisiyle yapılabilir.</p>}
      {message && <p className="success-message live-mode-message">{message}</p>}
      {errorMessage && <p className="error-message live-mode-message">{errorMessage}</p>}

      <button className="primary-action" type="button" disabled={!isElectronMode || !canResetData || isResetting} onClick={handleResetDemoData}>
        {isResetting ? "Demo verileri temizleniyor..." : "Demo Verileri Temizle ve Gerçek Kullanıma Hazırla"}
      </button>
    </section>
  );
}
