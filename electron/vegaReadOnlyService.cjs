function listVegaStockReadOnly() {
  const isEnabled = process.env.VEGA_READONLY_ENABLED === "true";
  const metadata = {
    readOnlyEnabled: isEnabled,
    driverConfigured: false,
    serverConfigured: false,
    databaseConfigured: false,
    stockQueryPrepared: false,
    writeEnabled: false,
    technicalPhase: "v1.20-read-only-prep",
    connectionLocked: true,
    sqlExecutionEnabled: false,
    odbcEnabled: false,
    databaseReadEnabled: false,
    maxRowsLimitPrepared: false,
    approvalRequired: true,
    maxRowsLimit: 20,
    timeoutMsPrepared: false,
    retryEnabled: false,
    failClosedEnabled: true,
    errorPressureProtection: true,
    stockReadScope: "stock-cards-only",
    connectionAttemptEnabled: false,
    timeoutMs: 3000,
    timeoutPolicyPrepared: true,
    safeErrorMessageEnabled: true,
    rawErrorExposeEnabled: false,
    lastConnectionAttempt: null,
  };

  if (!isEnabled) {
    return {
      status: "not_configured",
      source: "none",
      items: [],
      message: "Vega bağlantısı henüz yapılandırılmadı. Gerçek stok okunmuyor.",
      metadata,
    };
  }

  return {
    status: "error",
    source: "vega-read-only",
    items: [],
    message: "Vega read-only bağlantısı açılmak istendi ancak bağlantı sürücüsü tanımlı değil.",
    metadata,
  };
}

module.exports = {
  listVegaStockReadOnly,
};
