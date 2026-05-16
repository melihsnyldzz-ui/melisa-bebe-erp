import { useMemo, useState } from "react";
import { Copy, Database, PackageSearch, Search, ShieldCheck, Warehouse } from "lucide-react";
import "../productSearchCenter.css";

const searchTypes = [
  { value: "barcode", label: "Barkod" },
  { value: "stockCode", label: "Stok Kodu" },
  { value: "productName", label: "Ürün Adı" },
  { value: "stockNo", label: "Stok No" },
];

const modeLabels = {
  warehouse: "Depo Modu",
  sales: "Satış Modu",
};

function normalizeProduct(item) {
  return {
    barcode: item?.BARCODE || item?.barcode || "",
    stockNo: item?.STOKNO || item?.IND || "",
    stockCode: item?.STOKKODU || "",
    productName: item?.MALINCINSI || "",
    description: item?.ACIKLAMA || "",
  };
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("tr-TR");
}

function buildSalesText(product) {
  const lines = [
    product.stockCode ? `Ürün Kodu: ${product.stockCode}` : null,
    product.productName ? `Ürün: ${product.productName}` : null,
  ].filter(Boolean);

  return lines.join("\n") || "Ürün bilgisi hazırlanamadı.";
}

export default function ProductSearchCenter() {
  const [mode, setMode] = useState("warehouse");
  const [searchType, setSearchType] = useState("barcode");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("HAZIR");
  const [message, setMessage] = useState("Ürün aramak için barkod, stok kodu, ürün adı veya stok no girin.");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [movementStatus, setMovementStatus] = useState("HAZIR");
  const [copied, setCopied] = useState(false);

  const selectedSalesText = useMemo(() => (selectedProduct ? buildSalesText(selectedProduct) : ""), [selectedProduct]);

  function validateSearch() {
    const value = query.trim();

    if (!value) return "Arama alanı boş olamaz.";
    if (searchType === "barcode" && !/^\d{8,20}$/.test(value)) return "Barkod 8-20 karakter arası ve sadece rakam olmalıdır.";
    if (searchType !== "barcode" && value.length < 2) return "Arama en az 2 karakter olmalıdır.";
    if (searchType !== "barcode" && value.length > 50) return "Arama en fazla 50 karakter olmalıdır.";
    if (searchType === "stockNo" && !/^\d+$/.test(value)) return "Stok no sadece rakamlardan oluşmalıdır.";

    return null;
  }

  async function runSearch(event) {
    event?.preventDefault();
    const validationError = validateSearch();

    if (validationError) {
      setStatus("GEÇERSİZ ARAMA");
      setMessage(validationError);
      setResults([]);
      setSelectedProduct(null);
      setMovements([]);
      return;
    }

    const api = window.electronAPI?.vegaReadOnly;
    if (!api) {
      setStatus("HATA");
      setMessage("Electron read-only köprüsü bulunamadı. Bu ekran desktop ortamında çalışır.");
      return;
    }

    setStatus("ARANIYOR");
    setMessage("Read-only ürün araması yapılıyor...");
    setCopied(false);

    try {
      const value = query.trim();
      const response =
        searchType === "barcode"
          ? await api.findProductByBarcode(value)
          : await api.searchStockCards({ type: searchType, query: value });

      const items = Array.isArray(response?.items) ? response.items.map(normalizeProduct) : [];
      setResults(items);
      setSelectedProduct(items[0] || null);
      setMovements([]);

      if (response?.status === "error") {
        setStatus("HATA");
        setMessage(response.message || "Arama güvenli şekilde durduruldu.");
        return;
      }

      setStatus(items.length ? "BULUNDU" : "BULUNAMADI");
      setMessage(items.length ? `${items.length} ürün bulundu. Maksimum 20 sonuç gösterilir.` : "Bu arama için ürün bulunamadı.");
    } catch {
      setStatus("HATA");
      setMessage("Ürün araması başarısız oldu. Ham hata gizlendi.");
      setResults([]);
      setSelectedProduct(null);
      setMovements([]);
    }
  }

  async function loadMovements(product = selectedProduct) {
    if (!product?.stockNo) return;

    const api = window.electronAPI?.vegaReadOnly;
    if (!api?.listStockMovementsByStockNo) {
      setMovementStatus("HATA");
      return;
    }

    setMovementStatus("ARANIYOR");

    try {
      const response = await api.listStockMovementsByStockNo(product.stockNo);
      const items = Array.isArray(response?.items) ? response.items : [];
      setMovements(items);
      setMovementStatus(response?.status === "error" ? "HATA" : items.length ? "BULUNDU" : "BULUNAMADI");
    } catch {
      setMovements([]);
      setMovementStatus("HATA");
    }
  }

  async function copySalesText() {
    if (!selectedSalesText) return;

    try {
      await navigator.clipboard.writeText(selectedSalesText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  function selectProduct(product) {
    setSelectedProduct(product);
    setMovements([]);
    setMovementStatus("HAZIR");
    setCopied(false);
  }

  return (
    <section className="product-search-center-page">
      <div className="product-search-hero">
        <div>
          <span className="eyebrow">v10.4–v10.7 geliştirme paketi</span>
          <h1>Ürün Bulma Merkezi</h1>
          <p>Depo ve satış ekibi için barkod, stok kodu, ürün adı ve stok no ile read-only ürün arama ekranı.</p>
        </div>
        <div className="security-strip" aria-label="Güvenlik kuralları">
          <span>READ-ONLY</span>
          <span>TOP 20</span>
          <span>FAIL-CLOSED</span>
          <span>VEGA WRITE KAPALI</span>
        </div>
      </div>

      <div className="mode-switch" role="group" aria-label="Kullanım modu">
        {Object.entries(modeLabels).map(([value, label]) => (
          <button key={value} className={mode === value ? "active" : ""} type="button" onClick={() => setMode(value)}>
            {value === "warehouse" ? <Warehouse size={18} /> : <PackageSearch size={18} />}
            {label}
          </button>
        ))}
      </div>

      <form className="product-search-panel" onSubmit={runSearch}>
        <label>
          Arama Tipi
          <select value={searchType} onChange={(event) => setSearchType(event.target.value)}>
            {searchTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>
        <label className="search-input-label">
          Arama
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Örn: 9452549221582 / 2158 / BATİK / 51652"
          />
        </label>
        <button type="submit">
          <Search size={18} />
          Ara
        </button>
      </form>

      <div className={`status-card status-${status.toLowerCase().replaceAll(" ", "-").replaceAll("ı", "i")}`}>
        <strong>{status}</strong>
        <span>{message}</span>
      </div>

      <div className="product-search-layout">
        <div className="result-list-card">
          <h2>Sonuçlar</h2>
          {results.length === 0 ? (
            <p className="empty-state">Henüz ürün listesi yok.</p>
          ) : (
            <div className="product-result-list">
              {results.map((product, index) => (
                <button
                  className={`product-result-card ${selectedProduct?.stockNo === product.stockNo ? "selected" : ""}`}
                  key={`${product.stockNo}-${product.stockCode}-${index}`}
                  type="button"
                  onClick={() => selectProduct(product)}
                >
                  <strong>{product.stockCode || "Stok kodu yok"}</strong>
                  <span>{product.productName || "Ürün adı yok"}</span>
                  <small>STOKNO: {product.stockNo || "-"}</small>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="selected-product-card">
          <h2>Ürün Kartı</h2>
          {selectedProduct ? (
            <>
              <div className="product-main-title">
                <span>{selectedProduct.stockCode || "-"}</span>
                <strong>{selectedProduct.productName || "Ürün adı yok"}</strong>
              </div>
              <div className="product-detail-grid">
                <span>STOKNO</span><strong>{selectedProduct.stockNo || "-"}</strong>
                <span>BARKOD</span><strong>{selectedProduct.barcode || "-"}</strong>
                <span>AÇIKLAMA</span><strong>{selectedProduct.description || "-"}</strong>
              </div>
              <button className="secondary-action" type="button" onClick={() => loadMovements(selectedProduct)}>
                <Database size={17} />
                Son 20 Stok Hareketini Göster
              </button>
            </>
          ) : (
            <p className="empty-state">Ürün seçilmedi.</p>
          )}
        </div>

        {mode === "sales" && (
          <div className="sales-reply-card">
            <h2>Satış Cevap Metni</h2>
            <textarea readOnly value={selectedSalesText || "Ürün seçildiğinde satış metni burada oluşur."} />
            <button type="button" onClick={copySalesText} disabled={!selectedProduct}>
              <Copy size={17} />
              Kopyala
            </button>
            <small>{copied ? "Kopyalandı." : "Otomatik WhatsApp/Instagram gönderimi yoktur."}</small>
          </div>
        )}
      </div>

      <div className="movement-card">
        <div className="movement-card-header">
          <h2>Stok Görünürlük Paneli</h2>
          <span>{movementStatus}</span>
        </div>
        {movements.length === 0 ? (
          <p className="empty-state">Stok hareketleri henüz yüklenmedi.</p>
        ) : (
          <div className="movement-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Depo</th>
                  <th>Giren</th>
                  <th>Çıkan</th>
                  <th>Kalan</th>
                  <th>Tarih</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement, index) => (
                  <tr key={`${movement.STOKNO}-${movement.TARIH}-${index}`}>
                    <td>{movement.DEPO ?? "-"}</td>
                    <td>{movement.GIREN ?? "-"}</td>
                    <td>{movement.CIKAN ?? "-"}</td>
                    <td>{movement.KALAN ?? "-"}</td>
                    <td>{formatDateTime(movement.TARIH)}</td>
                    <td>{movement.ACIKLAMA ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="product-search-safety-note">
        <ShieldCheck size={20} />
        <span>Bu ekran yalnızca read-only arama ve görünürlük sağlar. Fiyat, stok taahhüdü, kayıt, export, sync veya Vega write işlemi içermez.</span>
      </div>
    </section>
  );
}
