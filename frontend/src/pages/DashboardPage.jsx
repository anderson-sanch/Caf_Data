import { useState } from "react";
import Layout from "../components/layout/Layout";
import { CardkpiData } from "../components/ui/Cards/CardkpiData";

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

        <CardkpiData title={"Ventas hoy"} data={20000} price={true} className={"kpi-card"}/>
        <CardkpiData title={"Ordemes"} data={48} className={"kpi-card"}/>
        <CardkpiData title={"Productos"} data={182} className={"kpi-card"}/>
        <CardkpiData title={"Clientes"} data={1412} className={"kpi-card"}/>
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