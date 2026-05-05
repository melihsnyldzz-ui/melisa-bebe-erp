import { useMemo, useState } from "react";
import SalesSlipForm from "../../components/SalesSlips/SalesSlipForm.jsx";
import { useErpData } from "../../context/ErpDataContext.jsx";
import { getNextSalesSlipNo } from "../../utils/documentNumbers.js";

export default function SalesSlipWindow() {
  const { customers, products, salesSlips, saveSalesSlip } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const nextSlipNo = useMemo(() => getNextSalesSlipNo(salesSlips), [salesSlips]);

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
    return result;
  }

  return (
    <main className="desktop-window-page">
      <section className="desktop-window-title">
        <div>
          <p>Melisa Bebe ERP</p>
          <h1>Yeni Satış Fişi</h1>
          <span>Satış fişini masaüstü penceresi içinde hızlıca oluşturun.</span>
        </div>
      </section>

      <p className="form-note desktop-window-note">
        Not: Masaüstü pencereler gerçek veritabanı bağlantısı aktif olduğunda ana ekranla eş zamanlı çalışacaktır.
      </p>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <SalesSlipForm nextSlipNo={nextSlipNo} products={products} customers={customers} onSave={handleSaveSlip} />
    </main>
  );
}
