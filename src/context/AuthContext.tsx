"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  id: number;
  nome_usuario: string;
  email: string;
  saldo: number;
  is_admin: boolean;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      const res = await fetch("/api/auth/user", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
