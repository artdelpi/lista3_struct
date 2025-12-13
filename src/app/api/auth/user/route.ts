import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getSessionFromHeaders } from "@/server/auth/session";

export async function GET(req: Request) {
  const session = await getSessionFromHeaders(db, req.headers);

  if (!session?.user) {
    return NextResponse.json({ user: null });
  }

  // Buscar o saldo e is_admin do usuário no banco
  const usuario = await db.usuario.findUnique({
    where: { id: session.user.id },
    select: { saldo: true, is_admin: true },
  });

  return NextResponse.json({
    user: {
      id: session.user.id,
      nome_usuario: session.user.nome_usuario,
      email: session.user.email,
      saldo: usuario?.saldo ?? 0,
      is_admin: usuario?.is_admin ?? false,
    },
  });
}
