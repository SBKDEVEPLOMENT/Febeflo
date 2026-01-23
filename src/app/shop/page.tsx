"use client";

import Link from "next/link";
import Image from "next/image";
import { Filter, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { getProducts } from "./actions";
import { useSearchParams } from "next/navigation";
import { PRODUCT_CATEGORIES, CategoryKey } from "@/constants/categories";

function ShopContent() {
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'selection' | 'products'>('selection');
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
      setViewMode('products');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getProducts();
        
        if (!result.success) {
          throw new Error(result.error);
        }

        const data = result.data;

        if (data) {
          const mappedProducts = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            subcategory: p.subcategory,
            image: p.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
            sizes: p.sizes || []
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error al cargar productos");
      } finally {
        setLoading(false);
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
    // Clear subcategories when main category changes to avoid invalid filters
    setSelectedSubcategories([]); 
  };

  const handleSubcategoryChange = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
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
    // Normalización de categorías para comparación flexible (ej: "Mujeres" coincide con "mujer")
    const productCat = product.category?.toLowerCase() || '';
    
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(selected => {
      const selectedLower = selected.toLowerCase();
      return productCat.includes(selectedLower) || selectedLower.includes(productCat);
    });

    const subcategoryMatch = selectedSubcategories.length === 0 || 
      (product.subcategory && selectedSubcategories.some(s => s.toLowerCase() === product.subcategory.toLowerCase()));
    
    let priceMatch = selectedPriceRanges.length === 0;
    if (!priceMatch) {
      for (const range of selectedPriceRanges) {
        if (range === 'low' && product.price <= 10000) priceMatch = true;
        if (range === 'medium' && product.price > 10000 && product.price <= 20000) priceMatch = true;
        if (range === 'high' && product.price > 20000) priceMatch = true;
      }
    }

    return categoryMatch && subcategoryMatch && priceMatch;
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

  if (viewMode === 'selection') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">¿Qué estás buscando hoy?</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => {
                setSelectedCategories(['hombre']);
                setViewMode('products');
              }}
              className="group relative aspect-[16/9] md:aspect-[2/1] bg-gray-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo/logo_hombre.ong.png"
                    alt="Colección Hombre"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide">HOMBRE</h2>
                <p className="text-white/90 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  Ver Colección
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedCategories(['mujer']);
                setViewMode('products');
              }}
              className="group relative aspect-[16/9] md:aspect-[2/1] bg-gray-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo/logo_mujer.png"
                    alt="Colección Mujer"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide">MUJER</h2>
                <p className="text-white/90 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  Ver Colección
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setViewMode('selection');
                setSelectedCategories([]);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Volver a categorías"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo Febeflo</h1>
          </div>
        </div>
        
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
                        checked={selectedCategories.some(c => c.toLowerCase().includes('mujer'))}
                        onChange={() => handleCategoryChange('mujer')}
                      />
                      <span className="ml-2 text-gray-600">Mujer</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary"
                        checked={selectedCategories.some(c => c.toLowerCase().includes('hombre'))}
                        onChange={() => handleCategoryChange('hombre')}
                      />
                      <span className="ml-2 text-gray-600">Hombre</span>
                    </label>
                  </div>
                </div>

                {/* Subcategories Filter */}
                {selectedCategories.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-medium mb-4">Tipo de Prenda</h3>
                    <div className="space-y-6">
                      {Object.entries(PRODUCT_CATEGORIES)
                        .filter(([key]) => selectedCategories.some(c => key.toLowerCase().includes(c.toLowerCase())))
                        .map(([key, config]) => (
                          <div key={key}>
                            {selectedCategories.length > 1 && (
                              <h4 className="text-sm font-semibold text-primary mb-3">{config.label}</h4>
                            )}
                            
                            {config.groups.map((group) => (
                              <div key={group.name} className="mb-4 last:mb-0">
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{group.name}</h5>
                                <div className="space-y-2 pl-1">
                                  {group.items.map((item) => (
                                    <label key={item} className="flex items-center cursor-pointer hover:text-primary transition-colors">
                                      <input 
                                        type="checkbox" 
                                        className="rounded text-primary focus:ring-primary border-gray-300"
                                        checked={selectedSubcategories.includes(item)}
                                        onChange={() => handleSubcategoryChange(item)}
                                      />
                                      <span className="ml-2 text-sm text-gray-600">{item}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-4">
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
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos.</p>
              </div>
            ) : (
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
                        {product.sizes?.map((size: string) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
