import { useMemo, useState } from "react";
import PurchaseSlipForm from "../../components/PurchaseSlips/PurchaseSlipForm.jsx";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { getNextPurchaseSlipNo } from "../../utils/documentNumbers.js";

export default function PurchaseSlipWindow() {
  const { products, purchaseSlips, savePurchaseSlip, suppliers } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const nextSlipNo = useMemo(() => getNextPurchaseSlipNo(purchaseSlips), [purchaseSlips]);

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
    return result;
  }

  return (
    <main className="desktop-window-page">
      <section className="desktop-window-title">
        <div>
          <p>Melisa Bebe ERP</p>
          <h1>Yeni Alış Fişi</h1>
          <span>Alış fişini masaüstü penceresi içinde hızlıca oluşturun.</span>
        </div>
      </section>

      <p className="form-note desktop-window-note">
        Not: Masaüstü pencereler gerçek veritabanı bağlantısı aktif olduğunda ana ekranla eş zamanlı çalışacaktır.
      </p>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <PurchaseSlipForm nextSlipNo={nextSlipNo} products={products} suppliers={suppliers} onSave={handleSaveSlip} />
    </main>
  );
}
