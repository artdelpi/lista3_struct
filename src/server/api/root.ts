import { createTRPCRouter } from "@/server/api/trpc";
import { partidaRouter } from "@/server/api/routers/partida";
import { opcoesApostaRouter } from "@/server/api/routers/opcoesAposta";
import { apostaRouter } from "./routers/aposta";
import { usuarioRouter } from "./routers/usuario";

export const appRouter = createTRPCRouter({
  partida: partidaRouter,
  opcoesAposta: opcoesApostaRouter,
  aposta: apostaRouter,
  usuario: usuarioRouter,
});

export type AppRouter = typeof appRouter;
