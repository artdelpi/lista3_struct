"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export default function AdminPartidasPage() {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.partida.listWithOpcoes.useQuery({ take: 50 });

  const create = api.partida.create.useMutation({
    onSuccess: async () => utils.partida.listWithOpcoes.invalidate(),
  });

  const update = api.partida.update.useMutation({
    onSuccess: async () => utils.partida.listWithOpcoes.invalidate(),
  });

  const remove = api.partida.remove.useMutation({
    onSuccess: async () => utils.partida.listWithOpcoes.invalidate(),
  });

  const createOpcao = api.opcoesAposta.create.useMutation({
    onSuccess: async () => utils.partida.listWithOpcoes.invalidate(),
  });

  const removeOpcao = api.opcoesAposta.remove.useMutation({
    onSuccess: async () => utils.partida.listWithOpcoes.invalidate(),
  });

  const [form, setForm] = useState({
    time_casa: "",
    time_visitante: "",
    status: "agendada",
    data_partida: new Date().toISOString().slice(0, 16),
  });

  const [opcaoForm, setOpcaoForm] = useState({
    tipo: "1",
    odds: "1.90",
  });

  return (
    <div className="py-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin • Partidas</h1>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
        <h2 className="text-xl font-bold">Criar partida</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            placeholder="Time casa"
            value={form.time_casa}
            onChange={(e) => setForm((p) => ({ ...p, time_casa: e.target.value }))}
          />
          <input
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            placeholder="Time visitante"
            value={form.time_visitante}
            onChange={(e) => setForm((p) => ({ ...p, time_visitante: e.target.value }))}
          />
          <input
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            placeholder="Status (ao_vivo/agendada/encerrada)"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          />
          <input
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            type="datetime-local"
            value={form.data_partida}
            onChange={(e) => setForm((p) => ({ ...p, data_partida: e.target.value }))}
          />
        </div>

        <button
          className="rounded-2xl bg-fuchsia-600 px-6 py-3 font-bold hover:bg-fuchsia-700 disabled:opacity-60"
          disabled={create.isPending}
          onClick={() =>
            create.mutate({
              time_casa: form.time_casa,
              time_visitante: form.time_visitante,
              status: form.status,
              data_partida: new Date(form.data_partida),
            })
          }
        >
          {create.isPending ? "Criando..." : "Criar"}
        </button>

        {(create.error as any)?.message && (
          <p className="text-sm text-red-400">{(create.error as any).message}</p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">Lista</h2>

        {isLoading && <p className="text-zinc-400">Carregando...</p>}
        {error && <p className="text-red-400">Erro: {error.message}</p>}

        <div className="grid gap-3">
          {data?.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold">
                    {p.time_casa} {p.placar_casa} x {p.placar_visitante} {p.time_visitante}
                  </div>
                  <div className="text-sm text-zinc-400">
                    status: {p.status} • tempo: {p.tempo_decorrido}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
                    onClick={() =>
                      update.mutate({
                        id: p.id,
                        status: p.status === "ao_vivo" ? "agendada" : "ao_vivo",
                      })
                    }
                  >
                    Toggle ao vivo
                  </button>

                  <button
                    className="rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
                    onClick={() => remove.mutate({ id: p.id })}
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <div className="text-sm text-zinc-300">
                <div className="font-semibold mb-2">Opções de aposta</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.opcoes_aposta.map((o) => (
                    <div key={o.id} className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 text-xs">
                      <span>{o.tipo}: {String(o.odds)}</span>
                      <button
                        onClick={() => removeOpcao.mutate({ id: o.id })}
                        className="text-red-400 hover:text-red-500 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <select
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs"
                    value={opcaoForm.tipo}
                    onChange={(e) => setOpcaoForm((prev) => ({ ...prev, tipo: e.target.value }))}
                  >
                    <option value="1">Vitória 1</option>
                    <option value="X">Empate</option>
                    <option value="2">Vitória 2</option>
                  </select>
                  <input
                    type="number"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs w-20"
                    placeholder="Odds"
                    value={opcaoForm.odds}
                    onChange={(e) => setOpcaoForm((prev) => ({ ...prev, odds: e.target.value }))}
                    step="0.01"
                    min="1"
                  />
                  <button
                    onClick={() =>
                      createOpcao.mutate({
                        partida_id: p.id,
                        tipo: opcaoForm.tipo,
                        odds: opcaoForm.odds,
                      })
                    }
                    disabled={createOpcao.isPending}
                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold hover:bg-green-700 disabled:opacity-60"
                  >
                    {createOpcao.isPending ? "..." : "+"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(update.error as any)?.message && (
          <p className="text-sm text-red-400">{(update.error as any).message}</p>
        )}
        {(remove.error as any)?.message && (
          <p className="text-sm text-red-400">{(remove.error as any).message}</p>
        )}
      </div>
    </div>
  );
}
