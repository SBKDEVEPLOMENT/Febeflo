const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Intentar cargar .env.local manualmente
const envPath = path.resolve(process.cwd(), '.env.local');
let envConfig = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            envConfig[key] = value;
        }
    });
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: Necesitas configurar NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu archivo .env.local');
    console.log('Puedes encontrar la SERVICE_ROLE_KEY en Supabase Dashboard -> Settings -> API');
    console.log('Asegúrate de agregarla en .env.local así:\nSUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const email = process.argv[2];

if (!email) {
    console.error('\x1b[33m%s\x1b[0m', '⚠️  Por favor proporciona un email para verificar.');
    console.log('Uso: node scripts/verify_user.js <email>');
    process.exit(1);
}

async function verify() {
    console.log(`🔍 Buscando usuario: ${email}...`);
    
    // Listar usuarios (puede requerir paginación si hay muchos, pero para empezar está bien)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    
    if (listError) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Error listando usuarios:', listError.message);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Usuario no encontrado. Asegúrate de haberte registrado primero.');
        return;
    }

    console.log(`✅ Usuario encontrado: ${user.id}`);
    
    if (user.email_confirmed_at) {
        console.log('\x1b[32m%s\x1b[0m', '✅ El usuario ya está verificado.');
        return;
    }

    // Verificar usuario
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
    );

    if (updateError) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Error verificando usuario:', updateError.message);
    } else {
        console.log('\x1b[32m%s\x1b[0m', `🎉 ¡Éxito! El usuario ${email} ha sido verificado manualmente.`);
        console.log('Ahora puedes iniciar sesión en la aplicación.');
    }
}

verify();
