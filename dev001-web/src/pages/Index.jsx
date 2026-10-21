import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

function Index() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <Button onClick={logout}>Cerrar sesión</Button>
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-xl shadow-green-900/5">
        
        <ShieldCheck className="mx-auto size-10 text-green-700" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">¡Hola, {user.name}! 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {user.roles?.map((rol) => (
            <span key={rol} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              {rol}
            </span>
          ))}
        </div>

        <Button onClick={logout} variant="outline" className="mt-8 w-full">
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default Index;
