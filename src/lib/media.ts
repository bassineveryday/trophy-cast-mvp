// Helpers for uploading and viewing media in Supabase storage (bucket: media).

import { supabase } from './supabaseClient';

export async function uploadMedia(file: File, prefix = "photos"): Promise<string> {
  const uniqueKey = `${prefix}/${crypto.randomUUID()}-${file.name}`;
  
  const { error } = await supabase.storage
    .from('media')
    .upload(uniqueKey, file);
    
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  return uniqueKey;
}

export async function signedUrl(key: string, expiresSec = 600): Promise<string> {
  const { data, error } = await supabase.storage
    .from('media')
    .createSignedUrl(key, expiresSec);
    
  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message || 'Unknown error'}`);
  }
  
  return data.signedUrl;
}