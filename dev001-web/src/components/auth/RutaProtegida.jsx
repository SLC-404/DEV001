import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

// Como el middleware "auth" de Laravel:
// si no hay usuario logueado, te manda al login.
export default function RutaProtegida() {
  const { user, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="size-8 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
