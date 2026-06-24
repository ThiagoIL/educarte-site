import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite's import.meta.env
// We configure Vite to accept 'NEXT_PUBLIC_' prefix in vite.config.ts
const supabaseUrl = (import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseKey = (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();

// Create a single Supabase client for storage upload
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * Falls back to throwing an error if Supabase credentials are not configured.
 * 
 * @param file The file to upload
 * @param bucketName The name of the storage bucket (defaults to 'images')
 */
export const uploadFileToSupabase = async (file: File, bucketName: string = 'images'): Promise<string> => {
  if (!supabase) {
    throw new Error(
      'Supabase não está configurado. Certifique-se de definir NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no arquivo .env'
    );
  }

  // Generate a unique file path to prevent collision
  const fileExt = file.name.split('.').pop() || '';
  const cleanFileName = file.name
    .replace(/[^\w.-]/g, '_') // Replace non-alphanumeric characters with underscores
    .split('.')
    .slice(0, -1)
    .join('.');
  const uniqueName = `${cleanFileName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  // Upload the file to the specified bucket
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniqueName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro de upload no Supabase Storage:', error);
    throw error;
  }

  // Retrieve the public URL of the uploaded asset
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(uniqueName);

  return publicUrl;
};
