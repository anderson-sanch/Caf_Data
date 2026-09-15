import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PASSPORT", label: "Pasaporte" },
];

function CrearClientePage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditing) return;
    let mounted = true;

    request(`/clients/${id}`)
      .then((client) => {
        if (!mounted) return;
        setForm({
          name: client.name ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          document: client.document ?? "",
          address: client.address ?? "",
          documentType: client.document_type ?? "CC",
        });
      })
      .catch((requestError) => {
        if (mounted) setError({ general: requestError.message });
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError((current) => ({ ...current, [name]: "", general: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const name = form.name.trim();
    const phone = form.phone.trim();
    const document = form.document.trim();

    if (name.length < 2 || name.length > 100) {
      errors.name = "El nombre debe tener entre 2 y 100 caracteres.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Correo electrónico inválido.";
    }
    if (phone && (phone.length < 5 || phone.length > 20)) {
      errors.phone = "El teléfono debe tener entre 5 y 20 caracteres.";
    }
    if (document && (document.length < 5 || document.length > 50)) {
      errors.document = "El documento debe tener entre 5 y 50 caracteres.";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setError(validationErrors);
      return;
    }

    setIsSaving(true);
    setError({});
    const document = form.document.trim();
    const payload = isEditing
      ? {
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          document: document || null,
          documentType: document ? form.documentType : null,
        }
      : {
          name: form.name.trim(),
          ...(form.email.trim() ? { email: form.email.trim() } : {}),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          ...(form.address.trim() ? { address: form.address.trim() } : {}),
          ...(document ? { document, documentType: form.documentType } : {}),
        };

    try {
      await request(isEditing ? `/clients/${id}` : "/clients", {
        method: isEditing ? "PATCH" : "POST",
        body: payload,
      });
      navigate("/clientes", {
        replace: true,
        state: {
          message: isEditing
            ? "Cliente actualizado correctamente."
            : "Cliente creado correctamente.",
        },
      });
    } catch (requestError) {
      setError({ general: requestError.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title={isEditing ? "Editar cliente" : "Nuevo cliente"}>
      <section className="client-form-card">
        <div className="client-form-header">
          <div>
            <p>{isEditing ? "Detalle del cliente" : "Registro de cliente"}</p>
            <h3>{isEditing ? "Editar cliente" : "Crear nuevo cliente"}</h3>
          </div>
          <button type="button" className="toolbar-chip" onClick={() => navigate("/clientes")}>
            Volver
          </button>
        </div>

        {isLoading ? (
          <div className="data-state">Cargando cliente...</div>
        ) : (
          <form className="client-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input name="name" value={form.name} onChange={handleChange} minLength={2} maxLength={100} required />
              {error.name && <span className="field-error">{error.name}</span>}
            </label>
            <label>
              Correo electrónico
              <input type="email" name="email" value={form.email} onChange={handleChange} />
              {error.email && <span className="field-error">{error.email}</span>}
            </label>
            <label>
              Teléfono
              <input name="phone" value={form.phone} onChange={handleChange} minLength={5} maxLength={20} />
              {error.phone && <span className="field-error">{error.phone}</span>}
            </label>
            <label>
              Tipo de documento
              <select name="documentType" value={form.documentType} onChange={handleChange}>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
            <label>
              Documento
              <input name="document" value={form.document} onChange={handleChange} minLength={5} maxLength={50} />
              {error.document && <span className="field-error">{error.document}</span>}
            </label>
            <label className="client-form-full">
              Dirección
              <textarea name="address" value={form.address} onChange={handleChange} rows={4} />
            </label>

            {error.general && (
              <p className="client-form-error client-form-full">{error.general}</p>
            )}
            <div className="client-form-actions client-form-full">
              <button type="button" className="toolbar-chip" onClick={() => navigate("/clientes")}>
                Cancelar
              </button>
              <button type="submit" className="toolbar-main" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar cliente"}
              </button>
            </div>
          </form>
        )}
      </section>
    </Layout>
  );
}

export default CrearClientePage;
