import { Barcode, PackageSearch, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { findProductByCodeOrBarcode, normalizeLookupValue } from "../../utils/productLookup.js";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";
import { formatDateTR } from "../../utils/dateUtils.js";
import { appendWarehouseScanHistory, buildWarehouseProductView } from "../../utils/warehouseTerminalUtils.js";

export default function WarehouseTerminalPanel({ products = [], stockMovements = [] }) {
  const [scanValue, setScanValue] = useState("");
  const [message, setMessage] = useState({ type: "info", text: "Barkod, ürün kodu veya varyant kodu okutun." });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    focusInput();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedValue = normalizeLookupValue(scanValue);

    if (!normalizedValue) {
      setMessage({ type: "error", text: "Okutulacak barkod veya ürün kodu boş olamaz." });
      focusInput();
      return;
    }

    const product = findProductByCodeOrBarcode(products, normalizedValue);
    if (!product) {
      setMessage({ type: "error", text: "Ürün bulunamadı. Barkod veya ürün kodunu kontrol edin." });
      focusInput();
      return;
    }

    const productView = buildWarehouseProductView(product, stockMovements);
    setSelectedProduct(productView);
    setScanHistory((currentHistory) => appendWarehouseScanHistory(currentHistory, productView, scanValue));
    setMessage({ type: "success", text: `${productView.name || productView.code} okundu. Stok: ${formatNumber(productView.stockQuantity)}` });
    setScanValue("");
    focusInput();
  }

  function handleKeyDown(event) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    setScanValue("");
    setMessage({ type: "info", text: "Giriş temizlendi. Yeni barkod okutabilirsiniz." });
    focusInput();
  }

  function clearScreen() {
    setScanValue("");
    setSelectedProduct(null);
    setScanHistory([]);
    setMessage({ type: "info", text: "Ekran temizlendi. Bu işlem veritabanına yazmaz." });
    focusInput();
  }

  function focusInput() {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <>
      <section className="table-panel warehouse-terminal-panel">
        <div className="section-heading">
          <Barcode size={20} />
          <h2>Terminal Okuma</h2>
        </div>
        <form className="warehouse-terminal-scan-form" onSubmit={handleSubmit}>
          <label className="filter-field warehouse-terminal-input">
            <span>Barkod / Ürün Kodu / Varyant Kodu</span>
            <input
              ref={inputRef}
              value={scanValue}
              onChange={(event) => setScanValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Okut veya manuel yaz"
              autoComplete="off"
            />
          </label>
          <button className="primary-action warehouse-terminal-submit" type="submit">
            <PackageSearch size={20} />
            Oku
          </button>
          <button className="secondary-action warehouse-terminal-clear" type="button" onClick={clearScreen}>
            <RotateCcw size={18} />
            Temizle
          </button>
        </form>
        {message && <p className={`barcode-message barcode-message-${message.type} warehouse-terminal-message`}>{message.text}</p>}
        <p className="form-note warehouse-terminal-note">
          Okuma modu salt okunurdur. Stok değiştirmez, fiş oluşturmaz, cari veya veritabanı kaydı yapmaz.
        </p>
      </section>

      <section className="warehouse-terminal-grid">
        <ProductReadCard product={selectedProduct} />
        <ScanHistoryCard history={scanHistory} />
      </section>
    </>
  );
}

function ProductReadCard({ product }) {
  if (!product) {
    return (
      <section className="table-panel warehouse-terminal-card warehouse-terminal-empty">
        <h2>Ürün Bilgisi</h2>
        <p className="empty-table-text">Ürün bilgisi görmek için barkod, ürün kodu veya varyant kodu okutun.</p>
      </section>
    );
  }

  return (
    <section className="table-panel warehouse-terminal-card">
      <div className="warehouse-terminal-product-head">
        <div>
          <span>{product.code || "-"}</span>
          <h2>{product.name || "-"}</h2>
          <p>{[product.brand, product.category, product.size, product.color].filter(Boolean).join(" / ") || "-"}</p>
        </div>
        <strong className={`warehouse-terminal-status ${product.status === "Satışa hazır" ? "status-ok" : "status-warn"}`}>{product.status}</strong>
      </div>
      <div className="warehouse-terminal-metrics">
        <Metric label="Mevcut Stok" value={formatNumber(product.stockQuantity)} />
        <Metric label="Kritik Seviye" value={formatNumber(product.criticalStockLevel)} />
        <Metric label="Satış Fiyatı" value={formatCurrency(product.salePrice)} />
        <Metric label="Tedarikçi" value={product.supplier || "-"} />
      </div>
      <div className="warehouse-terminal-detail-grid">
        <Detail label="Barkod" value={product.barcode} />
        <Detail label="Varyant Kodu" value={product.variantCode} />
        <Detail label="Model Kodu" value={product.modelCode} />
        <Detail label="Durum" value={product.isActive ? "Aktif" : "Pasif"} />
      </div>
      <div className="integrity-table-block">
        <h3>Son Stok Hareketleri</h3>
        <div className="product-table-scroll">
          <table className="product-table warehouse-terminal-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İşlem</th>
                <th>Giriş</th>
                <th>Çıkış</th>
                <th>Kalan</th>
                <th>Fiş</th>
              </tr>
            </thead>
            <tbody>
              {product.movements.map((movement) => (
                <tr key={movement.id || `${movement.relatedSlipNo}-${movement.date}`}>
                  <td>{movement.date ? formatDateTR(movement.date) : "-"}</td>
                  <td>{movement.movementType || "-"}</td>
                  <td className="stock-in">{formatNumber(movement.quantityIn)}</td>
                  <td className="stock-out">{formatNumber(movement.quantityOut)}</td>
                  <td>{formatNumber(movement.remainingStock)}</td>
                  <td>{movement.relatedSlipNo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {product.movements.length === 0 && <p className="empty-table-text">Bu ürün için stok hareketi bulunamadı.</p>}
      </div>
    </section>
  );
}

function ScanHistoryCard({ history }) {
  return (
    <section className="table-panel warehouse-terminal-card">
      <h2>Okuma Geçmişi</h2>
      {history.length === 0 ? (
        <p className="empty-table-text">Henüz terminal okuması yok.</p>
      ) : (
        <div className="warehouse-terminal-history">
          {history.map((item) => (
            <div className="warehouse-terminal-history-row" key={item.id}>
              <strong>{item.productName || item.productCode || "-"}</strong>
              <span>{item.barcode || item.scannedValue || "-"}</span>
              <small>
                {formatNumber(item.stockQuantity)} adet · {item.status}
              </small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="stock-count-report-metric">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}
