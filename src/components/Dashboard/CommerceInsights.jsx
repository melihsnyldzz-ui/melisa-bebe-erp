import { BarChart3, CalendarDays, PackageCheck, UsersRound } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";

function ShortTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="dashboard-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.dataKey}>
          {item.name}: {item.dataKey === "revenue" || item.dataKey === "value" ? formatCurrency(item.value) : `${formatNumber(item.value)} adet`}
        </span>
      ))}
    </div>
  );
}

function HorizontalBarCard({ title, icon: Icon, data, dataKey, valueLabel, emptyText, color = "#2d2f34" }) {
  return (
    <div className="chart-panel dashboard-small-chart">
      <div className="section-heading">
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      {data.length > 0 ? (
        <div className="dashboard-compact-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 6, right: 12, bottom: 6, left: 24 }}>
              <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={104} axisLine={false} tickLine={false} />
              <Tooltip content={<ShortTooltip />} />
              <Bar dataKey={dataKey} name={valueLabel} radius={[0, 8, 8, 0]} fill={color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="dashboard-empty-note">{emptyText}</p>
      )}
    </div>
  );
}

export default function CommerceInsights({ data }) {
  return (
    <section className="dashboard-commerce-insights">
      <div className="dashboard-operation-panel table-panel">
        <div className="section-heading">
          <CalendarDays size={19} />
          <h2>Bugünkü Operasyon Özeti</h2>
        </div>
        <div className="dashboard-operation-grid">
          {data.todayOperation.map((item) => (
            <article className="dashboard-operation-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>Ay toplamı: {item.monthValue}</small>
              <div className="dashboard-mini-bar" aria-label={`${item.label} bugün ay toplamının yüzde ${Math.round(item.percent)} oranında`}>
                <i style={{ width: `${item.percent}%` }} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="chart-panel wide">
        <div className="section-heading">
          <BarChart3 size={19} />
          <h2>Bu Ay Performans Özeti</h2>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlySalesTrend}>
              <defs>
                <linearGradient id="monthlySalesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d71920" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#d71920" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
              <Tooltip content={<ShortTooltip />} />
              <Area type="monotone" dataKey="value" name="Satış" stroke="#d71920" strokeWidth={3} fill="url(#monthlySalesFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-small-chart-grid">
        <HorizontalBarCard
          title="Bu Ay En Çok Alan Müşteriler - Ciro"
          icon={UsersRound}
          data={data.topCustomersByRevenue}
          dataKey="revenue"
          valueLabel="Ciro"
          color="#1864ab"
          emptyText="Bu ay müşteri ciro analizi için satış verisi bekleniyor."
        />
        <HorizontalBarCard
          title="Bu Ay En Çok Alan Müşteriler - Adet"
          icon={UsersRound}
          data={data.topCustomersByQuantity}
          dataKey="quantity"
          valueLabel="Adet"
          color="#0f6e52"
          emptyText="Bu ay müşteri adet analizi için satış verisi bekleniyor."
        />
        <HorizontalBarCard
          title="Bu Ay En Çok Satan Ürünler"
          icon={PackageCheck}
          data={data.monthlyTopProducts}
          dataKey="quantity"
          valueLabel="Adet"
          color="#2d2f34"
          emptyText="Bu ay ürün satış analizi için satış verisi bekleniyor."
        />
        <div className="chart-panel dashboard-small-chart">
          <div className="section-heading">
            <BarChart3 size={18} />
            <h2>Kategori / Yaş Grubu Dağılımı</h2>
          </div>
          {data.categoryAgeDistribution.length > 0 ? (
            <div className="dashboard-distribution-list">
              {data.categoryAgeDistribution.map((item) => (
                <div className="dashboard-distribution-row" key={item.name}>
                  <span>{item.name}</span>
                  <strong>{formatNumber(item.quantity)} adet</strong>
                  <div className="dashboard-mini-bar">
                    <i style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty-note">Kategori/yaş grubu analizi için ürün eşleşmesi bekleniyor.</p>
          )}
        </div>
      </div>
    </section>
  );
}
