"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  BarChart3
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col h-full">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Febeflo Admin
            </h1>
            <p className="text-gray-400 text-sm mt-1">SaaS Panel</p>
        </div>
        {/* Close button for mobile */}
        {onClose && (
             <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <LogOut size={20} className="rotate-180" /> 
             </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link 
          href="/admin" 
          onClick={onClose}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin") 
              ? "bg-primary text-white" 
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/admin/products" 
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/products") 
              ? "bg-primary text-white" 
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <ShoppingBag size={20} />
          <span>Productos</span>
        </Link>

        <Link 
          href="/admin/analytics" 
          onClick={onClose}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/analytics") 
              ? "bg-primary text-white" 
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <BarChart3 size={20} />
          <span>Analíticas</span>
        </Link>

        <Link 
          href="/admin/users" 
          onClick={onClose}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/users") 
              ? "bg-primary text-white" 
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Users size={20} />
          <span>Usuarios</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
