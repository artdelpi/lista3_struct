import { prisma } from "./index";
import crypto from "node:crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

const main = async () => {
  
  const usuario = await prisma.usuario.create({
    data: {
      nome_usuario: "Arthur Marques",
      email: "arthur_nlsa@gmail.com",
      senha_hash: hashPassword("1234567"),
      saldo: 1000.0,
    },
  });

  const admin = await prisma.usuario.create({
    data: {
      nome_usuario: "Admin",
      email: "admin@gmail.com",
      senha_hash: hashPassword("admin"),
      is_admin: true,
      saldo: 0.0,
    },
  });

  const partida1 = await prisma.partida.create({
    data: {
      time_casa: "Bayern Munich",
      time_visitante: "Borussia Dortmund",
      placar_casa: 3,
      placar_visitante: 1,
      status: "ao_vivo",
      tempo_decorrido: "78:45",
      data_partida: new Date(),
    },
  });

  const partida2 = await prisma.partida.create({
    data: {
      time_casa: "Real Madrid",
      time_visitante: "Barcelona",
      placar_casa: 0,
      placar_visitante: 0,
      status: "agendada",
      tempo_decorrido: "0:00",
      data_partida: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opcoesAposta.createMany({
    data: [
      { partida_id: partida1.id, tipo: "1", odds: 1.45 },
      { partida_id: partida1.id, tipo: "X", odds: 4.0 },
      { partida_id: partida1.id, tipo: "2", odds: 5.5 },
    ],
  });

  await prisma.opcoesAposta.createMany({
    data: [
      { partida_id: partida2.id, tipo: "1", odds: 1.75 },
      { partida_id: partida2.id, tipo: "X", odds: 3.5 },
      { partida_id: partida2.id, tipo: "2", odds: 4.2 },
    ],
  });

  const opcoesPartida1 = await prisma.opcoesAposta.findMany({
    where: { partida_id: partida1.id },
  });

  await prisma.aposta.create({
    data: {
      usuario_id: usuario.id,
      opcao_aposta_id: opcoesPartida1[0]?.id || 1,
      valor_apostado: 50.0,
      odds_aposta: 1.45,
      status: "pendente",
    },
  });

  await prisma.transacao.create({
    data: {
      usuario_id: usuario.id,
      tipo: "deposito",
      valor: 1000.0,
      descricao: "Depósito inicial",
    },
  });

  console.log("Seed completed successfully!");
  console.log(`Usuário criado: ${usuario.nome_usuario}`);
  console.log(`Admin criado: ${admin.email}`);
  console.log("Partidas criadas: 2");
  console.log("Apostas criadas: 1");
};

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
