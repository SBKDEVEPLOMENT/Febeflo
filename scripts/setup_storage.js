const { createClient } = require('@supabase/supabase-js');

// Leer variables de entorno (simulado ya que no estamos en nextjs)
// Usaré los valores que vi en .env.local anteriormente
const supabaseUrl = 'https://olhvqojytqfsgernosmj.supabase.co';
const supabaseKey = 'sb_secret_LcksiKzzQQYqBFkZKQj02Q_XoTK3TIt'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('Verificando bucket "products"...');
  
  try {
    // 1. Listar buckets para ver si existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listando buckets:', listError);
      return;
    }

    const productsBucket = buckets.find(b => b.name === 'products');

    if (productsBucket) {
      console.log('✅ El bucket "products" ya existe.');
      console.log('Configuración actual:', productsBucket);
      
      // Asegurar que sea público
      if (!productsBucket.public) {
        console.log('⚠️ El bucket no es público. Intentando actualizar...');
        const { error: updateError } = await supabase.storage.updateBucket('products', {
          public: true
        });
        if (updateError) console.error('Error haciendo público el bucket:', updateError);
        else console.log('✅ Bucket actualizado a público.');
      }
    } else {
      console.log('⚠️ El bucket "products" no existe. Intentando crearlo...');
      const { data, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
      });
      
      if (createError) {
        console.error('❌ Error creando el bucket:', createError);
      } else {
        console.log('✅ Bucket "products" creado exitosamente.');
      }
    }

    // Nota: Las políticas RLS (Row Level Security) para Storage Objects no se pueden configurar fácilmente vía API JS de Storage.
    // Deben configurarse vía SQL.
    console.log('\nIMPORTANTE: Para que la subida funcione desde el cliente, necesitas políticas RLS.');
    console.log('Generando script SQL para solucionar permisos...');

  } catch (err) {
    console.error('Error inesperado:', err);
  }
}

setupStorage();
