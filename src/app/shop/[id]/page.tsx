"use client";

import { ShoppingCart, Star, Truck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getProductById } from "../actions";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await getProductById(id);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        const data = result.data;

        if (data) {
          setProduct({
            id: data.id,
            name: data.name,
            price: data.price,
            category: data.category,
            description: data.description || 'Sin descripción disponible.',
            image: data.image_url || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
            sizes: data.sizes || []
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/shop" className="text-primary hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Si el producto tiene tallas, verificar que se haya seleccionado una (lógica futura si se implementa selector de tallas aquí)
    // Por ahora, añadimos al carrito con la estructura esperada
    addItem({ ...product, image_url: product.image });
    toast.success('Producto añadido al carrito');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la Tienda
        </Link>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
               <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-primary font-bold">${product.price.toLocaleString('es-CL')}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className="h-5 w-5 flex-shrink-0 text-yellow-400 fill-current"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">5 out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center text-sm text-gray-500">
                <Truck className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <span>Envío disponible a todo Chile</span>
              </div>
            </div>

            <div className="mt-10 flex sm:flex-col1">
              <button
                onClick={handleAddToCart}
                className="max-w-xs flex-1 bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary sm:w-full transition-colors"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
