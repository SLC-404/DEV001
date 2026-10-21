import { Routes, Route, Navigate } from "react-router";
import RutaProtegida from "@/components/auth/RutaProtegida";
import RutaInvitado from "@/components/auth/RutaInvitado";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Solo invitados (middleware guest) */}
      <Route element={<RutaInvitado />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Solo logueados (middleware auth) */}
      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Index />} />
      </Route>

      {/* Cualquier otra URL → al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
