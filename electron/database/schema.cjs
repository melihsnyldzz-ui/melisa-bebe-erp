function runMigrations(db) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      barcode TEXT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
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
  `);

  ensureColumn(db, "collections", "status", "TEXT DEFAULT 'Kayıtlı'");
  ensureColumn(db, "payments", "status", "TEXT DEFAULT 'Kayıtlı'");
}

module.exports = { runMigrations };

function ensureColumn(db, tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (columns.some((column) => column.name === columnName)) return;

  db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`).run();
}
