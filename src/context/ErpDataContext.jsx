import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  collections as initialCollections,
  customers as initialCustomers,
  payments as initialPayments,
  products as initialProducts,
  purchaseSlips as initialPurchaseSlips,
  salesSlips as initialSalesSlips,
  stockMovements as initialStockMovements,
  suppliers as initialSuppliers,
} from "../data/mockData.js";
import { buildImportResult, validateApplyImportPayload } from "../utils/importApplyUtils.js";
import { buildStockCountReference, validateStockAdjustmentPayload } from "../utils/stockAdjustmentUtils.js";

const ErpDataContext = createContext(null);
const fallbackAppSettings = {
  dataMode: "demo",
  setupCompleted: "false",
  demoDataClearedAt: "",
  lastBackupAt: "",
  lastBackupPath: "",
  lastBackupStatus: "",
  lastBackupError: "",
};

export function ErpDataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [purchaseSlips, setPurchaseSlips] = useState(initialPurchaseSlips);
  const [salesSlips, setSalesSlips] = useState(initialSalesSlips);
  const [collections, setCollections] = useState(initialCollections);
  const [payments, setPayments] = useState(initialPayments);
  const [stockMovements, setStockMovements] = useState(initialStockMovements);
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [currentAccounts, setCurrentAccounts] = useState([]);
  const [currentAccountMovements, setCurrentAccountMovements] = useState([]);
  const [productBarcodes, setProductBarcodes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stockBalances, setStockBalances] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [priceListItems, setPriceListItems] = useState([]);
  const [documentNumbers, setDocumentNumbers] = useState([]);
  const [appSettings, setAppSettings] = useState(fallbackAppSettings);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = useCallback(async () => {
    const erp = getDesktopErp();
    if (!erp) return { ok: false, error: "Electron veri köprüsü aktif değil." };

    try {
      const data = await erp.getInitialData();
      applyInitialData(data);
      return { ok: true, data };
    } catch (error) {
      console.error("SQLite başlangıç verisi alınamadı:", error);
      return { ok: false, error: error.message || "SQLite başlangıç verisi alınamadı." };
    }
  }, []);

  async function savePurchaseSlip(slipPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.savePurchaseSlip(slipPayload);
      if (!result.ok) return result;
      applyInitialData(result.data);
      return { ok: true, data: result.record || findSavedSlip(result.data.purchaseSlips, slipPayload.slipNo) };
    }

    const newSlip = createRecord(slipPayload, { status: "Kayıtlı" });
    const stockRows = buildPurchaseStockMovements(newSlip, products);

    setPurchaseSlips((currentSlips) => [newSlip, ...currentSlips]);
    setProducts((currentProducts) => applyStockIncrease(currentProducts, newSlip.items));
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) =>
        supplier.id === newSlip.supplierId
          ? {
              ...supplier,
              currentBalance: supplier.currentBalance + newSlip.grandTotal,
              totalPurchases: supplier.totalPurchases + newSlip.grandTotal,
              lastTransactionDate: newSlip.date,
            }
          : supplier,
      ),
    );
    setStockMovements((currentMovements) => [...stockRows, ...currentMovements]);

    return { ok: true, data: newSlip };
  }

  async function saveSalesSlip(slipPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.saveSalesSlip(slipPayload);
      if (!result.ok) return result;
      applyInitialData(result.data);
      return { ok: true, data: result.record || findSavedSlip(result.data.salesSlips, slipPayload.slipNo) };
    }

    if (salesSlips.some((slip) => slip.slipNo === slipPayload.slipNo)) {
      return { ok: false, error: `${slipPayload.slipNo} numaralı satış fişi zaten kayıtlı. Lütfen tekrar deneyin.` };
    }

    const shortage = findStockShortage(slipPayload.items, products);
    if (shortage) {
      return { ok: false, error: `${shortage.productName} için stok yetersiz. Mevcut stok: ${shortage.availableStock}` };
    }

    const newSlip = createRecord(slipPayload, { status: "Kayıtlı" });
    const stockRows = buildSalesStockMovements(newSlip, products);

    setSalesSlips((currentSlips) => [newSlip, ...currentSlips]);
    setProducts((currentProducts) => applyStockDecrease(currentProducts, newSlip.items));
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === newSlip.customerId
          ? {
              ...customer,
              currentBalance: customer.currentBalance + newSlip.grandTotal,
              totalSales: customer.totalSales + newSlip.grandTotal,
              lastPurchaseDate: newSlip.date,
            }
          : customer,
      ),
    );
    setStockMovements((currentMovements) => [...stockRows, ...currentMovements]);

    return { ok: true, data: newSlip };
  }

  async function saveCollection(collectionPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.saveCollection(collectionPayload);
      if (!result.ok) return result;
      applyInitialData(result.data);
      return { ok: true, data: result.data.collections.find((collection) => collection.collectionNo === collectionPayload.collectionNo) };
    }

    const newCollection = createRecord(collectionPayload, { status: "Kayıtlı" });

    setCollections((currentCollections) => [newCollection, ...currentCollections]);
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === newCollection.customerId
          ? {
              ...customer,
              currentBalance: customer.currentBalance - newCollection.amount,
              totalPayments: customer.totalPayments + newCollection.amount,
            }
          : customer,
      ),
    );

    return { ok: true, data: newCollection };
  }

  async function savePayment(paymentPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.savePayment(paymentPayload);
      if (!result.ok) return result;
      applyInitialData(result.data);
      return { ok: true, data: result.data.payments.find((payment) => payment.paymentNo === paymentPayload.paymentNo) };
    }

    const newPayment = createRecord(paymentPayload, { status: "Kayıtlı" });

    setPayments((currentPayments) => [newPayment, ...currentPayments]);
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) =>
        supplier.id === newPayment.supplierId
          ? {
              ...supplier,
              currentBalance: supplier.currentBalance - newPayment.amount,
              totalPayments: supplier.totalPayments + newPayment.amount,
              lastTransactionDate: newPayment.date,
            }
          : supplier,
      ),
    );

    return { ok: true, data: newPayment };
  }

  async function cancelPurchaseSlip(slipId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.cancelPurchaseSlip(slipId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    const slip = purchaseSlips.find((item) => item.id === slipId);
    if (!slip) return { ok: false, error: "Alış fişi bulunamadı." };
    if (slip.status === "İptal") return { ok: false, error: "Bu alış fişi zaten iptal edilmiş." };

    const stockRows = buildPurchaseCancelStockMovements(slip, products);
    setPurchaseSlips((currentSlips) => currentSlips.map((item) => (item.id === slipId ? { ...item, status: "İptal" } : item)));
    setProducts((currentProducts) => applyStockDecrease(currentProducts, slip.items));
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) =>
        supplier.id === slip.supplierId
          ? {
              ...supplier,
              currentBalance: supplier.currentBalance - slip.grandTotal,
              totalPurchases: supplier.totalPurchases - slip.grandTotal,
            }
          : supplier,
      ),
    );
    setStockMovements((currentMovements) => [...stockRows, ...currentMovements]);

    return { ok: true, data: { ...slip, status: "İptal" } };
  }

  async function cancelSalesSlip(slipId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.cancelSalesSlip(slipId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    const slip = salesSlips.find((item) => item.id === slipId);
    if (!slip) return { ok: false, error: "Satış fişi bulunamadı." };
    if (slip.status === "İptal") return { ok: false, error: "Bu satış fişi zaten iptal edilmiş." };

    const stockRows = buildSalesCancelStockMovements(slip, products);
    setSalesSlips((currentSlips) => currentSlips.map((item) => (item.id === slipId ? { ...item, status: "İptal" } : item)));
    setProducts((currentProducts) => applyStockIncrease(currentProducts, slip.items));
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === slip.customerId
          ? {
              ...customer,
              currentBalance: customer.currentBalance - slip.grandTotal,
              totalSales: customer.totalSales - slip.grandTotal,
            }
          : customer,
      ),
    );
    setStockMovements((currentMovements) => [...stockRows, ...currentMovements]);

    return { ok: true, data: { ...slip, status: "İptal" } };
  }

  async function cancelCollection(collectionId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.cancelCollection(collectionId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    const collection = collections.find((item) => item.id === collectionId);
    if (!collection) return { ok: false, error: "Tahsilat bulunamadı." };
    if (collection.status === "İptal") return { ok: false, error: "Bu tahsilat zaten iptal edilmiş." };

    setCollections((currentCollections) =>
      currentCollections.map((item) => (item.id === collectionId ? { ...item, status: "İptal" } : item)),
    );
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === collection.customerId
          ? {
              ...customer,
              currentBalance: customer.currentBalance + collection.amount,
              totalPayments: customer.totalPayments - collection.amount,
            }
          : customer,
      ),
    );

    return { ok: true, data: { ...collection, status: "İptal" } };
  }

  async function cancelPayment(paymentId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.cancelPayment(paymentId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    const payment = payments.find((item) => item.id === paymentId);
    if (!payment) return { ok: false, error: "Ödeme bulunamadı." };
    if (payment.status === "İptal") return { ok: false, error: "Bu ödeme zaten iptal edilmiş." };

    setPayments((currentPayments) => currentPayments.map((item) => (item.id === paymentId ? { ...item, status: "İptal" } : item)));
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) =>
        supplier.id === payment.supplierId
          ? {
              ...supplier,
              currentBalance: supplier.currentBalance + payment.amount,
              totalPayments: supplier.totalPayments - payment.amount,
            }
          : supplier,
      ),
    );

    return { ok: true, data: { ...payment, status: "İptal" } };
  }

  async function addProduct(product) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.addProduct(product);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setProducts((currentProducts) => [{ ...product, id: Date.now(), isActive: true }, ...currentProducts]);
  }

  async function updateProduct(productPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.updateProduct(productPayload);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === productPayload.id ? { ...product, ...productPayload } : product)),
    );
  }

  async function toggleProductStatus(productId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.toggleProductStatus(productId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === productId ? { ...product, isActive: !product.isActive } : product)),
    );
  }

  async function addCustomer(customer) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.addCustomer(customer);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setCustomers((currentCustomers) => [{ ...customer, id: Date.now(), isActive: true }, ...currentCustomers]);
  }

  async function updateCustomer(customerPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.updateCustomer(customerPayload);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) => (customer.id === customerPayload.id ? { ...customer, ...customerPayload } : customer)),
    );
  }

  async function toggleCustomerStatus(customerId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.toggleCustomerStatus(customerId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) => (customer.id === customerId ? { ...customer, isActive: !customer.isActive } : customer)),
    );
  }

  async function addSupplier(supplier) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.addSupplier(supplier);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setSuppliers((currentSuppliers) => [{ ...supplier, id: Date.now(), isActive: true }, ...currentSuppliers]);
  }

  async function updateSupplier(supplierPayload) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.updateSupplier(supplierPayload);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) => (supplier.id === supplierPayload.id ? { ...supplier, ...supplierPayload } : supplier)),
    );
  }

  async function toggleSupplierStatus(supplierId) {
    const erp = getDesktopErp();
    if (erp) {
      const result = await erp.toggleSupplierStatus(supplierId);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) => (supplier.id === supplierId ? { ...supplier, isActive: !supplier.isActive } : supplier)),
    );
  }

  async function applyStockCountAdjustment(adjustmentPayload) {
    const erp = getDesktopErp();
    if (erp?.applyStockCountAdjustment) {
      const result = await erp.applyStockCountAdjustment(adjustmentPayload);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    const validationError = validateStockAdjustmentPayload(adjustmentPayload);
    if (validationError) return { ok: false, error: validationError };

    const now = new Date().toISOString();
    const referenceNo = buildStockCountReference(now);
    const movementRows = [];
    const productMap = new Map(products.map((product) => [Number(product.id), product]));

    for (const item of adjustmentPayload.items) {
      const product = productMap.get(Number(item.productId));
      if (!product) return { ok: false, error: `${item.productName || "Ürün"} bulunamadı.` };

      const countedQuantity = Number(item.countedQuantity);
      const actualDifference = countedQuantity - (Number(product.stockQuantity) || 0);
      if (actualDifference === 0) continue;

      movementRows.push({
        id: Date.now() + movementRows.length,
        date: adjustmentPayload.date,
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
        createdBy: "Sayım",
        createdAt: now,
      });
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const adjustment = adjustmentPayload.items.find((item) => Number(item.productId) === Number(product.id));
        return adjustment ? { ...product, stockQuantity: Math.max(0, Number(adjustment.countedQuantity) || 0), updatedAt: now } : product;
      }),
    );
    setStockMovements((currentMovements) => [...movementRows, ...currentMovements]);

    if (movementRows.length === 0) return { ok: false, error: "Düzeltilecek ürün bulunamadı." };

    return { ok: true, data: { referenceNo, adjustedCount: movementRows.length }, record: { referenceNo, adjustedCount: movementRows.length } };
  }

  async function applyDataImport(importPayload) {
    const erp = getDesktopErp();
    if (erp?.applyDataImport) {
      const result = await erp.applyDataImport(importPayload);
      if (result.ok) applyInitialData(result.data);
      return result;
    }

    const validationError = validateApplyImportPayload(importPayload);
    if (validationError) return { ok: false, error: validationError };

    const duplicateError = getMemoryImportDuplicateError(importPayload, { products, customers, suppliers });
    if (duplicateError) return { ok: false, error: duplicateError };

    const now = new Date().toISOString();
    const records = importPayload.rows.map((row, index) => buildImportRecord(importPayload.importType, row.values, now, index));

    if (importPayload.importType === "products") setProducts((currentProducts) => [...records, ...currentProducts]);
    if (importPayload.importType === "customers") setCustomers((currentCustomers) => [...records, ...currentCustomers]);
    if (importPayload.importType === "suppliers") setSuppliers((currentSuppliers) => [...records, ...currentSuppliers]);

    const record = buildImportResult({
      importType: importPayload.importType,
      totalRows: importPayload.rows.length,
      insertedCount: records.length,
      skippedCount: 0,
      errors: [],
    });

    return { ok: true, data: record, record };
  }

  async function exportDatabaseBackup(targetDirectory) {
    const erp = getDesktopErp();
    if (!erp?.exportDatabaseBackup) {
      return { ok: false, error: "Veritabanı yedekleme yalnızca Electron modunda kullanılabilir." };
    }

    const result = await erp.exportDatabaseBackup(targetDirectory);
    if (result.appSettings) {
      setAppSettings(result.appSettings);
    } else {
      await refreshAppSettings();
    }
    return result;
  }

  async function refreshAppSettings() {
    const erp = getDesktopErp();
    if (!erp?.getAppSettings) {
      setAppSettings(fallbackAppSettings);
      return { ok: false, error: "Uygulama ayarları yalnızca Electron modunda okunabilir." };
    }

    try {
      const settings = await erp.getAppSettings();
      setAppSettings(settings || fallbackAppSettings);
      return { ok: true, data: settings };
    } catch (error) {
      console.error("Uygulama ayarları alınamadı:", error);
      return { ok: false, error: error.message || "Uygulama ayarları alınamadı." };
    }
  }

  async function startLiveMode() {
    const erp = getDesktopErp();
    if (!erp?.startLiveMode) {
      return { ok: false, error: "Gerçek kullanım moduna geçiş yalnızca Electron modunda yapılabilir." };
    }

    const result = await erp.startLiveMode();
    if (result.ok) applyInitialData(result.data);
    return result;
  }

  async function resetDemoData() {
    const erp = getDesktopErp();
    if (!erp?.resetDemoData) {
      return { ok: false, error: "Demo veri temizleme yalnızca Electron modunda yapılabilir." };
    }

    const result = await erp.resetDemoData();
    if (result.ok) applyInitialData(result.data);
    return result;
  }

  const value = useMemo(
    () => ({
      products,
      customers,
      suppliers,
      purchaseSlips,
      salesSlips,
      collections,
      payments,
      stockMovements,
      currencies,
      exchangeRates,
      currentAccounts,
      currentAccountMovements,
      productBarcodes,
      warehouses,
      stockBalances,
      priceLists,
      priceListItems,
      documentNumbers,
      appSettings,
      savePurchaseSlip,
      saveSalesSlip,
      saveCollection,
      savePayment,
      cancelPurchaseSlip,
      cancelSalesSlip,
      cancelCollection,
      cancelPayment,
      updateProduct,
      addProduct,
      toggleProductStatus,
      updateCustomer,
      addCustomer,
      toggleCustomerStatus,
      updateSupplier,
      addSupplier,
      toggleSupplierStatus,
      applyStockCountAdjustment,
      applyDataImport,
      exportDatabaseBackup,
      refreshAppSettings,
      startLiveMode,
      resetDemoData,
      refreshData,
    }),
    [
      appSettings,
      collections,
      currentAccountMovements,
      currentAccounts,
      currencies,
      customers,
      documentNumbers,
      exchangeRates,
      payments,
      priceListItems,
      priceLists,
      productBarcodes,
      products,
      purchaseSlips,
      salesSlips,
      stockBalances,
      stockMovements,
      suppliers,
      warehouses,
      refreshData,
    ],
  );

  return <ErpDataContext.Provider value={value}>{children}</ErpDataContext.Provider>;

  function applyInitialData(data) {
    setProducts(data.products || []);
    setCustomers(data.customers || []);
    setSuppliers(data.suppliers || []);
    setPurchaseSlips(data.purchaseSlips || []);
    setSalesSlips(data.salesSlips || []);
    setCollections(data.collections || []);
    setPayments(data.payments || []);
    setStockMovements(data.stockMovements || []);
    setCurrencies(data.currencies || []);
    setExchangeRates(data.exchangeRates || []);
    setCurrentAccounts(data.currentAccounts || []);
    setCurrentAccountMovements(data.currentAccountMovements || []);
    setProductBarcodes(data.productBarcodes || []);
    setWarehouses(data.warehouses || []);
    setStockBalances(data.stockBalances || []);
    setPriceLists(data.priceLists || []);
    setPriceListItems(data.priceListItems || []);
    setDocumentNumbers(data.documentNumbers || []);
    setAppSettings(data.appSettings || fallbackAppSettings);
  }
}

