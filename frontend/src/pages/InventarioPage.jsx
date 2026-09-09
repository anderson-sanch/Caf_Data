import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { CardkpiData } from "../components/ui/Cards/CardkpiData";
import { request } from "../services/apiClient";
import { useNavigate } from "react-router-dom";

function InventarioPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    request("/inventory/stock")
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProductos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.categories?.name?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const lowStock = products.filter((product) => product.stock <= 5).length;
  const inventoryValue = products.reduce(
    (total, product) => total + Number(product.product_prices?.[0]?.price || 0) * product.stock,
    0,
  );

  return (
    <Layout title="Inventario">
      <section className="inventory-toolbar">
        <input
          type="text"
          placeholder="Buscar productos, categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="toolbar-right">
          <button type="button" className="toolbar-chip">
            Categoría
          </button>
          <button type="button" className="toolbar-chip">
            Exportar
          </button>
          <button type="button" className="toolbar-main" onClick={() => navigate("/inventario/nuevo")}>
            Agregar productos
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid">

        <CardkpiData title={"Total productos"} data={products.length} className={"kpi-card inventory-kpi-card"} />
        <CardkpiData title={"Stock bajo"} data={lowStock} className={"kpi-card inventory-kpi-card"} message={`${lowStock} productos con stock bajo`} smallClassName={"down"}/>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Valor inventario</p>
            <h3>${inventoryValue.toLocaleString("es-CO")}</h3>
          </div>
        </article>
      </section>

      <section className="orders-card">
        <div className="orders-header">
          <h3>Lista de productos</h3>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="6">Cargando inventario...</td></tr>}
            {error && <tr><td colSpan="6">{error}</td></tr>}
            {!loading && !error && filteredProductos.length === 0 && <tr><td colSpan="6">No hay productos registrados.</td></tr>}
            {filteredProductos.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.categories?.name || "Sin categoría"}</td>
                <td>{item.stock}</td>
                <td>${Number(item.product_prices?.[0]?.price || 0).toLocaleString("es-CO")}</td>
                <td>
                  <span
                    className={`status ${
                      item.stock <= 0 ? "soldout" : "completed"
                    }`}
                  >
                    {item.stock <= 0 ? "Agotado" : "Disponible"}
                  </span>
                </td>
                <td>Ver detalles</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default InventarioPage;
