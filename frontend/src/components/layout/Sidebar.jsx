import { NavLink } from "react-router-dom";
import logo from  "../../imagenes/logo.png"
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/dashboard" className="sidebar-brand-link">
          <img src={logo} alt="Logo CafData" className="sidebar-logo" />
        <h1>CafData</h1>
        </Link>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Dashboard
        </NavLink>
        <NavLink to="/inventario" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Inventario
        </NavLink>
        <NavLink to="/ventas" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Ventas
        </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Clientes
        </NavLink>
        <NavLink to="/reportes" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Reportes
        </NavLink>
        <NavLink to="/personal" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Personal
        </NavLink>
        <NavLink to="/notificaciones" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Notificaciones
        </NavLink>
        <NavLink to="/configuracion" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;