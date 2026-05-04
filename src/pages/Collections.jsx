import { useMemo, useState } from "react";
import { Banknote, CircleDollarSign, ReceiptText, Trophy } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import CollectionForm from "../components/Collections/CollectionForm.jsx";
import CollectionTable from "../components/Collections/CollectionTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { getNextCollectionNo } from "../utils/documentNumbers.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Collections() {
  const { hasPermission } = useAuth();
  const { cancelCollection, collections, customers, saveCollection } = useErpData();
  const canCancelRecords = hasPermission("cancelRecords");
  const canEditCollections = hasPermission("collections.edit");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);

  const nextCollectionNo = useMemo(() => getNextCollectionNo(collections), [collections]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const activeCollections = collections.filter((collection) => collection.status !== "İptal");
    const todayTotal = activeCollections
      .filter((collection) => collection.date === today)
      .reduce((total, collection) => total + collection.amount, 0);
    const totalAmount = activeCollections.reduce((total, collection) => total + collection.amount, 0);
    const highestAmount = activeCollections.reduce((highest, collection) => Math.max(highest, collection.amount), 0);

    return [
      { label: "Toplam Tahsilat Kaydı", value: collections.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Tahsilat", value: formatCurrency(todayTotal), icon: Banknote, tone: "green" },
      { label: "Toplam Tahsilat Tutarı", value: formatCurrency(totalAmount), icon: CircleDollarSign, tone: "red" },
      { label: "En Yüksek Tahsilat", value: formatCurrency(highestAmount), icon: Trophy, tone: "amber" },
    ];
  }, [collections]);

  async function handleSaveCollection(collectionPayload) {
    const { data: newCollection } = await saveCollection(collectionPayload);
    setErrorMessage("");
    setSuccessMessage(`${newCollection.collectionNo} numaralı tahsilat kaydedildi.`);
    setSelectedCollection(newCollection);
  }

  async function handleCancelCollection(collection) {
    const confirmed = window.confirm("Bu tahsilatı iptal etmek istediğinize emin misiniz? Müşteri cari etkisi geri alınacaktır.");
    if (!confirmed) return;

    const result = await cancelCollection(collection.id);
    if (!result.ok) {
      setSuccessMessage("");
      setErrorMessage(result.error);
      return;
    }

    setErrorMessage("");
    setSuccessMessage(`${collection.collectionNo} numaralı tahsilat iptal edildi.`);
    setSelectedCollection({ ...collection, status: "İptal" });
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Cari ödeme</p>
          <h1>Tahsilatlar</h1>
          <span>Müşterilerden gelen ödemeleri cari hesaplara işleyin.</span>
        </div>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {canEditCollections && <CollectionForm nextCollectionNo={nextCollectionNo} customers={customers} onSave={handleSaveCollection} />}
      <CollectionTable
        canCancel={canCancelRecords}
        collections={collections}
        selectedCollection={selectedCollection}
        onCancel={handleCancelCollection}
        onViewDetail={setSelectedCollection}
      />
    </>
  );
}
