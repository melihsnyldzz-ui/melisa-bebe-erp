import { useEffect, useRef, useState } from "react";
import { Barcode, CheckCircle2, Search, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";
import { findProductByCodeOrBarcode, normalizeLookupValue } from "../../utils/productLookup.js";

const BOUNCE_GUARD_MS = 400;

export default function BarcodeTestPanel({ products, viewCosts }) {
  const [lookupValue, setLookupValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [lastScan, setLastScan] = useState(null);
  const inputRef = useRef(null);
  const lastAcceptedScanRef = useRef({ normalizedValue: "", time: 0 });

  useEffect(() => {
    focusInput();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const rawValue = lookupValue;
    const normalizedValue = normalizeLookupValue(rawValue);
    setLastScan({ rawValue, normalizedValue });

    if (!normalizedValue) {
      setError("Barkod, ürün kodu veya varyant kodu girin.");
      setResult(null);
      focusInput();
      return;
    }

    if (isBounceScan(normalizedValue)) {
      focusInput();
      return;
    }

    const product = findProductByCodeOrBarcode(products, normalizedValue);
    const time = new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

    setAttempts((currentAttempts) => [
      {
        id: `${Date.now()}-${normalizedValue}`,
        rawValue,
        normalizedValue,
        productName: product?.name || "",
        success: Boolean(product),
        time,
      },
      ...currentAttempts.slice(0, 4),
    ]);

    if (!product) {
      setResult(null);
      setError("Ürün bulunamadı. Barkod, ürün kodu veya varyant kodunu kontrol edin.");
      focusInput();
      return;
    }

    setResult(product);
    setError("");
    setLookupValue("");
    focusInput();
  }

  function handleInputKeyDown(event) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    setLookupValue("");
    setError("");
    setResult(null);
    setLastScan(null);
    focusInput();
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
    <section className="barcode-test-panel table-panel">
      <div className="section-heading">
        <Barcode size={19} />
        <h2>Barkod Test Paneli</h2>
      </div>

      <form className="barcode-test-form" onSubmit={handleSubmit}>
        <label className="filter-field barcode-test-field">
          <span>Barkod testi</span>
          <input
            ref={inputRef}
            value={lookupValue}
            onChange={(event) => setLookupValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Barkod / ürün kodu / varyant kodu okut veya yaz"
            autoComplete="off"
          />
        </label>
        <button className="secondary-action" type="submit">
          <Search size={17} />
          Test Et
        </button>
      </form>

      {lastScan && <ScanTechnicalLine rawValue={lastScan.rawValue} normalizedValue={lastScan.normalizedValue} />}
      {error && <p className="barcode-test-message barcode-test-error">{error}</p>}
      {result && <ProductResultCard product={result} viewCosts={viewCosts} />}
      <RecentAttempts attempts={attempts} />
    </section>
  );
}

function ScanTechnicalLine({ rawValue, normalizedValue }) {
  return (
    <div className="barcode-technical-line">
      <span>Ham: {formatVisibleValue(rawValue)}</span>
      <span>Normalize: {normalizedValue || "-"}</span>
    </div>
  );
}

function ProductResultCard({ product, viewCosts }) {
  const stockStatus = getStockStatus(product);
  const details = [
    ["Ürün kodu", product.code],
    ["Barkod", product.barcode],
    ["Varyant kodu", product.variantCode],
    ["Model kodu", product.modelCode],
    ["Marka", product.brand],
    ["Sezon", product.season],
    ["Yaş grubu", product.ageGroup],
    ["Cinsiyet", product.gender],
    ["Beden", product.size],
    ["Renk", product.color],
    ["Stok miktarı", formatNumber(product.stockQuantity)],
    ["Kritik stok seviyesi", formatNumber(product.criticalStockLevel)],
    ["Satış fiyatı", formatCurrency(product.salePrice)],
  ];

  if (viewCosts) {
    details.push(["Alış fiyatı", formatCurrency(product.purchasePrice)]);
  }

  return (
    <div className="barcode-result-card">
      <div className="barcode-result-title">
        <div>
          <span>Bulunan ürün</span>
          <strong>{product.name}</strong>
        </div>
        <span className={`stock-status-badge ${stockStatus.className}`}>{stockStatus.label}</span>
      </div>
      <div className="barcode-result-grid">
        {details.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentAttempts({ attempts }) {
  if (!attempts.length) {
    return <p className="barcode-attempts-empty">Son 5 barkod denemesi burada listelenir.</p>;
  }

  return (
    <div className="barcode-attempts">
      <strong>Son 5 barkod denemesi</strong>
      <ul>
        {attempts.map((attempt) => (
          <li className={attempt.success ? "barcode-attempt-success" : "barcode-attempt-error"} key={attempt.id}>
            {attempt.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <div>
              <span>{formatVisibleValue(attempt.rawValue)}</span>
              <small>Normalize: {attempt.normalizedValue || "-"}</small>
              {attempt.productName && <strong>{attempt.productName}</strong>}
            </div>
            <small>{attempt.success ? "Başarılı" : "Başarısız"}</small>
            <time>{attempt.time}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getStockStatus(product) {
  const stockQuantity = Number(product.stockQuantity) || 0;
  const criticalStockLevel = Number(product.criticalStockLevel) || 0;

  if (stockQuantity <= 0) {
    return { label: "Stok yok", className: "stock-status-empty" };
  }

  if (stockQuantity <= criticalStockLevel) {
    return { label: "Kritik stok", className: "stock-status-critical" };
  }

  return { label: "Satışa uygun", className: "stock-status-ready" };
}

function formatVisibleValue(value) {
  const visibleValue = String(value || "")
    .replace(/\u00A0/g, "[NBSP]")
    .replace(/\t/g, "[TAB]")
    .replace(/\r/g, "[CR]")
    .replace(/\n/g, "[LF]")
    .replace(/\u200B/g, "[ZWSP]")
    .replace(/\u200C/g, "[ZWNJ]")
    .replace(/\u200D/g, "[ZWJ]")
    .replace(/\uFEFF/g, "[BOM]")
    .replace(/\u2060/g, "[WJ]");

  return visibleValue || "-";
}
