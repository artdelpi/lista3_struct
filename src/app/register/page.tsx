"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [nome_usuario, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nome_usuario, email, senha }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as any;
      setErr(data?.error ?? "Erro ao cadastrar.");
      return;
    }

    router.push("/");
  }

  return (
    <div className="mx-auto max-w-md py-14">
      <h1 className="text-3xl font-bold">Cadastrar</h1>
      <p className="mt-2 text-zinc-400">Crie sua conta.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3"
          placeholder="Nome de usuário"
          value={nome_usuario}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3"
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {err && <p className="text-sm text-red-400">{err}</p>}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
