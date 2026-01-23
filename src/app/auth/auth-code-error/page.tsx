"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle size={32} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Error de Verificación
        </h1>
        
        <p className="text-gray-600 mb-6">
          Hubo un problema al verificar tu correo electrónico. Esto puede deberse a que el enlace ha expirado o ya ha sido utilizado.
        </p>

        <div className="space-y-3">
          <Link 
            href="/auth/login"
            className="block w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
          >
            Volver a Iniciar Sesión
          </Link>
          
          <Link 
            href="/"
            className="block w-full py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
