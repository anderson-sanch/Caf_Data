import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

function ClientesPage() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const Clientes = async () => {
      try{
        const data = await request("/clients");
        setClients(Array.isArray(data) ? data : []);
      } catch(err){
        setError('Error al obtener clientes')
      } finally{
        setLoading(false);
      }
    }

    Clientes()
  }, [])

  const filteredClientes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;

    return clients.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
    );
  }, [clients, search]);

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
          <button
            type="button"
            className="toolbar-main"
            onClick={() => navigate("/clientes/nuevo")}
          >
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
              <th>email</th>
              <th>Direccion</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading && <tr><td colSpan="6">Cargando...</td></tr>}
            {error && <tr><td colSpan="6">{error}</td></tr>}
            {!loading && !error && filteredClientes.length === 0 && <tr><td colSpan="6">No hay clientes registrados.</td></tr>}
            {filteredClientes.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>
                  <span
                    className={`status ${
                      item.deleted_at ? "soldout" : "completed"
                    }`}
                  >
                    {item.deleted_at ? 'Inactivo' : 'Activo'}
                  </span>
                </td>
                <td>{item.email}</td>
                <td>{item.address}</td>
                <td>
                  <button className="botton-action">Eliminar</button>
                  <button className="botton-action">Editar</button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default ClientesPage;
