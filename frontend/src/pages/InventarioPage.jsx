import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";
import InventoryOperations from "../components/inventory/InventoryOperations";

const emptyProduct = {
  name: "",
  description: "",
  categoryId: "",
  price: "",
};

function InventarioPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [activeView, setActiveView] = useState("catalog");

  useEffect(() => {
    let mounted = true;
    Promise.all([request("/products"), request("/products/category")])
      .then(([productData, categoryData]) => {
        if (!mounted) return;
        if (!Array.isArray(productData) || !Array.isArray(categoryData)) {
          throw new Error("La respuesta del catálogo no es válida.");
        }
        setProducts(productData);
        setCategories(categoryData);
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

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      [product.name, product.category?.name, product.description].some((value) =>
        String(value ?? "").toLowerCase().includes(term),
      ),
    );
  }, [products, search]);

  const openCreateProduct = () => {
    setEditingId(null);
    setProductForm(emptyProduct);
    setError("");
    setSuccess("");
    setShowProductForm(true);
  };

  const openEditProduct = async (id) => {
    setLoadingProductId(id);
    setError("");
    try {
      const product = await request(`/products/${id}`);
      setEditingId(id);
      setProductForm({
        name: product.name ?? "",
        description: product.description ?? "",
        categoryId: product.categoryId ?? "",
        price: product.currentPrice ?? "",
      });
      setShowProductForm(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    if (savingProduct) return;
    const price = Number(productForm.price);
    if (!productForm.name.trim() || (!editingId && (!Number.isFinite(price) || price <= 0))) {
      setError("Ingresa un nombre y un precio mayor que cero.");
      return;
    }

    setSavingProduct(true);
    setError("");
    setSuccess("");
    const payload = {
      name: productForm.name.trim(),
      ...(!editingId && !productForm.description.trim()
        ? {}
        : { description: productForm.description.trim() }),
      ...(!editingId && !productForm.categoryId
        ? {}
        : { categoryId: productForm.categoryId || null }),
      ...(productForm.price !== "" ? { price } : {}),
    };

    try {
      const saved = await request(editingId ? `/products/${editingId}` : "/products", {
        method: editingId ? "PATCH" : "POST",
        body: payload,
      });
      setProducts((current) =>
        editingId
          ? current.map((product) => (product.id === saved.id ? saved : product))
          : [saved, ...current],
      );
      setSuccess(editingId ? "Producto actualizado correctamente." : "Producto creado correctamente.");
      setShowProductForm(false);
      setEditingId(null);
      setProductForm(emptyProduct);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    if (savingCategory || !categoryName.trim()) return;
    setSavingCategory(true);
    setError("");
    setSuccess("");
    try {
      const category = await request("/products/category", {
        method: "POST",
        body: { name: categoryName.trim() },
      });
      setCategories((current) =>
        [...current, category].sort((first, second) =>
          first.name.localeCompare(second.name),
        ),
      );
      setProductForm((current) => ({ ...current, categoryId: category.id }));
      setCategoryName("");
      setShowCategoryForm(false);
      setSuccess("Categoría creada correctamente.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar lógicamente el producto ${product.name}?`)) return;
    setDeletingId(product.id);
    setError("");
    setSuccess("");
    try {
      await request(`/products/${product.id}`, { method: "DELETE" });
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setSuccess("Producto eliminado correctamente.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) =>
    price == null
      ? "Sin precio"
      : new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(price);

  return (
    <Layout title="Inventario">
      <div className="notice-tabs inventory-tabs">
        <button
          type="button"
          className={`toolbar-chip ${activeView === "catalog" ? "active" : ""}`}
          onClick={() => setActiveView("catalog")}
        >
          Catálogo
        </button>
        <button
          type="button"
          className={`toolbar-chip ${activeView === "stock" ? "active" : ""}`}
          onClick={() => setActiveView("stock")}
        >
          Stock y entradas
        </button>
        <button
          type="button"
          className={`toolbar-chip ${activeView === "history" ? "active" : ""}`}
          onClick={() => setActiveView("history")}
        >
          Historial
        </button>
      </div>

      {activeView === "catalog" ? (
        <>
      <section className="inventory-toolbar">
        <input
          type="search"
          placeholder="Buscar producto o categoría..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="toolbar-right">
          <button type="button" className="toolbar-chip" onClick={() => setShowCategoryForm((visible) => !visible)}>
            + Categoría
          </button>
          <button type="button" className="toolbar-main" onClick={openCreateProduct}>
            + Agregar producto
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid compact-kpi-grid">
        <article className="kpi-card inventory-kpi-card">
          <div><p>Productos activos</p><h3>{products.length}</h3></div>
        </article>
        <article className="kpi-card inventory-kpi-card">
          <div><p>Categorías</p><h3>{categories.length}</h3></div>
        </article>
      </section>

      {showCategoryForm && (
        <section className="client-form-card compact-form-card">
          <form className="inline-form" onSubmit={handleCategorySubmit}>
            <label>
              Nueva categoría
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
            </label>
            <button className="toolbar-main" type="submit" disabled={savingCategory}>
              {savingCategory ? "Guardando..." : "Crear categoría"}
            </button>
          </form>
        </section>
      )}

      {showProductForm && (
        <section className="client-form-card">
          <div className="client-form-header">
            <div>
              <p>Catálogo</p>
              <h3>{editingId ? "Editar producto" : "Nuevo producto"}</h3>
            </div>
            <button type="button" className="toolbar-chip" onClick={() => setShowProductForm(false)}>
              Cerrar
            </button>
          </div>
          <form className="client-form" onSubmit={handleProductSubmit}>
            <label>
              Nombre
              <input
                value={productForm.name}
                onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                minLength={2}
                maxLength={150}
                required
              />
            </label>
            <label>
              Categoría
              <select
                value={productForm.categoryId}
                onChange={(event) => setProductForm((current) => ({ ...current, categoryId: event.target.value }))}
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Precio vigente
              <input
                type="number"
                value={productForm.price}
                onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
                min="0.01"
                step="0.01"
                required
              />
            </label>
            <label className="client-form-full">
              Descripción
              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                maxLength={1000}
                rows={3}
              />
            </label>
            <div className="client-form-actions client-form-full">
              <button type="button" className="toolbar-chip" onClick={() => setShowProductForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="toolbar-main" disabled={savingProduct}>
                {savingProduct ? "Guardando..." : "Guardar producto"}
              </button>
            </div>
          </form>
        </section>
      )}

      {success && <p className="feedback-success">{success}</p>}
      {error && <p className="client-form-error page-feedback">{error}</p>}

      <section className="orders-card">
        <div className="orders-header"><h3>Lista de productos</h3></div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio vigente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5}><div className="data-state">Cargando productos...</div></td></tr>
            )}
            {!loading && !error && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="data-state">
                    {products.length === 0 ? "Aún no hay productos registrados." : "No hay coincidencias."}
                  </div>
                </td>
              </tr>
            )}
            {!loading && filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  {product.description && <small className="table-secondary">{product.description}</small>}
                </td>
                <td>{product.category?.name || "Sin categoría"}</td>
                <td>{formatPrice(product.currentPrice)}</td>
                <td><span className="status completed">Activo</span></td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="toolbar-chip"
                      disabled={loadingProductId === product.id}
                      onClick={() => openEditProduct(product.id)}
                    >
                      {loadingProductId === product.id ? "Cargando..." : "Ver / editar"}
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product)}
                    >
                      {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
        </>
      ) : (
        <InventoryOperations view={activeView} />
      )}
    </Layout>
  );
}

export default InventarioPage;
