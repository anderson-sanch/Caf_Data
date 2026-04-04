import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";

function PersonalPage() {
  const [search, setSearch] = useState("");

  const empleados = [
    {
      nombre: "Juan Pérez",
      rol: "Barista",
      estado: "En turno",
    },
    {
      nombre: "Laura Gómez",
      rol: "Cajera",
      estado: "En descanso",
    },
    {
      nombre: "Carlos Ruiz",
      rol: "Supervisor",
      estado: "En turno",
    },
  ];

  const filteredEmpleados = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return empleados;

    return empleados.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.rol.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <Layout title="Personal">
      <section className="inventory-toolbar">
        <input
          type="text"
          placeholder="Buscar empleado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="toolbar-right">
          <button type="button" className="toolbar-main">
            + Nuevo empleado
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid">
        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Empleados activos</p>
            <h3>12</h3>
            <small className="up">+1 este mes</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>En turno</p>
            <h3>8</h3>
            <small className="up">Turno actual</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>En descanso</p>
            <h3>4</h3>
            <small className="down">2 en pausa</small>
          </div>
        </article>
      </section>

      <section className="staff-grid">
        {filteredEmpleados.map((item) => (
          <article className="staff-card" key={item.nombre}>
            <div className="staff-header">
              <div className="staff-avatar" />
              <div>
                <h4>{item.nombre}</h4>
                <p>{item.rol}</p>
              </div>
            </div>

            <span
              className={`status ${
                item.estado === "En descanso" ? "soldout" : "completed"
              }`}
            >
              {item.estado}
            </span>

            <div className="staff-actions">
              <button type="button" className="toolbar-chip">
                Finalizar turno
              </button>

              <button type="button" className="toolbar-chip">
                Reasignar
              </button>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}

export default PersonalPage;