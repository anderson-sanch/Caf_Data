import { useEffect, useMemo, useState } from "react";
import { request } from "../../services/apiClient";

const emptyEntry = { productId: "", quantity: "", reason: "" };

export default function InventoryOperations({ view }) {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [entry, setEntry] = useState(emptyEntry);
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([request("/inventory"), request("/inventory/movements")])
      .then(([stockData, movementData]) => {
        if (!mounted) return;
        if (!Array.isArray(stockData) || !Array.isArray(movementData)) {
          throw new Error("La respuesta de inventario no es válida.");
        }
        setInventory(stockData);
        setMovements(movementData);
        setEntry((current) => ({
          ...current,
          productId: current.productId || stockData[0]?.productId || "",
        }));
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

  const filteredInventory = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return inventory;
    return inventory.filter((item) =>
      [item.name, item.category?.name].some((value) =>
        String(value ?? "").toLowerCase().includes(term),
      ),
    );
  }, [inventory, search]);

  const filteredMovements = useMemo(
    () =>
      productFilter
        ? movements.filter(
            (movement) => movement.product.id === productFilter,
          )
        : movements,
    [movements, productFilter],
  );

  const handleEntrySubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const quantity = Number(entry.quantity);
    if (
      !entry.productId ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      entry.reason.trim().length < 3
    ) {
      setError("Selecciona un producto, una cantidad entera positiva y un motivo.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const movement = await request("/inventory/entries", {
        method: "POST",
        body: {
          productId: entry.productId,
          quantity,
          reason: entry.reason.trim(),
        },
      });
      setInventory((current) =>
        current.map((item) =>
          item.productId === entry.productId
            ? { ...item, stock: item.stock + quantity }
            : item,
        ),
      );
      setMovements((current) => [movement, ...current]);
      setEntry((current) => ({ ...current, quantity: "", reason: "" }));
      setSuccess("Entrada registrada correctamente.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
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

  const formatDate = (value) =>
    value ? new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value)) : "—";

  if (loading) {
    return <div className="data-state inventory-page-state">Cargando inventario...</div>;
  }

  if (view === "stock") {
    const totalUnits = inventory.reduce((total, item) => total + item.stock, 0);
    const zeroStock = inventory.filter((item) => item.stock === 0).length;
    return (
      <>
        <section className="inventory-kpi-grid compact-kpi-grid">
          <article className="kpi-card inventory-kpi-card">
            <div><p>Unidades disponibles</p><h3>{totalUnits}</h3></div>
          </article>
          <article className="kpi-card inventory-kpi-card">
            <div><p>Productos con stock 0</p><h3>{zeroStock}</h3></div>
          </article>
        </section>

        <section className="client-form-card">
          <div className="client-form-header">
            <div><p>Movimiento IN</p><h3>Registrar entrada de mercancía</h3></div>
          </div>
          <form className="client-form" onSubmit={handleEntrySubmit}>
            <label>
              Producto
              <select
                value={entry.productId}
                onChange={(event) => setEntry((current) => ({ ...current, productId: event.target.value }))}
                required
              >
                {inventory.length === 0 && <option value="">No hay productos activos</option>}
                {inventory.map((item) => (
                  <option key={item.productId} value={item.productId}>
                    {item.name} — stock {item.stock}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cantidad
              <input
                type="number"
                min="1"
                step="1"
                value={entry.quantity}
                onChange={(event) => setEntry((current) => ({ ...current, quantity: event.target.value }))}
                required
              />
            </label>
            <label className="client-form-full">
              Motivo
              <textarea
                value={entry.reason}
                onChange={(event) => setEntry((current) => ({ ...current, reason: event.target.value }))}
                minLength={3}
                maxLength={250}
                rows={3}
                required
              />
            </label>
            <div className="client-form-actions client-form-full">
              <button
                type="submit"
                className="toolbar-main"
                disabled={saving || inventory.length === 0}
              >
                {saving ? "Registrando..." : "Registrar entrada"}
              </button>
            </div>
          </form>
        </section>

        {success && <p className="feedback-success">{success}</p>}
        {error && <p className="client-form-error page-feedback">{error}</p>}

        <section className="inventory-toolbar">
          <input
            type="search"
            placeholder="Buscar producto o categoría..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>
        <section className="orders-card">
          <div className="orders-header"><h3>Stock por producto</h3></div>
          <table className="orders-table">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Precio vigente</th><th>Stock</th></tr></thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr><td colSpan={4}><div className="data-state">No hay productos para mostrar.</div></td></tr>
              ) : filteredInventory.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.category?.name || "Sin categoría"}</td>
                  <td>{formatPrice(item.currentPrice)}</td>
                  <td><strong>{item.stock}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="inventory-toolbar">
        <select
          className="catalog-filter"
          value={productFilter}
          onChange={(event) => setProductFilter(event.target.value)}
        >
          <option value="">Todos los productos</option>
          {inventory.map((item) => (
            <option key={item.productId} value={item.productId}>{item.name}</option>
          ))}
        </select>
      </section>
      {error && <p className="client-form-error page-feedback">{error}</p>}
      <section className="orders-card">
        <div className="orders-header"><h3>Historial de movimientos</h3></div>
        <table className="orders-table">
          <thead>
            <tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th><th>Responsable</th></tr>
          </thead>
          <tbody>
            {filteredMovements.length === 0 ? (
              <tr><td colSpan={6}><div className="data-state">No hay movimientos registrados.</div></td></tr>
            ) : filteredMovements.map((movement) => (
              <tr key={movement.id}>
                <td>{formatDate(movement.createdAt)}</td>
                <td>{movement.product.name}</td>
                <td><span className={`movement-type ${movement.type.toLowerCase()}`}>{movement.type}</span></td>
                <td>{movement.quantity}</td>
                <td>{movement.reason || "—"}</td>
                <td>{movement.responsible?.name || movement.responsible?.email || "Sistema"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
