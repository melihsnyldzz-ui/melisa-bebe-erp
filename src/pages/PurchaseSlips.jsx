import { useMemo, useState } from "react";
import { Clock3, FilePlus2, ReceiptText, ShoppingCart, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PurchaseSlipForm from "../components/PurchaseSlips/PurchaseSlipForm.jsx";
import PurchaseSlipTable from "../components/PurchaseSlips/PurchaseSlipTable.jsx";
import { products, purchaseSlips as initialPurchaseSlips, suppliers } from "../data/mockData.js";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function PurchaseSlips() {
  const [purchaseSlips, setPurchaseSlips] = useState(initialPurchaseSlips);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const nextSlipNo = useMemo(() => {
    const nextNumber = purchaseSlips.length + 1;
    return `AF-${String(nextNumber).padStart(4, "0")}`;
  }, [purchaseSlips.length]);

  const summaryCards = useMemo(() => {
    const today = "2026-05-02";
    const todayTotal = purchaseSlips
      .filter((slip) => slip.date === today)
      .reduce((total, slip) => total + slip.grandTotal, 0);
    const grandTotal = purchaseSlips.reduce((total, slip) => total + slip.grandTotal, 0);
    const draftCount = purchaseSlips.filter((slip) => slip.status !== "Kayıtlı").length;

    return [
      { label: "Toplam Alış Fişi", value: purchaseSlips.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Alış", value: currencyFormatter.format(todayTotal), icon: ShoppingCart, tone: "green" },
      { label: "Toplam Alış Tutarı", value: currencyFormatter.format(grandTotal), icon: WalletCards, tone: "red" },
      { label: "Bekleyen / Taslak Fiş", value: draftCount.toString(), icon: Clock3, tone: "amber" },
    ];
  }, [purchaseSlips]);

  function handleSaveSlip(slipPayload) {
    const newSlip = {
      ...slipPayload,
      id: Date.now(),
      status: "Kayıtlı",
      createdAt: new Date().toISOString(),
    };

    setPurchaseSlips((currentSlips) => [newSlip, ...currentSlips]);
    setSuccessMessage(`${newSlip.slipNo} numaralı alış fişi kaydedildi.`);
    setSelectedSlip(newSlip);
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Alış ve stok</p>
          <h1>Alış Fişleri</h1>
          <span>Tedarikçiden gelen ürünleri fiş mantığıyla stok ve cari hesaplara işleyin.</span>
        </div>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <PurchaseSlipForm
        nextSlipNo={nextSlipNo}
        products={products}
        suppliers={suppliers}
        onSave={handleSaveSlip}
      />

      <PurchaseSlipTable slips={purchaseSlips} selectedSlip={selectedSlip} onViewDetail={setSelectedSlip} />
    </>
  );
}
