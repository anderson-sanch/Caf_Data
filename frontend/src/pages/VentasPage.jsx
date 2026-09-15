import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { request } from "../services/apiClient";

const paymentMethods = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
];

function VentasPage() {
  const [view, setView] = useState("sale");
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [cart, setCart] = useState([]);
  const [clientId, setClientId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInventory = async () => {
    const data = await request("/inventory");
    if (!Array.isArray(data)) throw new Error("La respuesta de inventario no es válida.");
    setInventory(data);
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([request("/clients"), request("/inventory"), request("/sales")])
      .then(([clientData, inventoryData, salesData]) => {
        if (!mounted) return;
        if (![clientData, inventoryData, salesData].every(Array.isArray)) {
          throw new Error("La respuesta del punto de venta no es válida.");
        }
        setClients(clientData);
        setInventory(inventoryData);
        setSales(salesData);
        setClientId(clientData[0]?.id || "");
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

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return inventory.filter((product) => {
      const matches = [product.name, product.category?.name].some((value) =>
        String(value ?? "").toLowerCase().includes(term),
      );
      return matches;
    });
  }, [inventory, search]);

  const total = useMemo(
    () =>
      Number(
        cart
          .reduce(
            (sum, item) => sum + item.currentPrice * item.quantity,
            0,
          )
          .toFixed(2),
      ),
    [cart],
  );

  const addToCart = (product) => {
    setError("");
    setSuccess("");
    if (product.stock <= 0) {
      setError("El producto no tiene stock disponible.");
      return;
    }
    if (product.currentPrice == null) {
      setError("El producto no tiene precio vigente.");
      return;
    }
    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === product.productId,
      );
      if (existing) {
        if (existing.quantity >= product.stock) {
          setError("La cantidad solicitada supera el stock visible.");
          return current;
        }
        return current.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId, delta) => {
    setError("");
    setCart((current) =>
      current
        .map((item) => {
          if (item.productId !== productId) return item;
          const quantity = item.quantity + delta;
          if (quantity > item.stock) {
            setError("La cantidad solicitada supera el stock visible.");
            return item;
          }
          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const confirmSale = async () => {
    if (submitting) return;
    if (!clientId) {
      setError("Selecciona un cliente.");
      return;
    }
    if (cart.length === 0) {
      setError("Agrega al menos un producto al carrito.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const sale = await request("/sales", {
        method: "POST",
        body: {
          clientId,
          paymentMethod,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      });
      setSales((current) => [sale, ...current]);
      setSelectedSale(sale);
      setCart([]);
      await loadInventory();
      setSuccess(
        `Venta ${sale.id} confirmada por ${formatMoney(sale.total)}.`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const showDetail = async (id) => {
    setLoadingDetailId(id);
    setError("");
    try {
      setSelectedSale(await request(`/sales/${id}`));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const cancelSale = async (sale) => {
    if (!window.confirm(`¿Cancelar la venta ${sale.id} y devolver su stock?`)) return;
    setCancelingId(sale.id);
    setError("");
    setSuccess("");
    try {
      const canceled = await request(`/sales/${sale.id}/cancel`, {
        method: "PATCH",
      });
      setSales((current) =>
        current.map((item) => (item.id === canceled.id ? canceled : item)),
      );
      if (selectedSale?.id === canceled.id) setSelectedSale(canceled);
      await loadInventory();
      setSuccess("Venta cancelada y stock recuperado correctamente.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCancelingId(null);
    }
  };

  const formatDate = (value) =>
    value
      ? new Intl.DateTimeFormat("es-CO", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "—";

  if (loading) {
    return <Layout title="Ventas"><div className="data-state inventory-page-state">Cargando punto de venta...</div></Layout>;
  }

  return (
    <Layout
      title="Ventas"
      showSearch={view === "sale"}
      searchPlaceholder="Buscar productos..."
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="notice-tabs inventory-tabs">
        <button type="button" className={`toolbar-chip ${view === "sale" ? "active" : ""}`} onClick={() => setView("sale")}>
          Nueva venta
        </button>
        <button type="button" className={`toolbar-chip ${view === "history" ? "active" : ""}`} onClick={() => setView("history")}>
          Historial
        </button>
      </div>

      {success && <p className="feedback-success">{success}</p>}
      {error && <p className="client-form-error page-feedback">{error}</p>}

      {view === "sale" ? (
        <section className="sales-layout">
          <section className="sales-main">
            <div className="sales-section-header">
              <h3>Productos disponibles</h3>
              <button type="button" className="toolbar-chip" disabled={cart.length === 0} onClick={() => setCart([])}>
                Limpiar carrito
              </button>
            </div>
            <div className="sales-products-grid">
              {visibleProducts.length === 0 ? (
                <div className="data-state">No hay productos para mostrar.</div>
              ) : visibleProducts.map((product) => (
                <article className="sale-product-card" key={product.productId}>
                  <span className="sale-icon" />
                  <h4>{product.name}</h4>
                  <p>{product.category?.name || "Sin categoría"}</p>
                  <strong>{formatMoney(product.currentPrice)}</strong>
                  <small>Stock: {product.stock}</small>
                  <button
                    type="button"
                    className="toolbar-main"
                    disabled={product.stock === 0 || product.currentPrice == null}
                    onClick={() => addToCart(product)}
                  >
                    Agregar
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-panel">
            <div className="cart-header">
              <h3>Carrito</h3>
              <button type="button" disabled={cart.length === 0} onClick={() => setCart([])}>Limpiar</button>
            </div>

            <div className="sale-selector">
              <label>
                Cliente
                <select value={clientId} onChange={(event) => setClientId(event.target.value)}>
                  {clients.length === 0 && <option value="">No hay clientes activos</option>}
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </label>
            </div>

            {cart.length === 0 ? (
              <div className="data-state">El carrito está vacío.</div>
            ) : cart.map((item) => (
              <div className="cart-item sale-cart-item" key={item.productId}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{formatMoney(item.currentPrice)} c/u</small>
                </div>
                <div className="quantity-controls">
                  <button type="button" onClick={() => changeQuantity(item.productId, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button type="button" disabled={item.quantity >= item.stock} onClick={() => changeQuantity(item.productId, 1)}>+</button>
                  <button type="button" className="remove-line" onClick={() => setCart((current) => current.filter((line) => line.productId !== item.productId))}>×</button>
                </div>
              </div>
            ))}

            <div className="cart-totals">
              <div className="total-row"><span>Total:</span><strong>{formatMoney(total)}</strong></div>
            </div>

            <div className="payment-methods">
              <h4>Método de pago</h4>
              {paymentMethods.map((method) => (
                <label key={method.value}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  />
                  {method.label}
                </label>
              ))}
              <button
                type="button"
                className="toolbar-main confirm-sale-button"
                disabled={submitting || cart.length === 0 || !clientId}
                onClick={confirmSale}
              >
                {submitting ? "Confirmando..." : "Confirmar venta"}
              </button>
            </div>
          </aside>
        </section>
      ) : (
        <section className="orders-card sales-history-card">
          <div className="orders-header"><h3>Historial de ventas</h3></div>
          <table className="orders-table">
            <thead>
              <tr><th>Fecha</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th>Responsable</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan={7}><div className="data-state">No hay ventas registradas.</div></td></tr>
              ) : sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{formatDate(sale.createdAt)}</td>
                  <td>{sale.client?.name || "Sin cliente"}</td>
                  <td>{formatMoney(sale.total)}</td>
                  <td>{paymentLabel(sale.paymentMethod)}</td>
                  <td><span className={`status ${sale.status === "canceled" ? "soldout" : "completed"}`}>{sale.status}</span></td>
                  <td>{sale.user?.name || sale.user?.email || "—"}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="toolbar-chip" disabled={loadingDetailId === sale.id} onClick={() => showDetail(sale.id)}>
                        {loadingDetailId === sale.id ? "Cargando..." : "Ver detalle"}
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        disabled={sale.status === "canceled" || cancelingId === sale.id}
                        onClick={() => cancelSale(sale)}
                      >
                        {cancelingId === sale.id ? "Cancelando..." : "Cancelar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {selectedSale && (
        <section className="client-form-card sale-detail">
          <div className="client-form-header">
            <div><p>Venta {selectedSale.id}</p><h3>Detalle de venta</h3></div>
            <button type="button" className="toolbar-chip" onClick={() => setSelectedSale(null)}>Cerrar</button>
          </div>
          <div className="sale-detail-summary">
            <span><strong>Cliente:</strong> {selectedSale.client?.name || "—"}</span>
            <span><strong>Fecha:</strong> {formatDate(selectedSale.createdAt)}</span>
            <span><strong>Responsable:</strong> {selectedSale.user?.name || selectedSale.user?.email || "—"}</span>
            <span><strong>Estado:</strong> {selectedSale.status}</span>
            <span><strong>Pago:</strong> {paymentLabel(selectedSale.paymentMethod)}</span>
          </div>
          <table className="orders-table">
            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio histórico</th><th>Subtotal</th></tr></thead>
            <tbody>
              {selectedSale.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.unitPrice)}</td>
                  <td>{formatMoney(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sale-detail-total">Total: {formatMoney(selectedSale.total)}</div>
        </section>
      )}
    </Layout>
  );
}

function formatMoney(value) {
  if (value == null) return "Sin precio";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function paymentLabel(value) {
  return paymentMethods.find((method) => method.value === value)?.label || value || "—";
}

export default VentasPage;
