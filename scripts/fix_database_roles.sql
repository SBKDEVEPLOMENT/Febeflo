-- COPIA Y PEGA ESTO EN EL EDITOR SQL DE SUPABASE PARA CORREGIR LA BASE DE DATOS

-- 1. Agregar la columna 'role' que falta
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer';

-- 2. Agregar la columna 'email' si falta
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

-- 3. Sincronizar emails desde la tabla de autenticación (para usuarios existentes)
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- 4. Asignar rol de CEO a las cuentas autorizadas automáticamente
UPDATE public.profiles
SET role = 'ceo'
WHERE email ILIKE 'agcatalans@febeflo.com' 
   OR email ILIKE 'ccandiae@febeflo.com';

-- 5. Confirmación
SELECT count(*) as perfiles_actualizados FROM public.profiles;