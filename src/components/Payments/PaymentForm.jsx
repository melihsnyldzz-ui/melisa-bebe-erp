import { useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";

const initialForm = {
  date: "2026-05-02",
  supplierId: "",
  paymentType: "Nakit",
  amount: "",
  receiptImageUrl: "",
  description: "",
};

const paymentTypes = ["Nakit", "Havale", "EFT", "Kredi Kartı", "Çek / Senet"];

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function PaymentForm({ nextPaymentNo, suppliers, onSave }) {
  const [form, setForm] = useState(initialForm);

  const selectedSupplier = useMemo(
    () => suppliers.find((supplier) => supplier.id === Number(form.supplierId)),
    [form.supplierId, suppliers],
  );

  function updateForm(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedSupplier) return;

    onSave({
      paymentNo: nextPaymentNo,
      date: form.date,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      paymentType: form.paymentType,
      amount: Number(form.amount),
      description: form.description,
      receiptImageUrl: form.receiptImageUrl.trim(),
    });

    resetForm();
  }

  return (
    <section className="table-panel purchase-form-panel">
      <div className="section-heading">
        <Save size={19} />
        <h2>Yeni Tedarikçi Ödemesi</h2>
      </div>

      <form className="purchase-slip-form collection-form" onSubmit={handleSubmit}>
        <label className="filter-field">
          <span>Ödeme No</span>
          <input value={nextPaymentNo} readOnly />
        </label>
        <label className="filter-field">
          <span>Tarih</span>
          <input type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} required />
        </label>
        <label className="filter-field">
          <span>Tedarikçi</span>
          <select value={form.supplierId} onChange={(event) => updateForm("supplierId", event.target.value)} required>
            <option value="">Tedarikçi seç</option>
            {suppliers.map((supplier) => (
              <option value={supplier.id} key={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Ödeme Tipi</span>
          <select value={form.paymentType} onChange={(event) => updateForm("paymentType", event.target.value)}>
            {paymentTypes.map((paymentType) => (
              <option value={paymentType} key={paymentType}>
                {paymentType}
              </option>
            ))}
          </select>
        </label>

        {selectedSupplier && (
          <div className="customer-balance-info">
            <span>Seçilen Tedarikçi Cari Bakiyesi</span>
            <strong>{currencyFormatter.format(selectedSupplier.currentBalance)}</strong>
          </div>
        )}

        <label className="filter-field">
          <span>Tutar</span>
          <input type="number" min="0" value={form.amount} onChange={(event) => updateForm("amount", event.target.value)} required />
        </label>
        <label className="filter-field">
          <span>Dekont Görsel URL</span>
          <input value={form.receiptImageUrl} onChange={(event) => updateForm("receiptImageUrl", event.target.value)} />
        </label>
        <label className="filter-field notes-field">
          <span>Açıklama</span>
          <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
        </label>

        <p className="form-note purchase-note">
          Not: Ödeme kaydedildiğinde gerçek sistemde tedarikçi cari bakiyesinden düşülür.
        </p>

        <div className="modal-actions purchase-actions">
          <button className="secondary-action" type="button" onClick={resetForm}>
            <RotateCcw size={17} />
            Temizle
          </button>
          <button className="primary-action" type="submit">
            <Save size={18} />
            Ödemeyi Kaydet
          </button>
        </div>
      </form>
    </section>
  );
}
