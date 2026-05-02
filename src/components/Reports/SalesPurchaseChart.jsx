import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SalesPurchaseChart({ data }) {
  return (
    <section className="chart-panel reports-chart-panel">
      <div className="section-heading">
        <BarChart3 size={19} />
        <h2>Satış / Alış Karşılaştırma Grafiği</h2>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
            <Tooltip formatter={(value) => `${Number(value).toLocaleString("tr-TR")} TL`} />
            <Legend />
            <Bar dataKey="sales" name="Satış" fill="#d71920" radius={[8, 8, 0, 0]} />
            <Bar dataKey="purchases" name="Alış" fill="#2d2f34" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
