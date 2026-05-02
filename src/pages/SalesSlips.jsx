import { useMemo, useState } from "react";
import { Clock3, ReceiptText, ShoppingBag, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SalesSlipForm from "../components/SalesSlips/SalesSlipForm.jsx";
import SalesSlipTable from "../components/SalesSlips/SalesSlipTable.jsx";
import { customers, products, salesSlips as initialSalesSlips } from "../data/mockData.js";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function SalesSlips() {
  const [salesSlips, setSalesSlips] = useState(initialSalesSlips);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const nextSlipNo = useMemo(() => {
    const nextNumber = salesSlips.length + 1;
    return `SF-${String(nextNumber).padStart(4, "0")}`;
  }, [salesSlips.length]);

  const summaryCards = useMemo(() => {
    const today = "2026-05-02";
    const todayTotal = salesSlips.filter((slip) => slip.date === today).reduce((total, slip) => total + slip.grandTotal, 0);
    const grandTotal = salesSlips.reduce((total, slip) => total + slip.grandTotal, 0);
    const draftCount = salesSlips.filter((slip) => slip.status !== "Kayıtlı").length;

    return [
      { label: "Toplam Satış Fişi", value: salesSlips.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Satış", value: currencyFormatter.format(todayTotal), icon: ShoppingBag, tone: "green" },
      { label: "Toplam Satış Tutarı", value: currencyFormatter.format(grandTotal), icon: WalletCards, tone: "red" },
      { label: "Bekleyen / Taslak Fiş", value: draftCount.toString(), icon: Clock3, tone: "amber" },
    ];
  }, [salesSlips]);

  function handleSaveSlip(slipPayload) {
    const newSlip = {
      ...slipPayload,
      id: Date.now(),
      status: "Kayıtlı",
      createdAt: new Date().toISOString(),
    };

    setSalesSlips((currentSlips) => [newSlip, ...currentSlips]);
    setSuccessMessage(`${newSlip.slipNo} numaralı satış fişi kaydedildi.`);
    setSelectedSlip(newSlip);
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Satış ve cari</p>
          <h1>Satış Fişleri</h1>
          <span>Müşteriye çıkan ürünleri fiş mantığıyla stok ve cari hesaplara işleyin.</span>
        </div>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <SalesSlipForm nextSlipNo={nextSlipNo} products={products} customers={customers} onSave={handleSaveSlip} />
      <SalesSlipTable slips={salesSlips} selectedSlip={selectedSlip} onViewDetail={setSelectedSlip} />
    </>
  );
}
