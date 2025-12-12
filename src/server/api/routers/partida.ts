import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const partidaCreateInput = z.object({
  time_casa: z.string().min(1),
  time_visitante: z.string().min(1),
  placar_casa: z.number().int().min(0).optional(),
  placar_visitante: z.number().int().min(0).optional(),
  status: z.string().min(1), // "ao_vivo" | "agendada" | "encerrada" etc
  tempo_decorrido: z.string().min(1).optional(),
  data_partida: z.coerce.date(),
});

const partidaUpdateInput = partidaCreateInput.partial().extend({
  id: z.number().int(),
});

export const partidaRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          take: z.number().int().min(1).max(100).optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.partida.findMany({
        where: input?.status ? { status: input.status } : undefined,
        orderBy: { data_partida: "desc" },
        take: input?.take ?? 50,
      });
    }),

  listWithOpcoes: publicProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          take: z.number().int().min(1).max(100).optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.partida.findMany({
        where: input?.status ? { status: input.status } : undefined,
        orderBy: { data_partida: "desc" },
        take: input?.take ?? 50,
        include: { opcoes_aposta: true },
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.partida.findUnique({
        where: { id: input.id },
        include: { opcoes_aposta: true },
      });
    }),

  create: publicProcedure.input(partidaCreateInput).mutation(({ ctx, input }) => {
    return ctx.db.partida.create({
      data: {
        time_casa: input.time_casa,
        time_visitante: input.time_visitante,
        placar_casa: input.placar_casa ?? 0,
        placar_visitante: input.placar_visitante ?? 0,
        status: input.status,
        tempo_decorrido: input.tempo_decorrido ?? "0:00",
        data_partida: input.data_partida,
      },
    });
  }),

  update: publicProcedure.input(partidaUpdateInput).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.partida.update({
      where: { id },
      data,
    });
  }),

  remove: publicProcedure.input(z.object({ id: z.number().int() })).mutation(({ ctx, input }) => {
    return ctx.db.partida.delete({ where: { id: input.id } });
  }),
});
