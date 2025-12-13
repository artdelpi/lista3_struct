// src/components/UserCookie.tsx - ADICIONE ESTE DEBUG
'use client';

import { useEffect, useState } from 'react';

export function UserCookie() {
  const [username, setUsername] = useState('');
  const [saldo, setSaldo] = useState<number | null>(null);

  useEffect(() => {
    const checkCookie = () => {
      try {
        const match = document.cookie.match(/betcomp_session=([^;]+)/);
        
        if (match) {
          const token = match[1];
          const parts = token.split('.');
          
          if (parts.length === 3) {
            const payload = parts[1];
            // Decodifica base64url
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(atob(base64));
            
            // DEBUG DETALHADO - veja no console do navegador
            console.log('🔍 DEBUG COOKIE:', {
              tokenLength: token.length,
              partsCount: parts.length,
              payloadRaw: payload,
              decoded: decoded,
              hasNome: 'nome_usuario' in decoded,
              hasSaldo: 'saldo' in decoded,
              allKeys: Object.keys(decoded)
            });
            
            if (decoded.nome_usuario) {
              setUsername(decoded.nome_usuario);
            } else if (decoded.uid) {
              // Se não tem nome, mostra pelo menos o ID
              setUsername(`Usuário ${decoded.uid}`);
            }
            
            if (decoded.saldo !== undefined) {
              setSaldo(decoded.saldo);
            } else {
              setSaldo(0);
            }
          }
        } else {
          console.log('❌ Nenhum cookie betcomp_session encontrado');
          setUsername('');
          setSaldo(null);
        }
      } catch (error) {
        console.error('❌ Erro ao ler cookie:', error);
      }
    };

    checkCookie();
    const interval = setInterval(checkCookie, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!username) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 shadow-lg">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="text-right">
          <span className="text-white text-sm font-medium block">
            {username}
          </span>
          <span className="text-green-400 text-xs font-bold block">
            {saldo !== null ? `R$ ${saldo.toFixed(2)}` : 'R$ 0,00'}
          </span>
        </div>
      </div>
    </div>
  );
}