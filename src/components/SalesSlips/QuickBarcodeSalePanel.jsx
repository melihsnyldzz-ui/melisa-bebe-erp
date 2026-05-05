import { useEffect, useMemo, useRef, useState } from "react";
import { Barcode, RotateCcw, Save, Trash2 } from "lucide-react";
import { getTodayISO } from "../../utils/dateUtils.js";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";
import { findProductByCodeOrBarcode, normalizeLookupValue } from "../../utils/productLookup.js";

const BOUNCE_GUARD_MS = 400;

export default function QuickBarcodeSalePanel({ customers, getCurrentSlipNo, onSave, products }) {
  const [customerId, setCustomerId] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const lastAcceptedScanRef = useRef({ normalizedValue: "", time: 0 });

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        const currentProduct = products.find((product) => product.id === item.productId);
        if (!currentProduct) return item;

        return {
          ...item,
          availableStock: Number(currentProduct.stockQuantity) || 0,
          unitPrice: Number(currentProduct.salePrice) || item.unitPrice,
        };
      }),
    );
  }, [products]);

  const activeCustomers = useMemo(() => customers.filter((customer) => customer.isActive !== false), [customers]);
  const totals = useMemo(() => calculateTotals(items), [items]);
  const hasStockWarning = items.some((item) => item.quantity > item.availableStock);

  function handleBarcodeSubmit(event) {
    event.preventDefault();

    const normalizedValue = normalizeLookupValue(barcodeValue);
    if (!normalizedValue) {
      setMessage({ type: "error", text: "Barkod, ürün kodu veya varyant kodu okutun." });
      focusInput();
      return;
    }

    if (isBounceScan(normalizedValue)) {
      focusInput();
      return;
    }

    const matchedProduct = findProductByCodeOrBarcode(products, normalizedValue);
    if (!matchedProduct) {
      setMessage({ type: "error", text: "Ürün bulunamadı." });
      focusInput();
      return;
    }

    if (matchedProduct.isActive === false) {
      setMessage({ type: "error", text: "Bu ürün pasif durumda, satışa eklenemez." });
      focusInput();
      return;
    }

    const product = findProductByCodeOrBarcode(products, normalizedValue, { activeOnly: true });
    const result = addProductToItems(product);
    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      focusInput();
      return;
    }

    setMessage({
      type: "success",
      text: result.action === "increase" ? "Ürün miktarı artırıldı." : "Ürün eklendi.",
    });
    setBarcodeValue("");
    focusInput();
  }

  function handleBarcodeKeyDown(event) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    setBarcodeValue("");
    setMessage(null);
    focusInput();
  }

  function addProductToItems(product) {
    const availableStock = Number(product.stockQuantity) || 0;
    if (availableStock <= 0) {
      return { ok: false, error: `Stok yetersiz. Mevcut stok: ${availableStock}` };
    }

    const existingItem = items.find((item) => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity + 1 > existingItem.availableStock) {
        return { ok: false, error: `Stok yetersiz. Mevcut stok: ${existingItem.availableStock}` };
      }

      setItems((currentItems) =>
        currentItems.map((item) => (item.productId === product.id ? calculateLine({ ...item, quantity: item.quantity + 1 }) : item)),
      );
      return { ok: true, action: "increase" };
    }

    setItems((currentItems) => [
      ...currentItems,
      calculateLine({
        id: `${Date.now()}-${product.id}`,
        productId: product.id,
        productCode: product.code,
        barcode: product.barcode,
        productName: product.name,
        size: product.size,
        color: product.color,
        quantity: 1,
        unitPrice: product.salePrice,
        discountRate: 0,
        availableStock,
      }),
    ]);
    return { ok: true, action: "add" };
  }

  function updateItem(itemId, key, value) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item;

        if (key === "quantity") {
          const requestedQuantity = Math.max(1, Number(value) || 1);
          const quantity = Math.min(requestedQuantity, item.availableStock);
          if (requestedQuantity > item.availableStock) {
            setMessage({ type: "error", text: `Stok yetersiz. Mevcut stok: ${item.availableStock}` });
          }
          return calculateLine({ ...item, quantity });
        }

        if (key === "discountRate") {
          const discountRate = Math.min(100, Math.max(0, Number(value) || 0));
          return calculateLine({ ...item, discountRate });
        }

        return item;
      }),
    );
  }

  function removeItem(itemId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    focusInput();
  }

  function resetPanel() {
    setCustomerId("");
    setBarcodeValue("");
    setItems([]);
    setMessage(null);
    lastAcceptedScanRef.current = { normalizedValue: "", time: 0 };
    focusInput();
  }

  async function handleSaveSale() {
    const customer = activeCustomers.find((item) => item.id === Number(customerId));
    if (!customer) {
      setMessage({ type: "error", text: "Müşteri seçin." });
      focusInput();
      return;
    }

    if (!items.length) {
      setMessage({ type: "error", text: "En az bir ürün okutun." });
      focusInput();
      return;
    }

    if (hasStockWarning) {
      setMessage({ type: "error", text: "Stok yetersiz satırlar varken satış kaydedilemez." });
      focusInput();
      return;
    }

    const stockValidation = validateItemsAgainstCurrentProducts(items, products);
    if (!stockValidation.ok) {
      syncItemStocks();
      setMessage({ type: "error", text: stockValidation.error });
      focusInput();
      return;
    }

    setIsSaving(true);
    const currentSlipNo = getCurrentSlipNo();
    const result = await onSave(
      {
        slipNo: currentSlipNo,
        date: getTodayISO(),
        customerId: customer.id,
        customerName: customer.name,
        saleType: "Hızlı Barkodlu Satış",
        cargoInfo: "",
        items,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        grandTotal: totals.grandTotal,
        description: "Barkodlu hızlı satış ekranından kaydedildi.",
      },
      { source: "quickBarcodeSale" },
    );
    setIsSaving(false);

    if (result && !result.ok) {
      setMessage({ type: "error", text: result.error || "Satış fişi kaydedilemedi." });
      focusInput();
      return;
    }

    const savedSlipNo = result.data?.slipNo || currentSlipNo;
    resetPanel();
    setMessage({ type: "success", text: `${savedSlipNo} numaralı satış fişi kaydedildi.` });
  }

  function syncItemStocks() {
    setItems((currentItems) =>
      currentItems.map((item) => {
        const currentProduct = products.find((product) => product.id === item.productId);
        return currentProduct ? { ...item, availableStock: Number(currentProduct.stockQuantity) || 0 } : item;
      }),
    );
  }

  function isBounceScan(normalizedValue) {
    const now = Date.now();
    const lastScanInfo = lastAcceptedScanRef.current;
    const isDuplicate =
      lastScanInfo.normalizedValue === normalizedValue && now - lastScanInfo.time < BOUNCE_GUARD_MS;

    if (!isDuplicate) {
      lastAcceptedScanRef.current = { normalizedValue, time: now };
    }

    return isDuplicate;
  }

  function focusInput() {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <section className="table-panel quick-sale-panel">
      <div className="section-heading">
        <Barcode size={19} />
        <h2>Barkodlu Hızlı Satış</h2>
      </div>

      <div className="quick-sale-controls">
        <label className="filter-field">
          <span>Müşteri</span>
          <select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
            <option value="">Müşteri seç</option>
            {activeCustomers.map((customer) => (
              <option value={customer.id} key={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </label>

        <form className="quick-sale-barcode-form" onSubmit={handleBarcodeSubmit}>
          <label className="filter-field">
            <span>Barkod okut</span>
            <input
              ref={inputRef}
              value={barcodeValue}
              onChange={(event) => {
                setBarcodeValue(event.target.value);
                if (message?.type === "error") setMessage(null);
              }}
              onKeyDown={handleBarcodeKeyDown}
              placeholder="Barkod / ürün kodu / varyant kodu okut veya yaz"
              autoComplete="off"
            />
          </label>
        </form>
      </div>

      {message && <p className={`barcode-message quick-sale-message barcode-message-${message.type}`}>{message.text}</p>}

      <QuickSaleItemsTable items={items} onRemoveItem={removeItem} onUpdateItem={updateItem} />

      <div className="quick-sale-totals">
        <div>
          <span>Toplam adet</span>
          <strong>{formatNumber(totals.totalQuantity)}</strong>
        </div>
        <div>
          <span>Ara toplam</span>
          <strong>{formatCurrency(totals.subtotal)}</strong>
        </div>
        <div>
          <span>İskonto toplamı</span>
          <strong>{formatCurrency(totals.discountTotal)}</strong>
        </div>
        <div className="grand-total">
          <span>Genel toplam</span>
          <strong>{formatCurrency(totals.grandTotal)}</strong>
        </div>
      </div>

      <div className="modal-actions quick-sale-actions">
        <button className="secondary-action" type="button" onClick={resetPanel}>
          <RotateCcw size={17} />
          Temizle
        </button>
        <button className="primary-action" type="button" disabled={isSaving || hasStockWarning} onClick={handleSaveSale}>
          <Save size={18} />
          Satışı Kaydet
        </button>
      </div>
    </section>
  );
}

function QuickSaleItemsTable({ items, onRemoveItem, onUpdateItem }) {
  return (
    <div className="product-table-scroll quick-sale-table-wrap">
      <table className="quick-sale-table">
        <thead>
          <tr>
            <th>Ürün</th>
            <th>Ürün Kodu</th>
            <th>Barkod</th>
            <th>Beden</th>
            <th>Renk</th>
            <th>Miktar</th>
            <th>Birim fiyat</th>
            <th>İskonto %</th>
            <th>Satır toplamı</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="strong-cell">{item.productName}</td>
              <td className="product-code-cell">{item.productCode}</td>
              <td className="barcode-cell">{item.barcode}</td>
              <td>{item.size || "-"}</td>
              <td>{item.color || "-"}</td>
              <td>
                <input
                  className={`line-input ${item.quantity > item.availableStock ? "line-input-danger" : ""}`}
                  min="1"
                  max={item.availableStock}
                  type="number"
                  value={item.quantity}
                  onChange={(event) => onUpdateItem(item.id, "quantity", event.target.value)}
                />
              </td>
              <td>{formatCurrency(item.unitPrice)}</td>
              <td>
                <input
                  className="line-input"
                  min="0"
                  max="100"
                  type="number"
                  value={item.discountRate}
                  onChange={(event) => onUpdateItem(item.id, "discountRate", event.target.value)}
                />
              </td>
              <td className="strong-cell">{formatCurrency(item.lineTotal)}</td>
              <td>
                <button className="icon-button small" aria-label="Satırı kaldır" type="button" onClick={() => onRemoveItem(item.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="empty-table-text">Hızlı satışa ürün eklemek için barkod okutun.</p>}
    </div>
  );
}

function validateItemsAgainstCurrentProducts(items, products) {
  for (const item of items) {
    const currentProduct = products.find((product) => product.id === item.productId);
    const availableStock = Number(currentProduct?.stockQuantity) || 0;

    if (!currentProduct || item.quantity > availableStock) {
      return {
        ok: false,
        error: `Stok güncellendi. ${item.productName} için mevcut stok: ${availableStock}`,
      };
    }
  }

  return { ok: true };
}

function calculateLine(item) {
  const quantity = Math.max(1, Number(item.quantity) || 1);
  const unitPrice = Number(item.unitPrice) || 0;
  const discountRate = Math.min(100, Math.max(0, Number(item.discountRate) || 0));
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
        totalQuantity: totals.totalQuantity + item.quantity,
        subtotal: totals.subtotal + grossTotal,
        discountTotal: totals.discountTotal + discountAmount,
        grandTotal: totals.grandTotal + grossTotal - discountAmount,
      };
    },
    { totalQuantity: 0, subtotal: 0, discountTotal: 0, grandTotal: 0 },
  );
}
