"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Save, ArrowLeft, Loader2, User, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  avatar_url: string;
  email: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  
  // Phone verification states removed
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error loading profile:', error);
      }

      if (data) {
        setProfile({
            id: data.id || user.id,
            email: data.email || user.email || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            address: data.address || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
        });
      }
    } catch (error: any) {
      // toast.error("Error al cargar perfil"); // SIlent fail is better for first load if no profile exists
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const validatePhone = (phone: string) => {
    // Regex for Chilean phone numbers: +56 9 followed by 8 digits
    // Accepts formats: +56 9 1234 5678, +56912345678, 912345678
    const phoneRegex = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
    return phoneRegex.test(phone);
  };

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    
    if (profile?.phone && !validatePhone(profile.phone)) {
        toast.error("El número de teléfono no es válido. Debe ser formato chileno (ej: +56 9 1234 5678)");
        return;
    }

    setUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      toast.error("Error al actualizar perfil: " + error.message);
    } finally {
      setUpdating(false);
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
        setUpdating(true);
        if (!e.target.files || e.target.files.length === 0) {
            throw new Error('Debe seleccionar una imagen para subir.');
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        
        setProfile(prev => {
          if (!prev) return null;
          return { ...prev, avatar_url: data.publicUrl };
        });
        toast.success("Imagen subida. No olvides guardar los cambios.");

    } catch (error: any) {
        toast.error("Error al subir imagen. Asegúrate de tener configurado el bucket 'avatars'.");
        console.error(error);
    } finally {
        setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return null; // Or a specific error state
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-6 flex justify-center sm:justify-start">
              <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden group">
                {profile.avatar_url ? (
                    <Image 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        fill 
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <User size={64} />
                    </div>
                )}
                
                {/* Overlay for upload */}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                    <Camera size={24} />
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={updating}
                    />
                </label>
              </div>
            </div>

            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                    {profile.first_name || profile.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : "Usuario Sin Nombre"
                    }
                </h1>
                <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                    <Mail size={16} />
                    {user?.email}
                </p>
            </div>

            <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={profile.first_name}
                                disabled
                                className="shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                            Apellido
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={profile.last_name}
                                disabled
                                className="shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                                placeholder="Tu apellido"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                                placeholder="Calle Principal 123, Comuna"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Número de Teléfono
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={profile.phone}
                                onChange={(e) => {
                                    setProfile({ ...profile, phone: e.target.value });
                                }}
                                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm rounded-md px-3 py-2 border border-gray-300"
                                placeholder="+56 9 1234 5678"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={updating}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {updating ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="-ml-1 mr-2 h-5 w-5" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
