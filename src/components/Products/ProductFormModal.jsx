import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const initialForm = {
  barcode: "",
  code: "",
  name: "",
  category: "",
  size: "",
  color: "",
  purchasePrice: "",
  salePrice: "",
  stockQuantity: "",
  criticalStockLevel: "",
  supplier: "",
};

export default function ProductFormModal({ isOpen, product, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      product
        ? {
            barcode: product.barcode,
            code: product.code,
            name: product.name,
            category: product.category,
            size: product.size,
            color: product.color,
            purchasePrice: product.purchasePrice,
            salePrice: product.salePrice,
            stockQuantity: product.stockQuantity,
            criticalStockLevel: product.criticalStockLevel,
            supplier: product.supplier,
          }
        : initialForm,
    );
  }, [isOpen, product]);

  if (!isOpen) return null;

  function updateField(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      barcode: form.barcode,
      code: form.code,
      name: form.name,
      category: form.category,
      size: form.size,
      color: form.color,
      purchasePrice: Number(form.purchasePrice),
      salePrice: Number(form.salePrice),
      stockQuantity: Number(form.stockQuantity),
      criticalStockLevel: Number(form.criticalStockLevel),
      supplier: form.supplier,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <div className="modal-header">
          <div>
            <p>Ürün kartı</p>
            <h2 id="product-modal-title">{product ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h2>
          </div>
          <button className="icon-button small" aria-label="Kapat" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <TextField label="Ürün Adı" value={form.name} onChange={(value) => updateField("name", value)} required />
          <TextField label="Ürün Kodu" value={form.code} onChange={(value) => updateField("code", value)} required />
          <TextField label="Barkod" value={form.barcode} onChange={(value) => updateField("barcode", value)} required />
          <TextField label="Kategori" value={form.category} onChange={(value) => updateField("category", value)} required />
          <TextField label="Beden" value={form.size} onChange={(value) => updateField("size", value)} required />
          <TextField label="Renk" value={form.color} onChange={(value) => updateField("color", value)} required />
          <TextField label="Alış Fiyatı" type="number" value={form.purchasePrice} onChange={(value) => updateField("purchasePrice", value)} required />
          <TextField label="Satış Fiyatı" type="number" value={form.salePrice} onChange={(value) => updateField("salePrice", value)} required />
          <TextField label="Stok" type="number" value={form.stockQuantity} onChange={(value) => updateField("stockQuantity", value)} required />
          <TextField
            label="Kritik Stok"
            type="number"
            value={form.criticalStockLevel}
            onChange={(value) => updateField("criticalStockLevel", value)}
            required
          />
          <TextField label="Tedarikçi" value={form.supplier} onChange={(value) => updateField("supplier", value)} required />

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
