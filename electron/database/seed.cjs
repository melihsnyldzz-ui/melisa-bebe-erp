const now = "2026-05-03T09:00:00.000Z";

const seedData = {
  products: [
    [1, "869000001001", "MB-TRK-001", "Kız Bebek Triko Takım", "Takım", "6-9 Ay", "Pudra", 180, 280, 36, 5, "ABC Tekstil", "", 1],
    [2, "869000001002", "MB-TLM-002", "Erkek Bebek Tulum", "Tulum", "3-6 Ay", "Mavi", 140, 230, 48, 8, "Yıldız Bebe", "", 1],
    [3, "869000001003", "MB-YLK-003", "Bebek Yelek", "Yelek", "1 Yaş", "Krem", 95, 150, 4, 5, "Minik Moda", "", 1],
    [4, "869000001004", "MB-HST-004", "Yenidoğan Hastane Çıkışı", "Hastane Çıkışı", "0-3 Ay", "Beyaz", 220, 340, 18, 6, "ABC Tekstil", "", 1],
    [5, "869000001005", "MB-ELB-005", "Kız Bebek Elbise", "Elbise", "9-12 Ay", "Ekru", 190, 310, 12, 4, "Yıldız Bebe", "", 1],
  ],
  customers: [
    [1, "Ayşe Kids Boutique", "Ayşe Kids Tekstil", "0532 111 22 33", "0532 111 22 33", "Türkiye", "İstanbul", "Mağaza", 0, 18500, 8500, 10000, 50000, "2026-05-02", "", 1],
    [2, "Mira Baby Store", "Mira Baby", "0533 222 33 44", "0533 222 33 44", "Türkiye", "Bursa", "Instagram Satıcı", 0, 9200, 9200, 0, 30000, "2026-05-01", "", 1],
    [3, "Lina Çocuk Giyim", "Lina Çocuk Giyim Ltd.", "0534 333 44 55", "0534 333 44 55", "Türkiye", "İzmir", "Bayi", 5000, 32750, 15000, 22750, 60000, "2026-05-01", "", 1],
    [4, "Sofia Baby", "Sofia Baby Ltd.", "+359 88 111 22 33", "+359 88 111 22 33", "Bulgaristan", "Sofya", "İhracat Müşterisi", 0, 44000, 12000, 32000, 80000, "2026-05-01", "", 1],
    [5, "Minik Adımlar", "Minik Adımlar", "0535 444 55 66", "0535 444 55 66", "Türkiye", "Ankara", "Mağaza", 0, 96750, 25000, 71750, 70000, "2026-05-02", "", 1],
  ],
  suppliers: [
    [1, "ABC Tekstil", "ABC Tekstil San. Tic. Ltd. Şti.", "0532 555 11 22", "0532 555 11 22", "Ahmet Bey", "İstanbul", "Türkiye", "", "", "", 0, 26000, 10000, 16000, "2026-05-02", "", 1],
    [2, "Yıldız Bebe Üretim", "Yıldız Bebe Üretim Ltd. Şti.", "0533 555 22 33", "0533 555 22 33", "Mehmet Bey", "Bursa", "Türkiye", "", "", "", 0, 14800, 5000, 9800, "2026-05-01", "", 1],
    [3, "Minik Moda Tekstil", "Minik Moda Tekstil San. Tic. Ltd. Şti.", "0534 555 33 44", "0534 555 33 44", "Selin Hanım", "İstanbul", "Türkiye", "", "", "", 5000, 38500, 18000, 25500, "2026-05-01", "", 1],
    [4, "Pamukhan Tekstil", "Pamukhan Tekstil A.Ş.", "0535 555 44 55", "0535 555 44 55", "Murat Bey", "Denizli", "Türkiye", "", "", "", 0, 42000, 12000, 30000, "2026-05-01", "", 1],
    [5, "Bursa Örme", "Bursa Örme Sanayi", "0536 555 55 66", "0536 555 55 66", "Emre Bey", "Bursa", "Türkiye", "", "", "", 0, 31250, 10000, 21250, "2026-05-01", "", 1],
  ],
};

