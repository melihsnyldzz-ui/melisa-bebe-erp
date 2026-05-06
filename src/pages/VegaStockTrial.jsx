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
  not_configured: "Vega bağlantısı yok",
  demo: "Demo veri",
  ready: "Read-only bağlantı hazır",
  error: "Bağlantı hatası",
};

const defaultConnectionMetadata = {
  readOnlyEnabled: false,
  driverConfigured: false,
  serverConfigured: false,
  databaseConfigured: false,
  stockQueryPrepared: false,
  writeEnabled: false,
};

const columnMappings = [
  { vegaField: "Stok Kodu", erpField: "stockCode" },
  { vegaField: "Barkod", erpField: "barcode" },
  { vegaField: "Ürün Adı", erpField: "productName" },
  { vegaField: "Marka", erpField: "brand" },
  { vegaField: "Beden", erpField: "size" },
  { vegaField: "Renk", erpField: "color" },
  { vegaField: "Mevcut Stok", erpField: "quantity" },
  { vegaField: "Alış Fiyatı", erpField: "purchasePrice" },
  { vegaField: "Satış Fiyatı", erpField: "salePrice" },
];

export default function VegaStockTrial() {
  const [query, setQuery] = useState("");
  const [stockState, setStockState] = useState({
    status: "not_configured",
    message: "Vega bağlantısı henüz yapılandırılmadı. Gerçek stok okunmuyor.",
    items: [],
    metadata: defaultConnectionMetadata,
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
            metadata: defaultConnectionMetadata,
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
  const connectionMetadata = { ...defaultConnectionMetadata, ...(stockState.metadata || {}) };
  const connectionCards = [
    { label: "Read-only mod", value: connectionMetadata.readOnlyEnabled ? "Açık" : "Kapalı" },
    { label: "Bağlantı sürücüsü", value: connectionMetadata.driverConfigured ? "Tanımlı" : "Tanımlı değil" },
    { label: "Veri yazma", value: connectionMetadata.writeEnabled ? "Açık" : "Kapalı" },
    { label: "Gösterilen veri", value: hasVegaRows ? "Vega read-only" : "Demo veri" },
  ];
  const dataSourceLabel = hasVegaRows ? "Vega read-only" : "Demo veri";
  const dataSourceMessage = hasVegaRows
    ? "Vega read-only satırları gösteriliyor. Veri yazma kapalıdır."
    : "Şu anda demo stok verisi gösteriliyor. Gerçek Vega stoğu okunmuyor.";
  const readinessSummaryRows = [
    { label: "Vega read-only mod", value: connectionMetadata.readOnlyEnabled ? "Açık" : "Kapalı" },
    { label: "Bağlantı sürücüsü", value: connectionMetadata.driverConfigured ? "Tanımlı" : "Tanımlı değil" },
    { label: "Gerçek stok okuma", value: hasVegaRows ? "Açık" : "Kapalı" },
    { label: "Veri yazma", value: connectionMetadata.writeEnabled ? "Açık" : "Kapalı" },
    { label: "Gösterilen veri", value: hasVegaRows ? "Vega read-only" : "Demo veri" },
  ];
  const readOnlyPreparationRows = [
    { label: "Read-only bağlantı modu", value: connectionMetadata.readOnlyEnabled ? "Açık" : "Kapalı" },
    { label: "ODBC / SQL sürücüsü", value: connectionMetadata.driverConfigured ? "Tanımlı" : "Tanımlı değil" },
    {
      label: "Vega veritabanı yolu / sunucusu",
      value: connectionMetadata.serverConfigured || connectionMetadata.databaseConfigured ? "Tanımlı" : "Tanımlı değil",
    },
    { label: "Stok okuma sorgusu", value: connectionMetadata.stockQueryPrepared ? "Hazır" : "Hazırlanmadı" },
    { label: "Veri yazma izni", value: connectionMetadata.writeEnabled ? "Açık" : "Kapalı" },
    { label: "Sonraki kontrollü adım", value: "Bağlantı parametrelerinin sadece okunur önizlemesi" },
  ];
  const connectionPreviewRows = [
    { label: "Bağlantı modu", value: "Read-only" },
    { label: "Sürücü türü", value: "ODBC / SQL" },
    { label: "Sunucu / dosya yolu", value: "Tanımlı değil" },
    { label: "Veritabanı adı", value: "Tanımlı değil" },
    { label: "Kullanıcı yetkisi", value: "Sadece okuma için hazırlanacak" },
    { label: "Stok sorgusu", value: "Hazırlanmadı" },
    { label: "Yazma izni", value: "Kapalı" },
  ];
  const driverRequirementRows = [
    { label: "Gerekli sürücü", value: "ODBC / SQL uyumlu bağlantı sürücüsü" },
    { label: "Erişim türü", value: "Sadece okuma" },
    { label: "Yazma izni", value: "Kapalı olmalı" },
    { label: "Kullanıcı yetkisi", value: "Minimum yetkili read-only kullanıcı" },
    { label: "Bağlantı testi", value: "Bu sürümde yapılmaz" },
    { label: "Stok sorgusu", value: "Ayrı kontrollü sürümde hazırlanacak" },
    { label: "Güvenlik notu", value: "Gerçek Vega verisine yazma işlemi kesinlikle açılmayacak" },
  ];
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
          <span>Bu ekran gerçek Vega bağlantısı açılmadan stok okuma modülünün hazırlık ve kontrol alanıdır.</span>
        </div>
      </section>

      <section className="vega-stock-trial-panel section-updated-highlight" id="vega-stock-trial-panel">
        <span className="new-release-badge">YENİ · {currentReleaseVersion}</span>
        <div className="vega-stock-safety-box">
          <ShieldCheck size={18} />
          <div>
            <strong>Güvenli Deneme Modu</strong>
            <span>Bu ekran yalnızca stok okuma hazırlığı içindir. Vega'ya veri yazmaz, stok değiştirmez, kayıt oluşturmaz.</span>
          </div>
        </div>
        <div className="vega-stock-trial-header">
          <div>
            <h2>Stok Okuma Denemesi</h2>
            <p>Gerçek bağlantı açılmadan stok okuma hazırlığı ve demo veri kontrol alanıdır.</p>
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

        <div className="vega-data-source-panel">
          <div>
            <strong>Veri Kaynağı</strong>
            <span>{dataSourceMessage}</span>
            <small>Vega read-only bağlantısı ileride ayrı kontrollü sürümde açılacaktır.</small>
          </div>
          <em>{dataSourceLabel}</em>
        </div>

        <div className="vega-stock-warning">
          <AlertTriangle size={18} />
          <span>
            {stockState.message} {!hasVegaRows && "Gösterilen satırlar demo veridir; gerçek Vega stoğu değildir."}
          </span>
        </div>

        <div className="vega-readiness-panel">
          <div>
            <h2>Hazır Değil Kontrol Özeti</h2>
            <p>Gerçek stok okuması açılmadan önce eksik güvenli hazırlıkları gösterir; bağlantı açmaz, veri yazmaz.</p>
          </div>
          <div className="vega-readiness-grid">
            {readinessSummaryRows.map((row) => (
              <div className="vega-readiness-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-connection-panel">
          <div>
            <h2>Bağlantı Kontrolü</h2>
            <p>Read-only hazırlık durumunu gösterir; gerçek Vega bağlantısını açmaz.</p>
          </div>
          <div className="vega-connection-grid">
            {connectionCards.map((card) => (
              <div className="vega-connection-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-readonly-prep-panel">
          <div>
            <h2>Read-only Bağlantı Hazırlığı</h2>
            <p>
              Bu alan ileride açılacak Vega read-only bağlantısı için gerekli hazırlıkları gösterir. Bu sürümde bağlantı
              kurulmaz, sorgu çalıştırılmaz ve veri yazılmaz.
            </p>
          </div>
          <div className="vega-readonly-prep-grid">
            {readOnlyPreparationRows.map((row) => (
              <div className="vega-readonly-prep-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-connection-preview-panel">
          <div>
            <h2>Bağlantı Parametreleri Önizleme</h2>
            <p>
              Bu alan ileride kullanılacak Vega read-only bağlantı parametrelerinin sadece okunur önizlemesidir. Bu
              sürümde parametre girilmez, kaydedilmez ve bağlantı testi yapılmaz.
            </p>
          </div>
          <div className="vega-connection-preview-grid">
            {connectionPreviewRows.map((row) => (
              <div className="vega-connection-preview-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-driver-guide-panel">
          <div>
            <h2>ODBC / SQL Sürücü Gereksinim Rehberi</h2>
            <p>
              Bu alan ileride yapılacak Vega read-only bağlantısı için gereken sürücü ve erişim hazırlıklarını gösterir.
              Bu sürümde sürücü kurulmaz, bağlantı açılmaz ve sorgu çalıştırılmaz.
            </p>
          </div>
          <div className="vega-driver-guide-grid">
            {driverRequirementRows.map((row) => (
              <div className="vega-driver-guide-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-column-mapping-panel">
          <div>
            <h2>Kolon Eşleştirme Hazırlığı</h2>
            <p>Bu alan yalnızca ileride yapılacak read-only stok okuma eşleştirmesini gösterir. Vega'dan veri çekmez ve kayıt oluşturmaz.</p>
          </div>
          <div className="vega-column-mapping-grid" aria-label="Vega stok kolon eşleştirme hazırlığı">
            {columnMappings.map((mapping) => (
              <div className="vega-column-mapping-row" key={mapping.erpField}>
                <span>{mapping.vegaField}</span>
                <strong>{mapping.erpField}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vega-test-note">
          <strong>Test Notu</strong>
          <span>Demo stok görünümü, bağlantı durumu ve kolon eşleştirme hazırlığı kontrol edilir; veri çekilmez, veri yazılmaz, kayıt oluşturulmaz.</span>
        </div>

        <div className="vega-closing-note">
          <div>
            <strong>Hazırlık Kapanış Notu</strong>
            <span>
              Bu hazırlık ekranı, gerçek Vega bağlantısı açılmadan önce demo veri, veri kaynağı, bağlantı güvenliği ve
              kolon eşleştirme kontrollerini tamamlamak için hazırlanmıştır. Gerçek Vega read-only bağlantısı ayrı ve
              kontrollü bir sürümde açılacaktır.
            </span>
          </div>
          <p>
            Sonraki Faz: <strong>v1.19.x · Vega read-only bağlantı hazırlığı</strong>
          </p>
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
