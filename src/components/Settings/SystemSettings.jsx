import { SlidersHorizontal } from "lucide-react";

export default function SystemSettings({ settings, onChange }) {
  function updateField(key, value) {
    onChange((currentSettings) => ({ ...currentSettings, [key]: value }));
  }

  return (
    <section className="table-panel settings-panel">
      <div className="section-heading">
        <SlidersHorizontal size={19} />
        <h2>Sistem Tercihleri</h2>
      </div>
      <div className="settings-form-grid">
        <TextField label="Varsayılan Para Birimi" value={settings.currency} onChange={(value) => updateField("currency", value)} />
        <TextField label="Varsayılan Depo" value={settings.warehouse} onChange={(value) => updateField("warehouse", value)} />
        <TextField label="Alış Fişi Ön Eki" value={settings.purchasePrefix} onChange={(value) => updateField("purchasePrefix", value)} />
        <TextField label="Satış Fişi Ön Eki" value={settings.salesPrefix} onChange={(value) => updateField("salesPrefix", value)} />
        <TextField label="Tahsilat Ön Eki" value={settings.collectionPrefix} onChange={(value) => updateField("collectionPrefix", value)} />
        <TextField label="Ödeme Ön Eki" value={settings.paymentPrefix} onChange={(value) => updateField("paymentPrefix", value)} />
        <TextField
          label="Kritik Stok Varsayılan Seviyesi"
          type="number"
          value={settings.defaultCriticalStock}
          onChange={(value) => updateField("defaultCriticalStock", Number(value))}
        />
        <TextField label="Tarih Formatı" value={settings.dateFormat} onChange={(value) => updateField("dateFormat", value)} />
        <TextField label="Saat Dilimi" value={settings.timezone} onChange={(value) => updateField("timezone", value)} />
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, type = "text" }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} min={type === "number" ? 0 : undefined} />
    </label>
  );
}
