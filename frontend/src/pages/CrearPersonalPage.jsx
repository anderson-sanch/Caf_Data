import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

const initialForm = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  isActive: true,
};

function CrearPersonalPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const requests = [request("/roles")];
    if (isEditing) requests.push(request(`/users/${id}`));

    Promise.all(requests)
      .then(([roleData, user]) => {
        if (!mounted) return;
        if (!Array.isArray(roleData)) throw new Error("La respuesta de roles no es válida.");
        setRoles(roleData);
        setForm((current) => ({
          ...current,
          ...(user ? {
            name: user.name || "",
            email: user.email,
            roleId: user.role?.id || "",
            isActive: user.isActive,
          } : { roleId: roleData[0]?.id || "" }),
        }));
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setError("");
    setIsSaving(true);

    try {
      if (isEditing) {
        await request(`/users/${id}`, {
          method: "PATCH",
          body: { name: form.name.trim(), roleId: form.roleId, isActive: form.isActive },
        });
      } else {
        await request("/users", {
          method: "POST",
          body: {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            roleId: form.roleId,
          },
        });
      }
      navigate("/personal", {
        replace: true,
        state: { message: isEditing ? "Usuario actualizado correctamente." : "Usuario creado correctamente." },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title={isEditing ? "Editar usuario" : "Nuevo usuario"}>
      <section className="client-form-card">
        <div className="client-form-header">
          <div>
            <p>Administración de usuarios</p>
            <h3>{isEditing ? "Editar usuario" : "Crear nuevo usuario"}</h3>
          </div>
          <button type="button" className="toolbar-chip" onClick={() => navigate("/personal")}>
            Volver
          </button>
        </div>

        {loading ? <div className="data-state">Cargando formulario...</div> : (
          <form className="client-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input type="text" name="name" value={form.name} onChange={handleChange} minLength={2} maxLength={100} required />
            </label>

            <label>
              Correo electrónico
              <input type="email" name="email" value={form.email} onChange={handleChange} disabled={isEditing} required />
            </label>

            {!isEditing && (
              <label>
                Contraseña
                <input type="password" name="password" value={form.password} onChange={handleChange} minLength={5} autoComplete="new-password" required />
              </label>
            )}

            <label>
              Rol
              <select name="roleId" value={form.roleId} onChange={handleChange} disabled={roles.length === 0} required>
                {roles.length === 0 ? <option value="">No hay roles disponibles</option> : roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </label>

            {isEditing && (
              <label className="personal-active-field">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                Usuario activo
              </label>
            )}

            {error && <p className="client-form-error client-form-full">{error}</p>}

            <div className="client-form-actions client-form-full">
              <button type="button" className="toolbar-chip" onClick={() => navigate("/personal")}>Cancelar</button>
              <button type="submit" className="toolbar-main" disabled={isSaving || !form.roleId}>
                {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar usuario"}
              </button>
            </div>
          </form>
        )}
      </section>
    </Layout>
  );
}

export default CrearPersonalPage;
