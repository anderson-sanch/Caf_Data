import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import {
  FaDollarSign,
  FaFileAlt,
  FaRegUserCircle,
  FaTag,
} from "react-icons/fa";

function ReportesPage() {
  const [search, setSearch] = useState("");

  const reportes = [
    {
      nombre: "Reporte_financiero_05062025",
      estado: "Completado",
      fecha: "05/05/2025",
      tipo: "Financiero",
    },
    {
      nombre: "Reporte_general_07032025",
      estado: "Completado",
      fecha: "05/05/2025",
      tipo: "Personalizado",
    },
    {
      nombre: "Reporte_inventario_09052025",
      estado: "Completado",
      fecha: "20/09/2025",
      tipo: "Inventario",
    },
  ];

  const filteredReportes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return reportes;

    return reportes.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.tipo.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <Layout title="Gestión de reportes">
      <section className="reports-toolbar">
        <input
          className="reports-search"
          type="text"
          placeholder="Buscar reporte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="toolbar-right">
          <button type="button" className="toolbar-chip">
            Hoy
          </button>
          <button type="button" className="toolbar-chip">
            Exportar
          </button>
          <button type="button" className="toolbar-main">
            + Nuevo
          </button>
        </div>
      </section>

      <section className="reports-grid">
        <article className="report-card">
          <h4>Reporte de ventas</h4>
          <p>Ventas por período</p>
          <span className="report-icon">
            <FaDollarSign />
          </span>
        </article>

        <article className="report-card">
          <h4>Reporte de inventario</h4>
          <p>Stock y movimientos</p>
          <span className="report-icon">
            <FaFileAlt />
          </span>
        </article>

        <article className="report-card">
          <h4>Reporte de clientes</h4>
          <p>Frecuencia de compra</p>
          <span className="report-icon">
            <FaRegUserCircle />
          </span>
        </article>

        <article className="report-card">
          <h4>Reporte de personal</h4>
          <p>Asistencia y turnos</p>
          <span className="report-icon">
            <FaRegUserCircle />
          </span>
        </article>

        <article className="report-card">
          <h4>Reporte financiero</h4>
          <p>Ingresos y gastos</p>
          <span className="report-icon">
            <FaDollarSign />
          </span>
        </article>

        <article className="report-card">
          <h4>Reporte personalizado</h4>
          <p>Filtros avanzados</p>
          <span className="report-icon">
            <FaTag />
          </span>
        </article>
      </section>

      <section className="orders-card">
        <div className="orders-header">
          <h3>Lista de reportes</h3>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredReportes.map((item) => (
              <tr key={item.nombre}>
                <td>{item.nombre}</td>
                <td>
                  <span className="status completed">{item.estado}</span>
                </td>
                <td>{item.fecha}</td>
                <td>{item.tipo}</td>
                <td>Ver detalles</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default ReportesPage;