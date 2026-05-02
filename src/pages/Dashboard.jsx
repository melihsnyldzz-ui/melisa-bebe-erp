import { AlertTriangle, Banknote, ClipboardList, ReceiptText, Truck, UserRound } from "lucide-react";
import DataTable from "../components/Dashboard/DataTable.jsx";
import KpiCard from "../components/Dashboard/KpiCard.jsx";
import SalesChart from "../components/Dashboard/SalesChart.jsx";
import TopProductsChart from "../components/Dashboard/TopProductsChart.jsx";
import { kpis, salesChart, tables, topProducts } from "../data/mockData.js";

export default function Dashboard() {
  return (
    <>
      <section className="page-title">
        <div>
          <p>Canlı özet</p>
          <h1>Melisa Bebe Yönetim Paneli</h1>
          <span>Bugünkü satış, stok ve cari durumunuzu tek ekrandan takip edin.</span>
        </div>
        <button className="primary-action">
          <ClipboardList size={18} />
          Gün Sonu Raporu
        </button>
      </section>

      <section className="kpi-grid">
        {kpis.map((item, index) => (
          <KpiCard item={item} index={index} key={item.label} />
        ))}
      </section>

      <section className="charts-grid">
        <SalesChart data={salesChart} />
        <TopProductsChart data={topProducts} />
      </section>

      <section className="tables-grid">
        <DataTable title="Son Satış Fişleri" icon={ReceiptText} rows={tables.sales} columns={["Fiş", "Müşteri", "Tutar", "Saat"]} />
        <DataTable title="Son Alış Fişleri" icon={Truck} rows={tables.purchases} columns={["Fiş", "Tedarikçi", "Tutar", "Zaman"]} />
        <DataTable title="Son Tahsilatlar" icon={Banknote} rows={tables.collections} columns={["No", "Cari", "Tutar", "Tip"]} />
        <DataTable title="Kritik Stok Uyarıları" icon={AlertTriangle} rows={tables.stock} columns={["Kod", "Ürün", "Stok", "Durum"]} />
        <DataTable title="Riskli Müşteriler" icon={UserRound} rows={tables.risk} columns={["Müşteri", "Alacak", "Gecikme", "Risk"]} />
      </section>
    </>
  );
}
