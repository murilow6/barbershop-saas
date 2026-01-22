# BarberSaaS (Admin + Cliente) — Opcao 2 (Supabase)

Projeto Next.js (App Router) com **Tailwind (tema rústico/elegante)**, **botões 3D**, animações com **Framer Motion** e backend no **Supabase** (Auth + Postgres + RLS).

## O que vem pronto
- **Publico:** Home animada, páginas de serviços, produtos, barbeiros e reserva.
- **Auth:** Login e cadastro (cliente padrão).
- **Cliente:** Painel, agendar, histórico, catálogo.
- **Admin:** Dashboard, agenda, CRUD de produtos/servicos/barbeiros, clientes + anotações.

## Setup (Supabase)
1) Crie um projeto no Supabase.
2) No SQL Editor, execute o arquivo:
   - `supabase/schema.sql`
3) Em **Auth > Users**, crie um usuário admin (ou converta um usuário):
   - Defina `role` como `ADMIN` em **app_metadata** ou **user_metadata**.

## Rodar local
1) Copie variáveis:
```bash
cp .env.example .env
```
2) Preencha:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3) Instale e rode:
```bash
npm i
npm run dev
```

## Rotas
- Público: `/` `/servicos` `/produtos` `/barbeiros` `/reservar`
- Auth: `/login` `/cadastro`
- Cliente: `/cliente/*`
- Admin: `/admin/*`

## Observações
- As policies do `schema.sql` já incluem RLS de exemplo. Ajuste para multi-tenant quando for evoluir.
- A UI está pronta para você plugar componentes mais complexos (calendário semanal, grade de horários, etc.).
