import { useMemo, useState } from "react";
import { CircleDollarSign, CreditCard, ReceiptText, Trophy } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PaymentForm from "../components/Payments/PaymentForm.jsx";
import PaymentTable from "../components/Payments/PaymentTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Payments() {
  const { payments, suppliers, savePayment } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const nextPaymentNo = useMemo(() => {
    const nextNumber = payments.length + 1;
    return `OD-${String(nextNumber).padStart(4, "0")}`;
  }, [payments.length]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const todayTotal = payments.filter((payment) => payment.date === today).reduce((total, payment) => total + payment.amount, 0);
    const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);
    const highestAmount = payments.reduce((highest, payment) => Math.max(highest, payment.amount), 0);

    return [
      { label: "Toplam Ödeme Kaydı", value: payments.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Ödeme", value: formatCurrency(todayTotal), icon: CreditCard, tone: "green" },
      { label: "Toplam Ödeme Tutarı", value: formatCurrency(totalAmount), icon: CircleDollarSign, tone: "red" },
      { label: "En Yüksek Ödeme", value: formatCurrency(highestAmount), icon: Trophy, tone: "amber" },
    ];
  }, [payments]);

  async function handleSavePayment(paymentPayload) {
    const { data: newPayment } = await savePayment(paymentPayload);
    setSuccessMessage(`${newPayment.paymentNo} numaralı ödeme kaydedildi.`);
    setSelectedPayment(newPayment);
  }

  return (
    <>
      <section className="page-title">
        <div>
          <p>Cari ödeme</p>
          <h1>Ödemeler</h1>
          <span>Tedarikçilere yapılan ödemeleri cari hesaplara işleyin.</span>
        </div>
      </section>

      <section className="kpi-grid product-summary-grid">
        {summaryCards.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <PaymentForm nextPaymentNo={nextPaymentNo} suppliers={suppliers} onSave={handleSavePayment} />
      <PaymentTable payments={payments} selectedPayment={selectedPayment} onViewDetail={setSelectedPayment} />
    </>
  );
}
