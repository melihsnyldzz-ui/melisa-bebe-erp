import { useMemo, useState } from "react";
import { Banknote, CircleDollarSign, ReceiptText, Trophy } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import CollectionForm from "../components/Collections/CollectionForm.jsx";
import CollectionTable from "../components/Collections/CollectionTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Collections() {
  const { collections, customers, saveCollection } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);

  const nextCollectionNo = useMemo(() => {
    const nextNumber = collections.length + 1;
    return `TH-${String(nextNumber).padStart(4, "0")}`;
  }, [collections.length]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const todayTotal = collections
      .filter((collection) => collection.date === today)
      .reduce((total, collection) => total + collection.amount, 0);
    const totalAmount = collections.reduce((total, collection) => total + collection.amount, 0);
    const highestAmount = collections.reduce((highest, collection) => Math.max(highest, collection.amount), 0);

    return [
      { label: "Toplam Tahsilat Kaydı", value: collections.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Tahsilat", value: formatCurrency(todayTotal), icon: Banknote, tone: "green" },
      { label: "Toplam Tahsilat Tutarı", value: formatCurrency(totalAmount), icon: CircleDollarSign, tone: "red" },
      { label: "En Yüksek Tahsilat", value: formatCurrency(highestAmount), icon: Trophy, tone: "amber" },
    ];
  }, [collections]);

  function handleSaveCollection(collectionPayload) {
    const { data: newCollection } = saveCollection(collectionPayload);
    setSuccessMessage(`${newCollection.collectionNo} numaralı tahsilat kaydedildi.`);
    setSelectedCollection(newCollection);
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

      <CollectionForm nextCollectionNo={nextCollectionNo} customers={customers} onSave={handleSaveCollection} />
      <CollectionTable collections={collections} selectedCollection={selectedCollection} onViewDetail={setSelectedCollection} />
    </>
  );
}
