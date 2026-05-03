import { useMemo, useState } from "react";
import { Clock3, FilePlus2, ReceiptText, ShoppingCart, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PurchaseSlipForm from "../components/PurchaseSlips/PurchaseSlipForm.jsx";
import PurchaseSlipTable from "../components/PurchaseSlips/PurchaseSlipTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { canUseDesktopBridge, openPurchaseSlipWindow } from "../utils/desktopBridge.js";
import { formatCurrency } from "../utils/formatters.js";

export default function PurchaseSlips() {
  const { products, purchaseSlips, savePurchaseSlip, suppliers } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const nextSlipNo = useMemo(() => {
    const nextNumber = purchaseSlips.length + 1;
    return `AF-${String(nextNumber).padStart(4, "0")}`;
  }, [purchaseSlips.length]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const todayTotal = purchaseSlips
      .filter((slip) => slip.date === today)
      .reduce((total, slip) => total + slip.grandTotal, 0);
    const grandTotal = purchaseSlips.reduce((total, slip) => total + slip.grandTotal, 0);
    const draftCount = purchaseSlips.filter((slip) => slip.status !== "Kayıtlı").length;

    return [
      { label: "Toplam Alış Fişi", value: purchaseSlips.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Alış", value: formatCurrency(todayTotal), icon: ShoppingCart, tone: "green" },
      { label: "Toplam Alış Tutarı", value: formatCurrency(grandTotal), icon: WalletCards, tone: "red" },
      { label: "Bekleyen / Taslak Fiş", value: draftCount.toString(), icon: Clock3, tone: "amber" },
    ];
  }, [purchaseSlips]);

  async function handleSaveSlip(slipPayload) {
    const result = await savePurchaseSlip(slipPayload);
    if (!result.ok) return;
    const newSlip = result.data;
    setSuccessMessage(`${newSlip.slipNo} numaralı alış fişi kaydedildi.`);
    setSelectedSlip(newSlip);
  }

  function handleOpenWindow() {
    openPurchaseSlipWindow();
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Alış ve stok</p>
          <h1>Alış Fişleri</h1>
          <span>Tedarikçiden gelen ürünleri fiş mantığıyla stok ve cari hesaplara işleyin.</span>
        </div>
        {canUseDesktopBridge() && (
          <button className="primary-action" type="button" onClick={handleOpenWindow}>
            <FilePlus2 size={18} />
            Yeni Alış Fişini Pencerede Aç
          </button>
        )}
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
