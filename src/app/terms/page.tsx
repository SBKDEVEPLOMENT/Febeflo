
import React from 'react';
import { FileText, Shield, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6 bg-white rounded-full p-2 shadow-lg">
                <img 
                  src="/logo/logo.png" 
                  alt="Febeflo Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Términos y Condiciones</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Por favor, lee detenidamente nuestras condiciones de servicio antes de realizar una compra.
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Section 1: General */}
            <section className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aspectos Generales</h2>
                <p className="text-gray-600 leading-relaxed">
                  Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones. 
                  Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento sin previo aviso. 
                  Es tu responsabilidad revisar esta página periódicamente.
                </p>
              </div>
            </section>

            {/* Section 2: Despacho */}
            <section className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Truck size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Políticas de Despacho</h2>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  <p>
                    Ofrecemos envíos a todo Chile a través de Starken y retiro en tienda.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Retiro en Tienda:</strong> Gratuito. El pedido estará listo para retiro según los horarios informados.
                    </li>
                    <li>
                      <strong>Envíos Starken:</strong> 
                      <br/>- Santiago (Región Metropolitana): $2.990
                      <br/>- Otras Regiones: $3.990
                    </li>
                    <li>
                      Los plazos de entrega dependen exclusivamente de la empresa de transporte (Starken). 
                      No nos hacemos responsables por retrasos imputables a la empresa de transporte.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Pagos */}
            <section className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <CreditCard size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">3. Medios de Pago</h2>
                <p className="text-gray-600 leading-relaxed">
                  Los pagos se procesan de forma segura a través de Webpay Plus (Transbank). 
                  Aceptamos tarjetas de crédito, débito y prepago. La confirmación de la compra está sujeta a la autorización del pago por parte de la entidad bancaria.
                </p>
              </div>
            </section>

            {/* Section 4: Cambios y Devoluciones */}
            <section className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <Shield size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cambios y Devoluciones</h2>
                <p className="text-gray-600 leading-relaxed">
                  Tienes derecho a cambio de producto dentro de los 30 días siguientes a la compra, siempre que el producto esté sin uso, con etiquetas y en su embalaje original.
                  No realizamos devoluciones de dinero por arrepentimiento, solo por fallas de fábrica según lo estipulado por la ley del consumidor.
                </p>
              </div>
            </section>

            <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm mb-6">
                Última actualización: {new Date().toLocaleDateString()}
              </p>
              <Link 
                href="/cart" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
              >
                Volver al Carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
