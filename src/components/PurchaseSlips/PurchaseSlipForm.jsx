import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, RotateCcw, Save } from "lucide-react";
import PurchaseSlipItemsTable from "./PurchaseSlipItemsTable.jsx";
import { getTodayISO } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";
import { findProductByCodeOrBarcode } from "../../utils/productLookup.js";

const initialForm = {
  date: getTodayISO(),
  supplierId: "",
  warehouse: "Merkez Depo",
  productId: "",
  search: "",
  description: "",
};

export default function PurchaseSlipForm({ nextSlipNo, products, suppliers, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [quickEntry, setQuickEntry] = useState("");
  const [formError, setFormError] = useState("");
  const [barcodeMessage, setBarcodeMessage] = useState(null);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = form.search.trim().toLocaleLowerCase("tr-TR");
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.code, product.modelCode, product.variantCode, product.barcode, product.brand].some((value) =>
        String(value || "").toLocaleLowerCase("tr-TR").includes(query),
      ),
    );
  }, [form.search, products]);

  const totals = useMemo(() => calculateTotals(items), [items]);

  function updateForm(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function addSelectedProduct() {
    const selectedProduct = products.find((product) => product.id === Number(form.productId));
    if (!selectedProduct) return;

    const action = addProductToItems(selectedProduct);
    setBarcodeMessage({
      type: "success",
      text: action === "increase" ? `${selectedProduct.name} miktarı artırıldı.` : `${selectedProduct.name} satıra eklendi.`,
    });
    setForm((currentForm) => ({ ...currentForm, productId: "", search: "" }));
  }

  function handleQuickEntryKeyDown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const product = findProductByCodeOrBarcode(products, quickEntry);
    if (!product) {
      setBarcodeMessage({ type: "error", text: "Ürün bulunamadı." });
      return;
    }

    const action = addProductToItems(product);
    setBarcodeMessage({
      type: "success",
      text: action === "increase" ? `${product.name} miktarı artırıldı.` : `${product.name} satıra eklendi.`,
    });
    setQuickEntry("");
  }

  function addProductToItems(product) {
    const action = items.some((item) => item.productId === product.id) ? "increase" : "add";

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return currentItems.map((item) => (item.productId === product.id ? calculateLine({ ...item, quantity: item.quantity + 1 }) : item));
      }

      return [
        ...currentItems,
        calculateLine({
          id: Date.now(),
          productId: product.id,
          productCode: product.code,
          barcode: product.barcode,
          productName: product.name,
          size: product.size,
          color: product.color,
          quantity: 1,
          unitPrice: product.purchasePrice,
          discountRate: 0,
          taxRate: 0,
        }),
      ];
    });
    setFormError("");
    return action;
  }

  function updateItem(itemId, key, value) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? calculateLine({ ...item, [key]: Number(value) }) : item)),
    );
  }

  function removeItem(itemId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }

  function resetForm() {
    setForm(initialForm);
    setItems([]);
    setQuickEntry("");
    setFormError("");
    setBarcodeMessage(null);
    window.requestAnimationFrame(() => barcodeInputRef.current?.focus());
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const supplier = suppliers.find((item) => item.id === Number(form.supplierId));

    if (!supplier || items.length === 0) return;

    const result = await onSave({
      slipNo: nextSlipNo,
      date: form.date,
      supplierId: supplier.id,
      supplierName: supplier.name,
      warehouse: form.warehouse,
      items,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxTotal: totals.taxTotal,
      grandTotal: totals.grandTotal,
      description: form.description,
    });

    if (!result || result.ok) {
      resetForm();
    }
  }

  return (
    <section className="table-panel purchase-form-panel">
      <div className="section-heading">
        <Save size={19} />
        <h2>Yeni Alış Fişi</h2>
      </div>

      <form className="purchase-slip-form" onSubmit={handleSubmit}>
        <label className="filter-field">
          <span>Fiş No</span>
          <input value={nextSlipNo} readOnly />
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
          <span>Depo</span>
          <select value={form.warehouse} onChange={(event) => updateForm("warehouse", event.target.value)}>
            <option>Merkez Depo</option>
          </select>
        </label>

        <div className="quick-barcode-entry">
          <div>
            <strong>Hızlı Barkod Girişi</strong>
            <span>Barkod / ürün kodu okut veya yaz</span>
          </div>
          <input
            ref={barcodeInputRef}
            value={quickEntry}
            onChange={(event) => {
              setQuickEntry(event.target.value);
              setBarcodeMessage(null);
            }}
            onKeyDown={handleQuickEntryKeyDown}
            placeholder="Barkod / ürün kodu okut veya yaz"
          />
          {barcodeMessage && <span className={`barcode-message barcode-message-${barcodeMessage.type}`}>{barcodeMessage.text}</span>}
        </div>

        <label className="filter-field purchase-search-field">
          <span>Barkod / Ürün Arama</span>
          <input
            value={form.search}
            onChange={(event) => updateForm("search", event.target.value)}
            placeholder="Barkod, ürün kodu veya ürün adı"
          />
        </label>
        <label className="filter-field">
          <span>Ürün Seç</span>
          <select value={form.productId} onChange={(event) => updateForm("productId", event.target.value)}>
            <option value="">Ürün seç</option>
            {filteredProducts.map((product) => (
              <option value={product.id} key={product.id}>
                {product.code} - {product.name}
              </option>
            ))}
          </select>
        </label>
        <button className="secondary-action" type="button" onClick={addSelectedProduct}>
          <Plus size={17} />
          Satıra Ekle
        </button>

        {formError && <p className="error-message purchase-note">{formError}</p>}

        <div className="purchase-items-area">
          <PurchaseSlipItemsTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
        </div>

        <label className="filter-field notes-field">
          <span>Açıklama</span>
          <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
        </label>

        <div className="purchase-totals">
          <div>
            <span>Ara Toplam</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>
          </div>
          <div>
            <span>İskonto Toplamı</span>
            <strong>{formatCurrency(totals.discountTotal)}</strong>
          </div>
          <div>
            <span>KDV Toplamı</span>
            <strong>{formatCurrency(totals.taxTotal)}</strong>
          </div>
          <div className="grand-total">
            <span>Genel Toplam</span>
            <strong>{formatCurrency(totals.grandTotal)}</strong>
          </div>
        </div>

        <p className="form-note purchase-note">
          Not: Alış fişi kaydedildiğinde gerçek sistemde stok artar ve tedarikçi carisine borç işlenir.
        </p>

        <div className="modal-actions purchase-actions">
          <button className="secondary-action" type="button" onClick={resetForm}>
            <RotateCcw size={17} />
            Temizle
          </button>
          <button className="primary-action" type="submit">
            <Save size={18} />
            Fişi Kaydet
          </button>
        </div>
      </form>
    </section>
  );
}

function calculateLine(item) {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discountRate = Number(item.discountRate) || 0;
  const taxRate = Number(item.taxRate) || 0;
  const grossTotal = quantity * unitPrice;
  const discountAmount = grossTotal * (discountRate / 100);
  const taxableTotal = grossTotal - discountAmount;
  const taxAmount = taxableTotal * (taxRate / 100);

  return {
    ...item,
    quantity,
    unitPrice,
    discountRate,
    taxRate,
    lineTotal: taxableTotal + taxAmount,
  };
}

function calculateTotals(items) {
  return items.reduce(
    (totals, item) => {
      const grossTotal = item.quantity * item.unitPrice;
      const discountAmount = grossTotal * (item.discountRate / 100);
      const taxableTotal = grossTotal - discountAmount;
      const taxAmount = taxableTotal * (item.taxRate / 100);

      return {
        subtotal: totals.subtotal + grossTotal,
        discountTotal: totals.discountTotal + discountAmount,
        taxTotal: totals.taxTotal + taxAmount,
        grandTotal: totals.grandTotal + taxableTotal + taxAmount,
      };
    },
    { subtotal: 0, discountTotal: 0, taxTotal: 0, grandTotal: 0 },
  );
}
