import { prisma } from "./index"

const main = async () => {
  // 1. Criando usuário
  const usuario = await prisma.usuario.create({
    data: {
      nome_usuario: "Arthur Marques",
      email: "arthur_nlsa@gmail.com",
      senha_hash: "1234567",
      saldo: 1000.00, // Saldo inicial
    }
  })

  // 2. Criando partidas
  const partida1 = await prisma.partida.create({
    data: {
      time_casa: "Bayern Munich",
      time_visitante: "Borussia Dortmund",
      placar_casa: 3,
      placar_visitante: 1,
      status: "ao_vivo",
      tempo_decorrido: "78:45",
      data_partida: new Date(),
    }
  })

  const partida2 = await prisma.partida.create({
    data: {
      time_casa: "Real Madrid",
      time_visitante: "Barcelona",
      placar_casa: 0,
      placar_visitante: 0,
      status: "agendada",
      tempo_decorrido: "0:00",
      data_partida: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
    }
  })

  // 3. Opções de aposta para as partidas
  // Partida 1 - Bayern vs Dortmund
  await prisma.opcoesAposta.createMany({
    data: [
      { partida_id: partida1.id, tipo: "1", odds: 1.45 },
      { partida_id: partida1.id, tipo: "X", odds: 4.00 },
      { partida_id: partida1.id, tipo: "2", odds: 5.50 },
    ]
  })

  // Partida 2 - Real Madrid vs Barcelona
  await prisma.opcoesAposta.createMany({
    data: [
      { partida_id: partida2.id, tipo: "1", odds: 1.75 },
      { partida_id: partida2.id, tipo: "X", odds: 3.50 },
      { partida_id: partida2.id, tipo: "2", odds: 4.20 },
    ]
  })

  // 4. Buscando as opções criadas
  const opcoesPartida1 = await prisma.opcoesAposta.findMany({
    where: { partida_id: partida1.id }
  })

  // 5. Criando uma aposta
  await prisma.aposta.create({
    data: {
      usuario_id: usuario.id,
      partida_id: partida1.id,
      opcao_aposta_id: opcoesPartida1[0]?.id || 1, // Aposta no time 1 (Bayern)
      valor_apostado: 50.00,
      odds_aposta: 1.45,
      status: "pendente",
    }
  })

  // 6. Criando transação de depósito inicial
  await prisma.transacao.create({
    data: {
      usuario_id: usuario.id,
      tipo: "deposito",
      valor: 1000.00,
      descricao: "Depósito inicial",
    }
  })

  console.log("Seed completed successfully!")
  console.log(`Usuário criado: ${usuario.nome_usuario}`)
  console.log(`Partidas criadas: 2`)
  console.log(`Apostas criadas: 1`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })