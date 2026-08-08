import { supabase } from '@/supabase/client';

export const messageService = {
  async getConversations(userId) {
    // A simplified distinct conversation getter
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    const conversationsMap = new Map();
    data.forEach(msg => {
      const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
      if (!otherUser) return;
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          latestMessage: msg,
          unreadCount: (msg.receiver_id === userId && !msg.is_read) ? 1 : 0
        });
      } else {
        const conv = conversationsMap.get(otherUser.id);
        if (msg.receiver_id === userId && !msg.is_read) {
          conv.unreadCount++;
        }
      }
    });

    return { data: Array.from(conversationsMap.values()), error: null };
  },

  async sendMessage({ sender_id, receiver_id, content, file_url = null }) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id, receiver_id, content, file_url })
      .select()
      .single();
    return { data, error };
  },

  async getMessages(userId, otherUserId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async markAsRead(senderId, receiverId) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .match({ sender_id: senderId, receiver_id: receiverId, is_read: false });
    return { data, error };
  },

  subscribeToMessages(userId, callback) {
    return supabase.channel(`messages:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      }, payload => {
        callback(payload.new);
      })
      .subscribe();
  },

  unsubscribeFromMessages(channel) {
    if (channel) supabase.removeChannel(channel);
  }
};
