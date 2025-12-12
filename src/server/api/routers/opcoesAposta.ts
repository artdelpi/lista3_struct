import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const decimalInput = z.union([z.number(), z.string().min(1)]);

const opCreateInput = z.object({
  partida_id: z.number().int(),
  tipo: z.string().min(1), // "1" | "X" | "2" etc
  odds: decimalInput,
});

const opUpdateInput = opCreateInput.partial().extend({
  id: z.number().int(),
});

export const opcoesApostaRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ partida_id: z.number().int().optional() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.opcoesAposta.findMany({
        where: input?.partida_id ? { partida_id: input.partida_id } : undefined,
        orderBy: { data_criacao: "desc" },
      });
    }),

  byId: publicProcedure.input(z.object({ id: z.number().int() })).query(({ ctx, input }) => {
    return ctx.db.opcoesAposta.findUnique({ where: { id: input.id } });
  }),

  create: publicProcedure.input(opCreateInput).mutation(({ ctx, input }) => {
    return ctx.db.opcoesAposta.create({
      data: {
        partida_id: input.partida_id,
        tipo: input.tipo,
        odds: new Prisma.Decimal(input.odds),
      },
    });
  }),

  update: publicProcedure.input(opUpdateInput).mutation(({ ctx, input }) => {
    const { id, odds, ...rest } = input;
    return ctx.db.opcoesAposta.update({
      where: { id },
      data: {
        ...rest,
        ...(odds !== undefined ? { odds: new Prisma.Decimal(odds) } : {}),
      },
    });
  }),

  remove: publicProcedure.input(z.object({ id: z.number().int() })).mutation(({ ctx, input }) => {
    return ctx.db.opcoesAposta.delete({ where: { id: input.id } });
  }),
});
