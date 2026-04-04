import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCog,
  FaBell,
  FaRegUserCircle,
  FaChevronDown,
} from "react-icons/fa";

function Topbar({
  title,
  showSearch = false,
  searchPlaceholder = "",
  searchValue = "",
  onSearchChange,
  showMenu = false,
}) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showMenu && (
          <button type="button" className="icon-button">
            <FaBars />
          </button>
        )}

        <h2>{title}</h2>
      </div>

      <div className="topbar-right">
        {showSearch && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{
            width: "400px",
            height: "40px",
            borderRadius: "10px",
            padding: "0 14px"
  }}
/>
        )}

        <button
          className="icon-button"
          onClick={() => navigate("/configuracion")}
        >
          <FaCog />
        </button>

        <button
          className="icon-button"
          onClick={() => navigate("/notificaciones")}
        >
          <FaBell />
          <span className="icon-badge">3</span>
        </button>

        <button
          className="admin-chip"
          onClick={() => navigate("/configuracion")}
        >
          <FaRegUserCircle className="admin-avatar" />
          <span>Admin</span>
          <FaChevronDown className="chevron-down" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;