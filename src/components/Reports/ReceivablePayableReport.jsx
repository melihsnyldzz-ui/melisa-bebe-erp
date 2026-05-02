import { WalletCards } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function ReceivablePayableReport({ receivable, payable }) {
  return (
    <section className="table-panel report-panel">
      <div className="section-heading">
        <WalletCards size={19} />
        <h2>Müşteri Alacağı / Tedarikçi Borcu</h2>
      </div>
      <div className="receivable-payable-grid">
        <div>
          <span>Müşteri Alacağı</span>
          <strong>{currencyFormatter.format(receivable)}</strong>
        </div>
        <div>
          <span>Tedarikçi Borcu</span>
          <strong>{currencyFormatter.format(payable)}</strong>
        </div>
      </div>
    </section>
  );
}
