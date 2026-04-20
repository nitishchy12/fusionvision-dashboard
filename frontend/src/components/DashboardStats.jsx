function DashboardStats({ summary, activeFilter }) {
  const stats = [
    { label: "Total", value: summary.total, color: "#111827" },
    { label: "OSINT", value: summary.byType.OSINT, color: "#15803d" },
    { label: "HUMINT", value: summary.byType.HUMINT, color: "#1d4ed8" },
    { label: "IMINT", value: summary.byType.IMINT, color: "#7e22ce" },
  ];

  return (
    <section className="stats-grid">
      {stats.map((item) => (
        <article key={item.label} className="stat-card">
          <h3>{item.label}</h3>
          <p style={{ color: item.color }}>{item.value}</p>
        </article>
      ))}
      <article className="stat-card">
        <h3>Active View</h3>
        <p>{activeFilter}</p>
      </article>
    </section>
  );
}

export default DashboardStats;
