// src/components/ApostaForm.tsx - MAIS SIMPLES
'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';

interface ApostaFormProps {
  opcaoId: number;
  odds: number;
}

export default function ApostaForm({ opcaoId, odds }: ApostaFormProps) {
  const [valor, setValor] = useState('10.00');
  const [loading, setLoading] = useState(false);

  // Hook do tRPC
  const utils = api.useUtils();
  const criarAposta = api.aposta.create.useMutation({
    onMutate: () => setLoading(true),
    onSuccess: () => {
      alert('Aposta realizada com sucesso!');
      // Redireciona para minhas apostas
      window.location.href = '/minhas-apostas';
    },
    onError: (error) => {
      alert('Erro: ' + error.message);
      setLoading(false);
    },
  });

  const ganhoPotencial = (parseFloat(valor) * odds).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseFloat(valor) < 1) {
      alert('Valor mínimo: R$ 1,00');
      return;
    }

    criarAposta.mutate({
      opcao_aposta_id: opcaoId,
      valor_apostado: parseFloat(valor),
      odds_aposta: odds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Valor */}
      <div>
        <label className="block text-sm text-zinc-400 mb-2">
          Valor da aposta (R$)
        </label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-lg"
          min="1"
          step="0.01"
          required
          disabled={loading}
        />
        
        {/* Valores rápidos */}
        <div className="flex gap-2 mt-3">
          {[10, 25, 50, 100].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setValor(v.toString())}
              className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors disabled:opacity-50"
              disabled={loading}
            >
              R$ {v}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-5 rounded-xl">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Valor apostado:</span>
            <span className="font-bold">R$ {parseFloat(valor).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ganho potencial:</span>
            <span className="font-bold text-green-400">R$ {ganhoPotencial}</span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'PROCESSANDO...' : 'CONFIRMAR APOSTA'}
        </button>
      </div>
    </form>
  );
}