export const IMPORT_TEMPLATE_FILES = {
  products: "melisa-bebe-products-import-template.csv",
  customers: "melisa-bebe-customers-import-template.csv",
  suppliers: "melisa-bebe-suppliers-import-template.csv",
};

export function getImportTemplateFileName(importType) {
  return IMPORT_TEMPLATE_FILES[importType] || "melisa-bebe-import-template.csv";
}
