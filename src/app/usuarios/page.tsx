"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export default function UsuariosPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user?.is_admin) {
          window.location.href = "/";
        } else {
          setIsAdmin(true);
        }
      });
  }, []);

  const { data: usuarios = [] } = api.usuario?.list?.useQuery() ?? { data: [] };
  const deleteUser = api.usuario?.delete?.useMutation?.();
  const utils = api.useUtils();

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${userName}?`)) {
      return;
    }

    try {
      await deleteUser?.mutate?.({ id: userId }, {
        onSuccess: () => {
          utils.usuario?.list?.invalidate?.();
        },
      });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-10 text-center">
        <p className="text-zinc-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-8">
      <h1 className="text-3xl font-bold">👥 Gerenciar Usuários</h1>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-6 py-4 text-left font-bold">ID</th>
              <th className="px-6 py-4 text-left font-bold">Nome de Usuário</th>
              <th className="px-6 py-4 text-left font-bold">Email</th>
              <th className="px-6 py-4 text-left font-bold">Saldo</th>
              <th className="px-6 py-4 text-left font-bold">Admin</th>
              <th className="px-6 py-4 text-left font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map?.((usuario: any) => (
              <tr key={usuario.id} className="border-b border-zinc-800 hover:bg-zinc-900/20 transition-colors">
                <td className="px-6 py-4 text-sm">{usuario.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{usuario.nome_usuario}</td>
                <td className="px-6 py-4 text-sm text-zinc-400">{usuario.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-fuchsia-400 font-bold">
                    R$ {(Number(usuario.saldo) || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {usuario.is_admin ? (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                      Sim
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs">
                      Não
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDeleteUser(usuario.id, usuario.nome_usuario)}
                    disabled={deleteUser?.isPending}
                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-60 transition-colors"
                  >
                    {deleteUser?.isPending ? "Deletando..." : "Deletar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!usuarios?.length && (
          <div className="px-6 py-8 text-center text-zinc-400">
            Nenhum usuário encontrado
          </div>
        )}
      </div>
    </div>
  );
}
