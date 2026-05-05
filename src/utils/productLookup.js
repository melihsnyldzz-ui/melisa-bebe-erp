export function findProductByBarcode(products, barcode) {
  const normalizedBarcode = normalizeLookupValue(barcode);
  if (!normalizedBarcode) return null;

  return products.find((product) => normalizeLookupValue(product.barcode) === normalizedBarcode) || null;
}

export function findProductByCodeOrBarcode(products, value, options = {}) {
  const normalizedValue = normalizeLookupValue(value);
  if (!normalizedValue) return null;

  return (
    products.find((product) => {
      if (options.activeOnly && product.isActive === false) return false;

      return [product.code, product.barcode, product.variantCode].some(
        (candidate) => normalizeLookupValue(candidate) === normalizedValue,
      );
    }) || null
  );
}

export function normalizeLookupValue(value) {
  return String(value || "")
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}
