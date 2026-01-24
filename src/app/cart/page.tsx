"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { STARKEN_BRANCHES, SHOP_LOCATION } from "@/constants/shipping";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, Loader2, Store, Truck, MapPin, Info, Phone } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { createClient } from "@/utils/supabase/client";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webpayData, setWebpayData] = useState<{url: string, token: string} | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Shipping State
  const [shippingMethod, setShippingMethod] = useState<'store' | 'starken'>('starken');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    // Cargar teléfono del perfil si existe
    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setIsVerified(!!user.phone_confirmed_at);
            const { data } = await supabase.from('profiles').select('phone').eq('id', user.id).single();
            if (data?.phone) setPhone(data.phone);
        }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (webpayData && formRef.current) {
      formRef.current.submit();
    }
  }, [webpayData]);

  const total = getTotal();
  
  // Calculate Shipping Cost
  const getShippingCost = () => {
    if (shippingMethod === 'store') return 0;
    // If region is Metropolitana or commune is in Santiago (simplified logic based on user request)
    // User requested: "si es en santiago 2990, si es en otra parte de Chile 3990"
    if (selectedRegion === 'Metropolitana') return 2990;
    return 3990;
  };

  const shippingCost = getShippingCost();
  const finalTotal = total + shippingCost;

  // Filter logic for Starken selectors
  const uniqueRegions = Array.from(new Set(STARKEN_BRANCHES.map(b => b.region)));
  const availableCommunes = selectedRegion 
    ? Array.from(new Set(STARKEN_BRANCHES.filter(b => b.region === selectedRegion).map(b => b.commune)))
    : [];
  const availableBranches = selectedRegion && selectedCommune
    ? STARKEN_BRANCHES.filter(b => b.region === selectedRegion && b.commune === selectedCommune)
    : [];

  const handleCheckout = async () => {
    if (!termsAccepted) {
      toast.error("Debes aceptar los Términos y Condiciones para continuar");
      return;
    }

    if (!isVerified) {
      toast.error("Debes verificar tu número de teléfono para continuar");
      return;
    }

    if (shippingMethod === 'starken' && (!selectedRegion || !selectedCommune || !selectedBranch)) {
      toast.error("Por favor completa los datos de envío Starken");
      return;
    }

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
              sessionId,
              // We could send shipping info here if backend supported it
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
          {/* Left Column: Items and Shipping */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Talla: {item.selectedSize}</p>
                      <p className="text-primary font-bold mt-2">${item.price.toLocaleString("es-CL")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedSize)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="text-primary" /> Método de Entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label 
                  className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    shippingMethod === 'starken' 
                      ? 'border-primary bg-blue-50/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="starken" 
                    checked={shippingMethod === 'starken'} 
                    onChange={() => setShippingMethod('starken')}
                    className="absolute opacity-0"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">Envío Starken</span>
                    <Truck size={20} className={shippingMethod === 'starken' ? 'text-primary' : 'text-gray-400'} />
                  </div>
                  <p className="text-sm text-gray-500">Retiro en agencia Starken cercana</p>
                  <p className="text-sm font-medium text-primary mt-2">Desde $2.990</p>
                </label>

                <label 
                  className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    shippingMethod === 'store' 
                      ? 'border-primary bg-blue-50/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="store" 
                    checked={shippingMethod === 'store'} 
                    onChange={() => setShippingMethod('store')}
                    className="absolute opacity-0"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">Retiro en Tienda</span>
                    <Store size={20} className={shippingMethod === 'store' ? 'text-primary' : 'text-gray-400'} />
                  </div>
                  <p className="text-sm text-gray-500">Retira gratis en nuestro local</p>
                  <p className="text-sm font-medium text-green-600 mt-2">Gratis</p>
                </label>
              </div>

              {/* Starken Options */}
              {shippingMethod === 'starken' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                      <Info size={16} className="mt-0.5 flex-shrink-0" />
                      Selecciona tu agencia Starken más cercana. El costo se calculará automáticamente según la región.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                      <select 
                        value={selectedRegion}
                        onChange={(e) => {
                          setSelectedRegion(e.target.value);
                          setSelectedCommune('');
                          setSelectedBranch('');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Selecciona una región</option>
                        {uniqueRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                      <select 
                        value={selectedCommune}
                        onChange={(e) => {
                          setSelectedCommune(e.target.value);
                          setSelectedBranch('');
                        }}
                        disabled={!selectedRegion}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Selecciona una comuna</option>
                        {availableCommunes.map(commune => (
                          <option key={commune} value={commune}>{commune}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedCommune && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agencia Starken</label>
                      <select 
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Selecciona una agencia</option>
                        {availableBranches.map(branch => (
                          <option key={branch.name} value={branch.name}>
                            {branch.name} - {branch.address}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Store Pickup Info */}
              {shippingMethod === 'store' && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Información de Retiro
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <span className="font-medium text-gray-900 min-w-[70px]">Dirección:</span>
                      {SHOP_LOCATION.address}
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-medium text-gray-900 min-w-[70px]">Horario:</span>
                      {SHOP_LOCATION.schedule}
                    </p>
                    <div className="pt-2">
                      <a 
                        href={SHOP_LOCATION.googleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-secondary underline font-medium"
                      >
                        Ver ubicación en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío ({shippingMethod === 'store' ? 'Retiro' : 'Starken'})</span>
                  <span className={shippingMethod === 'store' ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString("es-CL")}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString("es-CL")}</span>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+56 9 1234 5678"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                            isVerified ? 'border-green-500 focus:border-green-500' : 'border-gray-300 focus:border-primary'
                        }`}
                    />
                    {isVerified && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                             <span className="text-green-500 text-sm font-bold">✓</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-start mt-1">
                    <p className="text-xs text-gray-500">
                        Necesario para coordinar la entrega o retiro.
                    </p>
                    {!isVerified && phone && (
                        <Link href="/profile" className="text-xs text-yellow-600 hover:text-yellow-700 hover:underline font-medium flex items-center gap-1">
                             ⚠ No verificado. Verificar aquí.
                        </Link>
                    )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-primary checked:bg-primary"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    He leído y acepto los <Link href="/terms" className="text-primary hover:underline font-medium" target="_blank">Términos y Condiciones</Link>
                  </span>
                </label>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading || !termsAccepted}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform flex items-center justify-center gap-2
                  ${isLoading || !termsAccepted
                    ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                    : 'bg-gray-900 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar y Pagar
                  </>
                )}
              </button>
              
              {!termsAccepted && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  Debes aceptar los términos para continuar
                </p>
              )}

              {/* Webpay Form Hidden */}
              <form action={webpayData?.url} method="POST" ref={formRef}>
                <input type="hidden" name="token_ws" value={webpayData?.token} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
