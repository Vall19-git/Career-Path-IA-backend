-- SOLO LECTURA. Ejecutar en el SQL Editor de Supabase tras coordinar
-- la aplicación de la migración de Tatiana. No modifica registros.
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'password_hash';

-- Permite verificar usuarios anteriores sin exponer sus hashes.
SELECT COUNT(*) AS total_usuarios,
       COUNT(password_hash) AS usuarios_con_hash,
       COUNT(*) - COUNT(password_hash) AS usuarios_sin_hash
FROM public.users;
