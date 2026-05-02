import { ShoppingBag } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TopProductsChart({ data }) {
  return (
    <div className="chart-panel">
      <div className="section-heading">
        <ShoppingBag size={19} />
        <h2>En Çok Satan 5 Ürün Grafiği</h2>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 18 }}>
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={92} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => `${value} adet`} />
            <Bar dataKey="adet" radius={[0, 8, 8, 0]} fill="#2d2f34" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
