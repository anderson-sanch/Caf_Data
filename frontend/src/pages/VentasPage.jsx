import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

function VentasPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  const [clientId, setClientId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([request("/inventory/stock"), request("/clients")])
      .then(([inventory, clientList]) => {
        setProducts(Array.isArray(inventory) ? inventory : []);
        setClients(Array.isArray(clientList) ? clientList : []);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => !term || product.name?.toLowerCase().includes(term));
  }, [products, search]);

  const addProduct = (product) => {
    if (product.stock <= 0) return;
    const price = Number(product.product_prices?.[0]?.price || 0);
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return currentCart;
        return currentCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { id: product.id, name: product.name, price, quantity: 1, stock: product.stock }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((currentCart) => currentCart
      .map((item) => item.id === id ? { ...item, quantity: Math.max(0, Math.min(item.stock, item.quantity + change)) } : item)
      .filter((item) => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const createSale = async () => {
    if (!cart.length) {
      setError("Agrega al menos un producto al carrito.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await request("/sales", {
        method: "POST",
        body: {
          ...(clientId ? { clientId } : {}),
          paymentMethod,
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        },
      });
      setCart([]);
      setMessage("Venta registrada correctamente.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Punto de venta" showMenu showSearch searchPlaceholder="Buscar productos..." searchValue={search} onSearchChange={setSearch}>
      <section className="sales-layout">
        <section className="sales-main">
          <div className="sales-section-header">
            <h3>Productos disponibles</h3>
            <div className="sales-actions"><button type="button" className="toolbar-chip" onClick={() => setCart([])}>Limpiar</button></div>
          </div>
          {error && <p className="client-form-error">{error}</p>}
          {message && <p className="up">{message}</p>}
          <div className="sales-products-grid">
            {filteredProducts.map((product) => {
              const price = Number(product.product_prices?.[0]?.price || 0);
              return (
                <button type="button" className="sale-product-card" key={product.id} disabled={product.stock <= 0} onClick={() => addProduct(product)}>
                  <span className="sale-icon" />
                  <h4>{product.name}</h4>
                  <p>${price.toLocaleString("es-CO")}</p>
                  <small>{product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}</small>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="cart-panel">
          <div className="cart-header"><h3>Carrito de compras</h3><button type="button" onClick={() => setCart([])}>Limpiar</button></div>
          <label>Cliente
            <select value={clientId} onChange={(event) => setClientId(event.target.value)}>
              <option value="">Venta sin cliente</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
          </label>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <p>{item.name}</p>
              <div><button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button><span> {item.quantity} </span><button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button><strong> ${Number(item.price * item.quantity).toLocaleString("es-CO")}</strong></div>
            </div>
          ))}
          {!cart.length && <p>No hay productos en el carrito.</p>}
          <div className="cart-totals"><div className="total-row"><span>Total:</span><strong>${total.toLocaleString("es-CO")}</strong></div></div>
          <div className="payment-methods">
            <h4>Método de pago</h4>
            {[['cash', 'Efectivo'], ['card', 'Tarjeta'], ['transfer', 'Transferencia']].map(([value, label]) => (
              <label key={value}><input type="radio" name="pay" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />{label}</label>
            ))}
          </div>
          <button type="button" className="toolbar-main" disabled={saving || !cart.length} onClick={createSale}>{saving ? "Registrando..." : "Confirmar venta"}</button>
        </aside>
      </section>
    </Layout>
  );
}

export default VentasPage;
