-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  first_name text,
  last_name text,
  address text,
  phone text,
  avatar_url text,
  email text
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Policies
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 4. Trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, address, phone, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone',
    '',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
