import { Navigate, Routes, Route } from "react-router-dom";
import ClientesPage from "../pages/ClientesPage";
import CrearClientePage from "../pages/CrearClientePage";
import DashboardPage from "../pages/DashboardPage";
import InventarioPage from "../pages/InventarioPage";
import VentasPage from "../pages/VentasPage";
import PersonalPage from "../pages/PersonalPage";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPage";
import CrearPersonalPage from "../pages/CrearPersonalPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/nuevo" element={<CrearClientePage />} />
        <Route path="/clientes/:id/editar" element={<CrearClientePage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/reportes" element={<Navigate to="/dashboard" replace />} />
        <Route path="/notificaciones" element={<Navigate to="/dashboard" replace />} />
        <Route path="/configuracion" element={<Navigate to="/dashboard" replace />} />
        <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/personal/nuevo" element={<CrearPersonalPage />} />
          <Route path="/personal/:id/editar" element={<CrearPersonalPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
