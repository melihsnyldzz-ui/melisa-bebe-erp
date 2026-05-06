const DEFAULT_APP_SETTINGS = {
  dataMode: "demo",
  setupCompleted: "false",
  firstRunAt: "",
  liveStartedAt: "",
  demoDataClearedAt: "",
  lastBackupAt: "",
  lastBackupPath: "",
  lastBackupStatus: "",
  lastBackupError: "",
};

function createRepositories(db, options = {}) {
  const purchaseTransaction = db.transaction((payload) => savePurchaseSlipTx(db, payload));
  const salesTransaction = db.transaction((payload) => saveSalesSlipTx(db, payload));
  const collectionTransaction = db.transaction((payload) => saveCollectionTx(db, payload));
  const paymentTransaction = db.transaction((payload) => savePaymentTx(db, payload));
  const cancelPurchaseTransaction = db.transaction((id) => cancelPurchaseSlipTx(db, id));
  const cancelSalesTransaction = db.transaction((id) => cancelSalesSlipTx(db, id));
  const cancelCollectionTransaction = db.transaction((id) => cancelCollectionTx(db, id));
  const cancelPaymentTransaction = db.transaction((id) => cancelPaymentTx(db, id));
  const stockCountAdjustmentTransaction = db.transaction((payload) => applyStockCountAdjustmentTx(db, payload));
  const dataImportTransaction = db.transaction((payload) => applyDataImportTx(db, payload));

  return {
    getAllProducts: () => rowsToBooleans(db.prepare("SELECT * FROM products ORDER BY id DESC").all()),
    getAllCustomers: () => rowsToBooleans(db.prepare("SELECT * FROM customers ORDER BY id DESC").all()),
    getAllSuppliers: () => rowsToBooleans(db.prepare("SELECT * FROM suppliers ORDER BY id DESC").all()),
    getAllPurchaseSlips: () => getPurchaseSlips(db),
    getAllSalesSlips: () => getSalesSlips(db),
    getAllCollections: () => db.prepare("SELECT * FROM collections ORDER BY id DESC").all(),
    getAllPayments: () => db.prepare("SELECT * FROM payments ORDER BY id DESC").all(),
    getAllStockMovements: () => db.prepare("SELECT * FROM stock_movements ORDER BY id DESC").all(),
    getAllCurrencies: () => rowsToBooleanFields(db.prepare("SELECT * FROM currencies ORDER BY isDefault DESC, code ASC").all()),
    getAllExchangeRates: () => db.prepare("SELECT * FROM exchange_rates ORDER BY rateDate DESC, currencyCode ASC").all(),
    getAllCurrentAccounts: () => rowsToBooleanFields(db.prepare("SELECT * FROM current_accounts ORDER BY id DESC").all()),
    getAllCurrentAccountMovements: () => db.prepare("SELECT * FROM current_account_movements ORDER BY id DESC").all(),
    getAllProductBarcodes: () => rowsToBooleanFields(db.prepare("SELECT * FROM product_barcodes ORDER BY id DESC").all()),
    getAllWarehouses: () => rowsToBooleanFields(db.prepare("SELECT * FROM warehouses ORDER BY isDefault DESC, id ASC").all()),
    getAllStockBalances: () => db.prepare("SELECT * FROM stock_balances ORDER BY id DESC").all(),
    getAllPriceLists: () => rowsToBooleanFields(db.prepare("SELECT * FROM price_lists ORDER BY isDefault DESC, id ASC").all()),
    getAllPriceListItems: () => rowsToBooleanFields(db.prepare("SELECT * FROM price_list_items ORDER BY id DESC").all()),
    getAllDocumentNumbers: () => rowsToBooleanFields(db.prepare("SELECT * FROM document_numbers ORDER BY documentType ASC").all()),
    getAppSettings: () => getAppSettings(db),
    recordBackupResult: (result) => recordBackupResult(db, result),
    updateAppSetting: (key, value) => wrapMutation(() => updateAppSettingTx(db, key, value), db),
    startLiveMode: () => startLiveMode(db, options),
    resetDemoData: () => resetDemoData(db, options),
    getInitialErpData: () => getInitialErpData(db),
    savePurchaseSlip: (payload) => wrapMutation(() => purchaseTransaction(payload), db),
    saveSalesSlip: (payload) => wrapMutation(() => salesTransaction(payload), db),
    saveCollection: (payload) => wrapMutation(() => collectionTransaction(payload), db),
    savePayment: (payload) => wrapMutation(() => paymentTransaction(payload), db),
    cancelPurchaseSlip: (id) => wrapMutation(() => cancelPurchaseTransaction(id), db),
    cancelSalesSlip: (id) => wrapMutation(() => cancelSalesTransaction(id), db),
    cancelCollection: (id) => wrapMutation(() => cancelCollectionTransaction(id), db),
    cancelPayment: (id) => wrapMutation(() => cancelPaymentTransaction(id), db),
    applyStockCountAdjustment: (payload) => wrapMutation(() => stockCountAdjustmentTransaction(payload), db),
    applyDataImport: (payload) => wrapMutation(() => dataImportTransaction(payload), db),
    addProduct: (payload) => wrapMutation(() => addProductTx(db, payload), db),
    updateProduct: (payload) => wrapMutation(() => updateProductTx(db, payload), db),
    toggleProductStatus: (id) => wrapMutation(() => toggleStatusTx(db, "products", id), db),
    addCustomer: (payload) => wrapMutation(() => addCustomerTx(db, payload), db),
    updateCustomer: (payload) => wrapMutation(() => updateCustomerTx(db, payload), db),
    toggleCustomerStatus: (id) => wrapMutation(() => toggleStatusTx(db, "customers", id), db),
    addSupplier: (payload) => wrapMutation(() => addSupplierTx(db, payload), db),
    updateSupplier: (payload) => wrapMutation(() => updateSupplierTx(db, payload), db),
    toggleSupplierStatus: (id) => wrapMutation(() => toggleStatusTx(db, "suppliers", id), db),
  };
}

