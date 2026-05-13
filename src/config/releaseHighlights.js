export const currentReleaseVersion = "v9.0.0";

export const currentReleaseTitle = "İlk Gerçek Test Sonrası Karar";

export const updatedSectionIds = ["latest-version-history", "system-workflow-model", "settings-readonly-stock-prep"];

export const releaseHighlightItems = [
  "Read-only Stok Test Hazırlığı paneli saha onayı ve ilk gerçek test sonrası karar kapısıyla genişletildi.",
  "Saha testi onay listesi, görev dağılımı, test günü zaman kutusu ve ilk gerçek test sonrası karar akışı görünür hale getirildi.",
  "v8.6 saha test yürütme planı korunur.",
  "Bu sürüm gerçek bağlantı kurmaz; yalnızca ilk gerçek read-only testin saha yürütme kararını pasif olarak gösterir.",
];

export const releaseJumpLinks = [
  { id: "latest-version-history", label: "Son Sürüm Geçmişi'ne git" },
  { id: "settings-readonly-stock-prep", label: "Read-only Stok Test Hazırlığı'na git" },
  { id: "warehouse-readonly-transition-gate", label: "Read-only Stok Testine Geçiş Kapısı'na git" },
  { id: "warehouse-minimal-pilot-mode", label: "Pilot Öncesi Minimal Ekran Modu'na git" },
  { id: "settings-web-preview-control", label: "Web Önizleme Kontrol Paneli'ne git" },
  { id: "warehouse-ready-hold-decision-center", label: "Hazır / Beklet Karar Merkezi'ne git" },
  { id: "warehouse-one-page-test-summary", label: "Test Günü Tek Sayfa Özet Paneli'ne git" },
  { id: "warehouse-terminal-final-simplification-center", label: "Terminal Pilot Final Sadeleştirme Merkezi'ne git" },
  { id: "warehouse-terminal-final-control-center", label: "Terminal Test Sonucu ve Karar Merkezi'ne git" },
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
      { id: "warehouse-readonly-transition-gate", label: "Read-only Stok Testine Geçiş Kapısı'na git" },
      { id: "warehouse-minimal-pilot-mode", label: "Pilot Öncesi Minimal Ekran Modu'na git" },
      { id: "warehouse-ready-hold-decision-center", label: "Hazır / Beklet Karar Merkezi'ne git" },
      { id: "warehouse-one-page-test-summary", label: "Test Günü Tek Sayfa Özet Paneli'ne git" },
      { id: "warehouse-terminal-final-simplification-center", label: "Terminal Pilot Final Sadeleştirme Merkezi'ne git" },
      { id: "warehouse-terminal-final-control-center", label: "Terminal Test Sonucu ve Karar Merkezi'ne git" },
      { id: "warehouse-terminal-training-center", label: "Terminal Eğitim ve Prova Merkezi'ne git" },
      { id: "warehouse-terminal-next-roadmap", label: "Terminal ve ERP Pilot Yol Haritası'na git" },
      { id: "warehouse-company-first-real-test-checklist", label: "Şirket Ortamı İlk Gerçek Test Checklisti'ne git" },
      { id: "warehouse-terminal-barcode-quality", label: "Barkod Kalite Durumu'na git" },
      { id: "warehouse-erp-terminal-test-plan", label: "ERP + El Terminali Test Planı'na git" },
      { id: "warehouse-mock-barcode-test", label: "Mock Barkod Test Alanı'na git" },
      { id: "warehouse-barcode-operation-center", label: "Operasyon Merkezi'ne git" },
      { id: "warehouse-stock-barcode-quality-center", label: "Kalite Kontrol Merkezi'ne git" },
      { id: "warehouse-risk-priority-matrix", label: "Risk Öncelik Matrisi'ne git" },
      { id: "warehouse-barcode-risk-panel", label: "Barkod Riskleri" },
    ],
    updatedSectionIds: ["warehouse-readonly-transition-gate", "warehouse-minimal-pilot-mode", "warehouse-ready-hold-decision-center", "warehouse-one-page-test-summary", "warehouse-terminal-final-simplification-center", "warehouse-terminal-final-control-center", "warehouse-terminal-training-center", "warehouse-terminal-next-roadmap", "warehouse-company-first-real-test-checklist", "warehouse-terminal-barcode-quality", "warehouse-erp-terminal-test-plan"],
  },
  settings: {
    releaseHighlightItems,
    releaseJumpLinks: [
      { id: "settings-readonly-stock-prep", label: "Read-only Stok Test Hazırlığı'na git" },
      { id: "settings-web-preview-control", label: "Web Önizleme Kontrol Paneli'ne git" },
      ...releaseJumpLinks,
    ],
    testChecklist: releaseVisibilityChecklist,
    updatedSectionIds: ["settings-readonly-stock-prep", "settings-web-preview-control", ...updatedSectionIds],
  },
};
