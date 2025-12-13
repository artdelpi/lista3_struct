// src/app/aposta/[opcaoId]/page.tsx
import { api } from '@/trpc/server';
import { redirect } from 'next/navigation';
import ApostaForm from '@/components/ApostaForm';

export default async function ApostaPage({
  params,
}: {
  params: Promise<{ opcaoId: string }>;
}) {
  
  const { opcaoId } = await params;
  
  try {
    const opcao = await api.opcoesAposta.byId({ 
      id: parseInt(opcaoId) 
    });

    if (!opcao) redirect('/eventos');

    const partida = await api.partida.byId({ 
      id: opcao.partida_id 
    });

    if (!partida) redirect('/eventos');

    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Fazer Aposta</h1>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-sm text-zinc-500 mb-1">
              {partida.status === 'ao_vivo' ? '⚡ AO VIVO' : 'Agendada'}
            </div>
            <div className="text-xl font-bold">
              {partida.time_casa} vs {partida.time_visitante}
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg">
            <div>
              <div className="text-sm text-zinc-400">Sua seleção</div>
              <div className="font-medium">
                {opcao.tipo === '1' ? `Vitória do ${partida.time_casa}` :
                 opcao.tipo === 'X' ? 'Empate' :
                 opcao.tipo === '2' ? `Vitória do ${partida.time_visitante}` :
                 opcao.tipo}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-zinc-400">Odds</div>
              <div className="text-fuchsia-400 font-bold text-2xl">
                {parseFloat(opcao.odds.toString()).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <ApostaForm 
          opcaoId={opcao.id}
          odds={parseFloat(opcao.odds.toString())}
        />
      </div>
    );
  } catch (error) {
    console.error('Erro:', error);
    redirect('/eventos');
  }
}