function getInitialErpData(db) {
  return {
    products: rowsToBooleans(db.prepare("SELECT * FROM products ORDER BY id DESC").all()),
    customers: rowsToBooleans(db.prepare("SELECT * FROM customers ORDER BY id DESC").all()),
    suppliers: rowsToBooleans(db.prepare("SELECT * FROM suppliers ORDER BY id DESC").all()),
    purchaseSlips: getPurchaseSlips(db),
    salesSlips: getSalesSlips(db),
    collections: db.prepare("SELECT * FROM collections ORDER BY id DESC").all(),
    payments: db.prepare("SELECT * FROM payments ORDER BY id DESC").all(),
    stockMovements: db.prepare("SELECT * FROM stock_movements ORDER BY id DESC").all(),
    currencies: rowsToBooleanFields(db.prepare("SELECT * FROM currencies ORDER BY isDefault DESC, code ASC").all()),
    exchangeRates: db.prepare("SELECT * FROM exchange_rates ORDER BY rateDate DESC, currencyCode ASC").all(),
    currentAccounts: rowsToBooleanFields(db.prepare("SELECT * FROM current_accounts ORDER BY id DESC").all()),
    currentAccountMovements: db.prepare("SELECT * FROM current_account_movements ORDER BY id DESC").all(),
    productBarcodes: rowsToBooleanFields(db.prepare("SELECT * FROM product_barcodes ORDER BY id DESC").all()),
    warehouses: rowsToBooleanFields(db.prepare("SELECT * FROM warehouses ORDER BY isDefault DESC, id ASC").all()),
    stockBalances: db.prepare("SELECT * FROM stock_balances ORDER BY id DESC").all(),
    priceLists: rowsToBooleanFields(db.prepare("SELECT * FROM price_lists ORDER BY isDefault DESC, id ASC").all()),
    priceListItems: rowsToBooleanFields(db.prepare("SELECT * FROM price_list_items ORDER BY id DESC").all()),
    documentNumbers: rowsToBooleanFields(db.prepare("SELECT * FROM document_numbers ORDER BY documentType ASC").all()),
    appSettings: getAppSettings(db),
  };
}

function getAppSettings(db) {
  ensureAppSettings(db);
  const rows = db.prepare("SELECT key, value FROM settings").all();
  return rows.reduce((settings, row) => ({ ...settings, [row.key]: row.value }), { ...DEFAULT_APP_SETTINGS });
}

function updateAppSettingTx(db, key, value) {
  db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, String(value));
}

function recordBackupResult(db, result) {
  const now = result?.createdAt || new Date().toISOString();
  updateAppSettingTx(db, "lastBackupAt", now);
  updateAppSettingTx(db, "lastBackupPath", result?.path || "");
  updateAppSettingTx(db, "lastBackupStatus", result?.ok ? "success" : "failed");
  updateAppSettingTx(db, "lastBackupError", result?.ok ? "" : result?.error || "Yedekleme tamamlanamadı.");
  return getAppSettings(db);
}

function startLiveMode(db, options = {}) {
  try {
    const backupResult = options.createBackup ? options.createBackup() : { ok: false, error: "Otomatik yedekleme fonksiyonu tanımlı değil." };
    recordBackupResult(db, backupResult);
    if (!backupResult.ok) return { ok: false, error: backupResult.error || "Otomatik yedek oluşturulamadı." };

    const now = new Date().toISOString();
    const tx = db.transaction(() => {
      updateAppSettingTx(db, "dataMode", "live");
      updateAppSettingTx(db, "setupCompleted", "true");
      updateAppSettingTx(db, "liveStartedAt", now);
    });

    tx();
    return { ok: true, path: backupResult.path, data: getInitialErpData(db) };
  } catch (error) {
    console.error("Gerçek kullanım moduna geçiş tamamlanamadı:", error);
    return { ok: false, error: error.message || "Gerçek kullanım moduna geçiş tamamlanamadı." };
  }
}

function resetDemoData(db, options = {}) {
  try {
    const backupResult = options.createBackup ? options.createBackup() : { ok: false, error: "Otomatik yedekleme fonksiyonu tanımlı değil." };
    recordBackupResult(db, backupResult);
    if (!backupResult.ok) return { ok: false, error: backupResult.error || "Otomatik yedek oluşturulamadı." };

    const now = new Date().toISOString();
    const tablesToClear = [
      "stock_movements",
      "purchase_slip_items",
      "sales_slip_items",
      "purchase_slips",
      "sales_slips",
      "collections",
      "payments",
      "products",
      "customers",
      "suppliers",
    ];
    const tx = db.transaction(() => {
      tablesToClear.forEach((table) => db.prepare(`DELETE FROM ${table}`).run());
      updateAppSettingTx(db, "dataMode", "live");
      updateAppSettingTx(db, "setupCompleted", "true");
      updateAppSettingTx(db, "demoDataClearedAt", now);
    });

    tx();
    return { ok: true, path: backupResult.path, data: getInitialErpData(db) };
  } catch (error) {
    console.error("Demo veri temizleme işlemi tamamlanamadı:", error);
    return { ok: false, error: error.message || "Demo veri temizleme işlemi tamamlanamadı." };
  }
}

function ensureAppSettings(db) {
  const now = new Date().toISOString();
  const insert = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  const defaults = { ...DEFAULT_APP_SETTINGS, firstRunAt: now };

  Object.entries(defaults).forEach(([key, value]) => insert.run(key, value));
}

function getPurchaseSlips(db) {
  const slips = db.prepare("SELECT * FROM purchase_slips ORDER BY id DESC").all();
  const itemStmt = db.prepare("SELECT * FROM purchase_slip_items WHERE slipId = ? ORDER BY id ASC");
  return slips.map((slip) => {
    const items = itemStmt.all(slip.id);
    return { ...slip, items: items.length ? items : parseItemsJson(slip.items_json) };
  });
}

