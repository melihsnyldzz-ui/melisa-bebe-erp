export const currentReleaseVersion = "v2.7.0";

export const currentReleaseTitle = "Şirket Ortamı İlk Gerçek Test Checklisti";

export const updatedSectionIds = ["latest-version-history", "system-workflow-model", "warehouse-company-first-real-test-checklist"];

export const releaseHighlightItems = [
  "ERP + el terminali test planı terminal ekranında pasif rehber olarak görünür hale getirildi.",
  "Mock barkod alanına kalite durumu, uyarı mesajları ve operatör notu eklendi.",
  "Şirket ortamında yapılacak ilk gerçek read-only stok testi için pasif checklist hazırlandı.",
  "Bu sürüm gerçek entegrasyon, API endpoint, gerçek stok arama, veri yazma/import/export/sync, localStorage veya credential bilgisi eklemez.",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "warehouse-company-first-real-test-checklist", label: "Şirket Ortamı İlk Gerçek Test Checklisti'ne git" },
  { id: "warehouse-terminal-barcode-quality", label: "Barkod Kalite Durumu'na git" },
  { id: "warehouse-erp-terminal-test-plan", label: "ERP + El Terminali Test Planı'na git" },
  { id: "warehouse-mock-barcode-test", label: "Mock Barkod Test Alanı'na git" },
  { id: "vega-stock-local-readiness-check", label: "v2.3 Yerel Hazırlık Kontrolü'ne git" },
  { id: "vega-stock-pilot-usage-center", label: "Pilot Kullanım Merkezi'ne git" },
  { id: "vega-stock-v21-manual-test-protocol", label: "v2.1 Manuel Test Protokolü'ne git" },
  { id: "vega-stock-v2-security-gate", label: "v2.0 Pilot Güvenlik Kapısı'na git" },
  { id: "vega-stock-closed-pilot-package", label: "Stok Kapalı Pilot Kullanım Paketi'ne git" },
  { id: "system-workflow-model", label: "Çalışma Modeli'ne git" },
];

export const releaseVisibilityChecklist = [
  "Üstte “Bu Sürümde Yenilenen Alanlar” paneli görünüyor mu?",
  "Hızlı geçiş linkleri ilgili bölüme götürüyor mu?",
  "YENİ etiketi güncel sürüm numarasını gösteriyor mu?",
  "Vurgulanan bölümlerin kenarlığı/arka planı ayırt ediliyor mu?",
];

const defaultReleasePage = {
  releaseHighlightItems,
  releaseJumpLinks,
  updatedSectionIds,
};

export const releaseHighlightsByPage = {
  dashboard: defaultReleasePage,
  reports: defaultReleasePage,
  customers: defaultReleasePage,
  vegaStockTrial: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "vega-stock-local-readiness-check", label: "v2.3 Yerel Hazırlık Kontrolü'ne git" },
      { id: "vega-stock-pilot-usage-center", label: "Pilot Kullanım Merkezi'ne git" },
      { id: "vega-stock-v21-manual-test-protocol", label: "v2.1 Manuel Test Protokolü'ne git" },
      { id: "vega-stock-v2-security-gate", label: "v2.0 Pilot Güvenlik Kapısı'na git" },
      { id: "vega-stock-closed-pilot-package", label: "Stok Kapalı Pilot Kullanım Paketi'ne git" },
    ],
    updatedSectionIds: ["vega-stock-local-readiness-check", "vega-stock-pilot-usage-center"],
  },
  vegaImportPreview: defaultReleasePage,
  warehouseTerminal: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "warehouse-company-first-real-test-checklist", label: "Şirket Ortamı İlk Gerçek Test Checklisti'ne git" },
      { id: "warehouse-terminal-barcode-quality", label: "Barkod Kalite Durumu'na git" },
      { id: "warehouse-erp-terminal-test-plan", label: "ERP + El Terminali Test Planı'na git" },
      { id: "warehouse-mock-barcode-test", label: "Mock Barkod Test Alanı'na git" },
      { id: "warehouse-barcode-operation-center", label: "Operasyon Merkezi'ne git" },
      { id: "warehouse-stock-barcode-quality-center", label: "Kalite Kontrol Merkezi'ne git" },
      { id: "warehouse-risk-priority-matrix", label: "Risk Öncelik Matrisi'ne git" },
      { id: "warehouse-barcode-risk-panel", label: "Barkod Riskleri'ne git" },
    ],
    updatedSectionIds: ["warehouse-company-first-real-test-checklist", "warehouse-terminal-barcode-quality", "warehouse-erp-terminal-test-plan"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
