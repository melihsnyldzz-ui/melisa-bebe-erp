import { useMemo, useState } from "react";
import { CircleDollarSign, CreditCard, ReceiptText, Trophy } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PaymentForm from "../components/Payments/PaymentForm.jsx";
import PaymentTable from "../components/Payments/PaymentTable.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Payments() {
  const { cancelPayment, payments, suppliers, savePayment } = useErpData();
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const nextPaymentNo = useMemo(() => {
    const nextNumber = payments.length + 1;
    return `OD-${String(nextNumber).padStart(4, "0")}`;
  }, [payments.length]);

  const summaryCards = useMemo(() => {
    const today = getTodayISO();
    const activePayments = payments.filter((payment) => payment.status !== "İptal");
    const todayTotal = activePayments.filter((payment) => payment.date === today).reduce((total, payment) => total + payment.amount, 0);
    const totalAmount = activePayments.reduce((total, payment) => total + payment.amount, 0);
    const highestAmount = activePayments.reduce((highest, payment) => Math.max(highest, payment.amount), 0);

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

  async function handleCancelPayment(payment) {
    const confirmed = window.confirm("Bu fişi iptal etmek istediğinize emin misiniz? Stok ve cari etkileri geri alınacaktır.");
    if (!confirmed) return;

    const result = await cancelPayment(payment.id);
    if (!result.ok) return;
    setSuccessMessage(`${payment.paymentNo} numaralı ödeme iptal edildi.`);
    setSelectedPayment({ ...payment, status: "İptal" });
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
      <PaymentTable payments={payments} selectedPayment={selectedPayment} onCancel={handleCancelPayment} onViewDetail={setSelectedPayment} />
    </>
  );
}
