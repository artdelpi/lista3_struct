import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const usuarioRouter = createTRPCRouter({
  list: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.usuario.findMany({
        select: {
          id: true,
          nome_usuario: true,
          email: true,
          saldo: true,
          is_admin: true,
        },
        orderBy: { data_criacao: "desc" },
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.usuario.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          nome_usuario: true,
          email: true,
          saldo: true,
          is_admin: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.usuario.delete({ where: { id: input.id } });
    }),
});
