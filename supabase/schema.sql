-- BarberSaaS - Supabase schema (PostgreSQL)
-- Execute no SQL Editor do Supabase.

-- 1) Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'CLIENTE',
  full_name text,
  phone text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'role','CLIENTE'),
          new.raw_user_meta_data->>'nome')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) Barbers
create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamp with time zone not null default now()
);

-- 3) Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  name text not null,
  description text,
  duration_minutes integer not null default 30,
  price_cents integer not null default 0,
  created_at timestamp with time zone not null default now()
);

-- 4) Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  name text not null,
  description text,
  price_cents integer not null default 0,
  stock integer default 0,
  image_url text,
  created_at timestamp with time zone not null default now()
);

-- 5) Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  user_id uuid not null references public.profiles(id) on delete cascade,
  barber_id uuid not null references public.barbers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  starts_at timestamp with time zone not null,
  status text not null default 'BOOKED',
  note text,
  created_at timestamp with time zone not null default now()
);

-- 6) Customer notes (admin -> cliente)
create table if not exists public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  note text not null,
  created_at timestamp with time zone not null default now()
);

-- ----------------
-- Row Level Security (RLS)
-- ----------------
-- Para MVP local, você pode deixar sem RLS.
-- Em producao, ative RLS e crie policies.

alter table public.profiles enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.appointments enable row level security;
alter table public.customer_notes enable row level security;

-- Helpers
create or replace function public.is_admin()
returns boolean as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN', false)
      or coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN', false);
$$ language sql stable;

-- Profiles: cada usuario ve/atualiza seu perfil; admin ve tudo
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
for select
using (is_admin() or auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
for update
using (is_admin() or auth.uid() = id)
with check (is_admin() or auth.uid() = id);

-- Admin-only tables (barbers/services/products)
-- select: publico pode ler, admin pode tudo

drop policy if exists "barbers_select_public" on public.barbers;
create policy "barbers_select_public" on public.barbers
for select using (true);

drop policy if exists "barbers_admin_write" on public.barbers;
create policy "barbers_admin_write" on public.barbers
for all using (is_admin()) with check (is_admin());

-- Services
drop policy if exists "services_select_public" on public.services;
create policy "services_select_public" on public.services
for select using (true);

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
for all using (is_admin()) with check (is_admin());

-- Products
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
for all using (is_admin()) with check (is_admin());

-- Appointments
-- Cliente: cria e ve os proprios agendamentos
-- Admin: ve tudo e pode atualizar/excluir
drop policy if exists "appointments_select" on public.appointments;
create policy "appointments_select" on public.appointments
for select using (is_admin() or auth.uid() = user_id);

drop policy if exists "appointments_insert" on public.appointments;
create policy "appointments_insert" on public.appointments
for insert with check (auth.uid() = user_id);

drop policy if exists "appointments_admin_write" on public.appointments;
create policy "appointments_admin_write" on public.appointments
for update using (is_admin()) with check (is_admin());

drop policy if exists "appointments_admin_delete" on public.appointments;
create policy "appointments_admin_delete" on public.appointments
for delete using (is_admin());

-- Customer notes
-- Somente admin escreve; admin e dono (cliente) le
drop policy if exists "customer_notes_select" on public.customer_notes;
create policy "customer_notes_select" on public.customer_notes
for select using (is_admin() or auth.uid() = customer_id);

drop policy if exists "customer_notes_admin_write" on public.customer_notes;
create policy "customer_notes_admin_write" on public.customer_notes
for all using (is_admin()) with check (is_admin());
