import { NavLink } from "react-router-dom";
import logo from  "../../imagenes/Logo.png"
import { Link } from "react-router-dom";
import { getSessionRole } from "../../services/session";

function Sidebar() {
  const isAdministrator = getSessionRole() === "Administrador";
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
        <NavLink to="/clientes" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Clientes
        </NavLink>
        <NavLink to="/inventario" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Inventario
        </NavLink>
        <NavLink to="/ventas" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
          Ventas
        </NavLink>
        {isAdministrator && (
          <NavLink to="/personal" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            Personal
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
