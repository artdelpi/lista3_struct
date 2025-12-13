// src/trpc/server.ts - VERSÃO CORRIGIDA
import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { appRouter } from "@/server/api/root"; // ← Importe appRouter
import { createTRPCContext } from "@/server/api/trpc";

/**
 * Contexto cacheado para performance
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({
    headers: heads,
  });
});

/**
 * Exporte o caller como uma Promise que resolve para o caller
 */
export async function getCaller() {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
}

/**
 * API simplificada para uso direto
 */
export const api = {
  partida: {
    listWithOpcoes: async (input?: { status?: string; take?: number }) => {
      const caller = await getCaller();
      return caller.partida.listWithOpcoes(input);
    },
    byId: async (input: { id: number }) => {
      const caller = await getCaller();
      return caller.partida.byId(input);
    },
  },
  opcoesAposta: {
    byId: async (input: { id: number }) => {
      const caller = await getCaller();
      return caller.opcoesAposta.byId(input);
    },
  },
  aposta: {
    create: async (input: { 
      opcao_aposta_id: number; 
      valor_apostado: number | string; 
      odds_aposta: number | string;
    }) => {
      const caller = await getCaller();
      return caller.aposta.create(input);
    },
    minhasApostas: async () => {
      const caller = await getCaller();
      return caller.aposta.minhasApostas();
    },
  },
};