const DEFAULT_APP_SETTINGS = {
  dataMode: "demo",
  setupCompleted: "false",
  firstRunAt: "",
  liveStartedAt: "",
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
    updateAppSetting: (key, value) => wrapMutation(() => updateAppSettingTx(db, key, value), db),
    startLiveMode: () => startLiveMode(db, options),
    getInitialErpData: () => getInitialErpData(db),
    savePurchaseSlip: (payload) => wrapMutation(() => purchaseTransaction(payload), db),
    saveSalesSlip: (payload) => wrapMutation(() => salesTransaction(payload), db),
    saveCollection: (payload) => wrapMutation(() => collectionTransaction(payload), db),
    savePayment: (payload) => wrapMutation(() => paymentTransaction(payload), db),
    cancelPurchaseSlip: (id) => wrapMutation(() => cancelPurchaseTransaction(id), db),
    cancelSalesSlip: (id) => wrapMutation(() => cancelSalesTransaction(id), db),
    cancelCollection: (id) => wrapMutation(() => cancelCollectionTransaction(id), db),
    cancelPayment: (id) => wrapMutation(() => cancelPaymentTransaction(id), db),
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

function startLiveMode(db, options = {}) {
  try {
    const backupResult = options.createBackup ? options.createBackup() : { ok: false, error: "Otomatik yedekleme fonksiyonu tanımlı değil." };
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
  const slipInfo = db.prepare(`
    INSERT INTO purchase_slips (slipNo, date, supplierId, supplierName, warehouse, subtotal, discountTotal, taxTotal, grandTotal, description, items_json, status, createdAt)
    VALUES (@slipNo, @date, @supplierId, @supplierName, @warehouse, @subtotal, @discountTotal, @taxTotal, @grandTotal, @description, @items_json, 'Kayıtlı', @createdAt)
  `).run({ ...payload, description: payload.description || "", items_json: JSON.stringify(payload.items || []), createdAt });
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

  payload.items.forEach((item) => {
    insertItem.run({ ...item, slipId });
    const currentStock = getProduct.get(item.productId)?.stockQuantity || 0;
    const remainingStock = currentStock + item.quantity;
    updateStock.run(item.quantity, createdAt, item.productId);
    insertMovement.run({
      ...item,
      date: payload.date,
      quantityIn: item.quantity,
      remainingStock,
      relatedSlipNo: payload.slipNo,
      relatedPartyName: payload.supplierName,
      createdAt,
    });
  });

  db.prepare(`
    UPDATE suppliers
    SET currentBalance = currentBalance + ?, totalPurchases = totalPurchases + ?, lastTransactionDate = ?, updatedAt = ?
    WHERE id = ?
  `).run(payload.grandTotal, payload.grandTotal, payload.date, createdAt, payload.supplierId);
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

  const slipInfo = db.prepare(`
    INSERT INTO sales_slips (slipNo, date, customerId, customerName, saleType, cargoInfo, subtotal, discountTotal, grandTotal, description, items_json, status, createdAt)
    VALUES (@slipNo, @date, @customerId, @customerName, @saleType, @cargoInfo, @subtotal, @discountTotal, @grandTotal, @description, @items_json, 'Kayıtlı', @createdAt)
  `).run({ ...payload, cargoInfo: payload.cargoInfo || "", description: payload.description || "", items_json: JSON.stringify(payload.items || []), createdAt });
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

  payload.items.forEach((item) => {
    const currentStock = getProduct.get(item.productId)?.stockQuantity || 0;
    const remainingStock = currentStock - item.quantity;
    insertItem.run({ ...item, slipId, availableStock: currentStock });
    updateStock.run(item.quantity, createdAt, item.productId);
    insertMovement.run({
      ...item,
      date: payload.date,
      quantityOut: item.quantity,
      remainingStock,
      relatedSlipNo: payload.slipNo,
      relatedPartyName: payload.customerName,
      createdAt,
    });
  });

  db.prepare(`
    UPDATE customers
    SET currentBalance = currentBalance + ?, totalSales = totalSales + ?, lastPurchaseDate = ?, updatedAt = ?
    WHERE id = ?
  `).run(payload.grandTotal, payload.grandTotal, payload.date, createdAt, payload.customerId);
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

function addProductTx(db, payload) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO products (barcode, code, name, category, size, color, purchasePrice, salePrice, stockQuantity, criticalStockLevel, supplier, imageUrl, isActive, createdAt, updatedAt)
    VALUES (@barcode, @code, @name, @category, @size, @color, @purchasePrice, @salePrice, @stockQuantity, @criticalStockLevel, @supplier, @imageUrl, 1, @now, @now)
  `).run({ ...payload, imageUrl: payload.imageUrl || "", now });
}

function updateProductTx(db, payload) {
  db.prepare(`
    UPDATE products
    SET barcode=@barcode, code=@code, name=@name, category=@category, size=@size, color=@color, purchasePrice=@purchasePrice,
      salePrice=@salePrice, stockQuantity=@stockQuantity, criticalStockLevel=@criticalStockLevel, supplier=@supplier, imageUrl=@imageUrl,
      isActive=@isActive, updatedAt=@updatedAt
    WHERE id=@id
  `).run({ ...payload, imageUrl: payload.imageUrl || "", isActive: payload.isActive ? 1 : 0, updatedAt: new Date().toISOString() });
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
    fn();
    return { ok: true, data: getInitialErpData(db) };
  } catch (error) {
    console.error("SQLite mutasyon işlemi tamamlanamadı:", error);
    return { ok: false, error: error.message || "Veritabanı işlemi tamamlanamadı." };
  }
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
