import { useMemo, useState } from "react";
import { CircleAlert, HandCoins, UserPlus, UsersRound, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import CustomerFilters from "../components/Customers/CustomerFilters.jsx";
import CustomerFormModal from "../components/Customers/CustomerFormModal.jsx";
import CustomerTable from "../components/Customers/CustomerTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

const emptyFilters = {
  search: "",
  customerType: "all",
  city: "all",
  debt: "all",
  risk: "all",
  status: "all",
};

export default function Customers() {
  const { customers, addCustomer, updateCustomer, toggleCustomerStatus } = useErpData();
  const [filters, setFilters] = useState(emptyFilters);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase("tr-TR");

    return customers.filter((customer) => {
      const hasDebt = customer.currentBalance > 0;
      const overRisk = customer.currentBalance > customer.riskLimit;
      const matchesSearch =
        !query ||
        [customer.name, customer.companyName, customer.phone, customer.city].some((value) =>
          value.toLocaleLowerCase("tr-TR").includes(query),
        );

      return (
        matchesSearch &&
        (filters.customerType === "all" || customer.customerType === filters.customerType) &&
        (filters.city === "all" || customer.city === filters.city) &&
        (filters.debt === "all" || (filters.debt === "debt" ? hasDebt : !hasDebt)) &&
        (filters.risk === "all" || (filters.risk === "over" ? overRisk : !overRisk)) &&
        (filters.status === "all" || (filters.status === "active" ? customer.isActive : !customer.isActive))
      );
    });
  }, [customers, filters]);

  const filterOptions = useMemo(
    () => ({
      customerTypes: uniqueValues(customers, "customerType"),
      cities: uniqueValues(customers, "city"),
    }),
    [customers],
  );

  const summaryCards = useMemo(() => {
    const activeCount = customers.filter((customer) => customer.isActive).length;
    const totalReceivable = customers.reduce((total, customer) => total + customer.currentBalance, 0);
    const overRiskCount = customers.filter((customer) => customer.currentBalance > customer.riskLimit).length;

    return [
      { label: "Toplam Müşteri", value: customers.length.toString(), icon: UsersRound, tone: "dark" },
      { label: "Aktif Müşteri", value: activeCount.toString(), icon: HandCoins, tone: "green" },
      { label: "Toplam Müşteri Alacağı", value: formatCurrency(totalReceivable), icon: WalletCards, tone: "red" },
      { label: "Risk Limitini Aşan Müşteri", value: overRiskCount.toString(), icon: CircleAlert, tone: "amber" },
    ];
  }, [customers]);

  function openCreateModal() {
    setEditingCustomer(null);
    setIsModalOpen(true);
  }

  function openEditModal(customer) {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  }

  function handleSaveCustomer(customerPayload) {
    if (editingCustomer) {
      updateCustomer({ ...editingCustomer, ...customerPayload });
    } else {
      addCustomer(customerPayload);
    }

    setIsModalOpen(false);
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Cari takip</p>
          <h1>Müşteri Cari Yönetimi</h1>
          <span>Müşteri bakiyelerini, risk limitlerini ve satış geçmişini takip edin.</span>
        </div>
        <button className="primary-action" onClick={openCreateModal}>
          <UserPlus size={18} />
          Yeni Müşteri
        </button>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <CustomerFilters filters={filters} options={filterOptions} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      <CustomerTable customers={filteredCustomers} onEdit={openEditModal} onToggleStatus={toggleCustomerStatus} />

      <CustomerFormModal
        isOpen={isModalOpen}
        customer={editingCustomer}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </>
  );
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "tr"));
}
