import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowDownToLine,
  Banknote,
  Bell,
  Boxes,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  Search,
  ShoppingBag,
  TrendingUp,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./styles.css";

const kpis = [
  { label: "Bugünkü Satış", value: "125.000 TL", icon: ShoppingBag, tone: "red" },
  { label: "Bugünkü Tahsilat", value: "72.000 TL", icon: Banknote, tone: "green" },
  { label: "Bugünkü Alış", value: "94.000 TL", icon: Truck, tone: "dark" },
  { label: "Bugünkü Tedarikçi Ödemesi", value: "40.000 TL", icon: CreditCard, tone: "amber" },
  { label: "Toplam Müşteri Alacağı", value: "1.240.000 TL", icon: WalletCards, tone: "red" },
  { label: "Toplam Tedarikçi Borcu", value: "890.000 TL", icon: ArrowDownToLine, tone: "dark" },
  { label: "Toplam Stok Adedi", value: "18.450", icon: Boxes, tone: "green" },
  { label: "Kritik Stok Ürün Sayısı", value: "37", icon: AlertTriangle, tone: "amber" },
];

const navItems = [
  { label: "Ana Panel", icon: LayoutDashboard, active: true },
  { label: "Satış", icon: ReceiptText },
  { label: "Alış", icon: Truck },
  { label: "Stok", icon: PackageSearch },
  { label: "Cari Hesaplar", icon: WalletCards },
  { label: "Raporlar", icon: ChartNoAxesColumnIncreasing },
];

const salesChart = [
  { day: "Pzt", value: 82000 },
  { day: "Sal", value: 96000 },
  { day: "Çar", value: 74000 },
  { day: "Per", value: 110000 },
  { day: "Cum", value: 125000 },
  { day: "Cmt", value: 118000 },
  { day: "Paz", value: 103000 },
];

const topProducts = [
  { name: "Organik Body", adet: 245 },
  { name: "Pamuk Tulum", adet: 218 },
  { name: "Bebek Seti", adet: 176 },
  { name: "Uyku Tulumu", adet: 142 },
  { name: "Patikli Alt", adet: 119 },
];

const tables = {
  sales: [
    ["SF-10245", "Ayşe Yılmaz", "18.450 TL", "11:42"],
    ["SF-10244", "MiniModa", "12.900 TL", "10:58"],
    ["SF-10243", "Ece Tekstil", "8.320 TL", "10:21"],
  ],
  purchases: [
    ["AF-6812", "Pamukhan Tekstil", "42.000 TL", "09:55"],
    ["AF-6811", "Bursa Örme", "31.250 TL", "Dün"],
    ["AF-6810", "Mira Aksesuar", "20.750 TL", "Dün"],
  ],
  collections: [
    ["TH-3509", "Deniz Kids", "28.000 TL", "Nakit"],
    ["TH-3508", "Ayşe Yılmaz", "16.500 TL", "Havale"],
    ["TH-3507", "MiniModa", "27.500 TL", "Kart"],
  ],
  stock: [
    ["MB-0142", "Yenidoğan Body 0-3 Ay", "4 adet", "Acil"],
    ["MB-0278", "Kız Bebek Tulum 6-9 Ay", "7 adet", "Kritik"],
    ["MB-0315", "Pamuk Battaniye", "9 adet", "Takip"],
  ],
  risk: [
    ["Ece Tekstil", "184.000 TL", "24 gün", "Yüksek"],
    ["Deniz Kids", "132.500 TL", "18 gün", "Orta"],
    ["Minik Adımlar", "96.750 TL", "15 gün", "Orta"],
  ],
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">M</div>
        <div>
          <strong>Melisa Bebe</strong>
          <span>ERP</span>
        </div>
      </div>
      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button className={`nav-item ${item.active ? "active" : ""}`} key={item.label}>
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <PackageCheck size={20} />
        <span>Stok senkronizasyonu aktif</span>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <button className="mobile-menu" aria-label="Menüyü aç">
        <Menu size={22} />
      </button>
      <label className="search-box">
        <Search size={18} />
        <input placeholder="Fiş, müşteri, ürün veya tedarikçi ara" />
      </label>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Bildirimler">
          <Bell size={19} />
        </button>
        <div className="user-card">
          <div className="avatar">
            <UserRound size={18} />
          </div>
          <div>
            <strong>Melisa Bebe</strong>
            <span>Yönetici</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function KpiCard({ item, index }) {
  const Icon = item.icon;
  return (
    <article className={`kpi-card ${item.tone}`} style={{ "--delay": `${index * 45}ms` }}>
      <div className="kpi-icon">
        <Icon size={21} />
      </div>
      <span>{item.label}</span>
      <strong>{item.value}</strong>
    </article>
  );
}

function DataTable({ title, icon: Icon, rows, columns }) {
  return (
    <section className="table-panel">
      <div className="section-heading">
        <Icon size={19} />
        <h2>{title}</h2>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`}>
                  {index === row.length - 1 ? <span className="status">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
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
          <div className="chart-panel wide">
            <div className="section-heading">
              <TrendingUp size={19} />
              <h2>Son 7 Gün Satış Grafiği</h2>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChart}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d71920" stopOpacity={0.34} />
                      <stop offset="100%" stopColor="#d71920" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip formatter={(value) => `${value.toLocaleString("tr-TR")} TL`} />
                  <Area type="monotone" dataKey="value" stroke="#d71920" strokeWidth={3} fill="url(#salesFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-panel">
            <div className="section-heading">
              <ShoppingBag size={19} />
              <h2>En Çok Satan 5 Ürün Grafiği</h2>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 18 }}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={92} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => `${value} adet`} />
                  <Bar dataKey="adet" radius={[0, 8, 8, 0]} fill="#2d2f34" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="tables-grid">
          <DataTable title="Son Satış Fişleri" icon={ReceiptText} rows={tables.sales} columns={["Fiş", "Müşteri", "Tutar", "Saat"]} />
          <DataTable title="Son Alış Fişleri" icon={Truck} rows={tables.purchases} columns={["Fiş", "Tedarikçi", "Tutar", "Zaman"]} />
          <DataTable title="Son Tahsilatlar" icon={Banknote} rows={tables.collections} columns={["No", "Cari", "Tutar", "Tip"]} />
          <DataTable title="Kritik Stok Uyarıları" icon={AlertTriangle} rows={tables.stock} columns={["Kod", "Ürün", "Stok", "Durum"]} />
          <DataTable title="Riskli Müşteriler" icon={UserRound} rows={tables.risk} columns={["Müşteri", "Alacak", "Gecikme", "Risk"]} />
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
