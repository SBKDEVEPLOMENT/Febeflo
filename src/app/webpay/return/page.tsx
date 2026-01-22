"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertTriangle, Home } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';

function WebpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore(state => state.clearCart);
  
  const status = searchParams.get('status');
  const amount = searchParams.get('amount');
  const order = searchParams.get('order');
  const authCode = searchParams.get('auth_code');
  const date = searchParams.get('date');
  const message = searchParams.get('message');

  useEffect(() => {
    if (status === 'success') {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        
        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
            <p className="text-gray-600 mb-6">Tu compra ha sido procesada correctamente.</p>
            
            <div className="bg-gray-50 rounded p-4 mb-6 text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Orden:</span>
                <span className="font-medium">{order}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monto:</span>
                <span className="font-medium">${Number(amount).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Código de Autorización:</span>
                <span className="font-medium">{authCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium">{date ? new Date(date).toLocaleString('es-CL') : '-'}</span>
              </div>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="h-20 w-20 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago Rechazado</h1>
            <p className="text-gray-600 mb-6">La transacción ha sido rechazada por el banco.</p>
            <p className="text-sm text-gray-500 mb-6">Orden: {order}</p>
          </>
        )}

        {status === 'aborted' && (
          <>
            <div className="flex justify-center mb-6">
              <AlertTriangle className="h-20 w-20 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago Anulado</h1>
            <p className="text-gray-600 mb-6">Has cancelado la operación de pago.</p>
          </>
        )}

        {status === 'error' && (
          <>
             <div className="flex justify-center mb-6">
              <XCircle className="h-20 w-20 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error en el Pago</h1>
            <p className="text-gray-600 mb-6">Ocurrió un error al procesar tu pago.</p>
            {message && <p className="text-xs text-red-400 mb-6 break-words">{message}</p>}
          </>
        )}

        <Link 
          href="/"
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Home className="mr-2 h-4 w-4" /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default function WebpayReturnPage() {
  return (
    <Suspense fallback={<div>Cargando resultado...</div>}>
      <WebpayReturnContent />
    </Suspense>
  );
}
