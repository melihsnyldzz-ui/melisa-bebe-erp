import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Database, Search, ShieldCheck } from "lucide-react";
import { currentReleaseVersion } from "../config/releaseHighlights.js";
import { canUseVegaReadOnlyBridge, listVegaStockReadOnly } from "../utils/desktopBridge.js";
import { formatCurrency, formatNumber } from "../utils/formatters.js";

const demoStockRows = [
  {
    stockCode: "DEMO-STK-001",
    barcode: "869000000001",
    productName: "Demo Bebek Body",
    brand: "Demo Marka",
    size: "3-6 Ay",
    color: "Ekru",
    quantity: 12,
    purchasePrice: 120,
    salePrice: 190,
  },
  {
    stockCode: "DEMO-STK-002",
    barcode: "869000000002",
    productName: "Demo Bebek Tulum",
    brand: "Demo Marka",
    size: "6-9 Ay",
    color: "Pudra",
    quantity: 7,
    purchasePrice: 160,
    salePrice: 260,
  },
];

const statusLabels = {
  not_configured: "Bağlantı yok",
  demo: "Demo veri",
  ready: "Vega read-only deneme",
  error: "Hata",
};

export default function VegaStockTrial() {
  const [query, setQuery] = useState("");
  const [stockState, setStockState] = useState({
    status: "not_configured",
    message: "Vega bağlantısı henüz yapılandırılmadı.",
    items: [],
  });

  useEffect(() => {
    let isActive = true;

    async function loadStockTrial() {
      if (!canUseVegaReadOnlyBridge()) {
        return;
      }

      try {
        const result = await listVegaStockReadOnly();
        if (isActive && result) {
          setStockState(result);
        }
      } catch (error) {
        if (isActive) {
          setStockState({
            status: "error",
            message: error?.message || "Vega read-only denemesi sırasında hata oluştu.",
            items: [],
          });
        }
      }
    }

    loadStockTrial();

    return () => {
      isActive = false;
    };
  }, []);

  const hasVegaRows = stockState.items?.length > 0;
  const visibleRows = hasVegaRows ? stockState.items : demoStockRows;
  const visibleStatus = stockState.status;
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredRows = useMemo(() => {
    if (!normalizedQuery) {
      return visibleRows;
    }

    return visibleRows.filter((row) =>
      [row.stockCode, row.barcode, row.productName].some((value) =>
        String(value || "")
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedQuery),
      ),
    );
  }, [normalizedQuery, visibleRows]);

  return (
    <>
      <section className="page-title vega-stock-trial-title">
        <div>
          <p>Deneme Modu</p>
          <h1>Vega Stok Deneme</h1>
          <span>Geçici test ekranıdır. Vega'dan sadece stok okunur, veri yazılmaz.</span>
        </div>
      </section>

      <section className="vega-stock-trial-panel section-updated-highlight" id="vega-stock-trial-panel">
        <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
        <div className="vega-stock-trial-header">
          <div>
            <h2>Stok Okuma Denemesi</h2>
            <p>Geçici test ekranıdır. Vega'dan sadece stok okunur, veri yazılmaz.</p>
          </div>
          <div className="vega-stock-status-list">
            <span className={`vega-stock-status ${visibleStatus}`}>{statusLabels[visibleStatus] || statusLabels.error}</span>
            {!hasVegaRows && <span className="vega-stock-status demo">Demo veri</span>}
            <span className="vega-stock-mode-chip">
              <ShieldCheck size={14} />
              Read-only
            </span>
            <span className="vega-stock-mode-chip">
              <Database size={14} />
              Veri yazılmaz
            </span>
          </div>
        </div>

        <div className="vega-stock-warning">
          <AlertTriangle size={18} />
          <span>
            {stockState.message} Gerçek Vega verisi ile demo veri aynı tabloda karıştırılmaz; bağlantı hazır olana kadar aşağıdaki
            satırlar açıkça demo olarak gösterilir.
          </span>
        </div>

        <label className="vega-stock-search">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Stok kodu, barkod veya ürün adı ara"
          />
        </label>

        <div className="vega-stock-table-wrap">
          <table className="vega-stock-table">
            <thead>
              <tr>
                <th>Durum</th>
                <th>Stok Kodu</th>
                <th>Barkod</th>
                <th>Ürün Adı</th>
                <th>Marka</th>
                <th>Beden</th>
                <th>Renk</th>
                <th>Mevcut Stok</th>
                <th>Alış Fiyatı</th>
                <th>Satış Fiyatı</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={`${row.stockCode}-${row.barcode}`}>
                  <td>
                    <span className={`vega-stock-row-source ${hasVegaRows ? "ready" : "demo"}`}>
                      {hasVegaRows ? "Vega read-only" : "Demo veri"}
                    </span>
                  </td>
                  <td>{row.stockCode}</td>
                  <td>{row.barcode}</td>
                  <td>{row.productName}</td>
                  <td>{row.brand || "-"}</td>
                  <td>{row.size || "-"}</td>
                  <td>{row.color || "-"}</td>
                  <td>{formatNumber(row.quantity || 0)}</td>
                  <td>{formatCurrency(row.purchasePrice || 0)}</td>
                  <td>{formatCurrency(row.salePrice || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && <p className="vega-stock-empty">Arama kriterine uygun stok satırı görünmüyor.</p>}
      </section>
    </>
  );
}
