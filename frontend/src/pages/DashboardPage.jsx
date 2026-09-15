import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    request("/dashboard/summary")
      .then((data) => {
        if (mounted) setSummary(data);
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <Layout title="Dashboard"><div className="data-state dashboard-state">Cargando resumen...</div></Layout>;
  }

  if (error) {
    return <Layout title="Dashboard"><p className="client-form-error page-feedback">{error}</p></Layout>;
  }

  const metrics = [
    { label: "Clientes registrados", value: summary.clientsCount },
    { label: "Productos activos", value: summary.productsCount },
    { label: "Ventas de hoy", value: summary.salesTodayCount },
    { label: "Importe vendido hoy", value: formatMoney(summary.salesTodayTotal) },
    { label: "Productos agotados", value: summary.outOfStockCount },
  ];

  return (
    <Layout title="Dashboard">
      <section className="inventory-kpi-grid dashboard-kpi-grid">
        {metrics.map((metric) => (
          <article className="kpi-card inventory-kpi-card" key={metric.label}>
            <div><p>{metric.label}</p><h3>{metric.value}</h3></div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <section className="orders-card dashboard-panel">
          <div className="orders-header"><h3>Ventas recientes</h3></div>
          {summary.recentSales.length === 0 ? (
            <div className="data-state">Todavía no hay ventas registradas.</div>
          ) : (
            <table className="orders-table">
              <thead><tr><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                {summary.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{formatDate(sale.createdAt)}</td>
                    <td>{sale.client?.name || "Sin cliente"}</td>
                    <td>{formatMoney(sale.total)}</td>
                    <td><span className={`status ${sale.status === "paid" ? "completed" : "soldout"}`}>{sale.status || "Sin estado"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="orders-card dashboard-panel">
          <div className="orders-header"><h3>Productos agotados</h3></div>
          {summary.outOfStockProducts.length === 0 ? (
            <div className="data-state">No hay productos con stock agotado.</div>
          ) : (
            <table className="orders-table">
              <thead><tr><th>Producto</th><th>Stock</th></tr></thead>
              <tbody>
                {summary.outOfStockProducts.map((product) => (
                  <tr key={product.id}><td>{product.name}</td><td>{product.stock}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </section>
    </Layout>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat("es-CO", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
    : "—";
}

export default DashboardPage;