function getSalesSlips(db) {
  const slips = db.prepare("SELECT * FROM sales_slips ORDER BY id DESC").all();
  const itemStmt = db.prepare("SELECT * FROM sales_slip_items WHERE slipId = ? ORDER BY id ASC");
  return slips.map((slip) => {
    const items = itemStmt.all(slip.id);
    return { ...slip, items: items.length ? items : parseItemsJson(slip.items_json) };
  });
}

function savePurchaseSlipTx(db, payload) {
  const createdAt = new Date().toISOString();
  const slipNo = allocateDocumentNo(db, {
    documentType: "purchase_slip",
    prefix: "AF",
    tableName: "purchase_slips",
    columnName: "slipNo",
    requestedNo: payload.slipNo,
  });
  const slipPayload = { ...payload, slipNo };
  const slipInfo = db.prepare(`
    INSERT INTO purchase_slips (slipNo, date, supplierId, supplierName, warehouse, subtotal, discountTotal, taxTotal, grandTotal, description, items_json, status, createdAt)
    VALUES (@slipNo, @date, @supplierId, @supplierName, @warehouse, @subtotal, @discountTotal, @taxTotal, @grandTotal, @description, @items_json, 'Kayıtlı', @createdAt)
  `).run({ ...slipPayload, description: slipPayload.description || "", items_json: JSON.stringify(slipPayload.items || []), createdAt });
  const slipId = slipInfo.lastInsertRowid;
  const insertItem = db.prepare(`
    INSERT INTO purchase_slip_items (slipId, productId, productCode, barcode, productName, size, color, quantity, unitPrice, discountRate, taxRate, lineTotal)
    VALUES (@slipId, @productId, @productCode, @barcode, @productName, @size, @color, @quantity, @unitPrice, @discountRate, @taxRate, @lineTotal)
  `);
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements (date, productId, productCode, barcode, productName, size, color, movementType, quantityIn, quantityOut, remainingStock, relatedSlipNo, relatedPartyName, createdBy, createdAt)
    VALUES (@date, @productId, @productCode, @barcode, @productName, @size, @color, 'Alış Girişi', @quantityIn, 0, @remainingStock, @relatedSlipNo, @relatedPartyName, 'Muhasebe', @createdAt)
  `);
  const getProduct = db.prepare("SELECT stockQuantity FROM products WHERE id = ?");
  const updateStock = db.prepare("UPDATE products SET stockQuantity = stockQuantity + ?, updatedAt = ? WHERE id = ?");

  slipPayload.items.forEach((item) => {
    insertItem.run({ ...item, slipId });
    const currentStock = getProduct.get(item.productId)?.stockQuantity || 0;
    const remainingStock = currentStock + item.quantity;
    updateStock.run(item.quantity, createdAt, item.productId);
    insertMovement.run({
      ...item,
      date: payload.date,
      quantityIn: item.quantity,
      remainingStock,
      relatedSlipNo: slipPayload.slipNo,
      relatedPartyName: slipPayload.supplierName,
      createdAt,
    });
  });

  db.prepare(`
    UPDATE suppliers
    SET currentBalance = currentBalance + ?, totalPurchases = totalPurchases + ?, lastTransactionDate = ?, updatedAt = ?
    WHERE id = ?
  `).run(slipPayload.grandTotal, slipPayload.grandTotal, slipPayload.date, createdAt, slipPayload.supplierId);

  return { ...slipPayload, id: slipId, status: "Kayıtlı", createdAt };
}

function saveSalesSlipTx(db, payload) {
  const createdAt = new Date().toISOString();
  const quantities = sumQuantitiesByProduct(payload.items);
  const getProduct = db.prepare("SELECT id, name, stockQuantity FROM products WHERE id = ?");

  for (const [productId, requestedQuantity] of quantities.entries()) {
    const product = getProduct.get(productId);
    if (product && requestedQuantity > product.stockQuantity) {
      const error = new Error(`${product.name} için stok yetersiz. Mevcut stok: ${product.stockQuantity}`);
      error.code = "INSUFFICIENT_STOCK";
      throw error;
    }
  }

  const slipNo = allocateDocumentNo(db, {
    documentType: "sales_slip",
    prefix: "SF",
    tableName: "sales_slips",
    columnName: "slipNo",
    requestedNo: payload.slipNo,
  });
  const slipPayload = { ...payload, slipNo };
  const slipInfo = db.prepare(`
    INSERT INTO sales_slips (slipNo, date, customerId, customerName, saleType, cargoInfo, subtotal, discountTotal, grandTotal, description, items_json, status, createdAt)
    VALUES (@slipNo, @date, @customerId, @customerName, @saleType, @cargoInfo, @subtotal, @discountTotal, @grandTotal, @description, @items_json, 'Kayıtlı', @createdAt)
  `).run({ ...slipPayload, cargoInfo: slipPayload.cargoInfo || "", description: slipPayload.description || "", items_json: JSON.stringify(slipPayload.items || []), createdAt });
  const slipId = slipInfo.lastInsertRowid;
  const insertItem = db.prepare(`
    INSERT INTO sales_slip_items (slipId, productId, productCode, barcode, productName, size, color, quantity, unitPrice, discountRate, availableStock, lineTotal)
    VALUES (@slipId, @productId, @productCode, @barcode, @productName, @size, @color, @quantity, @unitPrice, @discountRate, @availableStock, @lineTotal)
  `);
  const updateStock = db.prepare("UPDATE products SET stockQuantity = stockQuantity - ?, updatedAt = ? WHERE id = ?");
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements (date, productId, productCode, barcode, productName, size, color, movementType, quantityIn, quantityOut, remainingStock, relatedSlipNo, relatedPartyName, createdBy, createdAt)
    VALUES (@date, @productId, @productCode, @barcode, @productName, @size, @color, 'Satış Çıkışı', 0, @quantityOut, @remainingStock, @relatedSlipNo, @relatedPartyName, 'Satış', @createdAt)
  `);

  slipPayload.items.forEach((item) => {
    const currentStock = getProduct.get(item.productId)?.stockQuantity || 0;
    const remainingStock = currentStock - item.quantity;
    insertItem.run({ ...item, slipId, availableStock: currentStock });
    updateStock.run(item.quantity, createdAt, item.productId);
    insertMovement.run({
      ...item,
      date: payload.date,
      quantityOut: item.quantity,
      remainingStock,
      relatedSlipNo: slipPayload.slipNo,
      relatedPartyName: slipPayload.customerName,
      createdAt,
    });
  });

  db.prepare(`
    UPDATE customers
    SET currentBalance = currentBalance + ?, totalSales = totalSales + ?, lastPurchaseDate = ?, updatedAt = ?
    WHERE id = ?
  `).run(slipPayload.grandTotal, slipPayload.grandTotal, slipPayload.date, createdAt, slipPayload.customerId);

  return { ...slipPayload, id: slipId, status: "Kayıtlı", createdAt };
}

