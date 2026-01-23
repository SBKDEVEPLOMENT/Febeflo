'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function uploadProductImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) return { success: false, error: 'No se proporcionó ningún archivo' }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `products/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath)

    return { success: true, url: data.publicUrl }
  } catch (error: any) {
    console.error('Error al subir imagen:', error)
    return { success: false, error: error.message }
  }
}
