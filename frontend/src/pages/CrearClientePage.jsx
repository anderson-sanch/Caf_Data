import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  document: "",
  address: "",
  documentType: "CC",
};

const documentTypes = [
  { value: "CC", label: "Cedula de ciudadania" },
  { value: "CE", label: "Cedula de extranjeria" },
  { value: "NIT", label: "NIT" },
  { value: "PASSPORT", label: "Pasaporte" },
];

function CrearClientePage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    // limpiar error del campo mientras escribe
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (form.name && /\d/.test(form.name)) {
      newErrors.name = "El nombre no debe contener números";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (form.phone && /[^0-9]/.test(form.phone)) {
      newErrors.phone = "El teléfono solo debe contener números";
    }

    if (form.document && /[^0-9]/.test(form.document)) {
      newErrors.document = "El documento solo debe contener números";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsSaving(false);
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(form)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => value)
    );

    try {
      await request("/clients", {
        method: "POST",
        body: payload,
      });
      navigate("/clientes");
    } catch (requestError) {
      setError({ general: requestError.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="Nuevo cliente">
      <section className="client-form-card">
        <div className="client-form-header">
          <div>
            <p>Registro de cliente</p>
            <h3>Crear nuevo cliente</h3>
          </div>
          <button
            type="button"
            className="toolbar-chip"
            onClick={() => navigate("/clientes")}
          >
            Volver
          </button>
        </div>

        <form className="client-form" onSubmit={handleSubmit}>
          {/* NOMBRE */}
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Maria Gonzalez"
            />
            {error.name && (
              <p className="error-message-form">{error.name}</p>
            )}
          </label>

          {/* EMAIL */}
          <label>
            Correo electronico
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cliente@correo.com"
            />
            {error.email && (
              <p className="error-message-form">{error.email}</p>
            )}
          </label>

          {/* TELÉFONO */}
          <label>
            Telefono
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="3001234567"
            />
            {error.phone && (
              <p className="error-message-form">{error.phone}</p>
            )}
          </label>

          {/* TIPO DOCUMENTO */}
          <label>
            Tipo de documento
            <select
              name="documentType"
              value={form.documentType}
              onChange={handleChange}
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          {/* DOCUMENTO */}
          <label>
            Documento
            <input
              type="text"
              name="document"
              value={form.document}
              onChange={handleChange}
              placeholder="Numero de documento"
            />
            {error.document && (
              <p className="error-message-formm">{error.document}</p>
            )}
          </label>

          {/* DIRECCIÓN */}
          <label className="client-form-full">
            Direccion
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Direccion del cliente"
              rows={4}
            />
          </label>

          {/* ERROR GENERAL */}
          {error.general && (
            <p className="client-form-error client-form-full">
              {error.general}
            </p>
          )}

          <div className="client-form-actions client-form-full">
            <button
              type="button"
              className="toolbar-chip"
              onClick={() => navigate("/clientes")}
            >
              Cancelar
            </button>

            <button type="submit" className="toolbar-main" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cliente"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default CrearClientePage;