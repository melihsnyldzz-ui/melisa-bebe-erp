import { useMemo, useState } from "react";
import { CalendarClock, HandCoins, Truck, UserPlus, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import CurrentLedgerTable from "../components/Ledger/CurrentLedgerTable.jsx";
import SupplierFilters from "../components/Suppliers/SupplierFilters.jsx";
import SupplierFormModal from "../components/Suppliers/SupplierFormModal.jsx";
import SupplierTable from "../components/Suppliers/SupplierTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatCurrency } from "../utils/formatters.js";
import { isWithinLastDays } from "../utils/dateUtils.js";
import { buildSupplierLedger } from "../utils/ledgerCalculations.js";

const emptyFilters = {
  search: "",
  city: "all",
  debt: "all",
  status: "all",
};

export default function Suppliers() {
  const { payments, purchaseSlips, suppliers, addSupplier, updateSupplier, toggleSupplierStatus } = useErpData();
  const [filters, setFilters] = useState(emptyFilters);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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
    const recentCount = suppliers.filter((supplier) => isWithinLastDays(supplier.lastTransactionDate, 30)).length;

    return [
      { label: "Toplam Tedarikçi", value: suppliers.length.toString(), icon: Truck, tone: "dark" },
      { label: "Aktif Tedarikçi", value: activeCount.toString(), icon: HandCoins, tone: "green" },
      { label: "Toplam Tedarikçi Borcu", value: formatCurrency(totalDebt), icon: WalletCards, tone: "red" },
      { label: "Son 30 Gün İşlem Gören Tedarikçi", value: recentCount.toString(), icon: CalendarClock, tone: "amber" },
    ];
  }, [suppliers]);

  const selectedSupplierLedger = useMemo(() => {
    if (!selectedSupplier) return [];
    return buildSupplierLedger(selectedSupplier.id, purchaseSlips, payments);
  }, [payments, purchaseSlips, selectedSupplier]);

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
      updateSupplier({ ...editingSupplier, ...supplierPayload });
    } else {
      addSupplier(supplierPayload);
    }

    setIsModalOpen(false);
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
      <SupplierTable
        suppliers={filteredSuppliers}
        selectedSupplierId={selectedSupplier?.id}
        onEdit={openEditModal}
        onToggleStatus={toggleSupplierStatus}
        onViewLedger={setSelectedSupplier}
      />

      {selectedSupplier && (
        <CurrentLedgerTable
          accountName={selectedSupplier.name}
          decreaseLabel="Ödeme"
          decreaseKey="payment"
          rows={selectedSupplierLedger}
        />
      )}

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
