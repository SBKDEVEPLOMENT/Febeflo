"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, Eye, EyeOff, Settings, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function AuthDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserName = () => {
    if (!user) return "";
    const { first_name, last_name } = user.user_metadata || {};
    if (first_name && last_name) return `${first_name}, ${last_name}`;
    if (first_name) return first_name;
    return user.email; // Fallback
  };

  const getFullName = () => {
    if (!user) return "";
    const { first_name, last_name } = user.user_metadata || {};
    if (first_name && last_name) return `${first_name} ${last_name}`;
    return user.email;
  };

  const validatePhone = (phone: string) => {
    // Regex for Chilean phone numbers: +56 9 followed by 8 digits
    // Accepts formats: +56 9 1234 5678, +56912345678, 912345678
    const phoneRegex = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
            if (error.message.includes("Email not confirmed")) {
                throw new Error("Por favor verifica tu correo electrónico antes de iniciar sesión.");
            }
            throw error;
        }
        
        toast.success("¡Bienvenido de nuevo!");
        setIsOpen(false);
      } else {
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
        
        console.log("Registro enviado:", { firstName, lastName, address, phone });
        
        if (authError) throw authError;

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
                    
                    // Actualizar el perfil con la URL del avatar si se pudo subir
                    // Esto puede fallar si el usuario no ha confirmado correo, pero los datos de texto ya están en metadata
                    await supabase
                        .from('profiles')
                        .update({ avatar_url: publicUrlData.publicUrl })
                        .eq('id', authData.user.id);
                }
            } catch (error) {
                console.error("Error subiendo avatar:", error);
                // No bloqueamos el registro por error en avatar
            }
        }

        toast.success("Registro exitoso. Revisa tu correo para confirmar.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
      >
        <User size={24} />
        {user && (
          <span className="hidden md:block text-sm font-medium">
            Bienvenido {getUserName()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {user ? (
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">Has iniciado sesión como</p>
              <p className="font-medium text-gray-900 truncate mb-4">{getFullName()}</p>
              
              {user?.email?.endsWith("@febeflo.com") && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 mb-2 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  <LayoutDashboard size={18} />
                  Panel de Administración
                </Link>
              )}

              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-2 mb-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Settings size={18} />
                Mi Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mode === "login"
                      ? "text-primary border-b-2 border-primary bg-gray-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mode === "register"
                      ? "text-primary border-b-2 border-primary bg-gray-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              <form onSubmit={handleAuth} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
                
                {mode === "register" && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="Juan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="Pérez"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                placeholder="Calle 123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                placeholder="+56 9 1234 5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>
                    </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : mode === "login" ? (
                    "Ingresar"
                  ) : (
                    "Registrarse"
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  {mode === "login"
                    ? "¿Olvidaste tu contraseña?"
                    : "Al registrarte aceptas nuestros términos y condiciones"}
                </p>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
