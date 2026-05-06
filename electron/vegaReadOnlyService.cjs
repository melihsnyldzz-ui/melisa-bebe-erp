const notConfiguredResult = {
  status: "not_configured",
  source: "none",
  items: [],
  message: "Vega bağlantısı henüz yapılandırılmadı.",
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
    message: "Vega read-only bağlantı sürücüsü bu geçici sürümde tanımlı değil.",
  };
}

module.exports = {
  listVegaStockReadOnly,
};
