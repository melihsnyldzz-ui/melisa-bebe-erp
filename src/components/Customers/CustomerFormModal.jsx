import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const initialForm = {
  name: "",
  companyName: "",
  phone: "",
  whatsapp: "",
  country: "Türkiye",
  city: "",
  customerType: "",
  openingBalance: "",
  totalSales: "",
  totalPayments: "",
  currentBalance: "",
  riskLimit: "",
  lastPurchaseDate: "",
  notes: "",
};

export default function CustomerFormModal({ isOpen, customer, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      customer
        ? {
            name: customer.name,
            companyName: customer.companyName,
            phone: customer.phone,
            whatsapp: customer.whatsapp,
            country: customer.country,
            city: customer.city,
            customerType: customer.customerType,
            openingBalance: customer.openingBalance,
            totalSales: customer.totalSales,
            totalPayments: customer.totalPayments,
            currentBalance: customer.currentBalance,
            riskLimit: customer.riskLimit,
            lastPurchaseDate: customer.lastPurchaseDate,
            notes: customer.notes || "",
          }
        : initialForm,
    );
  }, [customer, isOpen]);

  if (!isOpen) return null;

  function updateField(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      name: form.name,
      companyName: form.companyName,
      phone: form.phone,
      whatsapp: form.whatsapp,
      country: form.country,
      city: form.city,
      customerType: form.customerType,
      openingBalance: Number(form.openingBalance),
      totalSales: Number(form.totalSales),
      totalPayments: Number(form.totalPayments),
      currentBalance: Number(form.currentBalance),
      riskLimit: Number(form.riskLimit),
      lastPurchaseDate: form.lastPurchaseDate,
      notes: form.notes,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="customer-modal-title">
        <div className="modal-header">
          <div>
            <p>Müşteri cari kartı</p>
            <h2 id="customer-modal-title">{customer ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}</h2>
          </div>
          <button className="icon-button small" aria-label="Kapat" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <TextField label="Müşteri Adı" value={form.name} onChange={(value) => updateField("name", value)} required />
          <TextField label="Firma Adı" value={form.companyName} onChange={(value) => updateField("companyName", value)} required />
          <TextField label="Telefon" value={form.phone} onChange={(value) => updateField("phone", value)} required />
          <TextField label="WhatsApp" value={form.whatsapp} onChange={(value) => updateField("whatsapp", value)} required />
          <TextField label="Ülke" value={form.country} onChange={(value) => updateField("country", value)} required />
          <TextField label="Şehir" value={form.city} onChange={(value) => updateField("city", value)} required />
          <TextField label="Müşteri Tipi" value={form.customerType} onChange={(value) => updateField("customerType", value)} required />
          <TextField label="Açılış Bakiyesi" type="number" value={form.openingBalance} onChange={(value) => updateField("openingBalance", value)} required />
          <TextField label="Toplam Satış" type="number" value={form.totalSales} onChange={(value) => updateField("totalSales", value)} required />
          <TextField label="Toplam Tahsilat" type="number" value={form.totalPayments} onChange={(value) => updateField("totalPayments", value)} required />
          <TextField label="Cari Bakiye" type="number" value={form.currentBalance} onChange={(value) => updateField("currentBalance", value)} required />
          <TextField label="Risk Limiti" type="number" value={form.riskLimit} onChange={(value) => updateField("riskLimit", value)} required />
          <TextField
            label="Son Alışveriş Tarihi"
            type="date"
            value={form.lastPurchaseDate}
            onChange={(value) => updateField("lastPurchaseDate", value)}
          />
          <label className="filter-field notes-field">
            <span>Notlar</span>
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </label>
          <p className="form-note">
            Not: Müşteri bakiyesi ileride satış fişi ve tahsilat hareketlerinden otomatik beslenecektir.
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