function seedDatabase(db) {
  const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
  if (productCount > 0) return;

  const insertProduct = db.prepare(`
    INSERT INTO products (id, barcode, code, name, category, size, color, purchasePrice, salePrice, stockQuantity, criticalStockLevel, supplier, imageUrl, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertCustomer = db.prepare(`
    INSERT INTO customers (id, name, companyName, phone, whatsapp, country, city, customerType, openingBalance, totalSales, totalPayments, currentBalance, riskLimit, lastPurchaseDate, notes, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSupplier = db.prepare(`
    INSERT INTO suppliers (id, name, companyTitle, phone, whatsapp, contactPerson, city, country, address, taxInfo, iban, openingBalance, totalPurchases, totalPayments, currentBalance, lastTransactionDate, notes, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    seedData.products.forEach((item) => insertProduct.run(...item, now, now));
    seedData.customers.forEach((item) => insertCustomer.run(...item, now, now));
    seedData.suppliers.forEach((item) => insertSupplier.run(...item, now, now));
    seedSlips(db);
  });

  tx();
}

function seedSlips(db) {
  db.prepare(`
    INSERT INTO purchase_slips (id, slipNo, date, supplierId, supplierName, warehouse, subtotal, discountTotal, taxTotal, grandTotal, description, status, createdAt)
    VALUES (1, 'AF-0001', '2026-05-02', 1, 'ABC Tekstil', 'Merkez Depo', 6960, 0, 0, 6960, '', 'Kayıtlı', ?)
  `).run(now);
  db.prepare(`
    INSERT INTO purchase_slip_items (slipId, productId, productCode, barcode, productName, size, color, quantity, unitPrice, discountRate, taxRate, lineTotal)
    VALUES
      (1, 1, 'MB-TRK-001', '869000001001', 'Kız Bebek Triko Takım', '6-9 Ay', 'Pudra', 12, 180, 0, 0, 2160),
      (1, 3, 'MB-YLK-003', '869000001003', 'Bebek Yelek', '1 Yaş', 'Krem', 24, 95, 0, 0, 2280),
      (1, 2, 'MB-TLM-002', '869000001002', 'Erkek Bebek Tulum', '3-6 Ay', 'Mavi', 18, 140, 0, 0, 2520)
  `).run();
  db.prepare(`
    INSERT INTO purchase_slips (id, slipNo, date, supplierId, supplierName, warehouse, subtotal, discountTotal, taxTotal, grandTotal, description, status, createdAt)
    VALUES (2, 'AF-0002', '2026-05-01', 2, 'Yıldız Bebe Üretim', 'Merkez Depo', 14800, 0, 0, 14800, '', 'Kayıtlı', ?)
  `).run(now);

  db.prepare(`
    INSERT INTO sales_slips (id, slipNo, date, customerId, customerName, saleType, cargoInfo, subtotal, discountTotal, grandTotal, description, status, createdAt)
    VALUES (1, 'SF-0001', '2026-05-02', 1, 'Ayşe Kids Boutique', 'Toptan Satış', '', 3180, 0, 3180, '', 'Kayıtlı', ?)
  `).run(now);
  db.prepare(`
    INSERT INTO sales_slip_items (slipId, productId, productCode, barcode, productName, size, color, quantity, unitPrice, discountRate, availableStock, lineTotal)
    VALUES
      (1, 1, 'MB-TRK-001', '869000001001', 'Kız Bebek Triko Takım', '6-9 Ay', 'Pudra', 6, 280, 0, 36, 1680),
      (1, 3, 'MB-YLK-003', '869000001003', 'Bebek Yelek', '1 Yaş', 'Krem', 10, 150, 0, 4, 1500)
  `).run();
  db.prepare(`
    INSERT INTO sales_slips (id, slipNo, date, customerId, customerName, saleType, cargoInfo, subtotal, discountTotal, grandTotal, description, status, createdAt)
    VALUES (2, 'SF-0002', '2026-05-01', 2, 'Mira Baby Store', 'Instagram Satıcı', '', 9200, 0, 9200, '', 'Kayıtlı', ?)
  `).run(now);

  db.prepare(`
    INSERT INTO collections (id, collectionNo, date, customerId, customerName, paymentType, amount, description, receiptImageUrl, createdAt)
    VALUES
      (1, 'TH-0001', '2026-05-02', 1, 'Ayşe Kids Boutique', 'Havale', 8500, 'Kısmi ödeme', '', ?),
      (2, 'TH-0002', '2026-05-01', 2, 'Mira Baby Store', 'Nakit', 9200, 'Tam ödeme', '', ?),
      (3, 'TH-0003', '2026-05-01', 3, 'Lina Çocuk Giyim', 'EFT', 15000, 'Cari tahsilat', '', ?)
  `).run(now, now, now);
  db.prepare(`
    INSERT INTO payments (id, paymentNo, date, supplierId, supplierName, paymentType, amount, description, receiptImageUrl, createdAt)
    VALUES
      (1, 'OD-0001', '2026-05-02', 1, 'ABC Tekstil', 'Havale', 10000, 'Kısmi ödeme', '', ?),
      (2, 'OD-0002', '2026-05-01', 2, 'Yıldız Bebe Üretim', 'EFT', 5000, 'Cari ödeme', '', ?),
      (3, 'OD-0003', '2026-05-01', 3, 'Minik Moda Tekstil', 'Nakit', 18000, 'Alış ödemesi', '', ?)
  `).run(now, now, now);
  db.prepare(`
    INSERT INTO stock_movements (id, date, productId, productCode, barcode, productName, size, color, movementType, quantityIn, quantityOut, remainingStock, relatedSlipNo, relatedPartyName, createdBy, createdAt)
    VALUES
      (1, '2026-05-02', 1, 'MB-TRK-001', '869000001001', 'Kız Bebek Triko Takım', '6-9 Ay', 'Pudra', 'Alış Girişi', 12, 0, 48, 'AF-0001', 'ABC Tekstil', 'Muhasebe', ?),
      (2, '2026-05-02', 1, 'MB-TRK-001', '869000001001', 'Kız Bebek Triko Takım', '6-9 Ay', 'Pudra', 'Satış Çıkışı', 0, 6, 42, 'SF-0001', 'Ayşe Kids Boutique', 'Satış', ?),
      (3, '2026-05-02', 3, 'MB-YLK-003', '869000001003', 'Bebek Yelek', '1 Yaş', 'Krem', 'Alış Girişi', 24, 0, 28, 'AF-0001', 'ABC Tekstil', 'Muhasebe', ?),
      (4, '2026-05-02', 3, 'MB-YLK-003', '869000001003', 'Bebek Yelek', '1 Yaş', 'Krem', 'Satış Çıkışı', 0, 10, 18, 'SF-0001', 'Ayşe Kids Boutique', 'Satış', ?),
      (5, '2026-05-01', 2, 'MB-TLM-002', '869000001002', 'Erkek Bebek Tulum', '3-6 Ay', 'Mavi', 'Alış Girişi', 18, 0, 66, 'AF-0001', 'ABC Tekstil', 'Muhasebe', ?)
  `).run(now, now, now, now, now);
}

module.exports = { seedDatabase };
