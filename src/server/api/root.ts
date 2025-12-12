import { createTRPCRouter } from "@/server/api/trpc";
import { partidaRouter } from "@/server/api/routers/partida";
import { opcoesApostaRouter } from "@/server/api/routers/opcoesAposta";

export const appRouter = createTRPCRouter({
  partida: partidaRouter,
  opcoesAposta: opcoesApostaRouter,
});

export type AppRouter = typeof appRouter;
