"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Activity,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  totalUsers: number;
  totalOrders: number;
  pageVisits: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    pageVisits: 0
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch Orders for Revenue Calculation
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });

      // Fetch Users Count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch Page Visits (Mocked for now if table empty)
      const { data: visits } = await supabase
        .from('page_analytics')
        .select('*');

      // Fetch Recent Logs
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate Stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      let total = 0;
      let monthly = 0;
      let weekly = 0;
      let previousMonth = 0;
      const chartDataMap: {[key: string]: number} = {};

      if (orders) {
        orders.forEach(order => {
          const amount = Number(order.total_amount);
          const date = new Date(order.created_at);
          
          total += amount;

          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            monthly += amount;
          }
          
          if (date >= oneMonthAgo && date < new Date(now.getFullYear(), now.getMonth(), 1)) {
             previousMonth += amount;
          }

          if (date >= oneWeekAgo) {
            weekly += amount;
          }

          // Chart Data (Group by Day)
          const dayKey = date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
          chartDataMap[dayKey] = (chartDataMap[dayKey] || 0) + amount;
        });
      }
      
      const growth = previousMonth > 0 ? ((monthly - previousMonth) / previousMonth) * 100 : 0;

      const chartData = Object.keys(chartDataMap).map(key => ({
        name: key,
        ventas: chartDataMap[key]
      }));

      // Calculate Total Visits
      const totalVisits = visits?.reduce((acc, curr) => acc + (curr.visit_count || 0), 0) || 0;

      setStats({
        totalRevenue: total,
        monthlyRevenue: monthly,
        weeklyRevenue: weekly,
        totalUsers: usersCount || 0,
        totalOrders: orders?.length || 0,
        pageVisits: totalVisits
      });

      setSalesData(chartData);
      setRecentLogs(logs || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando datos del panel...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Control</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Ingresos Totales</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-green-600 text-sm mt-4 flex items-center">
            <TrendingUp size={16} className="mr-1" /> Real (Histórico)
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Ingresos Mensuales</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(stats.monthlyRevenue)}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Este mes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Usuarios Registrados</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{stats.totalUsers}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-purple-600 text-sm mt-4 flex items-center">
            <Users size={16} className="mr-1" /> Total clientes
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Visitas Totales</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{stats.pageVisits}</h3>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Eye className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Interacciones</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Resumen de Ventas</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData.length > 0 ? salesData : [{name: 'Sin datos', ventas: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Ventas']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay actividad registrada.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <Activity size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
