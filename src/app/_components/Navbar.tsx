"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse =
  | { user: null }
  | { user: { id: number; nome_usuario: string; email: string; saldo: number; is_admin: boolean } };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/user", { cache: "no-store" });
      const data = (await res.json()) as MeResponse;
      setMe(data);
    })();
  }, []);

  const user = me?.user ?? null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe({ user: null });
    setOpen(false);
    router.refresh();
    router.push("/");
  }

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform"
          >
            Bet<span className="text-fuchsia-400">Comp</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link href="/explore" className="font-medium hover:text-fuchsia-400 transition-colors">
                Explorar
              </Link>
              <Link href="/sports" className="font-medium hover:text-fuchsia-400 transition-colors">
                Esportes
              </Link>
              <Link href="/live" className="font-medium text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                ⚡ Ao Vivo
              </Link>
              <Link href="/promotions" className="font-medium hover:text-fuchsia-400 transition-colors">
                Promoções
              </Link>
              {user && (
                <Link href="/minhas-apostas" className="font-medium hover:text-fuchsia-400 transition-colors">
                  Minhas Apostas
                </Link>
              )}
              {user?.is_admin && (
                <>
                  <Link href="/admin/partidas" className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                    ⚙️ Admin
                  </Link>
                  <Link href="/usuarios" className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                    👥 Usuários
                  </Link>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-zinc-700"></div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-zinc-300">
                      Olá, <b className="text-white">{user.nome_usuario}</b>
                    </span>
                    <span className="text-xs text-fuchsia-400 font-semibold">
                      R$ {(Number(user.saldo) || 0).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-2 rounded-lg font-bold text-white hover:from-fuchsia-600 hover:to-purple-700 transition-all"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg font-medium hover:text-fuchsia-400 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-2 rounded-lg font-bold text-white hover:from-fuchsia-600 hover:to-purple-700 transition-all"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {open ? "✕" : "☰"}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <Link href="/explore" className="py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium" onClick={() => setOpen(false)}>
                Explorar
              </Link>
              <Link href="/sports" className="py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium" onClick={() => setOpen(false)}>
                Esportes
              </Link>
              <Link href="/live" className="py-3 px-4 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 transition-colors font-medium" onClick={() => setOpen(false)}>
                ⚡ Ao Vivo
              </Link>
              <Link href="/promotions" className="py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium" onClick={() => setOpen(false)}>
                Promoções
              </Link>
              {user && (
                <Link href="/minhas-apostas" className="py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium" onClick={() => setOpen(false)}>
                  Minhas Apostas
                </Link>
              )}
              {user?.is_admin && (
                <>
                  <Link href="/admin/partidas" className="py-3 px-4 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 transition-colors font-medium" onClick={() => setOpen(false)}>
                    ⚙️ Admin - Partidas
                  </Link>
                  <Link href="/usuarios" className="py-3 px-4 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 transition-colors font-medium" onClick={() => setOpen(false)}>
                    👥 Usuários
                  </Link>
                </>
              )}

              <div className="border-t border-zinc-800 pt-4 mt-2">
                {user ? (
                  <>
                    <div className="px-4 pb-2 text-sm text-zinc-300">
                      Logado como <b className="text-white">{user.nome_usuario}</b>
                    </div>
                    <button onClick={handleLogout} className="w-full block py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-center">
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-center mb-2" onClick={() => setOpen(false)}>
                      Entrar
                    </Link>
                    <Link href="/register" className="block bg-gradient-to-r from-fuchsia-500 to-purple-600 py-3 px-4 rounded-lg font-bold text-white hover:from-fuchsia-600 hover:to-purple-700 transition-all text-center" onClick={() => setOpen(false)}>
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
