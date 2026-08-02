import { supabase } from '@/supabase/client';
import { isConfigured } from '@/utils/helpers';

export const storageService = {
  async uploadFile(bucket, path, file) {
    if (!isConfigured()) return { url: `https://demo.webloom.ai/storage/${bucket}/${path}`, error: null };
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (uploadError) return { url: null, error: uploadError };
    return this.getFileUrl(bucket, path);
  },

  async getFileUrl(bucket, path) {
    if (!isConfigured()) return { url: `https://demo.webloom.ai/storage/${bucket}/${path}`, error: null };
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  },

  async deleteFile(bucket, path) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return { error };
  },

  async downloadFile(bucket, path) {
    if (!isConfigured()) return { blob: new Blob(['demo'], { type: 'text/plain' }), error: null };
    const { data, error } = await supabase.storage.from(bucket).download(path);
    return { blob: data, error };
  }
};
