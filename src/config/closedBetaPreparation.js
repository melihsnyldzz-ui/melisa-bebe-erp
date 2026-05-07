export const closedBetaPreparationRows = [
  { label: "Beta tipi", value: "Kapalı beta / patron bilgisayarı" },
  { label: "Uygulama modu", value: "Local Desktop" },
  { label: "Kurulum hedefi", value: "Windows masaüstü" },
  { label: "Canlı Vega bağlantısı", value: "Kapalı" },
  { label: "SQL bağlantısı", value: "Sadece terminal smoke test" },
  { label: "Veri yazma", value: "Kapalı" },
  { label: "Import/senkron", value: "Kapalı" },
  { label: "Cari/fiş/hareket okuma", value: "Kapalı" },
  { label: "Stok alan haritası", value: "Pasif dokümantasyon" },
  { label: "Vega bağlantı durumu", value: "Pasif görünürlük" },
  { label: "Build kontrolü", value: "npm run build" },
  { label: "Electron paket kontrolü", value: "npm run electron:build manuel doğrulama bekliyor" },
];

export const closedBetaPreparationMessage =
  "Bu kapalı beta sürümü canlı Vega'ya arayüzden bağlanmaz ve veri yazmaz. Amaç masaüstü uygulama akışını, ekranları ve güvenlik kilitlerini patron bilgisayarında test etmektir.";
