import { useMemo, useState } from "react";
import { CircleAlert, HandCoins, UserPlus, UsersRound, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import CustomerFilters from "../components/Customers/CustomerFilters.jsx";
import CustomerFormModal from "../components/Customers/CustomerFormModal.jsx";
import CustomerTable from "../components/Customers/CustomerTable.jsx";
import CurrentLedgerTable from "../components/Ledger/CurrentLedgerTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { currentReleaseVersion } from "../config/releaseHighlights.js";
import { formatCurrency } from "../utils/formatters.js";
import { buildCustomerLedger } from "../utils/ledgerCalculations.js";


const currentAccountStatusCards = [
  { label: "Cari takip modu", value: "Pasif/mock hazırlık" },
  { label: "Tahsilat kaydı", value: "Kapalı" },
  { label: "Ödeme kaydı", value: "Kapalı" },
  { label: "Gerçek veri yazma", value: "Kapalı" },
];

const currentAccountRiskClasses = [
  {
    title: "Normal Takip",
    items: [
      "Vadesi gelmemiş cari hareketler",
      "Düzenli ödeme yapan müşteriler",
      "Standart takip listesi",
      "Yönetici müdahalesi gerektirmez",
    ],
  },
  {
    title: "Yakın Vade",
    items: [
      "Vadesi yaklaşan alacaklar",
      "Hatırlatma listesine alınacak müşteriler",
      "Satış temsilcisi manuel kontrol eder",
      "Tahsilat kaydı bu ekrandan yapılmaz",
    ],
  },
  {
    title: "Gecikmiş Alacak",
    items: [
      "Vadesi geçmiş cari bakiye",
      "Yönetici kontrolü gerekir",
      "Müşteri notu hazırlanır",
      "Gerçek işlem ayrı fazda ele alınır",
    ],
  },
  {
    title: "Kritik Risk",
    items: [
      "Uzun süredir kapanmayan alacak",
      "Yüksek bakiye veya tekrar eden gecikme",
      "Yeni satış kararı yöneticiye bağlıdır",
      "Tahsilat/ödeme işlemi bu ekrandan yapılmaz",
    ],
  },
];

const receivablePriorityRows = [
  {
    level: "Yüksek Öncelik",
    riskType: "Gecikmiş yüksek bakiye",
    staffAction: "Müşteri notu hazırla, yöneticiye bildir",
    managerControl: "Evet",
    note: "Tekrar eden gecikme veya ödeme sözü bozulmuş müşteri",
  },
  {
    level: "Orta Öncelik",
    riskType: "Yakın vade",
    staffAction: "Hatırlatma listesine al",
    managerControl: "Hayır",
    note: "Parçalı ödeme veya dönemsel yavaş ödeme",
  },
  {
    level: "Düşük Öncelik",
    riskType: "Düzenli müşteri",
    staffAction: "Standart takipte bırak",
    managerControl: "Hayır",
    note: "Vadesi gelmemiş bakiye veya düşük tutarlı açık bakiye",
  },
];

const collectionPreparationGuideItems = [
  "Tahsilat yapılmadan önce cari bakiye manuel kontrol edilir.",
  "Vade tarihi ve son ödeme hareketi karşılaştırılır.",
  "Müşteri notu varsa yöneticiye gösterilir.",
  "Eksik veya şüpheli bakiye varsa işlem yapılmaz.",
  "Bu ekranda tahsilat kaydı oluşturulmaz.",
  "Gerçek tahsilat/ödeme işlemleri ayrı fazda planlanır.",
];

const emptyFilters = {
  search: "",
  customerType: "all",
  city: "all",
  debt: "all",
  risk: "all",
  status: "all",
};

export default function Customers() {
  const { hasPermission } = useAuth();
  const { collections, customers, salesSlips, addCustomer, updateCustomer, toggleCustomerStatus } = useErpData();
  const canEditCustomers = hasPermission("customers.edit");
  const [filters, setFilters] = useState(emptyFilters);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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

  const selectedCustomerLedger = useMemo(() => {
    if (!selectedCustomer) return [];
    return buildCustomerLedger(selectedCustomer.id, salesSlips, collections);
  }, [collections, salesSlips, selectedCustomer]);

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
        {canEditCustomers && (
          <button className="primary-action" onClick={openCreateModal}>
            <UserPlus size={18} />
            Yeni Müşteri
          </button>
        )}
      </section>

      <CurrentAccountRiskCenter />

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <CustomerFilters filters={filters} options={filterOptions} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      <CustomerTable
        customers={filteredCustomers}
        canEdit={canEditCustomers}
        selectedCustomerId={selectedCustomer?.id}
        onEdit={openEditModal}
        onToggleStatus={toggleCustomerStatus}
        onViewLedger={setSelectedCustomer}
      />

      {selectedCustomer && (
        <CurrentLedgerTable
          accountName={selectedCustomer.name}
          decreaseLabel="Alacak"
          decreaseKey="credit"
          rows={selectedCustomerLedger}
        />
      )}

      <CustomerFormModal
        isOpen={isModalOpen}
        customer={editingCustomer}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </>
  );
}


function CurrentAccountRiskCenter() {
  return (
    <section className="current-account-risk-center section-updated-highlight" id="current-account-risk-center">
      <span className="new-release-badge current-account-release-badge">YENİ · {currentReleaseVersion}</span>
      <div className="current-account-risk-hero">
        <div>
          <p>Cari risk hazırlığı</p>
          <h2>Cari ve Alacak Riskleri Yönetici Merkezi</h2>
          <span>
            Müşteri borç/alacak takibi, vade riski, tahsilat önceliği ve yönetici kontrolünü gerçek veri yazmadan görünür
            hale getiren pasif hazırlık ekranı.
          </span>
        </div>
      </div>

      <div className="current-account-status-grid">
        {currentAccountStatusCards.map((card) => (
          <article className="current-account-status-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <section className="current-account-panel" id="current-account-risk-classes">
        <div className="current-account-panel-heading">
          <h3>Cari Risk Sınıfları</h3>
          <p>Yönetici takibi için cari riskler pasif/mock sınıflar halinde okunur.</p>
        </div>
        <div className="current-account-risk-class-grid">
          {currentAccountRiskClasses.map((riskClass) => (
            <article className="current-account-risk-class-card" key={riskClass.title}>
              <h4>{riskClass.title}</h4>
              <ul>
                {riskClass.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="current-account-panel" id="receivable-priority-matrix">
        <div className="current-account-panel-heading">
          <h3>Alacak Öncelik Matrisi</h3>
          <p>Risk türü, personel aksiyonu ve yönetici kontrolü gereksinimi statik olarak özetlenir.</p>
        </div>
        <div className="receivable-priority-grid">
          {receivablePriorityRows.map((row) => (
            <article className="receivable-priority-card" key={row.level}>
              <span>{row.level}</span>
              <strong>{row.riskType}</strong>
              <p>{row.note}</p>
              <dl>
                <div>
                  <dt>Personelin yapacağı şey</dt>
                  <dd>{row.staffAction}</dd>
                </div>
                <div>
                  <dt>Yönetici kontrolü gerekir mi?</dt>
                  <dd>{row.managerControl}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="current-account-panel collection-preparation-guide" id="collection-preparation-guide">
        <div className="current-account-panel-heading">
          <h3>Tahsilat Hazırlık Rehberi</h3>
          <p>Gerçek finansal işlem yapılmadan önce manuel kontrol sırası görünür tutulur.</p>
        </div>
        <ul>
          {collectionPreparationGuideItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "tr"));
}
