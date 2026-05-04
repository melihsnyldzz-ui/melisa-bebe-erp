import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, RotateCcw, Save } from "lucide-react";
import SalesSlipItemsTable from "./SalesSlipItemsTable.jsx";
import { getTodayISO } from "../../utils/dateUtils.js";
import { formatCurrency } from "../../utils/formatters.js";

const initialForm = {
  date: getTodayISO(),
  customerId: "",
  saleType: "Toptan Satış",
  productId: "",
  search: "",
  cargoInfo: "",
  description: "",
};

const saleTypes = ["Toptan Satış", "Sıcak Satış", "Instagram Satıcı", "Bayi Siparişi", "İhracat"];

export default function SalesSlipForm({ nextSlipNo, products, customers, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
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
      [product.name, product.code, product.barcode].some((value) =>
        String(value || "").toLocaleLowerCase("tr-TR").includes(query),
      ),
    );
  }, [form.search, products]);

  const totals = useMemo(() => calculateTotals(items), [items]);
  const hasStockWarning = items.some((item) => item.quantity > item.availableStock);

  function updateForm(key, value) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
    if (key === "search") setBarcodeMessage(null);
  }

  function addSelectedProduct() {
    const selectedProduct =
      products.find((product) => product.id === Number(form.productId)) || findProductByBarcode(products, form.search);
    if (!selectedProduct) {
      setBarcodeMessage({ type: "error", text: "Ürün bulunamadı." });
      return;
    }

    const existingItem = items.find((item) => item.productId === selectedProduct.id);
    const nextQuantity = (existingItem?.quantity || 0) + 1;
    if (nextQuantity > selectedProduct.stockQuantity) {
      setBarcodeMessage({ type: "error", text: `Stok yetersiz. Mevcut stok: ${selectedProduct.stockQuantity}` });
      return;
    }

    const action = addOrIncreaseItem(selectedProduct);
    setForm((currentForm) => ({ ...currentForm, productId: "", search: "" }));
    setBarcodeMessage({
      type: "success",
      text:
        action === "increase"
          ? `${selectedProduct.name} miktarı artırıldı.`
          : `${selectedProduct.name} satıra eklendi.`,
    });
    setFormError("");
  }

  function addOrIncreaseItem(product) {
    const action = items.some((item) => item.productId === product.id) ? "increase" : "add";

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id);
      if (!existingItem) return [...currentItems, createSalesItem(product)];

      return currentItems.map((item) =>
        item.productId === product.id ? calculateLine({ ...item, quantity: item.quantity + 1 }) : item,
      );
    });

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
    setFormError("");
    setBarcodeMessage(null);
    requestAnimationFrame(() => barcodeInputRef.current?.focus());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const customer = customers.find((item) => item.id === Number(form.customerId));

    if (!customer || items.length === 0) return;

    if (hasStockWarning) {
      setFormError("Mevcut stoktan fazla adet girilen satırlar var. Fiş kaydedilemez.");
      return;
    }

    onSave({
      slipNo: nextSlipNo,
      date: form.date,
      customerId: customer.id,
      customerName: customer.name,
      saleType: form.saleType,
      cargoInfo: form.cargoInfo,
      items,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      grandTotal: totals.grandTotal,
      description: form.description,
    });

    resetForm();
  }

  return (
    <section className="table-panel purchase-form-panel">
      <div className="section-heading">
        <Save size={19} />
        <h2>Yeni Satış Fişi</h2>
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
          <span>Satış Tipi</span>
          <select value={form.saleType} onChange={(event) => updateForm("saleType", event.target.value)}>
            {saleTypes.map((saleType) => (
              <option value={saleType} key={saleType}>
                {saleType}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field purchase-search-field">
          <span>Hızlı Barkod Girişi / Ürün Arama</span>
          <input
            ref={barcodeInputRef}
            value={form.search}
            onChange={(event) => updateForm("search", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSelectedProduct();
              }
            }}
            placeholder="Barkod, ürün kodu veya ürün adı"
          />
          {barcodeMessage && <span className={`barcode-message barcode-message-${barcodeMessage.type}`}>{barcodeMessage.text}</span>}
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

        <div className="purchase-items-area">
          <SalesSlipItemsTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
        </div>

        {formError && <p className="error-message purchase-note">{formError}</p>}

        <label className="filter-field notes-field">
          <span>Kargo Bilgisi</span>
          <textarea value={form.cargoInfo} onChange={(event) => updateForm("cargoInfo", event.target.value)} />
        </label>
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
          <div className="grand-total">
            <span>Genel Toplam</span>
            <strong>{formatCurrency(totals.grandTotal)}</strong>
          </div>
        </div>

        <p className="form-note purchase-note">
          Not: Satış fişi kaydedildiğinde gerçek sistemde stok düşer ve müşteri carisine borç işlenir.
        </p>

        <div className="modal-actions purchase-actions">
          <button className="secondary-action" type="button" onClick={resetForm}>
            <RotateCcw size={17} />
            Temizle
          </button>
          <button className="primary-action" type="submit" disabled={hasStockWarning}>
            <Save size={18} />
            Fişi Kaydet
          </button>
        </div>
      </form>
    </section>
  );
}

function findProductByBarcode(products, value) {
  const barcode = value.trim();
  if (!barcode) return null;
  return products.find((product) => String(product.barcode || "").trim() === barcode) || null;
}

function createSalesItem(product) {
  return calculateLine({
    id: Date.now(),
    productId: product.id,
    productCode: product.code,
    barcode: product.barcode,
    productName: product.name,
    size: product.size,
    color: product.color,
    quantity: 1,
    unitPrice: product.salePrice,
    discountRate: 0,
    availableStock: product.stockQuantity,
  });
}

function calculateLine(item) {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discountRate = Number(item.discountRate) || 0;
  const grossTotal = quantity * unitPrice;
  const discountAmount = grossTotal * (discountRate / 100);

  return {
    ...item,
    quantity,
    unitPrice,
    discountRate,
    lineTotal: grossTotal - discountAmount,
  };
}

function calculateTotals(items) {
  return items.reduce(
    (totals, item) => {
      const grossTotal = item.quantity * item.unitPrice;
      const discountAmount = grossTotal * (item.discountRate / 100);

      return {
        subtotal: totals.subtotal + grossTotal,
        discountTotal: totals.discountTotal + discountAmount,
        grandTotal: totals.grandTotal + grossTotal - discountAmount,
      };
    },
    { subtotal: 0, discountTotal: 0, grandTotal: 0 },
  );
}
