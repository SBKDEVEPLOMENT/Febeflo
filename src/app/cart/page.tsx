"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webpayData, setWebpayData] = useState<{url: string, token: string} | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (webpayData && formRef.current) {
      formRef.current.submit();
    }
  }, [webpayData]);

  const total = getTotal();
  const shipping = 3990; // Costo de envío fijo (ejemplo)
  const finalTotal = total + shipping;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const buyOrder = "O-" + Math.floor(Math.random() * 1000000);
      const sessionId = "S-" + Math.floor(Math.random() * 1000000);
      
      const response = await fetch('/api/webpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              amount: finalTotal,
              buyOrder,
              sessionId
          })
      });
      
      const data = await response.json();
      
      if (data.token && data.url) {
          setWebpayData({ url: data.url, token: data.token });
          toast.success("Redirigiendo a Webpay...");
      } else {
          toast.error("Error al iniciar pago con Webpay: " + (data.error || "Desconocido"));
          setIsLoading(false);
      }
    } catch (error) {
        console.error(error);
        toast.error("Error de conexión al iniciar el pago");
        setIsLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          ¡Parece que aún no has añadido nada! Explora nuestra colección y encuentra algo que te encante.
        </p>
        <Link 
          href="/shop" 
          className="bg-primary text-white px-8 py-3 rounded-full hover:bg-secondary transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.image_url || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-600 mt-1">Talla: <span className="font-semibold">{item.selectedSize}</span></p>
                  )}
                  <p className="text-primary font-bold mt-1">${item.price.toLocaleString("es-CL")}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => removeItem(item.id, item.selectedSize)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío estimado</span>
                  <span>${shipping.toLocaleString("es-CL")}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString("es-CL")}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-secondary transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Pagar con Webpay
                </button>
                <Link 
                  href="/shop"
                  className="block w-full text-center text-primary hover:text-secondary font-medium text-sm"
                >
                  Continuar Comprando
                </Link>
              </div>

              <div className="mt-6 text-xs text-gray-500 text-center">
                <p>Pagos seguros procesados por Transbank Webpay.</p>
                <p className="mt-2">Nota: Al hacer clic en pagar, serás redirigido al portal de Webpay. El monto total es <span className="font-bold">${finalTotal.toLocaleString("es-CL")}</span>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden form for Webpay redirection */}
        <form ref={formRef} action={webpayData?.url} method="POST" className="hidden">
          <input type="hidden" name="token_ws" value={webpayData?.token} />
        </form>
      </div>
    </div>
  );
}
