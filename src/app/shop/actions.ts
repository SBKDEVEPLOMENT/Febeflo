'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products (admin):", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Unexpected error fetching products:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getProductById(id: number) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching product (admin):", error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data: data };
  } catch (error: any) {
    console.error("Unexpected error fetching product:", error);
    return { success: false, error: error.message, data: null };
  }
}
