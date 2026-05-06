const WAREHOUSE_COUNT_BASKET_KEY = "melisa-bebe-warehouse-count-basket";

export function readWarehouseCountBasket() {
  if (typeof localStorage === "undefined") return [];

  try {
    const parsedBasket = JSON.parse(localStorage.getItem(WAREHOUSE_COUNT_BASKET_KEY) || "[]");
    return Array.isArray(parsedBasket) ? parsedBasket.map(normalizeBasketItem).filter(Boolean) : [];
  } catch (error) {
    console.error("Depo terminali sayım sepeti okunamadı:", error);
    return [];
  }
}

export function addProductToCountBasket(currentBasket, product) {
  if (!product) return Array.isArray(currentBasket) ? currentBasket : [];

  const basket = Array.isArray(currentBasket) ? currentBasket.map(normalizeBasketItem).filter(Boolean) : [];
  const productId = resolveProductId(product);
  const existingItem = basket.find((item) => item.productId === productId);

  if (existingItem) {
    return writeBasket(
      basket.map((item) =>
        item.productId === productId ? calculateBasketLine({ ...item, countedQuantity: item.countedQuantity + 1 }) : item,
      ),
    );
  }

  return writeBasket([createBasketItem(product), ...basket]);
}

export function updateCountBasketQuantity(currentBasket, productId, value) {
  const numericValue = Number(value);
  const countedQuantity = Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
  const basket = Array.isArray(currentBasket) ? currentBasket : [];

  return writeBasket(basket.map((item) => (item.productId === productId ? calculateBasketLine({ ...item, countedQuantity }) : item)));
}

export function removeCountBasketItem(currentBasket, productId) {
  return writeBasket((Array.isArray(currentBasket) ? currentBasket : []).filter((item) => item.productId !== productId));
}

export function clearWarehouseCountBasket() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(WAREHOUSE_COUNT_BASKET_KEY);
  }

  return [];
}

export function buildCountBasketSummary(basket) {
  const safeBasket = Array.isArray(basket) ? basket : [];

  return {
    lineCount: safeBasket.length,
    totalCountedQuantity: safeBasket.reduce((total, item) => total + toNumber(item.countedQuantity), 0),
    surplusCount: safeBasket.filter((item) => toNumber(item.difference) > 0).length,
    shortageCount: safeBasket.filter((item) => toNumber(item.difference) < 0).length,
    matchedCount: safeBasket.filter((item) => toNumber(item.difference) === 0).length,
  };
}

export function getBasketDifferenceStatus(difference) {
  const numericDifference = toNumber(difference);
  if (numericDifference > 0) return "Fazla";
  if (numericDifference < 0) return "Eksik";
  return "Eşit";
}

function createBasketItem(product) {
  const currentStock = toNumber(product.stockQuantity);

  return calculateBasketLine({
    addedAt: new Date().toISOString(),
    productId: resolveProductId(product),
    barcode: product.barcode || "",
    code: product.code || "",
    productName: product.name || "",
    size: product.size || "",
    color: product.color || "",
    currentStock,
    countedQuantity: 1,
    difference: 1 - currentStock,
  });
}

function resolveProductId(product = {}) {
  return product.id || product.code || product.barcode || product.variantCode || `${product.name || "product"}-${product.size || ""}-${product.color || ""}`;
}

function normalizeBasketItem(item = {}) {
  if (!item || typeof item !== "object") return null;

  return calculateBasketLine({
    addedAt: item.addedAt || new Date().toISOString(),
    productId: item.productId || item.id || item.code || item.barcode,
    barcode: item.barcode || "",
    code: item.code || "",
    productName: item.productName || item.name || "",
    size: item.size || "",
    color: item.color || "",
    currentStock: toNumber(item.currentStock),
    countedQuantity: toNumber(item.countedQuantity),
  });
}

function calculateBasketLine(item) {
  const currentStock = toNumber(item.currentStock);
  const countedQuantity = toNumber(item.countedQuantity);

  return {
    ...item,
    currentStock,
    countedQuantity,
    difference: countedQuantity - currentStock,
  };
}

function writeBasket(basket) {
  const nextBasket = Array.isArray(basket) ? basket.map(normalizeBasketItem).filter(Boolean) : [];
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(WAREHOUSE_COUNT_BASKET_KEY, JSON.stringify(nextBasket));
    } catch (error) {
      console.error("Depo terminali sayım sepeti kaydedilemedi:", error);
    }
  }

  return nextBasket;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
