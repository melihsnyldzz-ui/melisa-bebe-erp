import { ActivitySquare } from "lucide-react";
import { useMemo } from "react";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { formatDateTR } from "../../utils/dateUtils.js";
import { canUsePersistentDatabase, getDatabaseModeLabel } from "../../utils/desktopBridge.js";

export default function DataStatusSettings() {
  const { appSettings, products, customers, suppliers, purchaseSlips, salesSlips, collections, payments, stockMovements } = useErpData();
  const persistentDatabaseActive = useMemo(() => canUsePersistentDatabase(), []);
  const modeLabel = useMemo(() => getDatabaseModeLabel(), []);
  const dataModeLabel = appSettings.dataMode === "live" ? "Gerçek kullanım modu" : "Demo veri modu";
  const recordCounts = [
    { label: "Ürün", value: products.length },
    { label: "Müşteri", value: customers.length },
    { label: "Tedarikçi", value: suppliers.length },
    { label: "Alış Fişi", value: purchaseSlips.length },
    { label: "Satış Fişi", value: salesSlips.length },
    { label: "Tahsilat", value: collections.length },
    { label: "Ödeme", value: payments.length },
    { label: "Stok Hareketi", value: stockMovements.length },
  ];

  return (
    <section className="table-panel settings-panel data-status-panel">
      <div className="section-heading">
        <ActivitySquare size={19} />
        <h2>Veri Durumu</h2>
      </div>

      <div className="data-status-card">
        <div>
          <span>Çalışma Modu</span>
          <strong>{modeLabel}</strong>
        </div>
        <span className={`data-mode-badge ${persistentDatabaseActive ? "persistent" : "temporary"}`}>
          {persistentDatabaseActive ? "Kalıcı veri aktif" : "Geçici veri modu"}
        </span>
      </div>

      <div className="data-status-card">
        <div>
          <span>Veri Modu</span>
          <strong>{dataModeLabel}</strong>
        </div>
        <span className={`data-mode-badge ${appSettings.dataMode === "live" ? "persistent" : "temporary"}`}>
          {appSettings.dataMode === "live" ? "Gerçek kullanım" : "Demo veri"}
        </span>
      </div>

      {!persistentDatabaseActive && (
        <p className="form-note data-status-note">
          Tarayıcı modunda yapılan değişiklikler uygulama yenilendiğinde kaybolabilir. Kalıcı kayıt için masaüstü uygulama modunu kullanın.
        </p>
      )}

      <div className="data-status-grid">
        {appSettings.demoDataClearedAt && (
          <div className="data-status-card">
            <span>Demo verileri temizlenme tarihi</span>
            <strong>{formatDateTR(appSettings.demoDataClearedAt)}</strong>
          </div>
        )}
        {recordCounts.map((item) => (
          <div className="data-status-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
