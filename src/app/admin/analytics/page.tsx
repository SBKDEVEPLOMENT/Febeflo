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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Category Distribution
      const { data: products } = await supabase
        .from('products')
        .select('category');

      if (products) {
        const counts: {[key: string]: number} = {};
        products.forEach(p => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });

        setCategoryData(Object.keys(counts).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: counts[key]
        })));
      }

      // Full Logs
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (email, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      setLogs(auditLogs || []);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <div className="p-4 lg:p-8">Cargando analíticas...</div>;

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Analíticas y Registros</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Distribución de Productos por Categoría</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placeholder for Traffic Source or other chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <p className="text-gray-400">Más métricas próximamente...</p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Registro de Auditoría (Últimos 50 movimientos)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Acción</th>
                <th className="p-4">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {log.profiles?.email || log.user_id}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500 max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
