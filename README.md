<p align="center">
  <img src="https://twemoji.maxcdn.com/v/latest/svg/1f680.svg" width="72" alt="Rocket Emoji">
</p>

<h1 align="center">Projeto 3 • BetComp (Struct/UnB)</h1>

<p align="center">
  <em>Plataforma de apostas — Projeto final da Empresa Júnior Struct (UnB)</em>
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/status-final%20presentation-brightgreen?style=for-the-badge&logo=github" alt="Status">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/T3%20Stack-6C3EA0?style=for-the-badge" alt="T3 Stack">
  </a>
</p>

---

## Visão Geral

O **BetComp** é uma plataforma web de apostas desenvolvida como **Projeto 3 da Struct (UnB)**.  
O sistema reúne **interface responsiva**, **autenticação**, **operações de admin**, **cadastro de partidas/opções** e o **fluxo de apostas do usuário**, incluindo **atualização de saldo** e visualização em **Minhas Apostas**.

---

## Principais Funcionalidades

### Usuário
- Cadastro e login
- Explorar/visualizar partidas e eventos
- Criar apostas
- Acompanhar apostas em **Minhas Apostas**
- Visualizar **saldo** (com exibição integrada na navbar)

### Admin
- Gerenciamento/área administrativa
- Operações de CRUD para apoiar cadastro/controle de partidas e opções (apoio de rotas/API)

### Páginas / Telas
- Landing page
- Promoções (com ajustes para mobile)
- Ao vivo
- Login e Registro
- Minhas Apostas
- Not Found (404)

---

## Back-end e Banco de Dados

- **Banco de dados** modelado com Prisma (com migrações e seed)
- **Rotas/APIs** para autenticação e sessão
- **CRUD** para entidades do domínio (ex.: partidas e opções de aposta)
- **CRUD de apostas do usuário**, com regra de negócio de **atualização do saldo** ao realizar apostas

---

## Tecnologias

- **T3 Stack** (Next.js + TypeScript + tRPC + Prisma)
- **SQLite** (ambiente local)
- **pnpm**

---

## Como rodar (passo a passo)

> Requisitos: **Node 18+** e **pnpm** habilitado.

```bash
# Clonar e instalar dependências
git clone https://github.com/artdelpi/lista2_struct.git
cd lista2_struct
pnpm install

# Aplicar migrations e criar o banco local
npx prisma migrate dev

# Popular o banco com dados de teste (seed)
npx prisma db seed

# Rodar o projeto
pnpm dev

# (Opcional) Visualizar dados no Prisma Studio
npx prisma studio
