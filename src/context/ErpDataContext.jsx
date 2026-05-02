import { createContext, useContext, useMemo, useState } from "react";
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

const ErpDataContext = createContext(null);

export function ErpDataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [purchaseSlips, setPurchaseSlips] = useState(initialPurchaseSlips);
  const [salesSlips, setSalesSlips] = useState(initialSalesSlips);
  const [collections, setCollections] = useState(initialCollections);
  const [payments, setPayments] = useState(initialPayments);
  const [stockMovements, setStockMovements] = useState(initialStockMovements);

  function savePurchaseSlip(slipPayload) {
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

  function saveSalesSlip(slipPayload) {
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

  function saveCollection(collectionPayload) {
    const newCollection = createRecord(collectionPayload);

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

  function savePayment(paymentPayload) {
    const newPayment = createRecord(paymentPayload);

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

  function addProduct(product) {
    setProducts((currentProducts) => [{ ...product, id: Date.now(), isActive: true }, ...currentProducts]);
  }

  function updateProduct(productPayload) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === productPayload.id ? { ...product, ...productPayload } : product)),
    );
  }

  function toggleProductStatus(productId) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === productId ? { ...product, isActive: !product.isActive } : product)),
    );
  }

  function addCustomer(customer) {
    setCustomers((currentCustomers) => [{ ...customer, id: Date.now(), isActive: true }, ...currentCustomers]);
  }

  function updateCustomer(customerPayload) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) => (customer.id === customerPayload.id ? { ...customer, ...customerPayload } : customer)),
    );
  }

  function toggleCustomerStatus(customerId) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) => (customer.id === customerId ? { ...customer, isActive: !customer.isActive } : customer)),
    );
  }

  function addSupplier(supplier) {
    setSuppliers((currentSuppliers) => [{ ...supplier, id: Date.now(), isActive: true }, ...currentSuppliers]);
  }

  function updateSupplier(supplierPayload) {
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) => (supplier.id === supplierPayload.id ? { ...supplier, ...supplierPayload } : supplier)),
    );
  }

  function toggleSupplierStatus(supplierId) {
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) => (supplier.id === supplierId ? { ...supplier, isActive: !supplier.isActive } : supplier)),
    );
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
      savePurchaseSlip,
      saveSalesSlip,
      saveCollection,
      savePayment,
      updateProduct,
      addProduct,
      toggleProductStatus,
      updateCustomer,
      addCustomer,
      toggleCustomerStatus,
      updateSupplier,
      addSupplier,
      toggleSupplierStatus,
    }),
    [collections, customers, payments, products, purchaseSlips, salesSlips, stockMovements, suppliers],
  );

  return <ErpDataContext.Provider value={value}>{children}</ErpDataContext.Provider>;
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
