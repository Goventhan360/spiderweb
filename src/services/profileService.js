import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';
import { storageService } from './storageService';

const DEMO_PROFILE = {
  id: 'demo-user-123',
  full_name: 'Demo User',
  headline: 'AI Enthusiast & Software Engineer',
  about: 'Passionate about building AI-driven solutions.',
  location: 'San Francisco, CA',
  avatar_url: null,
  resume_url: null,
  skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
};

export const profileService = {
  async getProfile(userId) {
    if (!isConfigured()) return { data: DEMO_PROFILE, error: null };
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
  },

  async updateProfile(userId, data) {
    if (!isConfigured()) return { data: { ...DEMO_PROFILE, ...data }, error: null };
    const { data: result, error } = await supabase.from('profiles').update(data).eq('id', userId).select().single();
    return { data: result, error };
  },

  async uploadAvatar(userId, file) {
    if (!isConfigured()) return { url: 'https://demo.webloom.ai/avatar.png', error: null };
    const path = `${userId}/${Date.now()}_${file.name}`;
    const { url, error } = await storageService.uploadFile('avatars', path, file);
    if (!error && url) {
      await this.updateProfile(userId, { avatar_url: url });
    }
    return { url, error };
  },

  async uploadResume(userId, file) {
    if (!isConfigured()) return { url: 'https://demo.webloom.ai/resume.pdf', error: null };
    const path = `${userId}/${Date.now()}_${file.name}`;
    const { url, error } = await storageService.uploadFile('resumes', path, file);
    if (!error && url) {
      await this.updateProfile(userId, { resume_url: url });
    }
    return { url, error };
  },

  async getProfileWithDetails(userId) {
    if (!isConfigured()) return { data: DEMO_PROFILE, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        education (*),
        experience (*),
        projects (*),
        certificates (*)
      `)
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async searchProfiles(query, filters = {}) {
    if (!isConfigured()) return { data: [DEMO_PROFILE], error: null };
    let q = supabase.from('profiles').select('*');
    if (query) {
      q = q.or(`full_name.ilike.%${query}%,headline.ilike.%${query}%,about.ilike.%${query}%`);
    }
    const { data, error } = await q;
    return { data, error };
  }
};
