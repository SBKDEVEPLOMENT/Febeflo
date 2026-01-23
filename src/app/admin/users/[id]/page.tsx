"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateOrderStatus } from '../actions';

interface OrderItem {
  id: number; // or string depending on product id
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image_url?: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // 2. Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

    } catch (error: any) {
      console.error('Error fetching details:', error);
      toast.error('Error al cargar detalles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) throw new Error(result.error);
      
      toast.success(`Estado actualizado a ${newStatus}`);
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      toast.error('Error al actualizar estado: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': 
      case 'entregado': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock size={16} />;
      case 'paid': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': 
      case 'entregado': return <Package size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) return <div className="p-8">Cargando detalles...</div>;
  if (!profile) return <div className="p-8">Usuario no encontrado</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver a Usuarios
      </button>

      {/* Header Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">{profile.id}</span>
              •
              <span>{profile.email}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
               profile.role === 'ceo' ? 'bg-purple-100 text-purple-700' :
               profile.role === 'admin' ? 'bg-blue-100 text-blue-700' :
               'bg-gray-100 text-gray-700'
            }`}>
              {profile.role?.toUpperCase() || 'CLIENTE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Teléfono</h3>
            <p className="text-gray-900">{profile.phone || 'No registrado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Dirección</h3>
            <p className="text-gray-900">{profile.address || 'No registrada'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Registro</h3>
            <p className="text-gray-900">
              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Desconocida'}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Package className="text-primary" />
        Historial de Pedidos
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-gray-900">#{order.id.slice(0, 8)}...</span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="font-bold text-lg text-primary">
                      ${order.total_amount.toLocaleString('es-CL')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/50 outline-none bg-white"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Productos en este pedido</h4>
                  <div className="space-y-3">
                    {order.items && Array.isArray(order.items) ? (
                      order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-gray-500 text-xs">
                                {item.size && `Talla: ${item.size}`} {item.color && `• Color: ${item.color}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900">{item.quantity} x ${Number(item.price).toLocaleString('es-CL')}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No hay detalles de productos disponibles.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Sin pedidos registrados</h3>
            <p className="text-gray-500 mt-1">Este usuario aún no ha realizado ninguna compra.</p>
          </div>
        )}
      </div>
    </div>
  );
}