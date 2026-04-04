import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";

function ClientesPage() {
  const [search, setSearch] = useState("");

  const clientes = [
    {
      nombre: "Herminia",
      contacto: "her@gmail.com",
      estado: "Activo",
      registro: "05/06/2025",
      tipo: "Frecuente",
    },
    {
      nombre: "Natalia",
      contacto: "nat@ghg.com",
      estado: "Inactivo",
      registro: "06/06/2025",
      tipo: "VIP",
    },
    {
      nombre: "Pipe",
      contacto: "pep@fgh.com",
      estado: "Activo",
      registro: "20/03/2025",
      tipo: "Nuevo",
    },
  ];

  const filteredClientes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clientes;

    return clientes.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.contacto.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <Layout title="Clientes">
      <section className="inventory-toolbar">
        <input
          type="text"
          placeholder="Buscar por nombre, correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="toolbar-right">
          <button type="button" className="toolbar-chip">
            Filtro
          </button>
          <button type="button" className="toolbar-chip">
            Exportar
          </button>
          <button type="button" className="toolbar-main">
            + Nuevo cliente
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid">
        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Total clientes</p>
            <h3>95</h3>
            <small className="up">+4 clientes esta semana</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Clientes frecuentes</p>
            <h3>34</h3>
            <small className="up">18 en el último mes</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Nuevos hoy</p>
            <h3>1</h3>
            <small className="up">+2.1%</small>
          </div>
        </article>
      </section>

      <section className="orders-card">
        <div className="orders-header">
          <h3>Lista de clientes</h3>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredClientes.map((item) => (
              <tr key={`${item.nombre}-${item.contacto}`}>
                <td>{item.nombre}</td>
                <td>{item.contacto}</td>
                <td>
                  <span
                    className={`status ${
                      item.estado === "Inactivo" ? "soldout" : "completed"
                    }`}
                  >
                    {item.estado}
                  </span>
                </td>
                <td>{item.registro}</td>
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

export default ClientesPage;