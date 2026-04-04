import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";

function InventarioPage() {
  const [search, setSearch] = useState("");

  const productos = [
    {
      producto: "Café",
      categoria: "kg",
      stock: 15,
      precio: "$20.000",
      estado: "Disponible",
    },
    {
      producto: "Azúcar",
      categoria: "kg",
      stock: 10,
      precio: "$40.000",
      estado: "Disponible",
    },
    {
      producto: "Leche",
      categoria: "ML",
      stock: 0,
      precio: "$15.000",
      estado: "Agotado",
    },
  ];

  const filteredProductos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return productos;

    return productos.filter(
      (item) =>
        item.producto.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term)
    );
  }, [search]);

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
          <button type="button" className="toolbar-main">
            Agregar productos
          </button>
        </div>
      </section>

      <section className="inventory-kpi-grid">
        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Total productos</p>
            <h3>95</h3>
            <small className="up">+4.8%</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Stock bajo</p>
            <h3>3</h3>
            <small className="down">3 productos críticos</small>
          </div>
        </article>

        <article className="kpi-card inventory-kpi-card">
          <div>
            <p>Valor inventario</p>
            <h3>$173.000</h3>
            <small className="up">+11.2%</small>
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
            {filteredProductos.map((item) => (
              <tr key={item.producto}>
                <td>{item.producto}</td>
                <td>{item.categoria}</td>
                <td>{item.stock}</td>
                <td>{item.precio}</td>
                <td>
                  <span
                    className={`status ${
                      item.estado === "Agotado" ? "soldout" : "completed"
                    }`}
                  >
                    {item.estado}
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