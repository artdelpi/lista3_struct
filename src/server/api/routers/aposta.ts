// src/server/api/routers/aposta.ts (NOVO ARQUIVO)
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

const decimalInput = z.union([z.number(), z.string().min(1)]);

const apostaCreateInput = z.object({
  opcao_aposta_id: z.number().int(),
  valor_apostado: decimalInput,
  odds_aposta: decimalInput,
});

export const apostaRouter = createTRPCRouter({
  // Cria uma nova aposta
  create: protectedProcedure
    .input(apostaCreateInput)
    .mutation(async ({ ctx, input }) => {
      // 1. Verifica se usuário tem saldo suficiente
      const usuario = await ctx.db.usuario.findUnique({
        where: { id: ctx.session.user.id },
        select: { saldo: true }
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      const valorAposta = new Prisma.Decimal(input.valor_apostado);
      
      if (valorAposta.greaterThan(usuario.saldo)) {
        throw new Error('Saldo insuficiente');
      }

      // 2. Cria a aposta
      const aposta = await ctx.db.aposta.create({
        data: {
          usuario_id: ctx.session.user.id,
          opcao_aposta_id: input.opcao_aposta_id,
          valor_apostado: valorAposta,
          odds_aposta: new Prisma.Decimal(input.odds_aposta),
          status: 'pendente'
        }
      });

      // 3. Atualiza saldo do usuário
      await ctx.db.usuario.update({
        where: { id: ctx.session.user.id },
        data: {
          saldo: usuario.saldo.minus(valorAposta)
        }
      });

      // 4. Registra transação
      await ctx.db.transacao.create({
        data: {
          usuario_id: ctx.session.user.id,
          tipo: 'aposta',
          valor: valorAposta.negated(), // Valor negativo
          descricao: `Aposta #${aposta.id}`
        }
      });

      return aposta;
    }),

  // Lista apostas do usuário
  minhasApostas: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.aposta.findMany({
      where: { usuario_id: ctx.session.user.id },
      include: {
        opcao_aposta: {
          include: {
            partida: true
          }
        }
      },
      orderBy: { data_criacao: 'desc' }
    });
  }),
});