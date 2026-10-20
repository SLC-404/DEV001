import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setCargando(false)
      return
    }
    api.get("/me")
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setCargando(false))
  }, [])

  async function login(email, password) {
    const { data } = await api.post("/login", { email, password })
    localStorage.setItem("token", data.token)
    setUser(data.user)
  }

  async function logout() {
    try {
      await api.post("/logout")
    } finally {
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  function can(permiso) {
    return user?.permissions?.includes(permiso) ?? false
  }

  return (
    <AuthContext value={{ user, cargando, login, logout, can }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}