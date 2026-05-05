import { useEffect, useMemo, useState } from "react";
import { Clock3, FilePlus2, ReceiptText, ShoppingCart, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PurchaseSlipForm from "../components/PurchaseSlips/PurchaseSlipForm.jsx";
import PurchaseSlipTable from "../components/PurchaseSlips/PurchaseSlipTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { canUseDesktopBridge, openPurchaseSlipWindow } from "../utils/desktopBridge.js";
import { getNextPurchaseSlipNo } from "../utils/documentNumbers.js";
import { formatCurrency } from "../utils/formatters.js";

export default function PurchaseSlips() {
  const { hasPermission } = useAuth();
  const { cancelPurchaseSlip, products, purchaseSlips, refreshData, savePurchaseSlip, suppliers } = useErpData();
  const canCancelRecords = hasPermission("cancelRecords");
  const canEditPurchaseSlips = hasPermission("purchaseSlips.edit");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const nextSlipNo = useMemo(() => getNextPurchaseSlipNo(purchaseSlips), [purchaseSlips]);

  useEffect(() => {
    function handleFocus() {
      refreshData();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshData]);

  useEffect(() => {
    if (!selectedSlip) return;

    const currentSlip = purchaseSlips.find((slip) => slip.id === selectedSlip.id);
    if (currentSlip && currentSlip !== selectedSlip) {
      setSelectedSlip(currentSlip);
    }
  }, [purchaseSlips, selectedSlip]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const activeSlips = purchaseSlips.filter((slip) => slip.status !== "İptal");
    const todayTotal = activeSlips
      .filter((slip) => slip.date === today)
      .reduce((total, slip) => total + slip.grandTotal, 0);
    const grandTotal = activeSlips.reduce((total, slip) => total + slip.grandTotal, 0);
    const draftCount = purchaseSlips.filter((slip) => slip.status !== "Kayıtlı" && slip.status !== "İptal").length;

    return [
      { label: "Toplam Alış Fişi", value: purchaseSlips.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Alış", value: formatCurrency(todayTotal), icon: ShoppingCart, tone: "green" },
      { label: "Toplam Alış Tutarı", value: formatCurrency(grandTotal), icon: WalletCards, tone: "red" },
      { label: "Bekleyen / Taslak Fiş", value: draftCount.toString(), icon: Clock3, tone: "amber" },
    ];
  }, [purchaseSlips]);

  async function handleSaveSlip(slipPayload) {
    const result = await savePurchaseSlip(slipPayload);
    if (!result.ok) {
      setSuccessMessage("");
      setErrorMessage(result.error);
      return result;
    }
    const newSlip = result.data;
    setErrorMessage("");
    setSuccessMessage(`${newSlip.slipNo} numaralı alış fişi kaydedildi.`);
    setSelectedSlip(newSlip);
    return result;
  }

  function handleOpenWindow() {
    openPurchaseSlipWindow();
  }

  async function handleCancelPurchaseSlip(slip) {
    const confirmed = window.confirm("Bu alış fişini iptal etmek istediğinize emin misiniz? Stok ve tedarikçi cari etkileri geri alınacaktır.");
    if (!confirmed) return;

    const result = await cancelPurchaseSlip(slip.id);
    if (!result.ok) {
      setSuccessMessage("");
      setErrorMessage(result.error);
      return;
    }

    setErrorMessage("");
    setSuccessMessage(`${slip.slipNo} numaralı alış fişi iptal edildi.`);
    setSelectedSlip({ ...slip, status: "İptal" });
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Alış ve stok</p>
          <h1>Alış Fişleri</h1>
          <span>Tedarikçiden gelen ürünleri fiş mantığıyla stok ve cari hesaplara işleyin.</span>
        </div>
        {canEditPurchaseSlips && canUseDesktopBridge() && (
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {canEditPurchaseSlips && (
        <PurchaseSlipForm
          nextSlipNo={nextSlipNo}
          products={products}
          suppliers={suppliers}
          onSave={handleSaveSlip}
        />
      )}

      <PurchaseSlipTable
        canCancel={canCancelRecords}
        slips={purchaseSlips}
        selectedSlip={selectedSlip}
        onCancel={handleCancelPurchaseSlip}
        onViewDetail={setSelectedSlip}
      />
    </>
  );
}
