export const currentReleaseVersion = "v3.5.0";

export const currentReleaseTitle = "Şirket Test Günü Komuta Merkezi";

export const updatedSectionIds = ["latest-version-history", "system-workflow-model", "warehouse-terminal-training-center"];

export const releaseHighlightItems = [
  "Terminal Eğitim ve Prova Merkezi eklendi.",
  "Hazır barkod senaryoları, depo eğitim akışı ve test günü komuta akışı görünür hale getirildi.",
  "Terminal ve ERP pilot yol haritası, şirket checklisti, barkod kalite kontrolü ve test planı korunur.",
  "Bu sürüm yalnızca pasif eğitim ve prova görünümü ekler.",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "warehouse-terminal-training-center", label: "Terminal Eğitim ve Prova Merkezi'ne git" },
  { id: "warehouse-terminal-next-roadmap", label: "Terminal ve ERP Pilot Yol Haritası'na git" },
  { id: "warehouse-company-first-real-test-checklist", label: "Şirket Ortamı İlk Gerçek Test Checklisti'ne git" },
  { id: "warehouse-terminal-barcode-quality", label: "Barkod Kalite Durumu'na git" },
  { id: "warehouse-erp-terminal-test-plan", label: "ERP + El Terminali Test Planı'na git" },
  { id: "warehouse-mock-barcode-test", label: "Mock Barkod Test Alanı'na git" },
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
  vegaStockTrial: defaultReleasePage,
  vegaImportPreview: defaultReleasePage,
  warehouseTerminal: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "warehouse-terminal-training-center", label: "Terminal Eğitim ve Prova Merkezi'ne git" },
      { id: "warehouse-terminal-next-roadmap", label: "Terminal ve ERP Pilot Yol Haritası'na git" },
      { id: "warehouse-company-first-real-test-checklist", label: "Şirket Ortamı İlk Gerçek Test Checklisti'ne git" },
      { id: "warehouse-terminal-barcode-quality", label: "Barkod Kalite Durumu'na git" },
      { id: "warehouse-erp-terminal-test-plan", label: "ERP + El Terminali Test Planı'na git" },
      { id: "warehouse-mock-barcode-test", label: "Mock Barkod Test Alanı'na git" },
      { id: "warehouse-barcode-operation-center", label: "Operasyon Merkezi'ne git" },
      { id: "warehouse-stock-barcode-quality-center", label: "Kalite Kontrol Merkezi'ne git" },
      { id: "warehouse-risk-priority-matrix", label: "Risk Öncelik Matrisi'ne git" },
      { id: "warehouse-barcode-risk-panel", label: "Barkod Riskleri'ne git" },
    ],
    updatedSectionIds: ["warehouse-terminal-training-center", "warehouse-terminal-next-roadmap", "warehouse-company-first-real-test-checklist", "warehouse-terminal-barcode-quality", "warehouse-erp-terminal-test-plan"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks,
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds,
  },
};
