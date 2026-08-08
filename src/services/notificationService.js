import { supabase } from '@/supabase/client';

export const notificationService = {
  async getNotifications(userId, limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async markAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    return { data, error };
  },

  async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return { error };
  },

  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .match({ user_id: userId, is_read: false });
    return { count: count || 0, error };
  },

  async createNotification({ user_id, type, title, message, link }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ user_id, type, title, message, link })
      .select()
      .single();
    return { data, error };
  },

  subscribeToNotifications(userId, callback) {
    return supabase.channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, payload => {
        callback(payload.new);
      })
      .subscribe();
  }
};
