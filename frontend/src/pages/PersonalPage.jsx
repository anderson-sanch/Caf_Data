import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";
import { getStoredSession } from "../services/session";

function PersonalPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = getStoredSession()?.user?.id;

  useEffect(() => {
    let mounted = true;
    request("/users")
      .then((data) => {
        if (!mounted) return;
        if (!Array.isArray(data)) throw new Error("La respuesta de usuarios no es válida.");
        setUsers(data);
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) =>
      [user.name, user.email, user.role?.name].some((value) =>
        String(value ?? "").toLowerCase().includes(term),
      ),
    );
  }, [search, users]);

  const toggleActive = async (user) => {
    const action = user.isActive ? "desactivar" : "reactivar";
    if (user.isActive && !window.confirm(`¿Deseas desactivar a ${user.name || user.email}?`)) return;

    setChangingId(user.id);
    setError("");
    setSuccess("");
    try {
      const updated = await request(`/users/${user.id}`, {
        method: "PATCH",
        body: { isActive: !user.isActive },
      });
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSuccess(`Usuario ${action === "desactivar" ? "desactivado" : "reactivado"} correctamente.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setChangingId(null);
    }
  };

  return (
    <Layout title="Personal">
      <section className="inventory-toolbar personal-toolbar">
        <input
          type="search"
          placeholder="Buscar por nombre, email o rol..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="button" className="toolbar-main" onClick={() => navigate("/personal/nuevo")}>
          + Nuevo usuario
        </button>
      </section>

      {success && <p className="feedback-success">{success}</p>}
      {error && <p className="client-form-error page-feedback">{error}</p>}

      <section className="orders-card personal-users-card">
        <div className="orders-header">
          <h3>Usuarios</h3>
          {!loading && <span>{visibleUsers.length} registrados</span>}
        </div>
        {loading ? (
          <div className="data-state">Cargando usuarios...</div>
        ) : visibleUsers.length === 0 ? (
          <div className="data-state">No hay usuarios para mostrar.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Creado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || "Sin nombre"}</td>
                  <td>{user.email}</td>
                  <td>{user.role?.name || "Sin rol"}</td>
                  <td>
                    <span className={`status ${user.isActive ? "completed" : "soldout"}`}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="toolbar-chip" onClick={() => navigate(`/personal/${user.id}/editar`)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className={user.isActive ? "danger-button" : "toolbar-chip"}
                        disabled={changingId === user.id || (user.id === currentUserId && user.isActive)}
                        title={user.id === currentUserId && user.isActive ? "No puedes desactivar tu propia cuenta" : ""}
                        onClick={() => toggleActive(user)}
                      >
                        {changingId === user.id ? "Guardando..." : user.isActive ? "Desactivar" : "Reactivar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </Layout>
  );
}

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(value))
    : "—";
}

export default PersonalPage;
