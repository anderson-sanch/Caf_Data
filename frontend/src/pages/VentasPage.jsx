import { useState } from "react";
import Layout from "../components/layout/Layout";

function VentasPage() {
  const [search, setSearch] = useState("");

  return (
    <Layout
      title=""
      showMenu={true}
      showSearch={true}
      searchPlaceholder="Buscar productos, clientes..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <section className="sales-layout">
        <section className="sales-main">
          <div className="sales-section-header">
            <h3>Punto de venta</h3>

            <div className="sales-actions">
              <button type="button" className="toolbar-chip">
                Limpiar
              </button>

              <button type="button" className="toolbar-main">
                + Crear venta
              </button>
            </div>
          </div>

          <div className="sales-products-grid">
            <article className="sale-product-card">
              <span className="sale-icon" />
              <h4>Americano</h4>
              <p>$5.000</p>
            </article>

            <article className="sale-product-card">
              <span className="sale-icon" />
              <h4>Capuccino</h4>
              <p>$6.500</p>
            </article>

            <article className="sale-product-card">
              <span className="sale-icon" />
              <h4>Postre</h4>
              <p>$10.000</p>
            </article>
          </div>
        </section>

        <aside className="cart-panel">
          <div className="cart-header">
            <h3>Carrito de compras</h3>
            <button type="button">Limpiar</button>
          </div>

          <div className="cart-item">
            <p>Café Americano</p>
            <span>$5.000</span>
          </div>

          <div className="cart-totals">
            <div>
              <span>Subtotal:</span>
              <strong>$50.000</strong>
            </div>

            <div>
              <span>IVA (19%):</span>
              <strong>$9.500</strong>
            </div>

            <div className="total-row">
              <span>Total:</span>
              <strong>$59.500</strong>
            </div>
          </div>

          <div className="payment-methods">
            <h4>Método de pago</h4>

            <label>
              <input type="radio" name="pay" defaultChecked />
              Efectivo
            </label>

            <label>
              <input type="radio" name="pay" />
              Tarjeta
            </label>

            <label>
              <input type="radio" name="pay" />
              Transferencia
            </label>
          </div>
        </aside>
      </section>
    </Layout>
  );
}

export default VentasPage;