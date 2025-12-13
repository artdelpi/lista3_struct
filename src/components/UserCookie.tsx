// src/components/UserCookie.tsx
'use client';

import { useEffect, useState } from 'react';

export function UserCookie() {
  const [user, setUser] = useState('');

  useEffect(() => {
    // Tenta pegar o nome do usuário do cookie
    const cookies = document.cookie;
    const match = cookies.match(/betcomp_session=([^;]+)/);
    
    if (match) {
      try {
        // Decodifica o JWT (segunda parte é o payload)
        const payload = match[1].split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload));
          if (decoded.nome_usuario) {
            setUser(decoded.nome_usuario);
          }
        }
      } catch {
        // Se falhar, não faz nada
      }
    }
  }, []);

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1.5">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {user.charAt(0)}
          </span>
        </div>
        <span className="text-white text-sm">
          {user}
        </span>
      </div>
    </div>
  );
}