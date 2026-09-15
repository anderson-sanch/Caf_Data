import { useNavigate } from "react-router-dom";
import {
  FaRegUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { getStoredSession, logout } from "../../services/authService";

function Topbar({
  title,
  showSearch = false,
  searchPlaceholder = "",
  searchValue = "",
  onSearchChange,
}) {
  const navigate = useNavigate();
  const session = getStoredSession();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
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

        <div className="admin-chip" aria-label="Usuario actual">
          <FaRegUserCircle className="admin-avatar" />
          <span>{session?.user?.name || session?.user?.email || "Usuario"}</span>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