function saveCollectionTx(db, payload) {
  const createdAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO collections (collectionNo, date, customerId, customerName, paymentType, amount, description, receiptImageUrl, status, createdAt)
    VALUES (@collectionNo, @date, @customerId, @customerName, @paymentType, @amount, @description, @receiptImageUrl, 'Kayıtlı', @createdAt)
  `).run({ ...payload, description: payload.description || "", receiptImageUrl: payload.receiptImageUrl || "", createdAt });
  db.prepare("UPDATE customers SET currentBalance = currentBalance - ?, totalPayments = totalPayments + ?, updatedAt = ? WHERE id = ?").run(
    payload.amount,
    payload.amount,
    createdAt,
    payload.customerId,
  );
}

function savePaymentTx(db, payload) {
  const createdAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO payments (paymentNo, date, supplierId, supplierName, paymentType, amount, description, receiptImageUrl, status, createdAt)
    VALUES (@paymentNo, @date, @supplierId, @supplierName, @paymentType, @amount, @description, @receiptImageUrl, 'Kayıtlı', @createdAt)
  `).run({ ...payload, description: payload.description || "", receiptImageUrl: payload.receiptImageUrl || "", createdAt });
  db.prepare(`
    UPDATE suppliers
    SET currentBalance = currentBalance - ?, totalPayments = totalPayments + ?, lastTransactionDate = ?, updatedAt = ?
    WHERE id = ?
  `).run(payload.amount, payload.amount, payload.date, createdAt, payload.supplierId);
}

function cancelPurchaseSlipTx(db, slipId) {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const slip = db.prepare("SELECT * FROM purchase_slips WHERE id = ?").get(slipId);
  if (!slip) throw new Error("Alış fişi bulunamadı.");
  if (slip.status === "İptal") throw new Error("Bu alış fişi zaten iptal edilmiş.");

  const items = db.prepare("SELECT * FROM purchase_slip_items WHERE slipId = ? ORDER BY id ASC").all(slipId);
  const getProduct = db.prepare("SELECT stockQuantity FROM products WHERE id = ?");
  const updateStock = db.prepare("UPDATE products SET stockQuantity = stockQuantity - ?, updatedAt = ? WHERE id = ?");
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements (date, productId, productCode, barcode, productName, size, color, movementType, quantityIn, quantityOut, remainingStock, relatedSlipNo, relatedPartyName, createdBy, createdAt)
    VALUES (@date, @productId, @productCode, @barcode, @productName, @size, @color, 'Alış İptali', 0, @quantityOut, @remainingStock, @relatedSlipNo, @relatedPartyName, 'İptal', @createdAt)
  `);

  items.forEach((item) => {
    const currentStock = getProduct.get(item.productId)?.stockQuantity || 0;
    const remainingStock = currentStock - item.quantity;
    updateStock.run(item.quantity, now, item.productId);
    insertMovement.run({
      ...item,
      date: today,
      quantityOut: item.quantity,
      remainingStock,
      relatedSlipNo: slip.slipNo,
      relatedPartyName: slip.supplierName,
      createdAt: now,
    });
  });

  db.prepare("UPDATE purchase_slips SET status = 'İptal' WHERE id = ?").run(slipId);
  db.prepare(`
    UPDATE suppliers
    SET currentBalance = currentBalance - ?, totalPurchases = totalPurchases - ?, updatedAt = ?
    WHERE id = ?
  `).run(slip.grandTotal, slip.grandTotal, now, slip.supplierId);
}

function cancelSalesSlipTx(db, slipId) {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const slip = db.prepare("SELECT * FROM sales_slips WHERE id = ?").get(slipId);
  if (!slip) throw new Error("Satış fişi bulunamadı.");
  if (slip.status === "İptal") throw new Error("Bu satış fişi zaten iptal edilmiş.");

  const items = db.prepare("SELECT * FROM sales_slip_items WHERE slipId = ? ORDER BY id ASC").all(slipId);
  const getProduct = db.prepare("SELECT stockQuantity FROM products WHERE id = ?");
  const updateStock = db.prepare("UPDATE products SET stockQuantity = stockQuantity + ?, updatedAt = ? WHERE id = ?");
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements (date, productId, productCode, barcode, productName, size, color, movementType, quantityIn, quantityOut, remainingStock, relatedSlipNo, relatedPartyName, createdBy, createdAt)
    VALUES (@date, @productId, @productCode, @barcode, @productName, @size, @color, 'Satış İptali', @quantityIn, 0, @remainingStock, @relatedSlipNo, @relatedPartyName, 'İptal', @createdAt)
  `);

  items.forEach((item) => {
    const currentStock = getProduct.get(item.productId)?.stockQuantity || 0;
    const remainingStock = currentStock + item.quantity;
    updateStock.run(item.quantity, now, item.productId);
    insertMovement.run({
      ...item,
      date: today,
      quantityIn: item.quantity,
      remainingStock,
      relatedSlipNo: slip.slipNo,
      relatedPartyName: slip.customerName,
      createdAt: now,
    });
  });

  db.prepare("UPDATE sales_slips SET status = 'İptal' WHERE id = ?").run(slipId);
  db.prepare(`
    UPDATE customers
    SET currentBalance = currentBalance - ?, totalSales = totalSales - ?, updatedAt = ?
    WHERE id = ?
  `).run(slip.grandTotal, slip.grandTotal, now, slip.customerId);
}

