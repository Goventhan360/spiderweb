import { supabase } from '@/supabase/client';
import { isConfigured } from '@/utils/helpers';

const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@webloom.ai',
  role: 'candidate',
  user_metadata: { full_name: 'Demo User' },
};

export const authService = {
  async signUp(email, password, metadata) {
    if (!isConfigured()) return { user: { ...DEMO_USER, email, user_metadata: metadata }, error: null };
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    return { user: data?.user, error };
  },

  async signIn(email, password) {
    if (!isConfigured()) {
      if (email.includes('error')) return { user: null, error: { message: 'Invalid credentials' } };
      return { user: DEMO_USER, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data?.user, error };
  },

  async signInWithGoogle() {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    return { error };
  },

  async signOut() {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    return { error };
  },

  async updatePassword(newPassword) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  },

  async getSession() {
    if (!isConfigured()) return { session: { user: DEMO_USER, access_token: 'demo-token' }, error: null };
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session, error };
  },

  async getUser() {
    if (!isConfigured()) return { user: DEMO_USER, error: null };
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user, error };
  }
};
