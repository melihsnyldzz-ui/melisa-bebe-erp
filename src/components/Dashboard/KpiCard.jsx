export default function KpiCard({ item, index }) {
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
