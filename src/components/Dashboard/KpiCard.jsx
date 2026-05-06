export default function KpiCard({ item, index }) {
  const Icon = item.icon;

  return (
    <article className={`kpi-card ${item.tone}`} style={{ "--delay": `${index * 45}ms` }}>
      <div className="kpi-icon">
        <Icon size={21} />
      </div>
      <span>{item.label}</span>
      <strong>{item.value}</strong>
      {item.monthValue && (
        <div className="kpi-mini-trend">
          <small>{item.monthValue}</small>
          <div className="dashboard-mini-bar">
            <i style={{ width: `${item.percent || 0}%` }} />
          </div>
        </div>
      )}
    </article>
  );
}
