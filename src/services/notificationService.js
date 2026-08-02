import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';

const DEMO_NOTIFICATIONS = [
  { id: '1', type: 'application', title: 'Application Viewed', message: 'Your application was viewed.', read: false, created_at: new Date().toISOString() }
];

export const notificationService = {
  async getNotifications(userId) {
    if (!isConfigured()) return { data: DEMO_NOTIFICATIONS, error: null };
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return { data, error };
  },
  async markAsRead(notificationId) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    return { error };
  },
  async markAllAsRead(userId) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
    return { error };
  },
  async deleteNotification(notificationId) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);
    return { error };
  },
  async createNotification(userId, type, title, message, link = null) {
    if (!isConfigured()) return { data: { id: Date.now().toString(), user_id: userId, type, title, message, link, read: false }, error: null };
    const { data, error } = await supabase.from('notifications').insert([{ user_id: userId, type, title, message, link }]).select().single();
    return { data, error };
  }
};
