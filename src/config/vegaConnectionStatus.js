export const passiveVegaConnectionStatusRows = [
  { label: "Vega bağlantı modu", value: "Kapalı" },
  { label: "SQL bağlantısı", value: "Sadece local terminal smoke test" },
  { label: "ERP arayüzünden bağlantı", value: "Yok" },
  { label: "Son güvenli test scripti", value: "npm run vega:readonly-stock-smoke" },
  { label: "Son güvenli tablo kapsamı", value: "F0102TBLSTOKLAR" },
  { label: "Okuma limiti", value: "20 stok kartı" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Import/senkron", value: "Kapalı" },
  { label: "Cari/fiş/hareket okuma", value: "Kapalı" },
  { label: "Alan haritası", value: "v1.48.0 pasif dokümantasyon" },
];

export const passiveVegaConnectionStatusMessage =
  "Bu ekran canlı Vega bağlantısı başlatmaz. Bağlantı testleri yalnızca local terminalden ve read-only smoke test olarak yapılır.";
