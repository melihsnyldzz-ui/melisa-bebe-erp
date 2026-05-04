import { useEffect, useMemo, useState } from "react";
import { Clock3, FilePlus2, ReceiptText, ShoppingBag, WalletCards } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SalesSlipForm from "../components/SalesSlips/SalesSlipForm.jsx";
import SalesSlipTable from "../components/SalesSlips/SalesSlipTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { canUseDesktopBridge, openSalesSlipWindow } from "../utils/desktopBridge.js";
import { getNextSalesSlipNo } from "../utils/documentNumbers.js";
import { formatCurrency } from "../utils/formatters.js";

export default function SalesSlips() {
  const { hasPermission } = useAuth();
  const { cancelSalesSlip, customers, products, refreshData, salesSlips, saveSalesSlip } = useErpData();
  const canCancelRecords = hasPermission("cancelRecords");
  const canEditSalesSlips = hasPermission("salesSlips.edit");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);

  const nextSlipNo = useMemo(() => getNextSalesSlipNo(salesSlips), [salesSlips]);

  useEffect(() => {
    function handleFocus() {
      refreshData();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshData]);

  useEffect(() => {
    if (!selectedSlip) return;

    const currentSlip = salesSlips.find((slip) => slip.id === selectedSlip.id);
    if (currentSlip && currentSlip !== selectedSlip) {
      setSelectedSlip(currentSlip);
    }
  }, [salesSlips, selectedSlip]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const activeSlips = salesSlips.filter((slip) => slip.status !== "İptal");
    const todayTotal = activeSlips.filter((slip) => slip.date === today).reduce((total, slip) => total + slip.grandTotal, 0);
    const grandTotal = activeSlips.reduce((total, slip) => total + slip.grandTotal, 0);
    const draftCount = salesSlips.filter((slip) => slip.status !== "Kayıtlı" && slip.status !== "İptal").length;

    return [
      { label: "Toplam Satış Fişi", value: salesSlips.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Satış", value: formatCurrency(todayTotal), icon: ShoppingBag, tone: "green" },
      { label: "Toplam Satış Tutarı", value: formatCurrency(grandTotal), icon: WalletCards, tone: "red" },
      { label: "Bekleyen / Taslak Fiş", value: draftCount.toString(), icon: Clock3, tone: "amber" },
    ];
  }, [salesSlips]);

  async function handleSaveSlip(slipPayload) {
    const result = await saveSalesSlip(slipPayload);
    if (!result.ok) {
      setSuccessMessage("");
      setErrorMessage(result.error);
      return;
    }

    const newSlip = result.data;
    setErrorMessage("");
    setSuccessMessage(`${newSlip.slipNo} numaralı satış fişi kaydedildi.`);
    setSelectedSlip(newSlip);
  }

  function handleOpenWindow() {
    openSalesSlipWindow();
  }

  async function handleCancelSalesSlip(slip) {
    const confirmed = window.confirm("Bu satış fişini iptal etmek istediğinize emin misiniz? Stok ve müşteri cari etkileri geri alınacaktır.");
    if (!confirmed) return;

    const result = await cancelSalesSlip(slip.id);
    if (!result.ok) {
      setSuccessMessage("");
      setErrorMessage(result.error);
      return;
    }

    setErrorMessage("");
    setSuccessMessage(`${slip.slipNo} numaralı satış fişi iptal edildi.`);
    setSelectedSlip({ ...slip, status: "İptal" });
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Satış ve cari</p>
          <h1>Satış Fişleri</h1>
          <span>Müşteriye çıkan ürünleri fiş mantığıyla stok ve cari hesaplara işleyin.</span>
        </div>
        {canEditSalesSlips && canUseDesktopBridge() && (
          <button className="primary-action" type="button" onClick={handleOpenWindow}>
            <FilePlus2 size={18} />
            Yeni Satış Fişini Pencerede Aç
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

      {canEditSalesSlips && <SalesSlipForm nextSlipNo={nextSlipNo} products={products} customers={customers} onSave={handleSaveSlip} />}
      <SalesSlipTable
        canCancel={canCancelRecords}
        slips={salesSlips}
        selectedSlip={selectedSlip}
        onCancel={handleCancelSalesSlip}
        onViewDetail={setSelectedSlip}
      />
    </>
  );
}
