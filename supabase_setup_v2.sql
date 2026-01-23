-- Ejecuta todo este script en el SQL Editor de Supabase para configurar la base de datos completa.

-- 1. Crear la tabla de perfiles (si no existe)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  address text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Habilitar seguridad (Row Level Security)
alter table public.profiles enable row level security;

-- 3. Crear políticas de seguridad para perfiles
-- Permitir que todos vean los perfiles (necesario para algunas validaciones, o restringir si prefieres)
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

-- Permitir que los usuarios inserten su propio perfil
create policy "Users can insert their own profile." 
  on public.profiles for insert with check (auth.uid() = id);

-- Permitir que los usuarios actualicen su propio perfil
create policy "Users can update own profile." 
  on public.profiles for update using (auth.uid() = id);

-- 4. Crear la función que maneja los nuevos usuarios (Trigger)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, address, phone, avatar_url, updated_at)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone',
    '',
    now()
  );
  return new;
end;
$$;

-- 5. Activar el trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Configurar Almacenamiento (Storage) para Avatares
-- Crear el bucket 'avatars' si no existe
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true) 
on conflict (id) do nothing;

-- 7. Políticas de seguridad para el Storage
-- Permitir ver avatares a todos (público)
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible." 
  on storage.objects for select using (bucket_id = 'avatars');

-- Permitir subir avatares a usuarios autenticados
drop policy if exists "Authenticated users can upload avatar" on storage.objects;
create policy "Authenticated users can upload avatar" 
  on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Permitir actualizar su propio avatar
drop policy if exists "Users can update their own avatar." on storage.objects;
create policy "Users can update their own avatar." 
  on storage.objects for update using (bucket_id = 'avatars' and auth.uid() = owner);

-- Permitir borrar su propio avatar
drop policy if exists "Users can delete their own avatar." on storage.objects;
create policy "Users can delete their own avatar." 
  on storage.objects for delete using (bucket_id = 'avatars' and auth.uid() = owner);
