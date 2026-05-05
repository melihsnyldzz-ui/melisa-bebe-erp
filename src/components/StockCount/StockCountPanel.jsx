import { Barcode, FileJson, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { findProductByCodeOrBarcode, normalizeLookupValue } from "../../utils/productLookup.js";
import {
  buildStockCountReport,
  buildStockCountSummary,
  calculateStockCountLine,
  createStockCountLine,
} from "../../utils/stockCountUtils.js";
import StockCountItemsTable from "./StockCountItemsTable.jsx";
import StockCountSummary from "./StockCountSummary.jsx";

const BOUNCE_GUARD_MS = 450;

export default function StockCountPanel({ products }) {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState(null);
  const [report, setReport] = useState(null);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const inputRef = useRef(null);
  const lastAcceptedScanRef = useRef({ normalizedValue: "", time: 0 });

  useEffect(() => {
    focusInput();
  }, []);

  const summary = useMemo(() => buildStockCountSummary(items), [items]);
  const filteredItems = useMemo(() => filterItems(items, filter, search), [filter, items, search]);

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

    const product = findProductByCodeOrBarcode(products, normalizedValue);
    if (!product) {
      setMessage({ type: "error", text: "Ürün bulunamadı. Barkodu kontrol edin." });
      focusInput();
      return;
    }

    addProduct(product);
    setMessage({ type: "success", text: `${product.name} sayım listesine eklendi.` });
    setBarcodeValue("");
    setReport(null);
    focusInput();
  }

  function handleBarcodeKeyDown(event) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    setBarcodeValue("");
    setMessage(null);
    focusInput();
  }

  function addProduct(product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id ? calculateStockCountLine({ ...item, countedQuantity: item.countedQuantity + 1 }) : item,
        );
      }

      return [createStockCountLine(product), ...currentItems];
    });
  }

  function updateQuantity(productId, value) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? calculateStockCountLine({ ...item, countedQuantity: value === "" ? 0 : Math.max(0, Number(value) || 0) })
          : item,
      ),
    );
    setReport(null);
  }

  function removeItem(productId) {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
    setReport(null);
    focusInput();
  }

  function resetCount() {
    setBarcodeValue("");
    setFilter("all");
    setItems([]);
    setMessage(null);
    setReport(null);
    setSearch("");
    lastAcceptedScanRef.current = { normalizedValue: "", time: 0 };
    focusInput();
  }

  function prepareReport() {
    const payload = buildStockCountReport(items);
    setReport(payload);
    setMessage({ type: "success", text: "Sayım raporu hazırlandı. Bu sürümde stoklar güncellenmez." });
  }

  function isBounceScan(normalizedValue) {
    const now = Date.now();
    const lastScanInfo = lastAcceptedScanRef.current;
    const isDuplicate = lastScanInfo.normalizedValue === normalizedValue && now - lastScanInfo.time < BOUNCE_GUARD_MS;

    if (!isDuplicate) {
      lastAcceptedScanRef.current = { normalizedValue, time: now };
    }

    return isDuplicate;
  }

  function focusInput() {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <>
      <section className="table-panel stock-count-panel">
        <div className="section-heading">
          <Barcode size={19} />
          <h2>Barkod Okutma</h2>
        </div>

        <form className="stock-count-scan-form" onSubmit={handleBarcodeSubmit}>
          <label className="filter-field">
            <span>Barkod / Ürün Kodu / Varyant Kodu</span>
            <input
              ref={inputRef}
              value={barcodeValue}
              onChange={(event) => {
                setBarcodeValue(event.target.value);
                if (message?.type === "error") setMessage(null);
              }}
              onKeyDown={handleBarcodeKeyDown}
              placeholder="Barkod okut veya manuel yaz"
              autoComplete="off"
            />
          </label>
          <button className="primary-action" type="submit">
            <Barcode size={18} />
            Sayıma Ekle
          </button>
        </form>

        {message && <p className={`barcode-message stock-count-message barcode-message-${message.type}`}>{message.text}</p>}

        <div className="stock-count-filters">
          <label className="filter-field">
            <span>Liste Arama</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ürün adı, kodu veya barkod" />
          </label>
          <label className="filter-field">
            <span>Durum</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">Tümü</option>
              <option value="MATCHED">Uyumlu</option>
              <option value="SHORTAGE">Eksik</option>
              <option value="SURPLUS">Fazla</option>
            </select>
          </label>
        </div>

        <div className="modal-actions stock-count-actions">
          <button className="secondary-action" type="button" onClick={resetCount}>
            <RotateCcw size={17} />
            Sayımı Temizle
          </button>
          <button className="primary-action" type="button" onClick={prepareReport}>
            <FileJson size={18} />
            Sayım Raporunu Hazırla
          </button>
        </div>
      </section>

      <StockCountSummary summary={summary} />
      <StockCountItemsTable items={filteredItems} onRemoveItem={removeItem} onUpdateQuantity={updateQuantity} />

      <section className="table-panel stock-count-report-panel">
        <div className="section-heading">
          <FileJson size={19} />
          <h2>Sayım Raporu</h2>
        </div>
        <p className="form-note stock-count-note">
          Bu sürüm yalnızca sayım raporu oluşturur. Stok düzeltme işlemi sonraki sürümde onaylı şekilde eklenecektir.
        </p>
        {report ? (
          <pre className="stock-count-report-preview">{JSON.stringify(report, null, 2)}</pre>
        ) : (
          <p className="empty-table-text">Rapor payload’ını görmek için “Sayım Raporunu Hazırla” butonunu kullanın.</p>
        )}
      </section>
    </>
  );
}

function filterItems(items, filter, search) {
  const query = normalizeLookupValue(search);
  return items.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      !query ||
      [item.productName, item.productCode, item.barcode].some((value) => normalizeLookupValue(value).includes(query));

    return matchesFilter && matchesSearch;
  });
}