export function useErpData() {
  const context = useContext(ErpDataContext);
  if (!context) {
    throw new Error("useErpData must be used inside ErpDataProvider");
  }
  return context;
}

function createRecord(payload, extraFields = {}) {
  return {
    ...payload,
    ...extraFields,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
}

function findSavedSlip(slips, requestedSlipNo) {
  return slips.find((slip) => slip.slipNo === requestedSlipNo) || slips[0] || null;
}

function getDesktopErp() {
  if (typeof window === "undefined") return null;
  return window.electronAPI?.erp || null;
}

function sumQuantitiesByProduct(items) {
  return items.reduce((quantities, item) => {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    return quantities;
  }, new Map());
}

function applyStockIncrease(currentProducts, items) {
  const quantities = sumQuantitiesByProduct(items);

  return currentProducts.map((product) => {
    const quantity = quantities.get(product.id) || 0;
    return quantity ? { ...product, stockQuantity: product.stockQuantity + quantity } : product;
  });
}

function applyStockDecrease(currentProducts, items) {
  const quantities = sumQuantitiesByProduct(items);

  return currentProducts.map((product) => {
    const quantity = quantities.get(product.id) || 0;
    return quantity ? { ...product, stockQuantity: product.stockQuantity - quantity } : product;
  });
}

function findStockShortage(items, products) {
  const quantities = sumQuantitiesByProduct(items);

  for (const [productId, requestedQuantity] of quantities.entries()) {
    const product = products.find((item) => item.id === productId);
    if (product && requestedQuantity > product.stockQuantity) {
      return {
        productName: product.name,
        availableStock: product.stockQuantity,
      };
    }
  }

  return null;
}

function buildPurchaseStockMovements(slip, products) {
  return slip.items.map((item, index) => {
    const product = products.find((currentProduct) => currentProduct.id === item.productId);

    return {
      id: Date.now() + index,
      date: slip.date,
      productId: item.productId,
      productCode: item.productCode,
      barcode: item.barcode,
      productName: item.productName,
      size: item.size,
      color: item.color,
      movementType: "Alış Girişi",
      quantityIn: item.quantity,
      quantityOut: 0,
      remainingStock: (product?.stockQuantity || 0) + item.quantity,
      relatedSlipNo: slip.slipNo,
      relatedPartyName: slip.supplierName,
      createdBy: "Muhasebe",
    };
  });
}

function buildSalesStockMovements(slip, products) {
  return slip.items.map((item, index) => {
    const product = products.find((currentProduct) => currentProduct.id === item.productId);

    return {
      id: Date.now() + index,
      date: slip.date,
      productId: item.productId,
      productCode: item.productCode,
      barcode: item.barcode,
      productName: item.productName,
      size: item.size,
      color: item.color,
      movementType: "Satış Çıkışı",
      quantityIn: 0,
      quantityOut: item.quantity,
      remainingStock: (product?.stockQuantity || 0) - item.quantity,
      relatedSlipNo: slip.slipNo,
      relatedPartyName: slip.customerName,
      createdBy: "Satış",
    };
  });
}

function buildPurchaseCancelStockMovements(slip, products) {
  return slip.items.map((item, index) => {
    const product = products.find((currentProduct) => currentProduct.id === item.productId);

    return {
      id: Date.now() + index,
      date: new Date().toISOString().slice(0, 10),
      productId: item.productId,
      productCode: item.productCode,
      barcode: item.barcode,
      productName: item.productName,
      size: item.size,
      color: item.color,
      movementType: "Alış İptali",
      quantityIn: 0,
      quantityOut: item.quantity,
      remainingStock: (product?.stockQuantity || 0) - item.quantity,
      relatedSlipNo: slip.slipNo,
      relatedPartyName: slip.supplierName,
      createdBy: "İptal",
    };
  });
}

function buildSalesCancelStockMovements(slip, products) {
  return slip.items.map((item, index) => {
    const product = products.find((currentProduct) => currentProduct.id === item.productId);

    return {
      id: Date.now() + index,
      date: new Date().toISOString().slice(0, 10),
      productId: item.productId,
      productCode: item.productCode,
      barcode: item.barcode,
      productName: item.productName,
      size: item.size,
      color: item.color,
      movementType: "Satış İptali",
      quantityIn: item.quantity,
      quantityOut: 0,
      remainingStock: (product?.stockQuantity || 0) + item.quantity,
      relatedSlipNo: slip.slipNo,
      relatedPartyName: slip.customerName,
      createdBy: "İptal",
    };
  });
}

function buildImportRecord(importType, values, now, index) {
  const baseRecord = {
    id: Date.now() + index,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  if (importType === "products") {
    return {
      ...baseRecord,
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
    };
  }

  if (importType === "customers") {
    const openingBalance = parseImportNumber(values.openingBalance);
    return {
      ...baseRecord,
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
    };
  }

  const openingBalance = parseImportNumber(values.openingBalance);
  return {
    ...baseRecord,
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
  };
}

function getMemoryImportDuplicateError(importPayload, currentData) {
  if (importPayload.importType === "products") {
    for (const row of importPayload.rows) {
      const values = row.values;
      if (values.barcode && currentData.products.some((product) => normalizeImportKey(product.barcode) === normalizeImportKey(values.barcode))) {
        return "Bu barkod başka bir üründe kullanılıyor.";
      }
      if (values.code && currentData.products.some((product) => normalizeImportKey(product.code) === normalizeImportKey(values.code))) {
        return "Bu ürün kodu başka bir üründe kullanılıyor.";
      }
      if (
        values.variantCode &&
        currentData.products.some((product) => normalizeImportKey(product.variantCode) === normalizeImportKey(values.variantCode))
      ) {
        return "Bu varyant kodu başka bir üründe kullanılıyor.";
      }
    }
  }

  if (importPayload.importType === "customers") {
    for (const row of importPayload.rows) {
      const values = row.values;
      const hasDuplicate = currentData.customers.some(
        (customer) =>
          (values.phone && normalizeImportKey(customer.name) === normalizeImportKey(values.name) && normalizeImportKey(customer.phone) === normalizeImportKey(values.phone)) ||
          (values.companyName && normalizeImportKey(customer.companyName) === normalizeImportKey(values.companyName)),
      );
      if (hasDuplicate) return "Bu müşteri bilgileri zaten kayıtlı görünüyor.";
    }
  }

  if (importPayload.importType === "suppliers") {
    for (const row of importPayload.rows) {
      const values = row.values;
      const hasDuplicate = currentData.suppliers.some(
        (supplier) =>
          normalizeImportKey(supplier.name) === normalizeImportKey(values.name) ||
          (values.companyTitle && normalizeImportKey(supplier.companyTitle) === normalizeImportKey(values.companyTitle)),
      );
      if (hasDuplicate) return "Bu tedarikçi bilgileri zaten kayıtlı görünüyor.";
    }
  }

  return "";
}

function parseImportNumber(value) {
  const numberValue = Number(String(value || "0").replace(",", "."));
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function normalizeImportKey(value) {
  return String(value || "").trim().toLocaleLowerCase("tr-TR");
}
