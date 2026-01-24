import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Sincronizar datos de Google con el perfil
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          const metadata = user.user_metadata;
          const fullName = metadata.full_name || metadata.name || "";
          const avatarUrl = metadata.avatar_url || metadata.picture || "";
          
          // Intentar separar nombre y apellido
          const nameParts = fullName.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          // Actualizar metadata del usuario para consistencia
          await supabase.auth.updateUser({
            data: {
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
            }
          });

          // Verificar si existe el perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!profile) {
            // Si no existe, crearlo
            await supabase.from('profiles').insert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
              // No incluimos email, phone, address para evitar errores si no existen las columnas o no tenemos los datos
            });
          } else {
            // Si existe, actualizar solo si faltan datos
            const updates: any = {};
            if (!profile.first_name) updates.first_name = firstName;
            if (!profile.last_name) updates.last_name = lastName;
            if (!profile.avatar_url) updates.avatar_url = avatarUrl;
            
            if (Object.keys(updates).length > 0) {
              await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);
            }
          }
        } catch (err) {
          console.error("Error syncing profile in callback:", err);
          // No bloqueamos el login si falla la sincronización del perfil
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
