import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { CardkpiData } from "../components/ui/Cards/CardkpiData";
import { request } from "../services/apiClient";

function DashboardPage() {
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState({
    salesToday: 0,
    ordersToday: 0,
    products: 0,
    clients: 0,
    recentSales: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    request("/dashboard/summary")
      .then((data) => setSummary(data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <Layout
      title="Dashboard"
      showSearch
      searchPlaceholder="Buscar productos, clientes..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <section className="inventory-kpi-grid dashboard-kpi-grid">

        <CardkpiData title={"Ventas hoy"} data={summary.salesToday} price={true} className={"kpi-card"}/>
        <CardkpiData title={"Órdenes"} data={summary.ordersToday} className={"kpi-card"}/>
        <CardkpiData title={"Productos"} data={summary.products} className={"kpi-card"}/>
        <CardkpiData title={"Clientes"} data={summary.clients} className={"kpi-card"}/>
      </section>

      <section className="orders-card">
        <div className="orders-header">
          <h3>Órdenes recientes</h3>
          <button type="button">Ver todo</button>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {error && <tr><td colSpan="6">{error}</td></tr>}
            {!error && summary.recentSales.length === 0 && <tr><td colSpan="6">No hay ventas registradas.</td></tr>}
            {summary.recentSales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id.slice(0, 8)}</td>
                <td>{sale.client}</td>
                <td>${Number(sale.total).toLocaleString("es-CO")}</td>
                <td><span className={`status ${sale.status === "canceled" ? "soldout" : "completed"}`}>{sale.status}</span></td>
                <td>{sale.created_at ? new Date(sale.created_at).toLocaleDateString("es-CO") : ""}</td>
                <td>Registrada</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default DashboardPage;
