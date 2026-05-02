import { useMemo, useState } from "react";
import { CircleDollarSign, CreditCard, ReceiptText, Trophy } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PaymentForm from "../components/Payments/PaymentForm.jsx";
import PaymentTable from "../components/Payments/PaymentTable.jsx";
import { payments as initialPayments, suppliers } from "../data/mockData.js";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const nextPaymentNo = useMemo(() => {
    const nextNumber = payments.length + 1;
    return `OD-${String(nextNumber).padStart(4, "0")}`;
  }, [payments.length]);

  const summaryCards = useMemo(() => {
    const today = "2026-05-02";
    const todayTotal = payments.filter((payment) => payment.date === today).reduce((total, payment) => total + payment.amount, 0);
    const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);
    const highestAmount = payments.reduce((highest, payment) => Math.max(highest, payment.amount), 0);

    return [
      { label: "Toplam Ödeme Kaydı", value: payments.length.toString(), icon: ReceiptText, tone: "dark" },
      { label: "Bugünkü Ödeme", value: currencyFormatter.format(todayTotal), icon: CreditCard, tone: "green" },
      { label: "Toplam Ödeme Tutarı", value: currencyFormatter.format(totalAmount), icon: CircleDollarSign, tone: "red" },
      { label: "En Yüksek Ödeme", value: currencyFormatter.format(highestAmount), icon: Trophy, tone: "amber" },
    ];
  }, [payments]);

  function handleSavePayment(paymentPayload) {
    const newPayment = {
      ...paymentPayload,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    setPayments((currentPayments) => [newPayment, ...currentPayments]);
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
