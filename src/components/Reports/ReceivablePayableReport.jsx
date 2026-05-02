import { WalletCards } from "lucide-react";
import { formatCurrency } from "../../utils/formatters.js";

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
          <strong>{formatCurrency(receivable)}</strong>
        </div>
        <div>
          <span>Tedarikçi Borcu</span>
          <strong>{formatCurrency(payable)}</strong>
        </div>
      </div>
    </section>
  );
}
