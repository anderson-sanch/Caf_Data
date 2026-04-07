import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";

function PersonalPage() {
  const [search, setSearch] = useState("");

  const empleados = [
    { nombre: "Juan Pérez", rol: "Barista", estado: "En turno" },
    { nombre: "Laura Gómez", rol: "Cajera", estado: "En descanso" },
    { nombre: "Carlos Ruiz", rol: "Supervisor", estado: "En turno" },
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

      <section className="shift-section">
        <h3>Empleados en turno</h3>

        <div className="shift-grid">
          {filteredEmpleados.map((item) => {
            const isDescanso = item.estado === "En descanso";

            return (
              <article
                className={`shift-card ${
                  isDescanso ? "shift-card-warning" : "shift-card-open"
                }`}
                key={item.nombre}
              >
                <div className="shift-top">
                  <div className="shift-user">
                    <div>
                      <strong>{item.nombre}</strong>
                      <span>{item.rol}</span>
                    </div>
                  </div>

                  <span
                    className={`shift-status ${
                      isDescanso ? "warning" : "success"
                    }`}
                  >
                    {item.estado}
                  </span>
                </div>

                <div className="shift-bottom">
                  <button type="button" className="toolbar-chip">
                    Finalizar turno
                  </button>

                  <button type="button" className="toolbar-chip">
                    Reasignar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

export default PersonalPage;