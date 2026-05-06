const notConfiguredResult = {
  status: "not_configured",
  source: "none",
  items: [],
  message: "Vega bağlantısı henüz yapılandırılmadı. Gerçek stok okunmuyor.",
};

function listVegaStockReadOnly() {
  const isEnabled = process.env.VEGA_READONLY_ENABLED === "true";

  if (!isEnabled) {
    return notConfiguredResult;
  }

  return {
    status: "error",
    source: "vega-read-only",
    items: [],
    message: "Vega read-only bağlantısı açılmak istendi ancak bağlantı sürücüsü tanımlı değil.",
  };
}

module.exports = {
  listVegaStockReadOnly,
};
