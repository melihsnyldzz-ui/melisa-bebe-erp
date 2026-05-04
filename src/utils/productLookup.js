export function findProductByBarcode(products, barcode) {
  const normalizedBarcode = normalizeLookupValue(barcode);
  if (!normalizedBarcode) return null;

  return products.find((product) => normalizeLookupValue(product.barcode) === normalizedBarcode) || null;
}

export function findProductByCodeOrBarcode(products, value) {
  const normalizedValue = normalizeLookupValue(value);
  if (!normalizedValue) return null;

  return (
    products.find((product) =>
      [product.code, product.barcode, product.variantCode].some((candidate) => normalizeLookupValue(candidate) === normalizedValue),
    ) || null
  );
}

function normalizeLookupValue(value) {
  return String(value || "").trim();
}
