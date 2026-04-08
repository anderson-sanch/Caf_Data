import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

function ClientesPage() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const Clientes = async () => {
      try{
        const res = await fetch("http://localhost:3000/clients");
        const data = await res.json();

        setClients(data)
      } catch(err){
        setError('Error al obtener clientes')
      } finally{
        setLoading(false);
      }
    }

    Clientes()
  }, [])


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
            {loading && <p>Cargando...</p>}
            {error && <p>{error}</p>}
            {clients.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>
                  <span
                    className={`status ${
                      item.deleted_at === "null" ? "soldout" : "completed"
                    }`}
                  >
                    {item.deleted_at === "null" ? 'Inactivo' : 'Activo'}
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
