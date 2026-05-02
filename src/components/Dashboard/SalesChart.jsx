import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="chart-panel wide">
      <div className="section-heading">
        <TrendingUp size={19} />
        <h2>Son 7 Gün Satış Grafiği</h2>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d71920" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#d71920" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
            <Tooltip formatter={(value) => `${value.toLocaleString("tr-TR")} TL`} />
            <Area type="monotone" dataKey="value" stroke="#d71920" strokeWidth={3} fill="url(#salesFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
