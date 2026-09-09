import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

const initialForm = { name: "", description: "", categoryId: "", price: "", initialStock: "" };

function CrearProductoPage() {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const loadCategories = () => request("/products/category")
    .then((data) => setCategories(Array.isArray(data) ? data : []))
    .catch((requestError) => setError(requestError.message));

  useEffect(() => { loadCategories(); }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setError("");
    try {
      const category = await request("/products/category", { method: "POST", body: { name: newCategory.trim() } });
      setCategories((currentCategories) => [...currentCategories, category].sort((a, b) => a.name.localeCompare(b.name)));
      setForm((currentForm) => ({ ...currentForm, categoryId: category.id }));
      setNewCategory("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await request("/products", {
        method: "POST",
        body: {
          name: form.name.trim(),
          ...(form.description.trim() ? { description: form.description.trim() } : {}),
          ...(form.categoryId ? { categoryId: form.categoryId } : {}),
          price: Number(form.price),
          ...(Number(form.initialStock) > 0 ? { initialStock: Number(form.initialStock) } : {}),
        },
      });
      navigate("/inventario");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Nuevo producto">
      <section className="client-form-card">
        <div className="client-form-header"><div><p>Inventario</p><h3>Crear producto</h3></div><button type="button" className="toolbar-chip" onClick={() => navigate("/inventario")}>Volver</button></div>
        <form className="client-form" onSubmit={submit}>
          <label>Nombre<input required name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Precio<input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
          <label>Categoría<select name="categoryId" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>Stock inicial<input min="0" step="1" type="number" name="initialStock" value={form.initialStock} onChange={(event) => setForm({ ...form, initialStock: event.target.value })} /></label>
          <label className="client-form-full">Descripción<textarea name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} /></label>
          <div className="client-form-full"><label>Nueva categoría<input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} /></label><button type="button" className="toolbar-chip" onClick={addCategory}>Agregar categoría</button></div>
          {error && <p className="client-form-error client-form-full">{error}</p>}
          <div className="client-form-actions client-form-full"><button type="button" className="toolbar-chip" onClick={() => navigate("/inventario")}>Cancelar</button><button type="submit" className="toolbar-main" disabled={saving}>{saving ? "Guardando..." : "Guardar producto"}</button></div>
        </form>
      </section>
    </Layout>
  );
}

export default CrearProductoPage;
