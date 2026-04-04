function KpiCard({ title, value, subtitle = "", trend = "up" }) {
  return (
    <article className="kpi-card inventory-kpi-card">
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        {subtitle ? <small className={trend}>{subtitle}</small> : null}
      </div>
    </article>
  );
}

export default KpiCard;