function cancelCollectionTx(db, collectionId) {
  const now = new Date().toISOString();
  const collection = db.prepare("SELECT * FROM collections WHERE id = ?").get(collectionId);
  if (!collection) throw new Error("Tahsilat bulunamadı.");
  if (collection.status === "İptal") throw new Error("Bu tahsilat zaten iptal edilmiş.");

  db.prepare("UPDATE collections SET status = 'İptal' WHERE id = ?").run(collectionId);
  db.prepare(`
    UPDATE customers
    SET currentBalance = currentBalance + ?, totalPayments = totalPayments - ?, updatedAt = ?
    WHERE id = ?
  `).run(collection.amount, collection.amount, now, collection.customerId);
}

function cancelPaymentTx(db, paymentId) {
  const now = new Date().toISOString();
  const payment = db.prepare("SELECT * FROM payments WHERE id = ?").get(paymentId);
  if (!payment) throw new Error("Ödeme bulunamadı.");
  if (payment.status === "İptal") throw new Error("Bu ödeme zaten iptal edilmiş.");

  db.prepare("UPDATE payments SET status = 'İptal' WHERE id = ?").run(paymentId);
  db.prepare(`
    UPDATE suppliers
    SET currentBalance = currentBalance + ?, totalPayments = totalPayments - ?, updatedAt = ?
    WHERE id = ?
  `).run(payment.amount, payment.amount, now, payment.supplierId);
}

function applyStockCountAdjustmentTx(db, payload) {
  const validationError = validateStockAdjustmentPayload(payload);
  if (validationError) throw new Error(validationError);

  const now = new Date().toISOString();
  const referenceNo = buildStockCountReference(now);
  const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
  const updateStock = db.prepare("UPDATE products SET stockQuantity = ?, updatedAt = ? WHERE id = ?");
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements (
      date, productId, productCode, barcode, productName, size, color, movementType,
      quantityIn, quantityOut, remainingStock, relatedSlipNo, relatedPartyName, createdBy, createdAt
    )
    VALUES (
      @date, @productId, @productCode, @barcode, @productName, @size, @color, @movementType,
      @quantityIn, @quantityOut, @remainingStock, @relatedSlipNo, @relatedPartyName, 'Sayım', @createdAt
    )
  `);

  let adjustedCount = 0;

  payload.items.forEach((item) => {
    const product = getProduct.get(item.productId);
    if (!product) throw new Error(`${item.productName || "Ürün"} bulunamadı.`);

    const countedQuantity = Number(item.countedQuantity);
    const currentDbStock = Number(product.stockQuantity) || 0;
    const actualDifference = countedQuantity - currentDbStock;
    if (actualDifference === 0) return;

    updateStock.run(countedQuantity, now, product.id);
    insertMovement.run({
      date: payload.date,
      productId: product.id,
      productCode: product.code || item.productCode || "",
      barcode: product.barcode || item.barcode || "",
      productName: product.name || item.productName || "",
      size: product.size || item.size || "",
      color: product.color || item.color || "",
      movementType: actualDifference > 0 ? "Sayım Fazlası" : "Sayım Eksiği",
      quantityIn: actualDifference > 0 ? actualDifference : 0,
      quantityOut: actualDifference < 0 ? Math.abs(actualDifference) : 0,
      remainingStock: countedQuantity,
      relatedSlipNo: referenceNo,
      relatedPartyName: "Barkodlu Stok Sayım",
      createdAt: now,
    });
    adjustedCount += 1;
  });

  if (adjustedCount === 0) throw new Error("Düzeltilecek ürün bulunamadı.");

  return { referenceNo, adjustedCount };
}

function applyDataImportTx(db, payload) {
  const validationError = validateDataImportPayload(payload);
  if (validationError) throw new Error(validationError);

  const now = new Date().toISOString();
  const insertFns = {
    products: (row) => addProductTx(db, normalizeImportProduct(row.values, now)),
    customers: (row) => addCustomerTx(db, normalizeImportCustomer(row.values, now)),
    suppliers: (row) => addSupplierTx(db, normalizeImportSupplier(row.values, now)),
  };

  assertDataImportDuplicates(db, payload);
  payload.rows.forEach((row) => insertFns[payload.importType](row));

  return {
    importType: payload.importType,
    totalRows: payload.rows.length,
    insertedCount: payload.rows.length,
    skippedCount: 0,
    errors: [],
    createdAt: now,
  };
}

function addProductTx(db, payload) {
  const now = new Date().toISOString();
  const product = normalizeProductPayload(payload, { now });
  assertUniqueProductFields(db, product);

  db.prepare(`
    INSERT INTO products (
      barcode, code, modelCode, variantCode, name, brand, season, ageGroup, gender, category, size, color,
      purchasePrice, salePrice, stockQuantity, criticalStockLevel, supplier, imageUrl, isActive, createdAt, updatedAt
    )
    VALUES (
      @barcode, @code, @modelCode, @variantCode, @name, @brand, @season, @ageGroup, @gender, @category, @size, @color,
      @purchasePrice, @salePrice, @stockQuantity, @criticalStockLevel, @supplier, @imageUrl, 1, @now, @now
    )
  `).run(product);
}

function updateProductTx(db, payload) {
  const product = normalizeProductPayload(payload, { isActive: payload.isActive ? 1 : 0, updatedAt: new Date().toISOString() });
  assertUniqueProductFields(db, product, payload.id);

  db.prepare(`
    UPDATE products
    SET barcode=@barcode, code=@code, modelCode=@modelCode, variantCode=@variantCode, name=@name, brand=@brand,
      season=@season, ageGroup=@ageGroup, gender=@gender, category=@category, size=@size, color=@color, purchasePrice=@purchasePrice,
      salePrice=@salePrice, stockQuantity=@stockQuantity, criticalStockLevel=@criticalStockLevel, supplier=@supplier, imageUrl=@imageUrl,
      isActive=@isActive, updatedAt=@updatedAt
    WHERE id=@id
  `).run(product);
}

function normalizeProductPayload(payload, extraFields = {}) {
  return {
    ...payload,
    barcode: normalizeNullableText(payload.barcode),
    code: normalizeNullableText(payload.code),
    modelCode: normalizeNullableText(payload.modelCode),
    variantCode: normalizeNullableText(payload.variantCode),
    brand: normalizeNullableText(payload.brand),
    season: normalizeNullableText(payload.season),
    ageGroup: normalizeNullableText(payload.ageGroup),
    gender: normalizeNullableText(payload.gender),
    category: normalizeNullableText(payload.category),
    supplier: normalizeNullableText(payload.supplier),
    imageUrl: normalizeNullableText(payload.imageUrl),
    ...extraFields,
  };
}

function normalizeNullableText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function assertUniqueProductFields(db, product, currentProductId = null) {
  const checks = [
    { key: "barcode", message: "Bu barkod başka bir üründe kullanılıyor." },
    { key: "code", message: "Bu ürün kodu başka bir üründe kullanılıyor." },
    { key: "variantCode", message: "Bu varyant kodu başka bir üründe kullanılıyor." },
  ];

  checks.forEach((check) => {
    const value = product[check.key];
    if (!value) return;

    const row = db.prepare(`SELECT id FROM products WHERE TRIM(COALESCE(${check.key}, '')) = ? LIMIT 1`).get(value);
    if (row && row.id !== currentProductId) throw new Error(check.message);
  });
}

function addCustomerTx(db, payload) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO customers (name, companyName, phone, whatsapp, country, city, customerType, openingBalance, totalSales, totalPayments, currentBalance, riskLimit, lastPurchaseDate, notes, isActive, createdAt, updatedAt)
    VALUES (@name, @companyName, @phone, @whatsapp, @country, @city, @customerType, @openingBalance, @totalSales, @totalPayments, @currentBalance, @riskLimit, @lastPurchaseDate, @notes, 1, @now, @now)
  `).run({ ...payload, notes: payload.notes || "", now });
}

