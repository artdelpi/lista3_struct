// src/app/eventos/page.tsx
import { api } from '@/trpc/server';
import Link from 'next/link';

export default async function EventosPage() {
  try {
    // Agora vai funcionar!
    const partidas = await api.partida.listWithOpcoes({
      status: 'ao_vivo',
      take: 10,
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Jogos ao Vivo ({partidas.length})</h1>
        
        <div className="space-y-4">
          {partidas.map((partida) => (
            <div key={partida.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-zinc-500">
                    {partida.status === 'ao_vivo' ? '⚡ AO VIVO' : 'Agendada'}
                  </div>
                  <div className="font-bold text-lg">
                    {partida.time_casa} vs {partida.time_visitante}
                  </div>
                </div>
                <div className="text-sm text-zinc-500">
                  {new Date(partida.data_partida).toLocaleTimeString([], { 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                {partida.opcoes_aposta.map((opcao) => (
                  <Link
                    key={opcao.id}
                    href={`/aposta/${opcao.id}`}
                    className="flex-1 bg-zinc-800 hover:bg-fuchsia-600 p-3 rounded-lg text-center transition-colors"
                  >
                    <div className="font-bold">
                      {opcao.tipo === '1' ? partida.time_casa :
                       opcao.tipo === 'X' ? 'Empate' :
                       opcao.tipo === '2' ? partida.time_visitante :
                       opcao.tipo}
                    </div>
                    <div className="text-fuchsia-400 hover:text-white font-bold text-xl">
                      {parseFloat(opcao.odds.toString()).toFixed(2)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Jogos ao Vivo</h1>
        <p className="text-zinc-400">Carregando eventos...</p>
      </div>
    );
  }
}