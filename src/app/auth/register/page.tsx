"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validatePhone(phone)) {
        throw new Error("El número de teléfono no es válido. Debe ser formato chileno (ej: +56 9 1234 5678)");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                address: address,
                phone: phone,
            },
        },
      });

      if (authError) {
        throw authError;
      }

      // Intentar subir avatar si existe y el usuario fue creado
      if (authData.user && avatar) {
        try {
            const fileExt = avatar.name.split('.').pop();
            const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatar);

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);
                
                await supabase
                    .from('profiles')
                    .update({ avatar_url: publicUrlData.publicUrl })
                    .eq('id', authData.user.id);
            }
        } catch (error) {
            console.error("Error subiendo avatar:", error);
        }
      }

      if (authData.session) {
        // Si hay sesión, no se requiere confirmación (o autoconfirmación activada)
        router.push("/");
        router.refresh();
      } else {
        // Si no hay sesión, se requiere confirmación
        alert("Registro exitoso! Por favor revisa tu correo para confirmar.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:text-secondary">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-0">
                <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nombre"
                />
                <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Apellido"
                />
            </div>

            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Dirección"
            />
            
            <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Teléfono"
            />
            
             <div className="relative block w-full px-3 py-2 border border-gray-300 bg-white">
                <label className="block text-xs font-medium text-gray-500 mb-1">Foto de Perfil</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-10"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O regístrate con</span>
            </div>
          </div>

          <GoogleSignInButton text="Registrarse con Google" />
        </form>
      </div>
    </div>
  );
}
