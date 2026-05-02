import { useMemo, useState } from "react";
import { CalendarClock, HandCoins, Truck, UserPlus, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SupplierFilters from "../components/Suppliers/SupplierFilters.jsx";
import SupplierFormModal from "../components/Suppliers/SupplierFormModal.jsx";
import SupplierTable from "../components/Suppliers/SupplierTable.jsx";
import { suppliers as initialSuppliers } from "../data/mockData.js";

const emptyFilters = {
  search: "",
  city: "all",
  debt: "all",
  status: "all",
};

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [filters, setFilters] = useState(emptyFilters);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSuppliers = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase("tr-TR");

    return suppliers.filter((supplier) => {
      const hasDebt = supplier.currentBalance > 0;
      const matchesSearch =
        !query ||
        [supplier.name, supplier.companyTitle, supplier.contactPerson, supplier.phone, supplier.city].some((value) =>
          value.toLocaleLowerCase("tr-TR").includes(query),
        );

      return (
        matchesSearch &&
        (filters.city === "all" || supplier.city === filters.city) &&
        (filters.debt === "all" || (filters.debt === "debt" ? hasDebt : !hasDebt)) &&
        (filters.status === "all" || (filters.status === "active" ? supplier.isActive : !supplier.isActive))
      );
    });
  }, [filters, suppliers]);

  const filterOptions = useMemo(
    () => ({
      cities: uniqueValues(suppliers, "city"),
    }),
    [suppliers],
  );

  const summaryCards = useMemo(() => {
    const activeCount = suppliers.filter((supplier) => supplier.isActive).length;
    const totalDebt = suppliers.reduce((total, supplier) => total + supplier.currentBalance, 0);
    const recentCount = suppliers.filter((supplier) => isWithinLastThirtyDays(supplier.lastTransactionDate)).length;

    return [
      { label: "Toplam Tedarikçi", value: suppliers.length.toString(), icon: Truck, tone: "dark" },
      { label: "Aktif Tedarikçi", value: activeCount.toString(), icon: HandCoins, tone: "green" },
      { label: "Toplam Tedarikçi Borcu", value: currencyFormatter.format(totalDebt), icon: WalletCards, tone: "red" },
      { label: "Son 30 Gün İşlem Gören Tedarikçi", value: recentCount.toString(), icon: CalendarClock, tone: "amber" },
    ];
  }, [suppliers]);

  function openCreateModal() {
    setEditingSupplier(null);
    setIsModalOpen(true);
  }

  function openEditModal(supplier) {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  }

  function handleSaveSupplier(supplierPayload) {
    if (editingSupplier) {
      setSuppliers((currentSuppliers) =>
        currentSuppliers.map((supplier) => (supplier.id === editingSupplier.id ? { ...supplier, ...supplierPayload } : supplier)),
      );
    } else {
      setSuppliers((currentSuppliers) => [{ ...supplierPayload, id: Date.now(), isActive: true }, ...currentSuppliers]);
    }

    setIsModalOpen(false);
  }

  function toggleSupplierStatus(supplierId) {
    setSuppliers((currentSuppliers) =>
      currentSuppliers.map((supplier) => (supplier.id === supplierId ? { ...supplier, isActive: !supplier.isActive } : supplier)),
    );
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Cari takip</p>
          <h1>Tedarikçi Cari Yönetimi</h1>
          <span>Tedarikçi bakiyelerini, alış toplamlarını ve ödeme durumlarını takip edin.</span>
        </div>
        <button className="primary-action" onClick={openCreateModal}>
          <UserPlus size={18} />
          Yeni Tedarikçi
        </button>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <SupplierFilters filters={filters} options={filterOptions} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      <SupplierTable suppliers={filteredSuppliers} onEdit={openEditModal} onToggleStatus={toggleSupplierStatus} />

      <SupplierFormModal
        isOpen={isModalOpen}
        supplier={editingSupplier}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupplier}
      />
    </>
  );
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "tr"));
}

function isWithinLastThirtyDays(value) {
  if (!value) return false;
  const transactionDate = new Date(value);
  const today = new Date("2026-05-02");
  const diffInDays = (today - transactionDate) / (1000 * 60 * 60 * 24);
  return diffInDays >= 0 && diffInDays <= 30;
}
