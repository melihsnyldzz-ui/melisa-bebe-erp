import { Barcode, PackageSearch, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { normalizeLookupValue } from "../../utils/productLookup.js";
import { formatNumber } from "../../utils/formatters.js";
import {
  appendWarehouseScanHistory,
  buildWarehouseProductView,
  clearWarehouseScanHistory,
  findWarehouseTerminalMatches,
  readWarehouseScanHistory,
} from "../../utils/warehouseTerminalUtils.js";
import {
  addProductToCountBasket,
  clearWarehouseCountBasket,
  readWarehouseCountBasket,
  removeCountBasketItem,
  updateCountBasketQuantity,
} from "../../utils/warehouseCountBasketUtils.js";
import TerminalCountBasket from "./TerminalCountBasket.jsx";
import TerminalProductCard from "./TerminalProductCard.jsx";
import TerminalScanHistory from "./TerminalScanHistory.jsx";
import TerminalTestScenarios from "./TerminalTestScenarios.jsx";

export default function WarehouseTerminalPanel({ products = [], stockMovements = [] }) {
  const [scanValue, setScanValue] = useState("");
  const [message, setMessage] = useState({ type: "info", text: "Barkod, ürün kodu veya varyant kodu okutun." });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [scanHistory, setScanHistory] = useState(() => readWarehouseScanHistory());
  const [countBasket, setCountBasket] = useState(() => readWarehouseCountBasket());
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

    const { exactProduct, partialProducts } = findWarehouseTerminalMatches(products, normalizedValue);
    if (exactProduct) {
      openProduct(exactProduct, scanValue);
      return;
    }

    if (partialProducts.length > 0) {
      setMatchedProducts(partialProducts);
      setMessage({ type: "info", text: `${partialProducts.length} ürün eşleşti. Listeden ürün seçin.` });
      focusInput();
      return;
    }

    setMatchedProducts([]);
    setMessage({ type: "error", text: "Ürün bulunamadı. Barkod veya ürün kodunu kontrol edin." });
    focusInput();
  }

  function openProduct(product, rawValue = scanValue) {
    const productView = buildWarehouseProductView(product, stockMovements);
    setSelectedProduct(productView);
    setMatchedProducts([]);
    setScanHistory((currentHistory) => appendWarehouseScanHistory(currentHistory, productView, rawValue));
    setMessage({ type: "success", text: `${productView.name || productView.code} okundu. Stok: ${formatNumber(productView.stockQuantity)}` });
    setScanValue("");
    focusInput();
  }

  function handleKeyDown(event) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    setScanValue("");
    setMatchedProducts([]);
    setMessage({ type: "info", text: "Giriş temizlendi. Yeni barkod okutabilirsiniz." });
    focusInput();
  }

  function clearScreen() {
    setScanValue("");
    setSelectedProduct(null);
    setMatchedProducts([]);
    setMessage({ type: "info", text: "Ekran temizlendi. Bu işlem veritabanına yazmaz." });
    focusInput();
  }

  function clearHistory() {
    setScanHistory(clearWarehouseScanHistory());
    setMessage({ type: "info", text: "Son okutulanlar geçmişi temizlendi. Veritabanına yazılmadı." });
    focusInput();
  }

  function addToBasket(productView) {
    setCountBasket((currentBasket) => addProductToCountBasket(currentBasket, productView));
    setMessage({ type: "success", text: `${productView?.name || "Ürün"} sayım sepetine eklendi. Stoklar değişmedi.` });
    focusInput();
  }

  function updateBasketQuantity(productId, value) {
    setCountBasket((currentBasket) => updateCountBasketQuantity(currentBasket, productId, value));
  }

  function removeBasketItem(productId) {
    setCountBasket((currentBasket) => removeCountBasketItem(currentBasket, productId));
    focusInput();
  }

  function clearBasket() {
    setCountBasket(clearWarehouseCountBasket());
    setMessage({ type: "info", text: "Sayım sepeti temizlendi. Veritabanına yazılmadı." });
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
              placeholder="Barkod, ürün kodu veya varyant kodu okutun..."
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

      <TerminalTestScenarios />

      {matchedProducts.length > 0 && <MatchedProductsPanel products={matchedProducts} onSelect={openProduct} />}

      <section className="warehouse-terminal-grid">
        <TerminalProductCard product={selectedProduct} onAddToBasket={addToBasket} />
        <TerminalScanHistory history={scanHistory} onClear={clearHistory} />
      </section>

      <TerminalCountBasket basket={countBasket} onClear={clearBasket} onRemove={removeBasketItem} onUpdateQuantity={updateBasketQuantity} />
    </>
  );
}

function MatchedProductsPanel({ onSelect, products }) {
  return (
    <section className="table-panel warehouse-terminal-card">
      <div className="section-heading">
        <PackageSearch size={19} />
        <h2>Eşleşen Ürünler</h2>
      </div>
      <div className="product-table-scroll">
        <table className="product-table warehouse-terminal-table">
          <thead>
            <tr>
              <th>Ürün adı</th>
              <th>Barkod</th>
              <th>Kod</th>
              <th>Beden</th>
              <th>Renk</th>
              <th>Stok</th>
              <th>Seç</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id || product.code || product.barcode}>
                <td className="strong-cell">{product.name || "-"}</td>
                <td className="barcode-cell">{product.barcode || "-"}</td>
                <td className="product-code-cell">{product.code || "-"}</td>
                <td>{product.size || "-"}</td>
                <td>{product.color || "-"}</td>
                <td>{formatNumber(product.stockQuantity)}</td>
                <td>
                  <button className="secondary-action small-action" type="button" onClick={() => onSelect(product, product.barcode || product.code)}>
                    Seç
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
