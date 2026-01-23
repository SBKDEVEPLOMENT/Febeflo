"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { updateUserRole, ensureCeoRole } from './actions';
import { Trash2, Shield, UserCheck, AlertTriangle, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  updated_at?: string;
}

const CEO_EMAILS = [
  'agcatalans@febeflo.com', 
  'ccandiae@febeflo.com',
  'Agcatalans@febeflo.com',
  'Ccandiae@febeflo.com'
];

export default function UsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkCEOAccess();
  }, []);

  const checkCEOAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Checking access for:", user?.email);
    
    if (user) {
      setCurrentUserEmail(user.email || null);
      // Normalizar email a minúsculas para comparación segura
      const userEmailLower = user.email?.toLowerCase() || '';
      const isCEO = CEO_EMAILS.some(email => email.toLowerCase() === userEmailLower);
      
      console.log("Is CEO?", isCEO);

      if (isCEO) {
        // Intentar auto-promover a CEO si el rol está mal
        ensureCeoRole().then(({ updated }) => {
          if (updated) {
            toast.success("Tu rol ha sido actualizado a CEO automáticamente");
          }
          fetchUsers();
        });
      } else {
        setLoading(false);
      }
    } else {
        setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios: ' + (error.message || error.error_description || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      // Usar Server Action para saltar restricciones RLS si soy admin
      const result = await updateUserRole(userId, newRole);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(`Rol actualizado a ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Error al actualizar rol: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="p-8">Cargando usuarios...</div>;

  if (!currentUserEmail || !CEO_EMAILS.some(email => currentUserEmail.toLowerCase() === email.toLowerCase())) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
        <p className="text-gray-600 max-w-md mb-4">
          Esta sección está reservada exclusivamente para los CEOs de Febeflo.
          Si necesitas acceso, contacta a administración.
        </p>
        <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-500">
          <p>Tu email detectado: <span className="font-mono font-bold">{currentUserEmail || 'No detectado'}</span></p>
          <p className="mt-1 text-xs">Asegúrate de haber iniciado sesión con una cuenta autorizada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios y Permisos</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary w-64 md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Usuario</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol Actual</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                     <div className="font-medium text-gray-900 group relative">
                       <Link href={`/admin/users/${user.id}`} className="hover:text-primary hover:underline flex items-center gap-2">
                         {user.first_name} {user.last_name}
                         <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                       </Link>
                     </div>
                     {user.updated_at && <div className="text-xs text-gray-500">Actualizado: {new Date(user.updated_at).toLocaleDateString()}</div>}
                   </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ceo' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'sales' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role?.toUpperCase() || 'CLIENTE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select 
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary/50"
                          value={user.role || 'customer'}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          disabled={CEO_EMAILS.includes(user.email)} // Prevent editing other CEOs easily to avoid lockout
                        >
                          <option value="customer">Cliente</option>
                          <option value="sales">Ventas</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No se encontraron usuarios que coincidan con "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
