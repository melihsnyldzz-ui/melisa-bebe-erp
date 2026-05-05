import { formatDateTR } from "../../utils/dateUtils.js";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";
import { buildSalesSlipPrintModel } from "../../utils/printSlipUtils.js";

export default function SalesSlipPrintPreview({ slip }) {
  const model = buildSalesSlipPrintModel(slip);
  if (!model) return null;

  return (
    <section className="table-panel sales-slip-print-panel print-area">
      <div className="print-document">
        <header className="print-header">
          <div>
            <h2>{model.company.name}</h2>
            <p>{model.company.address}</p>
            <p>{model.company.phone}</p>
          </div>
          <div className="print-document-title">
            <span>{model.documentTitle}</span>
            <strong>{model.slipNo}</strong>
            {model.isCanceled && <b>İPTAL</b>}
          </div>
        </header>

        <div className="print-info-grid">
          <PrintInfo label="Tarih" value={formatDateTR(model.date)} />
          <PrintInfo label="Müşteri" value={model.customerName} />
          <PrintInfo label="Müşteri No" value={model.customerId} />
          <PrintInfo label="Satış Tipi" value={model.saleType} />
          <PrintInfo label="Kargo" value={model.cargoInfo} />
          <PrintInfo label="Oluşturma" value={model.createdAt ? `${formatDateTR(model.createdAt)} ${formatPrintTime(model.createdAt)}` : "-"} />
        </div>

        <div className="product-table-scroll print-table-wrap">
          <table className="print-slip-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Ürün Kodu</th>
                <th>Barkod</th>
                <th>Ürün Adı</th>
                <th>Beden</th>
                <th>Renk</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>İsk. %</th>
                <th>Satır Toplamı</th>
              </tr>
            </thead>
            <tbody>
              {model.items.map((item) => (
                <tr key={`${item.lineNo}-${item.productCode}-${item.barcode}`}>
                  <td>{item.lineNo}</td>
                  <td>{item.productCode}</td>
                  <td>{item.barcode}</td>
                  <td>{item.productName}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td>{formatNumber(item.quantity)}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatNumber(item.discountRate)}</td>
                  <td>{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {model.items.length === 0 && <p className="empty-table-text">Bu satış fişinde yazdırılacak ürün satırı bulunamadı.</p>}

        <footer className="print-footer">
          <div className="print-description">
            <span>Açıklama</span>
            <p>{model.description}</p>
          </div>
          <div className="print-totals">
            <PrintTotal label="Toplam Adet" value={formatNumber(model.totalQuantity)} />
            <PrintTotal label="Ara Toplam" value={formatCurrency(model.subtotal)} />
            <PrintTotal label="İskonto Toplamı" value={formatCurrency(model.discountTotal)} />
            <PrintTotal label="Genel Toplam" value={formatCurrency(model.grandTotal)} strong />
          </div>
        </footer>
      </div>
    </section>
  );
}

function PrintInfo({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function PrintTotal({ label, strong = false, value }) {
  return (
    <div className={strong ? "print-total-strong" : ""}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatPrintTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}
