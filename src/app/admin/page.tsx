"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  sizes: string[];
}

export default function AdminDashboard() {
  // Estado inicial vacío, se llenará con Supabase
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setProducts(data);
      }
    };
    
    fetchProducts();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'hombre',
    sizes: [],
    image_url: ''
  });

  const SIZES = {
    hombre: ["S", "M", "L", "XL", "XXL", "40", "42", "44", "46", "48", "50", "52", "54"],
    mujer: ["S", "M", "L", "XL", "36", "38", "40", "42", "44", "46"]
  };

  const currentAvailableSizes = currentProduct.category === 'mujer' ? SIZES.mujer : SIZES.hombre;

  const handleSizeToggle = (size: string) => {
    const currentSizes = currentProduct.sizes || [];
    if (currentSizes.includes(size)) {
      setCurrentProduct({
        ...currentProduct,
        sizes: currentSizes.filter(s => s !== size)
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        sizes: [...currentSizes, size]
      });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: currentProduct.name,
        price: currentProduct.price,
        category: currentProduct.category,
        sizes: currentProduct.sizes,
        image_url: currentProduct.image_url || "/placeholder-product.jpg"
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;

      if (data) {
        setProducts([data[0] as Product, ...products]);
        setIsModalOpen(false);
        setCurrentProduct({ name: '', price: 0, category: 'hombre', sizes: [], image_url: '' });
        alert("Producto guardado exitosamente");
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert("Error al guardar el producto: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-primary hover:bg-teal-600 shadow-sm"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Producto
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          
          {/* Lista de Productos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden mr-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price.toLocaleString('es-CL')}</p>
                        <div className="flex gap-1 mt-1">
                          {product.sizes.map(size => (
                            <span key={size} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-500">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Modal de Creación/Edición */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input 
                      type="text" 
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2 border"
                      value={currentProduct.name}
                      onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio (CLP)</label>
                      <input 
                        type="number" 
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2 border"
                        value={currentProduct.price}
                        onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría</label>
                      <select 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2 border"
                        value={currentProduct.category}
                        onChange={e => setCurrentProduct({...currentProduct, category: e.target.value, sizes: []})}
                      >
                        <option value="hombre">Hombre</option>
                        <option value="mujer">Mujer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tallas Disponibles ({currentProduct.category === 'mujer' ? 'Mujer' : 'Hombre'})</label>
                    <div className="flex flex-wrap gap-2">
                      {currentAvailableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                            currentProduct.sizes?.includes(size)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-600"
                    >
                      Guardar Producto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
