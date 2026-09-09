import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

function PersonalPage() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    request("/users")
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const filteredEmpleados = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;

    return employees.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
    );
  }, [employees, search]);

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
          <button
            type="button"
            className="toolbar-main"
            onClick={() => navigate("/personal/nuevo")}
          >
            + Nuevo empleado
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid">
        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Empleados activos</p>
            <h3>{employees.filter((employee) => employee.is_active).length}</h3>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>En turno</p>
            <h3>{employees.filter((employee) => employee.is_active).length}</h3>
            <small className="up">Usuarios activos</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>En descanso</p>
            <h3>{employees.filter((employee) => !employee.is_active).length}</h3>
            <small className="down">Usuarios inactivos</small>
          </div>
        </article>
      </section>

      <section className="shift-section">
        <h3>Empleados en turno</h3>

        <div className="shift-grid">
          {error && <p>{error}</p>}
          {filteredEmpleados.map((item) => {
            const isDescanso = !item.is_active;

            return (
              <article
                className={`shift-card ${
                  isDescanso ? "shift-card-warning" : "shift-card-open"
                }`}
                key={item.id}
              >
                <div className="shift-top">
                  <div className="shift-user">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.email}</span>
                    </div>
                  </div>

                  <span
                    className={`shift-status ${
                      isDescanso ? "warning" : "success"
                    }`}
                  >
                    {isDescanso ? "Inactivo" : "Activo"}
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
