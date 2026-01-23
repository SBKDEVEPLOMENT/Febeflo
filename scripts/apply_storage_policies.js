const postgres = require('postgres');

// Cadena de conexión directa (obtenida de .env.local)
const connectionString = 'postgresql://postgres:3DM2z5KyFwxwBxG.@db.olhvqojytqfsgernosmj.supabase.co:5432/postgres';

const sql = postgres(connectionString);

async function applyPolicies() {
  console.log('Conectando a la base de datos para aplicar políticas de Storage...');

  try {
    await sql`
      DO $$
      BEGIN
        -- Eliminar políticas existentes para evitar duplicados
        DROP POLICY IF EXISTS "Public Access" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
        
        -- Política para ver imágenes (Pública)
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'products' );

        -- Política para subir imágenes (Autenticados)
        CREATE POLICY "Authenticated Upload"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK ( bucket_id = 'products' );

        -- Política para actualizar (Autenticados)
        CREATE POLICY "Authenticated Update"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING ( bucket_id = 'products' );

        -- Política para borrar (Autenticados)
        CREATE POLICY "Authenticated Delete"
        ON storage.objects FOR DELETE
        TO authenticated
        USING ( bucket_id = 'products' );
      END
      $$;
    `;
    console.log('✅ Políticas de Storage aplicadas correctamente.');
  } catch (error) {
    console.error('❌ Error aplicando políticas:', error);
  } finally {
    await sql.end();
  }
}

applyPolicies();