function updateCustomerTx(db, payload) {
  db.prepare(`
    UPDATE customers
    SET name=@name, companyName=@companyName, phone=@phone, whatsapp=@whatsapp, country=@country, city=@city, customerType=@customerType,
      openingBalance=@openingBalance, totalSales=@totalSales, totalPayments=@totalPayments, currentBalance=@currentBalance,
      riskLimit=@riskLimit, lastPurchaseDate=@lastPurchaseDate, notes=@notes, isActive=@isActive, updatedAt=@updatedAt
    WHERE id=@id
  `).run({ ...payload, notes: payload.notes || "", isActive: payload.isActive ? 1 : 0, updatedAt: new Date().toISOString() });
}

function addSupplierTx(db, payload) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO suppliers (name, companyTitle, phone, whatsapp, contactPerson, city, country, address, taxInfo, iban, openingBalance, totalPurchases, totalPayments, currentBalance, lastTransactionDate, notes, isActive, createdAt, updatedAt)
    VALUES (@name, @companyTitle, @phone, @whatsapp, @contactPerson, @city, @country, @address, @taxInfo, @iban, @openingBalance, @totalPurchases, @totalPayments, @currentBalance, @lastTransactionDate, @notes, 1, @now, @now)
  `).run({ ...payload, address: payload.address || "", taxInfo: payload.taxInfo || "", iban: payload.iban || "", notes: payload.notes || "", now });
}

function updateSupplierTx(db, payload) {
  db.prepare(`
    UPDATE suppliers
    SET name=@name, companyTitle=@companyTitle, phone=@phone, whatsapp=@whatsapp, contactPerson=@contactPerson, city=@city, country=@country,
      address=@address, taxInfo=@taxInfo, iban=@iban, openingBalance=@openingBalance, totalPurchases=@totalPurchases,
      totalPayments=@totalPayments, currentBalance=@currentBalance, lastTransactionDate=@lastTransactionDate, notes=@notes,
      isActive=@isActive, updatedAt=@updatedAt
    WHERE id=@id
  `).run({
    ...payload,
    address: payload.address || "",
    taxInfo: payload.taxInfo || "",
    iban: payload.iban || "",
    notes: payload.notes || "",
    isActive: payload.isActive ? 1 : 0,
    updatedAt: new Date().toISOString(),
  });
}

function toggleStatusTx(db, table, id) {
  db.prepare(`UPDATE ${table} SET isActive = CASE WHEN isActive = 1 THEN 0 ELSE 1 END, updatedAt = ? WHERE id = ?`).run(
    new Date().toISOString(),
    id,
  );
}

function wrapMutation(fn, db) {
  try {
    const record = fn();
    return { ok: true, data: getInitialErpData(db), record };
  } catch (error) {
    console.error("SQLite mutasyon işlemi tamamlanamadı:", error);
    return { ok: false, error: mapDatabaseError(error) };
  }
}

function mapDatabaseError(error) {
  const message = error.message || "Veritabanı işlemi tamamlanamadı.";
  if (message.includes("sales_slips.slipNo") || message.includes("purchase_slips.slipNo")) return "Fiş numarası çakıştı. Lütfen tekrar kaydedin.";
  if (message.includes("products.barcode")) return "Bu barkod başka bir üründe kullanılıyor.";
  if (message.includes("products.code")) return "Bu ürün kodu başka bir üründe kullanılıyor.";
  if (message.includes("products.variantCode")) return "Bu varyant kodu başka bir üründe kullanılıyor.";
  return message;
}

function allocateDocumentNo(db, { documentType, prefix, tableName, columnName, requestedNo }) {
  const year = new Date().getFullYear();
  ensureDocumentCounter(db, { documentType, prefix, tableName, columnName, year });

  const normalizedRequestedNo = normalizeNullableText(requestedNo);
  if (normalizedRequestedNo && !documentNoExists(db, tableName, columnName, normalizedRequestedNo)) {
    syncDocumentCounterWithNo(db, { documentType, prefix, year, documentNo: normalizedRequestedNo });
    return normalizedRequestedNo;
  }

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const documentNo = incrementDocumentCounter(db, { documentType, prefix, year });
    if (!documentNoExists(db, tableName, columnName, documentNo)) return documentNo;
  }

  throw new Error("Fiş numarası çakıştı. Lütfen tekrar kaydedin.");
}

function ensureDocumentCounter(db, { documentType, prefix, tableName, columnName, year }) {
  const now = new Date().toISOString();
  const maxExistingSequence = getMaxDocumentSequence(db, { tableName, columnName, prefix, year });
  const existing = db.prepare("SELECT lastNumber FROM document_numbers WHERE documentType = ? AND year = ?").get(documentType, year);

  if (!existing) {
    db.prepare(`
      INSERT INTO document_numbers (documentType, prefix, lastNumber, year, isActive, updatedAt)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run(documentType, prefix, maxExistingSequence, year, now);
    return;
  }

  if (Number(existing.lastNumber) < maxExistingSequence) {
    db.prepare("UPDATE document_numbers SET lastNumber = ?, prefix = ?, isActive = 1, updatedAt = ? WHERE documentType = ? AND year = ?").run(
      maxExistingSequence,
      prefix,
      now,
      documentType,
      year,
    );
  }
}

