import { Routes, Route, Navigate } from "react-router-dom";
import ClientesPage from "../pages/ClientesPage";
import DashboardPage from "../pages/DashboardPage";
import InventarioPage from "../pages/InventarioPage";
import VentasPage from "../pages/VentasPage";
import ReportesPage from "../pages/ReportesPage";
import PersonalPage from "../pages/PersonalPage";
import NotificacionesPage from "../pages/NotificacionesPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";
import LoginPage from "../pages/LoginPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/ventas" element={<VentasPage />} />
      <Route path="/reportes" element={<ReportesPage />} />
      <Route path="/personal" element={<PersonalPage />} />
      <Route path="/ventnotificaciones" element={<NotificacionesPage />} />
      <Route path="/configuracion" element={<ConfiguracionPage />} />
    </Routes>
  );
}

export default AppRoutes;