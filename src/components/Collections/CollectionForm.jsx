import { useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";

const initialForm = {
  date: "2026-05-02",
  customerId: "",
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

export default function CollectionForm({ nextCollectionNo, customers, onSave }) {
  const [form, setForm] = useState(initialForm);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === Number(form.customerId)),
    [customers, form.customerId],
  );

  function updateForm(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedCustomer) return;

    onSave({
      collectionNo: nextCollectionNo,
      date: form.date,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
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
        <h2>Yeni Tahsilat</h2>
      </div>

      <form className="purchase-slip-form collection-form" onSubmit={handleSubmit}>
        <label className="filter-field">
          <span>Tahsilat No</span>
          <input value={nextCollectionNo} readOnly />
        </label>
        <label className="filter-field">
          <span>Tarih</span>
          <input type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} required />
        </label>
        <label className="filter-field">
          <span>Müşteri</span>
          <select value={form.customerId} onChange={(event) => updateForm("customerId", event.target.value)} required>
            <option value="">Müşteri seç</option>
            {customers.map((customer) => (
              <option value={customer.id} key={customer.id}>
                {customer.name}
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

        {selectedCustomer && (
          <div className="customer-balance-info">
            <span>Seçilen Müşteri Cari Bakiyesi</span>
            <strong>{currencyFormatter.format(selectedCustomer.currentBalance)}</strong>
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
          Not: Tahsilat kaydedildiğinde gerçek sistemde müşteri cari bakiyesinden düşülür.
        </p>

        <div className="modal-actions purchase-actions">
          <button className="secondary-action" type="button" onClick={resetForm}>
            <RotateCcw size={17} />
            Temizle
          </button>
          <button className="primary-action" type="submit">
            <Save size={18} />
            Tahsilatı Kaydet
          </button>
        </div>
      </form>
    </section>
  );
}
