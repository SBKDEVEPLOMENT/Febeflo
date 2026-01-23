-- Ejecuta este código en el Editor SQL de tu panel de Supabase para configurar la base de datos y el almacenamiento.

-- 1. Crear la tabla de perfiles (profiles) si no existe
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  address text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(first_name) >= 2)
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Crear políticas de seguridad para profiles
-- Permitir ver perfiles públicamente (opcional, o solo el propio)
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

-- Permitir a los usuarios insertar su propio perfil
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- Permitir a los usuarios actualizar su propio perfil
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 4. Configurar el Bucket de almacenamiento para Avatares ('avatars')
-- Nota: Esto crea el bucket si no existe.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 5. Políticas de seguridad para el bucket 'avatars'
-- Permitir acceso público a las imágenes (SELECT)
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

-- Permitir a los usuarios autenticados subir imágenes (INSERT)
create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Permitir a los usuarios actualizar sus propias imágenes (UPDATE)
create policy "Users can update their own avatar." on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid() = owner);

-- Permitir a los usuarios borrar sus propias imágenes (DELETE)
create policy "Users can delete their own avatar." on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid() = owner);
