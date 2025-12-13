import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/server/db";
import { createSessionToken, getSessionCookieName } from "@/server/auth/session";

function hashPassword(password: string): string {
  // English: store as "salt:hash" using scrypt
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    nome_usuario?: string;
    email?: string;
    senha?: string;
  };

  if (!body.nome_usuario || !body.email || !body.senha) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const existing = await db.usuario.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });
  }

  const user = await db.usuario.create({
    data: {
      nome_usuario: body.nome_usuario,
      email: body.email,
      senha_hash: hashPassword(body.senha),
      // saldo default já é 0 pelo schema
    },
    select: { id: true },
  });

  const token = createSessionToken(user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
