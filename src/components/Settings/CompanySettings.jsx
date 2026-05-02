import { Building2 } from "lucide-react";

export default function CompanySettings({ settings, onChange }) {
  function updateField(key, value) {
    onChange((currentSettings) => ({ ...currentSettings, [key]: value }));
  }

  return (
    <section className="table-panel settings-panel">
      <div className="section-heading">
        <Building2 size={19} />
        <h2>Firma Bilgileri</h2>
      </div>
      <div className="settings-form-grid">
        <TextField label="Firma Adı" value={settings.companyName} onChange={(value) => updateField("companyName", value)} />
        <TextField label="Telefon" value={settings.phone} onChange={(value) => updateField("phone", value)} />
        <TextField label="WhatsApp" value={settings.whatsapp} onChange={(value) => updateField("whatsapp", value)} />
        <TextField label="E-posta" value={settings.email} onChange={(value) => updateField("email", value)} />
        <TextField label="Vergi Dairesi" value={settings.taxOffice} onChange={(value) => updateField("taxOffice", value)} />
        <TextField label="Vergi Numarası" value={settings.taxNumber} onChange={(value) => updateField("taxNumber", value)} />
        <TextField label="IBAN" value={settings.iban} onChange={(value) => updateField("iban", value)} />
        <TextField label="Logo URL" value={settings.logoUrl} onChange={(value) => updateField("logoUrl", value)} />
        <label className="filter-field settings-wide-field">
          <span>Adres</span>
          <textarea value={settings.address} onChange={(event) => updateField("address", event.target.value)} />
        </label>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
