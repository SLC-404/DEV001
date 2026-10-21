import { Link } from "react-router";

export default function Register() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted">
      <h1 className="text-2xl font-bold">Registro (pronto)</h1>
      <Link to="/login" className="font-semibold text-green-700 hover:underline">
        ← Volver al login
      </Link>
    </div>
  );
}
