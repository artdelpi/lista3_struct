import { createTRPCRouter } from "@/server/api/trpc";
import { partidaRouter } from "@/server/api/routers/partida";
import { opcoesApostaRouter } from "@/server/api/routers/opcoesAposta";
import { apostaRouter } from "./routers/aposta";

export const appRouter = createTRPCRouter({
  partida: partidaRouter,
  opcoesAposta: opcoesApostaRouter,
  aposta: apostaRouter,
});

export type AppRouter = typeof appRouter;