function incrementDocumentCounter(db, { documentType, prefix, year }) {
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE document_numbers
    SET lastNumber = lastNumber + 1, prefix = ?, isActive = 1, updatedAt = ?
    WHERE documentType = ? AND year = ?
  `).run(prefix, now, documentType, year);

  const row = db.prepare("SELECT lastNumber FROM document_numbers WHERE documentType = ? AND year = ?").get(documentType, year);
  return formatDocumentNo(prefix, year, row.lastNumber);
}

function syncDocumentCounterWithNo(db, { documentType, prefix, year, documentNo }) {
  const sequence = parseDocumentSequence(documentNo, prefix, year);
  if (!sequence) return;

  db.prepare(`
    UPDATE document_numbers
    SET lastNumber = MAX(lastNumber, ?), prefix = ?, isActive = 1, updatedAt = ?
    WHERE documentType = ? AND year = ?
  `).run(sequence, prefix, new Date().toISOString(), documentType, year);
}

function documentNoExists(db, tableName, columnName, documentNo) {
  return Boolean(db.prepare(`SELECT 1 FROM ${tableName} WHERE ${columnName} = ? LIMIT 1`).get(documentNo));
}

function getMaxDocumentSequence(db, { tableName, columnName, prefix, year }) {
  const rows = db.prepare(`SELECT ${columnName} AS documentNo FROM ${tableName} WHERE ${columnName} IS NOT NULL`).all();
  return rows.reduce((maxSequence, row) => {
    const sequence = parseDocumentSequence(row.documentNo, prefix, year);
    return sequence && sequence > maxSequence ? sequence : maxSequence;
  }, 0);
}

function parseDocumentSequence(documentNo, prefix, year) {
  if (typeof documentNo !== "string") return 0;

  const modernPrefix = `${prefix}-${year}-`;
  if (documentNo.startsWith(modernPrefix)) {
    const sequence = Number(documentNo.slice(modernPrefix.length));
    return Number.isInteger(sequence) ? sequence : 0;
  }

  const legacyPrefix = `${prefix}-`;
  if (documentNo.startsWith(legacyPrefix)) {
    const sequence = Number(documentNo.slice(legacyPrefix.length));
    return Number.isInteger(sequence) ? sequence : 0;
  }

  return 0;
}

function formatDocumentNo(prefix, year, sequence) {
  return `${prefix}-${year}-${String(sequence).padStart(6, "0")}`;
}

function validateStockAdjustmentPayload(payload) {
  if (!payload?.date) return "Sayım tarihi bulunamadı.";
  if (!Array.isArray(payload.items) || payload.items.length === 0) return "Düzeltilecek ürün bulunamadı.";

  const productIds = new Set();
  for (const item of payload.items) {
    if (!item.productId) return "Düzeltilecek ürün bulunamadı.";
    if (productIds.has(Number(item.productId))) return "Aynı ürün birden fazla satırda görünüyor. Lütfen listeyi kontrol edin.";
    productIds.add(Number(item.productId));

    if (!Number.isFinite(Number(item.countedQuantity)) || Number(item.countedQuantity) < 0) return "Sayım miktarı geçersiz.";
    if (!Number.isFinite(Number(item.currentStock)) || !Number.isFinite(Number(item.difference))) return "Sayım miktarı geçersiz.";
  }

  return "";
}

function validateDataImportPayload(payload) {
  if (!["products", "customers", "suppliers"].includes(payload?.importType)) return "İçe aktarma tipi geçersiz.";
  if (!Array.isArray(payload.rows) || payload.rows.length === 0) return "İçe aktarılacak geçerli satır bulunamadı.";

  const seenProductKeys = {
    barcode: new Set(),
    code: new Set(),
    variantCode: new Set(),
  };

  for (const row of payload.rows) {
    if (row.status === "error") return "Hatalı satırlar içe aktarılamaz.";
    const values = row.values || {};

    if (payload.importType === "products") {
      if (!normalizeNullableText(values.name)) return "Zorunlu alanlar eksik.";
      if (!normalizeNullableText(values.code) && !normalizeNullableText(values.barcode)) return "Zorunlu alanlar eksik.";
      for (const field of ["purchasePrice", "salePrice", "stockQuantity", "criticalStockLevel"]) {
        if (!isImportNumber(values[field])) return "Sayısal alanlar hatalı.";
      }
      for (const field of ["barcode", "code", "variantCode"]) {
        const value = normalizeNullableText(values[field]);
        if (!value) continue;
        const key = value.toLocaleLowerCase("tr-TR");
        if (seenProductKeys[field].has(key)) return field === "barcode" ? "Bu barkod başka bir üründe kullanılıyor." : field === "code" ? "Bu ürün kodu başka bir üründe kullanılıyor." : "Bu varyant kodu başka bir üründe kullanılıyor.";
        seenProductKeys[field].add(key);
      }
    }

    if (payload.importType === "customers" && !normalizeNullableText(values.name)) return "Zorunlu alanlar eksik.";
    if (payload.importType === "customers") {
      for (const field of ["openingBalance", "riskLimit"]) {
        if (!isImportNumber(values[field])) return "Sayısal alanlar hatalı.";
      }
    }

    if (payload.importType === "suppliers" && !normalizeNullableText(values.name)) return "Zorunlu alanlar eksik.";
    if (payload.importType === "suppliers" && !isImportNumber(values.openingBalance)) return "Sayısal alanlar hatalı.";
  }

  return "";
}

function assertDataImportDuplicates(db, payload) {
  if (payload.importType === "products") {
    payload.rows.forEach((row) => assertUniqueProductFields(db, normalizeImportProduct(row.values, new Date().toISOString())));
    return;
  }

  if (payload.importType === "customers") {
    payload.rows.forEach((row) => {
      const values = row.values || {};
      const name = normalizeNullableText(values.name);
      const phone = normalizeNullableText(values.phone);
      const companyName = normalizeNullableText(values.companyName);
      const duplicate = db
        .prepare(
          "SELECT id FROM customers WHERE (TRIM(COALESCE(name, '')) = ? AND TRIM(COALESCE(phone, '')) = ?) OR (? IS NOT NULL AND TRIM(COALESCE(companyName, '')) = ?) LIMIT 1",
        )
        .get(name, phone || "", companyName, companyName || "");
      if (duplicate) throw new Error("Bu müşteri bilgileri zaten kayıtlı görünüyor.");
    });
  }

  if (payload.importType === "suppliers") {
    payload.rows.forEach((row) => {
      const values = row.values || {};
      const name = normalizeNullableText(values.name);
      const companyTitle = normalizeNullableText(values.companyTitle);
      const duplicate = db
        .prepare("SELECT id FROM suppliers WHERE TRIM(COALESCE(name, '')) = ? OR (? IS NOT NULL AND TRIM(COALESCE(companyTitle, '')) = ?) LIMIT 1")
        .get(name, companyTitle, companyTitle || "");
      if (duplicate) throw new Error("Bu tedarikçi bilgileri zaten kayıtlı görünüyor.");
    });
  }
}

function normalizeImportProduct(values, now) {
  return {
    barcode: values.barcode || "",
    code: values.code || "",
    modelCode: values.modelCode || "",
    variantCode: values.variantCode || "",
    name: values.name || "",
    brand: values.brand || "",
    season: values.season || "",
    ageGroup: values.ageGroup || "",
    gender: values.gender || "",
    category: values.category || "",
    size: values.size || "",
    color: values.color || "",
    purchasePrice: parseImportNumber(values.purchasePrice),
    salePrice: parseImportNumber(values.salePrice),
    stockQuantity: parseImportNumber(values.stockQuantity),
    criticalStockLevel: parseImportNumber(values.criticalStockLevel),
    supplier: values.supplier || "",
    imageUrl: "",
    now,
  };
}

function normalizeImportCustomer(values, now) {
  const openingBalance = parseImportNumber(values.openingBalance);
  return {
    name: values.name || "",
    companyName: values.companyName || "",
    phone: values.phone || "",
    whatsapp: values.whatsapp || "",
    country: values.country || "",
    city: values.city || "",
    customerType: values.customerType || "",
    openingBalance,
    totalSales: 0,
    totalPayments: 0,
    currentBalance: openingBalance,
    riskLimit: parseImportNumber(values.riskLimit),
    lastPurchaseDate: "",
    notes: values.notes || "",
    now,
  };
}

function normalizeImportSupplier(values, now) {
  const openingBalance = parseImportNumber(values.openingBalance);
  return {
    name: values.name || "",
    companyTitle: values.companyTitle || "",
    phone: values.phone || "",
    whatsapp: values.whatsapp || "",
    contactPerson: values.contactPerson || "",
    city: values.city || "",
    country: values.country || "",
    address: values.address || "",
    taxInfo: values.taxInfo || "",
    iban: values.iban || "",
    openingBalance,
    totalPurchases: 0,
    totalPayments: 0,
    currentBalance: openingBalance,
    lastTransactionDate: "",
    notes: values.notes || "",
    now,
  };
}

function parseImportNumber(value) {
  const numberValue = Number(String(value || "0").replace(",", "."));
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function isImportNumber(value) {
  if (value === undefined || value === null || String(value).trim() === "") return true;
  return Number.isFinite(Number(String(value).replace(",", ".")));
}

function buildStockCountReference(value = new Date().toISOString()) {
  const digits = value.replace(/\D/g, "");
  const datePart = digits.slice(0, 8);
  const timePart = digits.slice(8, 14);
  return `SAYIM-${datePart}-${timePart}`;
}

function parseItemsJson(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Fiş satırları JSON alanından okunamadı:", error);
    return [];
  }
}

function rowsToBooleans(rows) {
  return rows.map((row) => ({ ...row, isActive: Boolean(row.isActive) }));
}

function rowsToBooleanFields(rows) {
  return rows.map((row) => {
    const result = { ...row };
    ["isActive", "isDefault", "isMain"].forEach((field) => {
      if (field in result) result[field] = Boolean(result[field]);
    });
    return result;
  });
}

function sumQuantitiesByProduct(items) {
  return items.reduce((quantities, item) => {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    return quantities;
  }, new Map());
}

module.exports = { createRepositories };
