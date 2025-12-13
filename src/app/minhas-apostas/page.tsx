// src/app/minhas-apostas/page.tsx
'use client';

import { api } from '@/trpc/react';

export default function MinhasApostasPage() {
  const { data: apostas, isLoading } = api.aposta.minhasApostas.useQuery();

  if (isLoading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Minhas Apostas</h1>
      
      {!apostas || apostas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-zinc-400">Você ainda não fez apostas</p>
          <a href="/eventos" className="text-fuchsia-400 hover:underline mt-2 inline-block">
            Ver eventos disponíveis →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {apostas.map((aposta) => (
            <div key={aposta.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">
                    {aposta.opcao_aposta.partida.time_casa} vs {aposta.opcao_aposta.partida.time_visitante}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">
                    {aposta.opcao_aposta.tipo === '1' ? `Vitória do ${aposta.opcao_aposta.partida.time_casa}` :
                     aposta.opcao_aposta.tipo === 'X' ? 'Empate' :
                     `Vitória do ${aposta.opcao_aposta.partida.time_visitante}`}
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">
                    {new Date(aposta.data_criacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-zinc-400">Valor</div>
                  <div className="font-bold">R$ {parseFloat(aposta.valor_apostado.toString()).toFixed(2)}</div>
                  <div className="text-sm text-zinc-400 mt-1">Odds</div>
                  <div className="text-fuchsia-400 font-bold">{parseFloat(aposta.odds_aposta.toString()).toFixed(2)}</div>
                  <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                    aposta.status === 'pendente' ? 'bg-yellow-900/30 text-yellow-400' :
                    aposta.status === 'ganha' ? 'bg-green-900/30 text-green-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {aposta.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}