import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

function ClientesPage() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    request("/clients")
      .then((data) => {
        if (!mounted) return;
        if (!Array.isArray(data)) {
          throw new Error("La respuesta de clientes no es válida.");
        }
        setClients(data);
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((client) =>
      [client.name, client.email, client.document, client.phone].some((value) =>
        String(value ?? "").toLowerCase().includes(term),
      ),
    );
  }, [clients, search]);

  const handleDelete = async (client) => {
    if (!window.confirm(`¿Eliminar lógicamente a ${client.name}?`)) return;
    setDeletingId(client.id);
    setError("");
    setSuccess("");
    try {
      await request(`/clients/${client.id}`, { method: "DELETE" });
      setClients((current) => current.filter((item) => item.id !== client.id));
      setSuccess("Cliente eliminado correctamente.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout title="Clientes">
      <section className="inventory-toolbar">
        <input
          type="search"
          placeholder="Buscar por nombre, correo, documento o teléfono..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="toolbar-right">
          <button type="button" className="toolbar-main" onClick={() => navigate("/clientes/nuevo")}>
            + Nuevo cliente
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid compact-kpi-grid">
        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Total clientes activos</p>
            <h3>{clients.length}</h3>
          </div>
        </article>
      </section>

      {success && <p className="feedback-success">{success}</p>}
      {error && <p className="client-form-error page-feedback">{error}</p>}

      <section className="orders-card">
        <div className="orders-header">
          <h3>Lista de clientes</h3>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6}><div className="data-state">Cargando clientes...</div></td></tr>
            )}
            {!loading && !error && filteredClients.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="data-state">
                    {clients.length === 0 ? "Aún no hay clientes registrados." : "No hay coincidencias."}
                  </div>
                </td>
              </tr>
            )}
            {!loading && filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email || "—"}</td>
                <td>{client.phone || "—"}</td>
                <td>
                  {client.document
                    ? `${client.document_type ?? ""} ${client.document}`.trim()
                    : "—"}
                </td>
                <td>{client.address || "—"}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="toolbar-chip"
                      onClick={() => navigate(`/clientes/${client.id}/editar`)}
                    >
                      Ver / editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      disabled={deletingId === client.id}
                      onClick={() => handleDelete(client)}
                    >
                      {deletingId === client.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
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
