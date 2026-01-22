"use client";

import { ShoppingCart, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const itemsCount = useCartStore((state) => state.getItemsCount());
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="relative h-20 w-20 mr-2">
                <Image
                  src="/logo/logo.png"
                  alt="Febeflo Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">Inicio</Link>
            <Link href="/shop" className="text-gray-600 hover:text-primary transition-colors">Tienda</Link>
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">Nosotros</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">Contacto</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="p-2 text-gray-600 hover:text-primary transition-colors">
              <User size={24} />
            </Link>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary transition-colors relative">
              <ShoppingCart size={24} />
              {mounted && itemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Inicio</Link>
            <Link href="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Tienda</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Nosotros</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contacto</Link>
            <Link href="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center">
              <ShoppingCart size={20} className="mr-2" /> Carrito ({mounted ? itemsCount : 0})
            </Link>
            <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center">
              <User size={20} className="mr-2" /> Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
