import { useMemo, useState } from "react";
import { Boxes, PackagePlus, PackageSearch, ShieldAlert, ToggleRight } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import ProductFilters from "../components/Products/ProductFilters.jsx";
import ProductFormModal from "../components/Products/ProductFormModal.jsx";
import ProductTable from "../components/Products/ProductTable.jsx";
import { products as initialProducts } from "../data/mockData.js";

const emptyFilters = {
  search: "",
  category: "all",
  size: "all",
  color: "all",
  stock: "all",
  status: "all",
};

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState(emptyFilters);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase("tr-TR");

    return products.filter((product) => {
      const isCritical = product.stockQuantity <= product.criticalStockLevel;
      const matchesSearch =
        !query ||
        [product.name, product.barcode, product.code].some((value) => value.toLocaleLowerCase("tr-TR").includes(query));

      return (
        matchesSearch &&
        (filters.category === "all" || product.category === filters.category) &&
        (filters.size === "all" || product.size === filters.size) &&
        (filters.color === "all" || product.color === filters.color) &&
        (filters.stock === "all" || (filters.stock === "critical" ? isCritical : !isCritical)) &&
        (filters.status === "all" || (filters.status === "active" ? product.isActive : !product.isActive))
      );
    });
  }, [filters, products]);

  const filterOptions = useMemo(
    () => ({
      categories: uniqueValues(products, "category"),
      sizes: uniqueValues(products, "size"),
      colors: uniqueValues(products, "color"),
    }),
    [products],
  );

  const summaryCards = useMemo(() => {
    const activeCount = products.filter((product) => product.isActive).length;
    const criticalCount = products.filter((product) => product.stockQuantity <= product.criticalStockLevel).length;
    const totalStock = products.reduce((total, product) => total + product.stockQuantity, 0);

    return [
      { label: "Toplam Ürün", value: products.length.toString(), icon: PackageSearch, tone: "dark" },
      { label: "Aktif Ürün", value: activeCount.toString(), icon: ToggleRight, tone: "green" },
      { label: "Kritik Stokta Ürün", value: criticalCount.toString(), icon: ShieldAlert, tone: "red" },
      { label: "Toplam Stok Adedi", value: totalStock.toLocaleString("tr-TR"), icon: Boxes, tone: "amber" },
    ];
  }, [products]);

  function openCreateModal() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  function handleSaveProduct(productPayload) {
    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === editingProduct.id ? { ...product, ...productPayload } : product)),
      );
    } else {
      setProducts((currentProducts) => [{ ...productPayload, id: Date.now(), isActive: true }, ...currentProducts]);
    }

    setIsModalOpen(false);
  }

  function toggleProductStatus(productId) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === productId ? { ...product, isActive: !product.isActive } : product)),
    );
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Stok ve fiyat</p>
          <h1>Ürün Yönetimi</h1>
          <span>Ürün kartlarını, stok seviyelerini ve fiyat bilgilerini yönetin.</span>
        </div>
        <button className="primary-action" onClick={openCreateModal}>
          <PackagePlus size={18} />
          Yeni Ürün
        </button>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <ProductFilters filters={filters} options={filterOptions} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      <ProductTable products={filteredProducts} onEdit={openEditModal} onToggleStatus={toggleProductStatus} />

      <ProductFormModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </>
  );
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "tr"));
}
