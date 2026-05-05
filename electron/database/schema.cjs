function runMigrations(db) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      barcode TEXT,
      code TEXT UNIQUE NOT NULL,
      modelCode TEXT,
      variantCode TEXT,
      name TEXT NOT NULL,
      brand TEXT,
      season TEXT,
      ageGroup TEXT,
      gender TEXT,
      category TEXT,
      size TEXT,
      color TEXT,
      purchasePrice REAL DEFAULT 0,
      salePrice REAL DEFAULT 0,
      stockQuantity INTEGER DEFAULT 0,
      criticalStockLevel INTEGER DEFAULT 0,
      supplier TEXT,
      imageUrl TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      companyName TEXT,
      phone TEXT,
      whatsapp TEXT,
      country TEXT,
      city TEXT,
      customerType TEXT,
      openingBalance REAL DEFAULT 0,
      totalSales REAL DEFAULT 0,
      totalPayments REAL DEFAULT 0,
      currentBalance REAL DEFAULT 0,
      riskLimit REAL DEFAULT 0,
      lastPurchaseDate TEXT,
      notes TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      companyTitle TEXT,
      phone TEXT,
      whatsapp TEXT,
      contactPerson TEXT,
      city TEXT,
      country TEXT,
      address TEXT,
      taxInfo TEXT,
      iban TEXT,
      openingBalance REAL DEFAULT 0,
      totalPurchases REAL DEFAULT 0,
      totalPayments REAL DEFAULT 0,
      currentBalance REAL DEFAULT 0,
      lastTransactionDate TEXT,
      notes TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS purchase_slips (
      id INTEGER PRIMARY KEY,
      slipNo TEXT UNIQUE NOT NULL,
      date TEXT,
      supplierId INTEGER,
      supplierName TEXT,
      warehouse TEXT,
      subtotal REAL DEFAULT 0,
      discountTotal REAL DEFAULT 0,
      taxTotal REAL DEFAULT 0,
      grandTotal REAL DEFAULT 0,
      description TEXT,
      items_json TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS purchase_slip_items (
      id INTEGER PRIMARY KEY,
      slipId INTEGER NOT NULL,
      productId INTEGER,
      productCode TEXT,
      barcode TEXT,
      productName TEXT,
      size TEXT,
      color TEXT,
      quantity INTEGER DEFAULT 0,
      unitPrice REAL DEFAULT 0,
      discountRate REAL DEFAULT 0,
      taxRate REAL DEFAULT 0,
      lineTotal REAL DEFAULT 0,
      FOREIGN KEY (slipId) REFERENCES purchase_slips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales_slips (
      id INTEGER PRIMARY KEY,
      slipNo TEXT UNIQUE NOT NULL,
      date TEXT,
      customerId INTEGER,
      customerName TEXT,
      saleType TEXT,
      cargoInfo TEXT,
      subtotal REAL DEFAULT 0,
      discountTotal REAL DEFAULT 0,
      grandTotal REAL DEFAULT 0,
      description TEXT,
      items_json TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS sales_slip_items (
      id INTEGER PRIMARY KEY,
      slipId INTEGER NOT NULL,
      productId INTEGER,
      productCode TEXT,
      barcode TEXT,
      productName TEXT,
      size TEXT,
      color TEXT,
      quantity INTEGER DEFAULT 0,
      unitPrice REAL DEFAULT 0,
      discountRate REAL DEFAULT 0,
      availableStock INTEGER DEFAULT 0,
      lineTotal REAL DEFAULT 0,
      FOREIGN KEY (slipId) REFERENCES sales_slips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY,
      collectionNo TEXT UNIQUE NOT NULL,
      date TEXT,
      customerId INTEGER,
      customerName TEXT,
      paymentType TEXT,
      amount REAL DEFAULT 0,
      description TEXT,
      receiptImageUrl TEXT,
      status TEXT DEFAULT 'Kayıtlı',
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY,
      paymentNo TEXT UNIQUE NOT NULL,
      date TEXT,
      supplierId INTEGER,
      supplierName TEXT,
      paymentType TEXT,
      amount REAL DEFAULT 0,
      description TEXT,
      receiptImageUrl TEXT,
      status TEXT DEFAULT 'Kayıtlı',
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY,
      date TEXT,
      productId INTEGER,
      productCode TEXT,
      barcode TEXT,
      productName TEXT,
      size TEXT,
      color TEXT,
      movementType TEXT,
      quantityIn INTEGER DEFAULT 0,
      quantityOut INTEGER DEFAULT 0,
      remainingStock INTEGER DEFAULT 0,
      relatedSlipNo TEXT,
      relatedPartyName TEXT,
      createdBy TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      symbol TEXT,
      isDefault INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS exchange_rates (
      id INTEGER PRIMARY KEY,
      currencyCode TEXT NOT NULL,
      rateDate TEXT NOT NULL,
      rate REAL DEFAULT 1,
      source TEXT,
      createdAt TEXT,
      UNIQUE(currencyCode, rateDate, source),
      FOREIGN KEY (currencyCode) REFERENCES currencies(code)
    );

    CREATE TABLE IF NOT EXISTS current_accounts (
      id INTEGER PRIMARY KEY,
      accountCode TEXT UNIQUE NOT NULL,
      accountName TEXT NOT NULL,
      accountType TEXT NOT NULL,
      companyName TEXT,
      phone TEXT,
      whatsapp TEXT,
      email TEXT,
      country TEXT,
      city TEXT,
      district TEXT,
      address TEXT,
      taxOffice TEXT,
      taxNumber TEXT,
      currencyCode TEXT DEFAULT 'TRY',
      openingBalance REAL DEFAULT 0,
      currentBalance REAL DEFAULT 0,
      foreignBalance REAL DEFAULT 0,
      riskLimit REAL DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (currencyCode) REFERENCES currencies(code)
    );

    CREATE TABLE IF NOT EXISTS current_account_movements (
      id INTEGER PRIMARY KEY,
      accountId INTEGER,
      accountCode TEXT,
      accountName TEXT,
      movementDate TEXT,
      movementType TEXT,
      documentType TEXT,
      documentNo TEXT,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      balance REAL DEFAULT 0,
      currencyCode TEXT DEFAULT 'TRY',
      exchangeRate REAL DEFAULT 1,
      foreignDebit REAL DEFAULT 0,
      foreignCredit REAL DEFAULT 0,
      foreignBalance REAL DEFAULT 0,
      description TEXT,
      relatedModule TEXT,
      relatedId INTEGER,
      createdAt TEXT,
      FOREIGN KEY (accountId) REFERENCES current_accounts(id),
      FOREIGN KEY (currencyCode) REFERENCES currencies(code)
    );

    CREATE TABLE IF NOT EXISTS product_barcodes (
      id INTEGER PRIMARY KEY,
      productId INTEGER NOT NULL,
      barcode TEXT UNIQUE NOT NULL,
      barcodeType TEXT,
      priceType TEXT,
      isMain INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (productId) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS warehouses (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      isDefault INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS stock_balances (
      id INTEGER PRIMARY KEY,
      productId INTEGER NOT NULL,
      warehouseId INTEGER NOT NULL,
      quantity REAL DEFAULT 0,
      reservedQuantity REAL DEFAULT 0,
      availableQuantity REAL DEFAULT 0,
      updatedAt TEXT,
      UNIQUE(productId, warehouseId),
      FOREIGN KEY (productId) REFERENCES products(id),
      FOREIGN KEY (warehouseId) REFERENCES warehouses(id)
    );

    CREATE TABLE IF NOT EXISTS price_lists (
      id INTEGER PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      currencyCode TEXT DEFAULT 'TRY',
      priceType TEXT,
      isDefault INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (currencyCode) REFERENCES currencies(code)
    );

    CREATE TABLE IF NOT EXISTS price_list_items (
      id INTEGER PRIMARY KEY,
      priceListId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      price REAL DEFAULT 0,
      currencyCode TEXT DEFAULT 'TRY',
      validFrom TEXT,
      validTo TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT,
      UNIQUE(priceListId, productId),
      FOREIGN KEY (priceListId) REFERENCES price_lists(id),
      FOREIGN KEY (productId) REFERENCES products(id),
      FOREIGN KEY (currencyCode) REFERENCES currencies(code)
    );

    CREATE TABLE IF NOT EXISTS document_numbers (
      id INTEGER PRIMARY KEY,
      documentType TEXT NOT NULL,
      prefix TEXT NOT NULL,
      lastNumber INTEGER DEFAULT 0,
      year INTEGER,
      isActive INTEGER DEFAULT 1,
      updatedAt TEXT,
      UNIQUE(documentType, year)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      userName TEXT,
      action TEXT,
      entityType TEXT,
      entityId INTEGER,
      oldValue TEXT,
      newValue TEXT,
      description TEXT,
      createdAt TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_current_account_movements_account
      ON current_account_movements(accountId, movementDate);

    CREATE INDEX IF NOT EXISTS idx_product_barcodes_product
      ON product_barcodes(productId);

    CREATE INDEX IF NOT EXISTS idx_stock_balances_product
      ON stock_balances(productId, warehouseId);

    CREATE INDEX IF NOT EXISTS idx_price_list_items_product
      ON price_list_items(productId, priceListId);
  `);

  ensureColumn(db, "collections", "status", "TEXT DEFAULT 'Kayıtlı'");
  ensureColumn(db, "payments", "status", "TEXT DEFAULT 'Kayıtlı'");
  ensureColumn(db, "products", "modelCode", "TEXT");
  ensureColumn(db, "products", "variantCode", "TEXT");
  ensureColumn(db, "products", "season", "TEXT");
  ensureColumn(db, "products", "ageGroup", "TEXT");
  ensureColumn(db, "products", "gender", "TEXT");
  ensureColumn(db, "products", "brand", "TEXT");
  ensureColumn(db, "purchase_slips", "items_json", "TEXT");
  ensureColumn(db, "sales_slips", "items_json", "TEXT");
  normalizeEmptyProductCodes(db);
  createUniqueIndexIfClean(db, "idx_products_barcode_unique", "products", "barcode");
  createUniqueIndexIfClean(db, "idx_products_code_unique", "products", "code");
  createUniqueIndexIfClean(db, "idx_products_variant_code_unique", "products", "variantCode");
  createUniqueIndexIfClean(db, "idx_purchase_slips_slip_no_unique", "purchase_slips", "slipNo");
  createUniqueIndexIfClean(db, "idx_sales_slips_slip_no_unique", "sales_slips", "slipNo");
}

module.exports = { runMigrations };

function ensureColumn(db, tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (columns.some((column) => column.name === columnName)) return;

  db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`).run();
}

function normalizeEmptyProductCodes(db) {
  ["barcode", "code", "variantCode"].forEach((columnName) => {
    db.prepare(`UPDATE products SET ${columnName} = NULL WHERE TRIM(COALESCE(${columnName}, '')) = ''`).run();
  });
}

function createUniqueIndexIfClean(db, indexName, tableName, columnName) {
  const duplicate = db
    .prepare(
      `SELECT ${columnName}
       FROM ${tableName}
       WHERE ${columnName} IS NOT NULL AND TRIM(${columnName}) != ''
       GROUP BY ${columnName}
       HAVING COUNT(*) > 1
       LIMIT 1`,
    )
    .get();

  if (duplicate) return;

  db.prepare(
    `CREATE UNIQUE INDEX IF NOT EXISTS ${indexName}
     ON ${tableName}(${columnName})
     WHERE ${columnName} IS NOT NULL AND TRIM(${columnName}) != ''`,
  ).run();
}
