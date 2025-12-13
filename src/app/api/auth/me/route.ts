import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getSessionFromHeaders } from "@/server/auth/session";

export async function GET(req: Request) {
  const session = await getSessionFromHeaders(db, req.headers);

  if (!session?.user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      nome_usuario: session.user.nome_usuario,
      email: session.user.email,
    },
  });
}
