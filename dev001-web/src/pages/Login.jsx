import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Lock,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [verPassword, setVerPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [enviando,setEnviando] =useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await login(email, password);
    } catch (err) {
      const status = err.response?.status;
      if (status === 422) {
        setError("Las credenciales no son correctas");
      } else if (status === 429) {
        setError("Demasiados intentos. Espera un minuto");
      } else {
        setError("No se puede conectar con el servidor.");
      }
    } finally{
      setEnviando(false);
    }
  }

  return (
    <div className="animate-regresar grid min-h-screen lg:grid-cols-2">
      {/* Panel izquierdo: marca (solo en pantallas grandes) */}
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-green-700 via-green-800 to-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-2 text-xl font-bold">
          <ShieldCheck className="size-7" />
          DEV001
        </div>

        <div className="relative">
          <h2 className="text-4xl leading-tight font-bold">
            Administra usuarios, roles y permisos en un solo lugar.
          </h2>
          <ul className="mt-8 flex flex-col gap-4 text-green-50">
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
                <Users className="size-5" />
              </span>
              Gestión de usuarios
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
                <KeyRound className="size-5" />
              </span>
              Roles y permisos con Spatie
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
                <LayoutDashboard className="size-5" />
              </span>
              Panel de control en tiempo real
            </li>
          </ul>
        </div>

        <p className="relative text-sm text-green-100/70">
          © 2026 DEV001 · César Segura
        </p>
      </aside>

      {/* Panel derecho: formulario */}
      <main className="flex items-center justify-center bg-muted p-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border bg-background p-8 shadow-xl shadow-green-900/5">
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa tus datos para continuar
            </p>

            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Correo</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@correo.com"
                    className="h-10 pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-green-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type={verPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-10 pr-10 pl-9"
                  />
                  <button
                    type="button"
                    onClick={() => setVerPassword(!verPassword)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-gray-900"
                    aria-label={
                      verPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {verPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={enviando}
                className="group mt-2 h-10 w-full bg-green-700 text-white hover:bg-green-800"
              >
                {enviando ? "Entrando..." : "Acceder"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-semibold text-green-700 hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
