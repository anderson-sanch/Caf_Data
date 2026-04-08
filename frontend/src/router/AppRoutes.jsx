import { Routes, Route } from "react-router-dom";
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

function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/clientes/nuevo" element={<CrearClientePage />} />
      <Route path="/ventas" element={<VentasPage />} />
      <Route path="/reportes" element={<ReportesPage />} />
      <Route path="/personal" element={<PersonalPage />} />
      <Route path="/personal/nuevo" element={<CrearPersonalPage />} />
      <Route path="/notificaciones" element={<NotificacionesPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/configuracion" element={<ConfiguracionPage />} />
    </Routes>
  );
}

export default AppRoutes;
