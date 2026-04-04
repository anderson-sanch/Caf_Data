import { Routes, Route, Navigate } from "react-router-dom";
import ClientesPage from "../pages/ClientesPage";
import DashboardPage from "../pages/DashboardPage";
import InventarioPage from "../pages/InventarioPage";
import VentasPage from "../pages/VentasPage";
import ReportesPage from "../pages/ReportesPage";
import PersonalPage from "../pages/PersonalPage";
import NotificacionesPage from "../pages/NotificacionesPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/Ventas" element={<VentasPage/>} />
      <Route path="/Reportes" element={<ReportesPage/>} />
      <Route path="/Personal" element={<PersonalPage/>} />
      <Route path="/Notificaciones" element={<NotificacionesPage/>} />
      <Route path="/Configuracion" element={<ConfiguracionPage/>} />

    </Routes>
  );
}

export default AppRoutes;