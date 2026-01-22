"use client";

import Link from "next/link";
import { Filter, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

// Mock Data (Fallback)
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Vestido Floral Verano',
    price: 24990,
    category: 'mujer',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 2,
    name: 'Jeans Slim Fit',
    price: 19990,
    category: 'mujer',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    sizes: ['36', '38', '40', '42']
  },
  {
    id: 3,
    name: 'Camisa Casual Hombre',
    price: 15990,
    category: 'hombre',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL']
  },
];

export default function ShopPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        // Map database fields to frontend structure if needed
        const mappedProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          image: p.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop', // Fallback image
          sizes: p.sizes || []
        }));
        setProducts(mappedProducts);
      }
    };
    
    fetchProducts();
  }, []);

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePriceChange = (range: string) => {
    if (selectedPriceRanges.includes(range)) {
      setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, range]);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    let priceMatch = selectedPriceRanges.length === 0;
    if (!priceMatch) {
      for (const range of selectedPriceRanges) {
        if (range === 'low' && product.price <= 10000) priceMatch = true;
        if (range === 'medium' && product.price > 10000 && product.price <= 20000) priceMatch = true;
        if (range === 'high' && product.price > 20000) priceMatch = true;
      }
    }

    return categoryMatch && priceMatch;
  });

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size
    });
  };

  const handleAddToCart = (product: typeof products[0]) => {
    const selectedSize = selectedSizes[product.id];
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error("Por favor selecciona una talla");
      return;
    }

    addItem({
      ...product,
      image_url: product.image
    }, selectedSize);
    
    toast.success("Producto añadido al carrito");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Catálogo Febeflo</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2" />
                <h2 className="font-bold text-lg">Filtros</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Categoría</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary"
                        checked={selectedCategories.includes('mujer')}
                        onChange={() => handleCategoryChange('mujer')}
                      />
                      <span className="ml-2 text-gray-600">Mujer</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary"
                        checked={selectedCategories.includes('hombre')}
                        onChange={() => handleCategoryChange('hombre')}
                      />
                      <span className="ml-2 text-gray-600">Hombre</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Precio</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary"
                        checked={selectedPriceRanges.includes('low')}
                        onChange={() => handlePriceChange('low')}
                      />
                      <span className="ml-2 text-gray-600">Hasta $10.000</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary"
                        checked={selectedPriceRanges.includes('medium')}
                        onChange={() => handlePriceChange('medium')}
                      />
                      <span className="ml-2 text-gray-600">$10.000 - $20.000</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary"
                        checked={selectedPriceRanges.includes('high')}
                        onChange={() => handlePriceChange('high')}
                      />
                      <span className="ml-2 text-gray-600">Más de $20.000</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-96">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 px-4 pb-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link href={`/shop/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
                      </div>
                      <p className="text-lg font-bold text-primary">${product.price.toLocaleString('es-CL')}</p>
                    </div>

                    {/* Selector de Tallas */}
                    <div className="mt-3 relative z-10">
                      <p className="text-sm font-medium text-gray-700 mb-2">Tallas:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes?.map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSizeSelect(product.id, size);
                            }}
                            className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                              selectedSizes[product.id] === size
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors z-10 relative"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al Carrito
                      </button>
                    </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
