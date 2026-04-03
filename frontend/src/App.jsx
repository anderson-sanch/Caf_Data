import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  FaBell,
  FaCalendarAlt,
  FaCalendarCheck,
  FaChevronDown,
  FaCog,
  FaDollarSign,
  FaExclamationTriangle,
  FaFileAlt,
  FaRegClock,
  FaRegUserCircle,
  FaTag,
} from "react-icons/fa";
import logo from "./imagenes/Logo.png";
import loginImage from "./imagenes/imagen_Login.png";
import DataState from "./components/ui/DataState";
import { ROUTES } from "./constants/routes";
import {
  CLIENTES_ITEMS,
  DASHBOARD_ORDERS,
  INVENTARIO_ITEMS,
  REPORTES_ITEMS,
} from "./mocks/moduleData";
import {
  clearSession,
  getStoredSession,
  login as loginRequest,
  saveSession,
} from "./services/authService";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Logo Caf Data" className="sidebar-logo" />
        <h1>CafData</h1>
      </div>

      <nav className="sidebar-menu">
        <NavLink to={ROUTES.APP.DASHBOARD} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Dashboard
        </NavLink>
        <NavLink to={ROUTES.APP.INVENTARIO} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Inventario
        </NavLink>
        <NavLink to={ROUTES.APP.VENTAS} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Ventas
        </NavLink>
        <NavLink to={ROUTES.APP.CLIENTES} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Clientes
        </NavLink>
        <NavLink to={ROUTES.APP.REPORTES} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Reportes
        </NavLink>
        <NavLink to={ROUTES.APP.PERSONAL} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Personal
        </NavLink>
        <NavLink to={ROUTES.APP.NOTIFICACIONES} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Notificaciones
        </NavLink>
        <NavLink to={ROUTES.APP.CONFIGURACION} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
}

