import { Navigate, Routes, Route } from "react-router-dom";
import ClientesPage from "../pages/ClientesPage";
import CrearClientePage from "../pages/CrearClientePage";
import DashboardPage from "../pages/DashboardPage";
import InventarioPage from "../pages/InventarioPage";
import VentasPage from "../pages/VentasPage";
import ReportesPage from "../pages/ReportesPage";
import PersonalPage from "../pages/PersonalPage";
import NotificacionesPage from "../pages/NotificacionesPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPage";
import CrearPersonalPage from "../pages/CrearPersonalPage"
import CrearProductoPage from "../pages/CrearProductoPage";

function AppRoutes() {
  const RequireAuth = ({ children }) =>
    localStorage.getItem("token") ? children : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/inventario" element={<RequireAuth><InventarioPage /></RequireAuth>} />
      <Route path="/inventario/nuevo" element={<RequireAuth><CrearProductoPage /></RequireAuth>} />
      <Route path="/clientes" element={<RequireAuth><ClientesPage /></RequireAuth>} />
      <Route path="/clientes/nuevo" element={<RequireAuth><CrearClientePage /></RequireAuth>} />
      <Route path="/ventas" element={<RequireAuth><VentasPage /></RequireAuth>} />
      <Route path="/reportes" element={<RequireAuth><ReportesPage /></RequireAuth>} />
      <Route path="/personal" element={<RequireAuth><PersonalPage /></RequireAuth>} />
      <Route path="/personal/nuevo" element={<RequireAuth><CrearPersonalPage /></RequireAuth>} />
      <Route path="/notificaciones" element={<RequireAuth><NotificacionesPage /></RequireAuth>} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/configuracion" element={<RequireAuth><ConfiguracionPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
