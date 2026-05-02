import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const initialForm = {
  name: "",
  companyTitle: "",
  phone: "",
  whatsapp: "",
  contactPerson: "",
  city: "",
  country: "Türkiye",
  address: "",
  taxInfo: "",
  iban: "",
  openingBalance: "",
  totalPurchases: "",
  totalPayments: "",
  currentBalance: "",
  lastTransactionDate: "",
  notes: "",
};

export default function SupplierFormModal({ isOpen, supplier, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      supplier
        ? {
            name: supplier.name,
            companyTitle: supplier.companyTitle,
            phone: supplier.phone,
            whatsapp: supplier.whatsapp,
            contactPerson: supplier.contactPerson,
            city: supplier.city,
            country: supplier.country,
            address: supplier.address,
            taxInfo: supplier.taxInfo,
            iban: supplier.iban,
            openingBalance: supplier.openingBalance,
            totalPurchases: supplier.totalPurchases,
            totalPayments: supplier.totalPayments,
            currentBalance: supplier.currentBalance,
            lastTransactionDate: supplier.lastTransactionDate,
            notes: supplier.notes || "",
          }
        : initialForm,
    );
  }, [isOpen, supplier]);

  if (!isOpen) return null;

  function updateField(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      name: form.name,
      companyTitle: form.companyTitle,
      phone: form.phone,
      whatsapp: form.whatsapp,
      contactPerson: form.contactPerson,
      city: form.city,
      country: form.country,
      address: form.address,
      taxInfo: form.taxInfo,
      iban: form.iban,
      openingBalance: Number(form.openingBalance),
      totalPurchases: Number(form.totalPurchases),
      totalPayments: Number(form.totalPayments),
      currentBalance: Number(form.currentBalance),
      lastTransactionDate: form.lastTransactionDate,
      notes: form.notes,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="supplier-modal-title">
        <div className="modal-header">
          <div>
            <p>Tedarikçi cari kartı</p>
            <h2 id="supplier-modal-title">{supplier ? "Tedarikçi Düzenle" : "Yeni Tedarikçi Ekle"}</h2>
          </div>
          <button className="icon-button small" aria-label="Kapat" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <TextField label="Tedarikçi Adı" value={form.name} onChange={(value) => updateField("name", value)} required />
          <TextField label="Firma Ünvanı" value={form.companyTitle} onChange={(value) => updateField("companyTitle", value)} required />
          <TextField label="Yetkili Kişi" value={form.contactPerson} onChange={(value) => updateField("contactPerson", value)} required />
          <TextField label="Telefon" value={form.phone} onChange={(value) => updateField("phone", value)} required />
          <TextField label="WhatsApp" value={form.whatsapp} onChange={(value) => updateField("whatsapp", value)} required />
          <TextField label="Şehir" value={form.city} onChange={(value) => updateField("city", value)} required />
          <TextField label="Ülke" value={form.country} onChange={(value) => updateField("country", value)} required />
          <TextField label="Vergi Bilgisi" value={form.taxInfo} onChange={(value) => updateField("taxInfo", value)} />
          <TextField label="IBAN" value={form.iban} onChange={(value) => updateField("iban", value)} />
          <TextField label="Açılış Bakiyesi" type="number" value={form.openingBalance} onChange={(value) => updateField("openingBalance", value)} required />
          <TextField label="Toplam Alış" type="number" value={form.totalPurchases} onChange={(value) => updateField("totalPurchases", value)} required />
          <TextField label="Toplam Ödeme" type="number" value={form.totalPayments} onChange={(value) => updateField("totalPayments", value)} required />
          <TextField label="Cari Bakiye" type="number" value={form.currentBalance} onChange={(value) => updateField("currentBalance", value)} required />
          <TextField
            label="Son İşlem Tarihi"
            type="date"
            value={form.lastTransactionDate}
            onChange={(value) => updateField("lastTransactionDate", value)}
          />
          <label className="filter-field notes-field">
            <span>Adres</span>
            <textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          </label>
          <label className="filter-field notes-field">
            <span>Notlar</span>
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </label>
          <p className="form-note">
            Not: Tedarikçi bakiyesi ileride alış fişi ve tedarikçi ödeme hareketlerinden otomatik beslenecektir.
          </p>

          <div className="modal-actions">
            <button className="secondary-action" type="button" onClick={onClose}>
              Vazgeç
            </button>
            <button className="primary-action" type="submit">
              <Save size={18} />
              Kaydet
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} min={type === "number" ? 0 : undefined} />
    </label>
  );
}