function TopbarUserControls({
  showSearch = false,
  placeholder = "",
  onLogout,
  searchValue = "",
  onSearchChange,
}) {
  const navigate = useNavigate();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setIsAdminMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar-actions">
      {showSearch ? (
        <input
          placeholder={placeholder}
          value={onSearchChange ? searchValue : undefined}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      ) : null}

      <button
        type="button"
        className="icon-button"
        aria-label="Configuración"
        onClick={() => navigate(ROUTES.APP.CONFIGURACION)}
      >
        <FaCog />
      </button>

      <button
        type="button"
        className="icon-button"
        aria-label="Notificaciones"
        onClick={() => navigate(ROUTES.APP.NOTIFICACIONES)}
      >
        <FaBell />
        <span className="icon-badge">3</span>
      </button>

      <div className="admin-menu-wrap" ref={adminMenuRef}>
        <button
          type="button"
          className="admin-chip"
          aria-label="Cuenta de administrador"
          onClick={() => setIsAdminMenuOpen((prev) => !prev)}
        >
          <FaRegUserCircle className="admin-avatar" />
          <span>Admin</span>
          <FaChevronDown className="chevron-down" />
        </button>
        {isAdminMenuOpen ? (
          <div className="admin-dropdown">
            <button
              type="button"
              onClick={() => {
                setIsAdminMenuOpen(false);
                navigate(ROUTES.APP.CONFIGURACION);
              }}
            >
              Ir a configuración
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdminMenuOpen(false);
                onLogout?.();
              }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DashboardView({ onLogout }) {
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setStatus("ready"), 350);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return DASHBOARD_ORDERS;
    return DASHBOARD_ORDERS.filter(
      (item) =>
        item.id.toLowerCase().includes(term) ||
        item.cliente.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Dashboard</h2>
            <TopbarUserControls
              showSearch
              placeholder="Buscar productos, clientes..."
              onLogout={onLogout}
              searchValue={search}
              onSearchChange={setSearch}
            />
          </header>

          <section className="inventory-kpi-grid dashboard-kpi-grid">
            <article className="kpi-card">
              <p>Ventas Hoy</p>
              <h3>$2,450,000</h3>
              <small className="up">+8.6%</small>
            </article>
            <article className="kpi-card">
              <p>Órdenes</p>
              <h3>84</h3>
              <small className="up">+4.2%</small>
            </article>
            <article className="kpi-card">
              <p>Productos</p>
              <h3>182</h3>
              <small className="down">-1.1%</small>
            </article>
            <article className="kpi-card">
              <p>Clientes</p>
              <h3>1,412</h3>
              <small className="up">+2.0%</small>
            </article>
          </section>

          <section className="orders-card">
            <div className="orders-header">
              <h3>Órdenes recientes</h3>
              <button type="button">Ver todo</button>
            </div>

            {status !== "ready" ? (
              <DataState
                mode={status === "loading" ? "loading" : "error"}
                onRetry={() => setStatus("loading")}
              />
            ) : filteredOrders.length === 0 ? (
              <DataState mode="empty" />
            ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.cliente}</td>
                    <td>{item.total}</td>
                    <td>
                      <span className="status completed">{item.estado}</span>
                    </td>
                    <td>{item.fecha}</td>
                    <td>Ver detalles</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function InventarioView({ onLogout }) {
  const [status, setStatus] = useState("ready");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return INVENTARIO_ITEMS;
    return INVENTARIO_ITEMS.filter(
      (item) =>
        item.producto.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Inventario</h2>
            <TopbarUserControls onLogout={onLogout} />
          </header>

          <section className="inventory-toolbar">
            <input
              placeholder="Buscar productos, categoría..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
              <p>Total productos</p>
              <h3>95</h3>
              <small className="up">+4.8%</small>
            </article>
            <article className="kpi-card inventory-kpi-card">
              <p>Stock bajo</p>
              <h3>3</h3>
              <small className="down">3 productos críticos</small>
            </article>
            <article className="kpi-card inventory-kpi-card">
              <p>Valor inventario</p>
              <h3>$173.000</h3>
              <small className="up">+11.2%</small>
            </article>
          </section>

          <section className="orders-card">
            <div className="orders-header">
              <h3>Lista de productos</h3>
            </div>

            {status !== "ready" ? (
              <DataState
                mode={status === "loading" ? "loading" : "error"}
                onRetry={() => setStatus("loading")}
              />
            ) : filteredItems.length === 0 ? (
              <DataState mode="empty" />
            ) : (
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
                {filteredItems.map((item) => (
                  <tr key={`${item.producto}-${item.categoria}`}>
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
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function VentasView({ onLogout }) {
  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Ventas</h2>
            <TopbarUserControls
              showSearch
              placeholder="Buscar productos, clientes..."
              onLogout={onLogout}
            />
          </header>

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
        </section>
      </section>
    </main>
  );
}

function ClientesView({ onLogout }) {
  const [status, setStatus] = useState("ready");
  const [search, setSearch] = useState("");

  const filteredClientes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return CLIENTES_ITEMS;
    return CLIENTES_ITEMS.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.contacto.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Clientes</h2>
            <TopbarUserControls onLogout={onLogout} />
          </header>

          <section className="inventory-toolbar">
            <input
              placeholder="Buscar por nombre, correo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="toolbar-right">
              <button type="button" className="toolbar-chip">
                Filtro
              </button>
              <button type="button" className="toolbar-chip">
                Exportar
              </button>
              <button type="button" className="toolbar-main">
                + Nuevo cliente
              </button>
            </div>
          </section>

          <section className="inventory-kpi-grid">
            <article className="kpi-card inventory-kpi-card">
              <p>Total clientes</p>
              <h3>95</h3>
              <small className="up">+4 clientes esta semana</small>
            </article>
            <article className="kpi-card inventory-kpi-card">
              <p>Clientes frecuentes</p>
              <h3>34</h3>
              <small className="up">18 en el último mes</small>
            </article>
            <article className="kpi-card inventory-kpi-card">
              <p>Nuevos hoy</p>
              <h3>1</h3>
              <small className="up">+2.1%</small>
            </article>
          </section>

          <section className="orders-card">
            <div className="orders-header">
              <h3>Lista de clientes</h3>
            </div>

            {status !== "ready" ? (
              <DataState
                mode={status === "loading" ? "loading" : "error"}
                onRetry={() => setStatus("loading")}
              />
            ) : filteredClientes.length === 0 ? (
              <DataState mode="empty" />
            ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((item) => (
                  <tr key={`${item.nombre}-${item.contacto}`}>
                    <td>{item.nombre}</td>
                    <td>{item.contacto}</td>
                    <td>
                      <span
                        className={`status ${
                          item.estado === "Inactivo" ? "soldout" : "completed"
                        }`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td>{item.registro}</td>
                    <td>{item.tipo}</td>
                    <td>Ver detalles</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function ReportesView({ onLogout }) {
  const [status, setStatus] = useState("ready");
  const [search, setSearch] = useState("");

  const filteredReportes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return REPORTES_ITEMS;
    return REPORTES_ITEMS.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.tipo.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Gestión de reportes</h2>
            <TopbarUserControls onLogout={onLogout} />
          </header>

          <section className="reports-toolbar">
            <input
              className="reports-search"
              placeholder="Buscar reporte..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="toolbar-right">
              <button type="button" className="toolbar-chip">
                Hoy
              </button>
              <button type="button" className="toolbar-chip">
                Exportar
              </button>
              <button type="button" className="toolbar-main">
                + Nuevo
              </button>
            </div>
          </section>

          <section className="reports-grid">
            <article className="report-card">
              <h4>Reporte de ventas</h4>
              <p>Ventas por período</p>
              <span className="report-icon">
                <FaDollarSign />
              </span>
            </article>
            <article className="report-card">
              <h4>Reporte de inventario</h4>
              <p>Stock y movimientos</p>
              <span className="report-icon">
                <FaFileAlt />
              </span>
            </article>
            <article className="report-card">
              <h4>Reporte de clientes</h4>
              <p>Frecuencia de compra</p>
              <span className="report-icon">
                <FaRegUserCircle />
              </span>
            </article>
            <article className="report-card">
              <h4>Reporte de personal</h4>
              <p>Asistencia y turnos</p>
              <span className="report-icon">
                <FaRegUserCircle />
              </span>
            </article>
            <article className="report-card">
              <h4>Reporte financiero</h4>
              <p>Ingresos y gastos</p>
              <span className="report-icon">
                <FaDollarSign />
              </span>
            </article>
            <article className="report-card">
              <h4>Reporte personalizado</h4>
              <p>Filtros avanzados</p>
              <span className="report-icon">
                <FaTag />
              </span>
            </article>
          </section>

          <section className="orders-card">
            <div className="orders-header">
              <h3>Lista de reportes</h3>
            </div>

            {status !== "ready" ? (
              <DataState
                mode={status === "loading" ? "loading" : "error"}
                onRetry={() => setStatus("loading")}
              />
            ) : filteredReportes.length === 0 ? (
              <DataState mode="empty" />
            ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReportes.map((item) => (
                  <tr key={item.nombre}>
                    <td>{item.nombre}</td>
                    <td>
                      <span className="status completed">{item.estado}</span>
                    </td>
                    <td>{item.fecha}</td>
                    <td>{item.tipo}</td>
                    <td>Ver detalles</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function PersonalView({ onLogout }) {
  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Gestión de Personal</h2>
            <TopbarUserControls onLogout={onLogout} />
          </header>

          <section className="inventory-toolbar">
            <input placeholder="Buscar empleado, turno..." />
            <div className="toolbar-right">
              <button type="button" className="toolbar-main">
                + Nuevo empleado
              </button>
            </div>
          </section>

          <section className="inventory-kpi-grid">
            <article className="kpi-card inventory-kpi-card">
              <p>Total empleados</p>
              <h3>12</h3>
              <small className="up">2 en turno</small>
            </article>
            <article className="kpi-card inventory-kpi-card">
              <p>Asistencia activa</p>
              <h3>9</h3>
              <small className="up">90%</small>
            </article>
            <article className="kpi-card inventory-kpi-card">
              <p>Turnos hoy</p>
              <h3>8</h3>
              <small className="up">Completados: 6</small>
            </article>
          </section>

          <section className="shift-section">
            <h3>Turnos activos</h3>
            <div className="shift-grid">
              <article className="shift-card shift-card-open">
                <div className="shift-top">
                  <div className="shift-user">
                    <FaRegUserCircle />
                    <div>
                      <strong>María González</strong>
                      <span>Cajera</span>
                    </div>
                  </div>
                  <span className="shift-status success">En turno</span>
                </div>
                <div className="shift-bottom">
                  <div>
                    <FaRegClock />
                    <span>12:00 - 18:00</span>
                  </div>
                  <button type="button" className="toolbar-chip">
                    Finalizar turno
                  </button>
                </div>
              </article>

              <article className="shift-card shift-card-warning">
                <div className="shift-top">
                  <div className="shift-user">
                    <FaRegUserCircle />
                    <div>
                      <strong>Ana Martínez</strong>
                      <span>Mesera</span>
                    </div>
                  </div>
                  <span className="shift-status warning">En descanso</span>
                </div>
                <div className="shift-bottom">
                  <div>
                    <FaCalendarAlt />
                    <span>12:00 - 20:00</span>
                  </div>
                  <button type="button" className="toolbar-main">
                    Reasignar
                  </button>
                </div>
              </article>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function NotificacionesView({ onLogout }) {
  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Centro de notificaciones</h2>
            <TopbarUserControls onLogout={onLogout} />
          </header>

          <section className="notice-tabs">
            <button type="button" className="toolbar-chip active">
              Todas
            </button>
            <button type="button" className="toolbar-chip">
              Sin leer
            </button>
            <button type="button" className="toolbar-chip">
              Críticas
            </button>
            <button type="button" className="toolbar-chip">
              Urgentes
            </button>
          </section>

          <section className="notice-list">
            <article className="notice-card critical">
              <div className="notice-icon critical">
                <FaExclamationTriangle />
              </div>
              <div className="notice-content">
                <div className="notice-title-row">
                  <h4>Stock crítico - Café Colombia Premium</h4>
                  <span>Hace 5 min</span>
                </div>
                <p>
                  El producto Café Colombia Premium tiene nivel de inventario
                  crítico. Quedan solo 2 unidades.
                </p>
                <div className="notice-actions">
                  <button type="button" className="toolbar-main">
                    Reabastecer ahora
                  </button>
                  <button type="button" className="toolbar-chip">
                    Ver producto
                  </button>
                </div>
              </div>
            </article>

            <article className="notice-card warning">
              <div className="notice-icon warning">
                <FaCalendarCheck />
              </div>
              <div className="notice-content">
                <div className="notice-title-row">
                  <h4>Turno de Personal Próximo a finalizar</h4>
                  <span>Hace 1 hora</span>
                </div>
                <p>
                  El turno de María González finaliza en 30 minutos. Programar
                  relevo.
                </p>
                <div className="notice-actions">
                  <button type="button" className="toolbar-chip">
                    Ver turno
                  </button>
                </div>
              </div>
            </article>
          </section>
        </section>
      </section>
    </main>
  );
}

function ConfiguracionView({ onLogout }) {
  return (
    <main className="dashboard-page">
      <section className="dashboard-layout" aria-label="Panel principal">
        <Sidebar />

        <section className="content-area">
          <header className="topbar">
            <h2>Configuración</h2>
            <TopbarUserControls onLogout={onLogout} />
          </header>

          <section className="config-card">
            <h3>Configuración General</h3>

            <div className="config-section">
              <h4>Información general</h4>
              <div className="config-grid">
                <label>
                  Nombre de la empresa
                  <input defaultValue="CAFÉ ONLINE" />
                </label>
                <label>
                  NIT
                  <input defaultValue="901234567-8" />
                </label>
                <label>
                  Dirección
                  <input defaultValue="CRA 10 # 20-30" />
                </label>
                <label>
                  Teléfono
                  <input defaultValue="+57 3000000000" />
                </label>
                <label>
                  Correo
                  <input defaultValue="info@cafdata.com" />
                </label>
              </div>
            </div>

            <div className="config-section">
              <h4>Configuración regional</h4>
              <div className="config-grid">
                <label>
                  Zona horaria
                  <input defaultValue="America/Bogota" />
                </label>
                <label>
                  Idioma
                  <input defaultValue="Español" />
                </label>
                <label>
                  Formato de fecha
                  <input defaultValue="dd/mm/yyyy" />
                </label>
              </div>
            </div>

            <div className="config-section">
              <h4>Información del negocio</h4>
              <div className="config-grid">
                <label>
                  Tipo de negocio
                  <input defaultValue="Cafetería de especialidad" />
                </label>
                <label>
                  Horario de atención
                  <input defaultValue="Lunes a sábado 7:00 - 20:00" />
                </label>
                <label>
                  Capacidad máxima
                  <input defaultValue="45 personas" />
                </label>
              </div>
            </div>

            <div className="config-section">
              <h4>Configuración de inventario y ventas</h4>
              <div className="config-grid">
                <label>
                  Umbral de stock bajo
                  <input defaultValue="5 unidades" />
                </label>
                <label>
                  Costos de envío
                  <input defaultValue="$0" />
                </label>
                <label>
                  Método de pago
                  <input defaultValue="Efectivo, tarjeta, transferencia" />
                </label>
                <label>
                  Descuentos y promociones
                  <input defaultValue="Activos" />
                </label>
              </div>
            </div>

            <button type="button" className="toolbar-main save-config-btn">
              Guardar
            </button>
          </section>
        </section>
      </section>
    </main>
  );
}

function InputWithHint({ id, type, value, onChange, hint }) {
  const hasText = value.trim().length > 0;

  return (
    <div className="input-hint-wrapper">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="input-with-hint"
        placeholder=" "
        autoComplete={id}
      />
      <span className={`input-hint ${hasText ? "hidden" : ""}`}>{hint}</span>
    </div>
  );
}

function LoginView({ onLogin, isAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthenticated) {
    return <Navigate to={ROUTES.APP.DASHBOARD} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Ingresa correo y contraseña para continuar.");
      return;
    }

    const emailIsValid = /\S+@\S+\.\S+/.test(email.trim());
    if (!emailIsValid) {
      setErrorMessage("Ingresa un correo válido.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onLogin({
        email: email.trim(),
        password,
        remember,
      });
      navigate(ROUTES.APP.DASHBOARD);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Pantalla de inicio de sesión">
        <div className="login-form-side">
          <img src={logo} alt="Logo Caf Data" className="brand-logo" />

          <h1>Iniciar Sesión</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <InputWithHint
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              hint="Correo"
            />
            <InputWithHint
              id="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              hint="Contraseña"
            />

            <label className="remember-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Recuérdame</span>
            </label>

            <button type="button" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </button>

            {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <aside className="login-image-side">
          <img
            src={loginImage}
            alt="Ambiente de cafetería"
            className="login-cover-image"
          />
          <div className="overlay">
            <p>¡Hola, Amigo!</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

function AppRoutes() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: "",
    user: null,
  });

  useEffect(() => {
    const session = getStoredSession();
    if (session?.token) {
      setAuthState({
        isAuthenticated: true,
        token: session.token,
        user: session.user || null,
      });
    }
  }, []);

  async function handleLogin(credentials) {
    const response = await loginRequest(credentials);
    const session = {
      token: response?.token || "",
      user: response?.user || null,
    };

    if (!session.token) {
      throw new Error("El backend no retornó token de sesión.");
    }

    if (credentials.remember) {
      saveSession(session);
    } else {
      clearSession();
    }

    setAuthState({
      isAuthenticated: true,
      token: session.token,
      user: session.user,
    });
  }

  function handleLogout() {
    clearSession();
    setAuthState({
      isAuthenticated: false,
      token: "",
      user: null,
    });
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route
        path={ROUTES.LOGIN}
        element={
          <LoginView
            onLogin={handleLogin}
            isAuthenticated={authState.isAuthenticated}
          />
        }
      />

      <Route
        path={ROUTES.APP.DASHBOARD}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <DashboardView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.INVENTARIO}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <InventarioView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.VENTAS}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <VentasView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.CLIENTES}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <ClientesView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.REPORTES}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <ReportesView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.PERSONAL}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <PersonalView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.NOTIFICACIONES}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <NotificacionesView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.APP.CONFIGURACION}
        element={
          <ProtectedRoute isAuthenticated={authState.isAuthenticated}>
            <ConfiguracionView onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
