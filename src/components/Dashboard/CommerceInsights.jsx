import { AlertTriangle, BarChart3, PackageCheck, ReceiptText, UsersRound } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";

function ShortTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};

  return (
    <div className="dashboard-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.dataKey}>
          {item.name}: {item.dataKey === "revenue" || item.dataKey === "value" ? formatCurrency(item.value) : `${formatNumber(item.value)} adet`}
        </span>
      ))}
      {row.quantity !== undefined && !payload.some((item) => item.dataKey === "quantity") && <span>Adet: {formatNumber(row.quantity)}</span>}
      {row.revenue !== undefined && !payload.some((item) => item.dataKey === "revenue") && <span>Ciro: {formatCurrency(row.revenue)}</span>}
    </div>
  );
}

function HorizontalBarCard({ title, icon: Icon, data, dataKey, valueLabel, emptyText, color = "#2d2f34" }) {
  return (
    <div className="chart-panel dashboard-chart-card">
      <div className="section-heading">
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      {data.length > 0 ? (
        <div className="dashboard-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 10, bottom: 4, left: 18 }}>
              <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={94} axisLine={false} tickLine={false} />
              <Tooltip content={<ShortTooltip />} />
              <Bar dataKey={dataKey} name={valueLabel} radius={[0, 8, 8, 0]} fill={color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="dashboard-empty-note">{emptyText}</p>
      )}
      {data.length > 0 && (
        <div className="dashboard-chart-summary">
          {data.slice(0, 2).map((item) => (
            <span key={`${item.name}-${item.quantity}-${item.revenue}`}>
              {item.name}: {formatNumber(item.quantity)} adet{item.revenue !== undefined ? ` · ${formatCurrency(item.revenue)}` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function getXAxisInterval(length) {
  if (length > 24) return 4;
  if (length > 14) return 2;
  if (length > 7) return 1;
  return 0;
}

export default function CommerceInsights({ data }) {
  const salesTrendInterval = getXAxisInterval(data.monthlySalesTrend.length);

  return (
    <section className="dashboard-commerce-insights" id="dashboard-commerce-insights">
      <div className="dashboard-middle-grid">
        <div className="chart-panel dashboard-chart-card">
          <div className="section-heading">
            <BarChart3 size={18} />
            <h2>Satış Trendi</h2>
          </div>
          <div className="dashboard-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlySalesTrend}>
                <defs>
                  <linearGradient id="monthlySalesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d71920" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#d71920" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} interval={salesTrendInterval} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip content={<ShortTooltip />} />
                <Area type="monotone" dataKey="value" name="Satış" stroke="#d71920" strokeWidth={3} fill="url(#monthlySalesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <HorizontalBarCard
          title="En Çok Alan Müşteriler"
          icon={UsersRound}
          data={data.topCustomersByRevenue}
          dataKey="revenue"
          valueLabel="Ciro"
          color="#1864ab"
          emptyText="Seçili dönem için müşteri satışı bekleniyor."
        />
      </div>

      <div className="dashboard-bottom-grid">
        <HorizontalBarCard
          title="En Çok Satan Ürünler"
          icon={PackageCheck}
          data={data.monthlyTopProducts}
          dataKey="quantity"
          valueLabel="Adet"
          color="#2d2f34"
          emptyText="Seçili dönem için ürün satışı bekleniyor."
        />

        <div className="chart-panel dashboard-list-card">
          <div className="section-heading">
            <AlertTriangle size={18} />
            <h2>Risk / Kritik Stok</h2>
          </div>
          {data.riskRows.length > 0 ? (
            <div className="dashboard-compact-list">
              {data.riskRows.map((row) => (
                <div className="dashboard-compact-row" key={`${row.label}-${row.status}`}>
                  <span>{row.label}</span>
                  <strong>{row.meta}</strong>
                  <small>{row.status}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty-note">Risk veya kritik stok kaydı görünmüyor.</p>
          )}
        </div>

        <div className="chart-panel dashboard-list-card">
          <div className="section-heading">
            <ReceiptText size={18} />
            <h2>Son Fişler</h2>
          </div>
          {data.latestSlips.length > 0 ? (
            <div className="dashboard-compact-list">
              {data.latestSlips.map((row) => (
                <div className="dashboard-compact-row" key={`${row.type}-${row.no}`}>
                  <span>
                    {row.type} · {row.no || "-"}
                  </span>
                  <strong>{formatCurrency(row.total)}</strong>
                  <small>{row.party || "-"}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty-note">Son fiş kaydı bekleniyor.</p>
          )}
        </div>
      </div>

      {data.categoryAgeDistribution.length > 0 ? (
        <div className="dashboard-distribution-strip table-panel">
          <div className="section-heading">
            <BarChart3 size={18} />
            <h2>Kategori / Yaş Grubu</h2>
          </div>
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
        </div>
      ) : (
        <p className="dashboard-empty-note dashboard-distribution-empty">Kategori analizi için eşleşme bekleniyor.</p>
      )}
    </section>
  );
}
