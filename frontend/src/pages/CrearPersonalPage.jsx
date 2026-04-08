import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

const initialForm = {
  name: "",
  email: "",
  password: "",
  roleId: "",
};

function CrearPersonalPage() {
  const [form, setForm] = useState(initialForm);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadRoles() {
      try {
        const data = await request("/roles");
        if (!mounted) return;

        setRoles(Array.isArray(data) ? data : []);
        setForm((currentForm) => ({
          ...currentForm,
          roleId: currentForm.roleId || data?.[0]?.id || "",
        }));
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message);
        }
      } finally {
        if (mounted) {
          setRolesLoading(false);
        }
      }
    }

    loadRoles();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await request("/users", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          roleId: form.roleId,
        },
      });
      navigate("/personal");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="Nuevo usuario">
      <section className="client-form-card">
        <div className="client-form-header">
          <div>
            <p>Registro de personal</p>
            <h3>Crear nuevo usuario</h3>
          </div>
          <button
            type="button"
            className="toolbar-chip"
            onClick={() => navigate("/personal")}
          >
            Volver
          </button>
        </div>

        <form className="client-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Laura Gomez"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            Correo electronico
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@correo.com"
              required
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimo 5 caracteres"
              minLength={5}
              required
            />
          </label>

          <label>
            Rol
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              disabled={rolesLoading || roles.length === 0}
              required
            >
              {roles.length === 0 ? (
                <option value="">
                  {rolesLoading ? "Cargando roles..." : "No hay roles disponibles"}
                </option>
              ) : (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))
              )}
            </select>
          </label>

          {error && <p className="client-form-error client-form-full">{error}</p>}

          <div className="client-form-actions client-form-full">
            <button
              type="button"
              className="toolbar-chip"
              onClick={() => navigate("/personal")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="toolbar-main"
              disabled={isSaving || rolesLoading || !form.roleId}
            >
              {isSaving ? "Guardando..." : "Guardar usuario"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default CrearPersonalPage;
