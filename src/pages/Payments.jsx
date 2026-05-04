import { useMemo, useState } from "react";
import { CircleDollarSign, CreditCard, ReceiptText, Trophy } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import PaymentForm from "../components/Payments/PaymentForm.jsx";
import PaymentTable from "../components/Payments/PaymentTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useErpData } from "../context/ErpDataContext.jsx";
import { getTodayISO } from "../utils/dateUtils.js";
import { getNextPaymentNo } from "../utils/documentNumbers.js";
import { formatCurrency } from "../utils/formatters.js";

export default function Payments() {
  const { hasPermission } = useAuth();
  const { cancelPayment, payments, suppliers, savePayment } = useErpData();
  const canCancelRecords = hasPermission("cancelRecords");
  const canEditPayments = hasPermission("payments.edit");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const nextPaymentNo = useMemo(() => getNextPaymentNo(payments), [payments]);

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
    setErrorMessage("");
    setSuccessMessage(`${newPayment.paymentNo} numaralı ödeme kaydedildi.`);
    setSelectedPayment(newPayment);
  }

  async function handleCancelPayment(payment) {
    const confirmed = window.confirm("Bu tedarikçi ödemesini iptal etmek istediğinize emin misiniz? Tedarikçi cari etkisi geri alınacaktır.");
    if (!confirmed) return;

    const result = await cancelPayment(payment.id);
    if (!result.ok) {
      setSuccessMessage("");
      setErrorMessage(result.error);
      return;
    }

    setErrorMessage("");
    setSuccessMessage(`${payment.paymentNo} numaralı tedarikçi ödemesi iptal edildi.`);
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {canEditPayments && <PaymentForm nextPaymentNo={nextPaymentNo} suppliers={suppliers} onSave={handleSavePayment} />}
      <PaymentTable
        canCancel={canCancelRecords}
        payments={payments}
        selectedPayment={selectedPayment}
        onCancel={handleCancelPayment}
        onViewDetail={setSelectedPayment}
      />
    </>
  );
}
