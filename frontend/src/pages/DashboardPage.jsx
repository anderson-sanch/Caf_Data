import { useState } from "react";
import Layout from "../components/layout/Layout";

function DashboardPage() {
  const [search, setSearch] = useState("");

  return (
    <Layout
      title="Dashboard"
      showSearch
      searchPlaceholder="Buscar productos, clientes..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <section className="inventory-kpi-grid dashboard-kpi-grid">
        <article className="kpi-card">
          <p>Ventas Hoy</p>
          <h3>$2,450,000</h3>
          <small className="up">+8.6%</small>
        </article>

        <article className="kpi-card">
          <p>Órdenes</p>
          <h3>84</h3>
          <small className="up">+4.2%</small>
        </article>

        <article className="kpi-card">
          <p>Productos</p>
          <h3>182</h3>
          <small className="down">-1.1%</small>
        </article>

        <article className="kpi-card">
          <p>Clientes</p>
          <h3>1,412</h3>
          <small className="up">+2.0%</small>
        </article>
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
            <tr>
              <td>#001</td>
              <td>María González</td>
              <td>$45.000</td>
              <td><span className="status completed">Completado</span></td>
              <td>12/03/2026</td>
              <td>Ver detalles</td>
            </tr>
            <tr>
              <td>#002</td>
              <td>Carlos López</td>
              <td>$32.000</td>
              <td><span className="status completed">Completado</span></td>
              <td>23/04/2024</td>
              <td>Ver detalles</td>
            </tr>
            <tr>
              <td>#003</td>
              <td>Ana Martínez</td>
              <td>$24.400</td>
              <td><span className="status completed">Completado</span></td>
              <td>14/05/2026</td>
              <td>Ver detalles</td>
            </tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default DashboardPage;