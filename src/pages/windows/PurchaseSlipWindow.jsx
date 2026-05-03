import { useMemo, useState } from "react";
import PurchaseSlipForm from "../../components/PurchaseSlips/PurchaseSlipForm.jsx";
import { useErpData } from "../../context/ErpDataContext.jsx";

export default function PurchaseSlipWindow() {
  const { products, purchaseSlips, savePurchaseSlip, suppliers } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");

  const nextSlipNo = useMemo(() => {
    const nextNumber = purchaseSlips.length + 1;
    return `AF-${String(nextNumber).padStart(4, "0")}`;
  }, [purchaseSlips.length]);

  function handleSaveSlip(slipPayload) {
    const result = savePurchaseSlip(slipPayload);
    const newSlip = result.data;
    setSuccessMessage(`${newSlip.slipNo} numaralı alış fişi kaydedildi.`);
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

      <PurchaseSlipForm nextSlipNo={nextSlipNo} products={products} suppliers={suppliers} onSave={handleSaveSlip} />
    </main>
  );
}
