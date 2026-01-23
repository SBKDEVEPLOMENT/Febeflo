import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image (Logo) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/logo/logo.png" 
            alt="Febeflo Background" 
            fill 
            className="object-cover opacity-90 blur-sm"
            priority
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-xl border-black">Bienvenido a Febeflo</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md font-medium">
            La mejor moda para mujer y hombre. Calidad y estilo en el corazón de Pudahuel.
          </p>
          <Link href="/shop" className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-black/90 transition-colors inline-flex items-center shadow-lg transform hover:scale-105 duration-200">
            Ver Catálogo <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Nuestras Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mujer */}
          <div className="group relative h-96 rounded-lg overflow-hidden shadow-lg bg-gray-200">
            <div className="absolute inset-0 transition-colors flex items-center justify-center">
              <Image 
                src="/logo/logo_mujer.png" 
                alt="Colección Mujer" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
              <h3 className="text-4xl font-bold text-white drop-shadow-lg">Mujer</h3>
            </div>
            <Link href="/shop?category=mujer" className="absolute inset-0"><span className="sr-only">Ver Mujer</span></Link>
          </div>

          {/* Hombre */}
          <div className="group relative h-96 rounded-lg overflow-hidden shadow-lg bg-gray-200">
            <div className="absolute inset-0 transition-colors flex items-center justify-center">
              <Image 
                src="/logo/logo_hombre.ong.png" 
                alt="Colección Hombre" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
              <h3 className="text-4xl font-bold text-white drop-shadow-lg">Hombre</h3>
            </div>
            <Link href="/shop?category=hombre" className="absolute inset-0"><span className="sr-only">Ver Hombre</span></Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">¿Por qué elegir Febeflo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">Seleccionamos las mejores prendas para ti.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Atención Rápida</h3>
              <p className="text-gray-600">Respondemos tus dudas por WhatsApp al instante.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ubicación Conveniente</h3>
              <p className="text-gray-600">
                <a 
                  href="https://maps.app.goo.gl/F8nBGqmQ7K3xFdXH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors hover:underline"
                >
                  Encuéntranos fácilmente en Persa Teniente Cruz.
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
