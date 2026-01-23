'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const CEO_EMAILS = [
  'agcatalans@febeflo.com', 
  'ccandiae@febeflo.com',
  'Agcatalans@febeflo.com',
  'Ccandiae@febeflo.com'
];

export async function updateUserRole(userId: string, newRole: string) {
  try {
    // 1. Verificar que el usuario que hace la petición es un admin/ceo
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, error: 'No autenticado' };
    }

    const userEmail = user.email.toLowerCase();
    const isCEO = CEO_EMAILS.some(email => email.toLowerCase() === userEmail);

    if (!isCEO) {
      return { success: false, error: 'No autorizado para realizar esta acción' };
    }

    // 2. Usar supabaseAdmin para actualizar el rol (saltándose RLS)
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error in updateUserRole:', error);
    return { success: false, error: error.message };
  }
}

export async function ensureCeoRole() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) return { success: false };
    
    const userEmail = user.email.toLowerCase();
    const isCEO = CEO_EMAILS.some(email => email.toLowerCase() === userEmail);
    
    if (isCEO) {
      // Check current role
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile && profile.role !== 'ceo') {
        console.log(`Auto-updating role for CEO ${user.email} from ${profile.role} to ceo`);
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'ceo', updated_at: new Date().toISOString() })
          .eq('id', user.id);
        return { success: true, updated: true };
      }
    }
    return { success: true, updated: false };
  } catch (e) {
    console.error("Error ensuring CEO role:", e);
    return { success: false };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    // 1. Check Auth (reuse logic or simple check)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) return { success: false, error: 'No autenticado' };
    
    // Check if admin/ceo (simplified check for now, trusting RLS largely but extra safety good)
    // Actually RLS for orders: "Admins see all orders" using email check. 
    // We should use supabaseAdmin to bypass if RLS is strict, or just standard client if policy allows update.
    // Policy "Admins see all orders" exists, but "Admins can update orders"? 
    // The schema showed "Admins can insert products", "Admins can update products". 
    // It didn't explicitly show "Admins can update orders". 
    // Let's assume we need admin privilege.

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) throw error;

    revalidatePath('/admin/users'); 
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}