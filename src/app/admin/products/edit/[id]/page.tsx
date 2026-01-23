"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, Plus, Save, ArrowLeft, Link as LinkIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { uploadProductImage } from '../../actions';
import { PRODUCT_CATEGORIES, CategoryKey } from '@/constants/categories';

type Variant = {
  size: string;
  color: string;
  stock: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageType, setImageType] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [variants, setVariants] = useState<Variant[]>([
    { size: "M", color: "Negro", stock: 0 }
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setName(data.name);
          setPrice(data.price.toString());
          setCategory(data.category);
          setSubcategory(data.subcategory || "");
          setDescription(data.description || "");
          
          if (data.image_url) {
            setImagePreview(data.image_url);
            setImageUrl(data.image_url);
            // Detect if it's a URL or uploaded file (approximate)
            if (data.image_url.startsWith('http')) {
               // Could be either, but let's default to keeping it as is unless changed
               // We won't set imageType to 'url' strictly unless user wants to edit URL
            }
          }

          if (data.variants) {
            setVariants(data.variants);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error al cargar el producto");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageType('upload');
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (imageType === 'url' && imageUrl && !imageFile) return imageUrl;
    
    // If no new file and we have an existing preview (which is the old url), return it
    if (!imageFile && imagePreview && imagePreview.startsWith('http')) return imagePreview;

    if (!imageFile && imageType === 'upload') return imagePreview; // No change

    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const result = await uploadProductImage(formData);
      
      if (!result.success) throw new Error(result.error);
      
      return result.url || null;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen: " + error.message);
      return null;
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImageUrl = await uploadImage();
      
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price: Number(price),
          category,
          subcategory,
          description,
          image_url: finalImageUrl,
          variants: variants,
          sizes: [...new Set(variants.map(v => v.size))], // Extract unique sizes
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Producto actualizado exitosamente");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error("Error al actualizar el producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Info Básica */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                placeholder="Ej: Polera Básica"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (CLP)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  placeholder="Ej: 15990"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  required
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory(""); // Reset subcategory when category changes
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              {category && PRODUCT_CATEGORIES[category as CategoryKey]?.groups.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Prenda</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  >
                    <option value="">Seleccionar...</option>
                    {PRODUCT_CATEGORIES[category as CategoryKey].groups.map((group) => (
                      <optgroup key={group.name} label={group.name}>
                        {group.items.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventario y Variantes</h2>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Talla</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                      placeholder="S, M, L..."
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                      placeholder="Rojo, Azul..."
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                      min="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Agregar Variante
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Imagen y Publicación */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Imagen del Producto</h2>
            
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setImageType('upload')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  imageType === 'upload' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Subir Archivo
              </button>
              <button
                type="button"
                onClick={() => setImageType('url')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  imageType === 'url' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Usar URL
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
              {imageType === 'upload' ? (
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-gray-600 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500 mb-2">Arrastra tu imagen aquí o</p>
                      <label className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 text-sm">
                        Seleccionar Archivo
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageFileChange} />
                      </label>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {imageUrl && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <LinkIcon size={16} className="text-gray-400" />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              "Guardando..."
            ) : (
              <>
                <Save size={20} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
