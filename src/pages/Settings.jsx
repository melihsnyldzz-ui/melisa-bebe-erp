import { useState } from "react";
import CompanySettings from "../components/Settings/CompanySettings.jsx";
import DatabaseBackupSettings from "../components/Settings/DatabaseBackupSettings.jsx";
import DataStatusSettings from "../components/Settings/DataStatusSettings.jsx";
import DemoDataResetSettings from "../components/Settings/DemoDataResetSettings.jsx";
import LiveModeSettings from "../components/Settings/LiveModeSettings.jsx";
import SystemHealthSettings from "../components/Settings/SystemHealthSettings.jsx";
import SystemSettings from "../components/Settings/SystemSettings.jsx";
import SystemStatusPanel from "../components/Settings/SystemStatusPanel.jsx";
import UserRoleSettings from "../components/Settings/UserRoleSettings.jsx";

const initialCompanySettings = {
  companyName: "Melisa Bebe Tekstil San. ve Tic. Ltd. Şti.",
  phone: "0212 000 00 00",
  whatsapp: "0532 000 00 00",
  email: "info@melisabebe.com",
  address: "İstanbul / Türkiye",
  taxOffice: "Merkez Vergi Dairesi",
  taxNumber: "1234567890",
  iban: "TR00 0000 0000 0000 0000 0000 00",
  logoUrl: "",
};

const initialSystemSettings = {
  currency: "TRY",
  warehouse: "Merkez Depo",
  purchasePrefix: "AF",
  salesPrefix: "SF",
  collectionPrefix: "TH",
  paymentPrefix: "OD",
  defaultCriticalStock: 5,
  dateFormat: "tr-TR",
  timezone: "Europe/Istanbul",
};

export default function Settings() {
  const [companySettings, setCompanySettings] = useState(initialCompanySettings);
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);
  const [successMessage, setSuccessMessage] = useState("");

  function handleSave() {
    setSuccessMessage("Ayarlar mock state üzerinde kaydedildi.");
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Sistem yönetimi</p>
          <h1>Ayarlar</h1>
          <span>Firma bilgileri, kullanıcı rolleri ve sistem tercihlerini yönetin.</span>
        </div>
        <button className="primary-action" onClick={handleSave}>
          Ayarları Kaydet
        </button>
      </section>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <p className="form-note settings-note">
        Not: Gerçek sistemde ayarlar kullanıcı yetkileri ve firma bazlı veritabanı kayıtlarıyla yönetilecektir.
      </p>

      <section className="settings-grid">
        <SystemStatusPanel />
        <CompanySettings settings={companySettings} onChange={setCompanySettings} />
        <SystemSettings settings={systemSettings} onChange={setSystemSettings} />
        <DataStatusSettings />
        <LiveModeSettings />
        <DemoDataResetSettings />
        <SystemHealthSettings />
        <DatabaseBackupSettings />
        <UserRoleSettings />
      </section>
    </>
  );
}
