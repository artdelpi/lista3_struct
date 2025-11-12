-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "saldo" DECIMAL NOT NULL DEFAULT 0,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time_casa" TEXT NOT NULL,
    "time_visitante" TEXT NOT NULL,
    "placar_casa" INTEGER NOT NULL DEFAULT 0,
    "placar_visitante" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "tempo_decorrido" TEXT NOT NULL DEFAULT '0:00',
    "data_partida" DATETIME NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OpcoesAposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partida_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "odds" DECIMAL NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OpcoesAposta_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "opcao_aposta_id" INTEGER NOT NULL,
    "valor_apostado" DECIMAL NOT NULL,
    "odds_aposta" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aposta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Aposta_opcao_aposta_id_fkey" FOREIGN KEY ("opcao_aposta_id") REFERENCES "OpcoesAposta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "descricao" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
