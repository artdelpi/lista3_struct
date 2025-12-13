import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/server/auth/session";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const sessionToken = cookies.get("betcomp_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(null);
    }

    const payload = verifySessionToken(sessionToken);

    if (!payload) {
      return NextResponse.json(null);
    }

    // Busca dados do usuário no banco
    const user = await db.usuario.findUnique({
      where: { id: payload.uid },
      select: {
        id: true,
        email: true,
        nome_usuario: true,
      },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nome_usuario: user.nome_usuario,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return NextResponse.json(null);
  }
}
