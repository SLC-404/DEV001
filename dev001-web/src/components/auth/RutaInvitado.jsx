import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

// Como el middleware "guest" de Laravel:
// si ya estás logueado, no te deja ver el login y te manda al inicio.
export default function RutaInvitado() {
  const { user, cargando } = useAuth();

  if (cargando) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
