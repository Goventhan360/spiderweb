import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';
import { storageService } from './storageService';

const DEMO_CONVERSATIONS = [
  { id: '1', participant: { id: 'user-2', full_name: 'John Recruiter' }, last_message: 'Hi there!', unread: 2 }
];

const DEMO_MESSAGES = [
  { id: '1', sender_id: 'user-2', receiver_id: 'demo-user-123', content: 'Hi there!', created_at: new Date().toISOString() }
];

export const messageService = {
  async getConversations(userId) {
    if (!isConfigured()) return { data: DEMO_CONVERSATIONS, error: null };
    const { data, error } = await supabase.from('conversations').select('*').contains('participants', [userId]);
    return { data, error };
  },
  async getMessages(senderId, receiverId) {
    if (!isConfigured()) return { data: DEMO_MESSAGES, error: null };
    const { data, error } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`).order('created_at', { ascending: true });
    return { data, error };
  },
  async sendMessage(senderId, receiverId, content, fileUrl = null) {
    if (!isConfigured()) return { data: { id: Date.now().toString(), sender_id: senderId, receiver_id: receiverId, content, fileUrl }, error: null };
    const { data, error } = await supabase.from('messages').insert([{ sender_id: senderId, receiver_id: receiverId, content, fileUrl }]).select().single();
    return { data, error };
  },
  async markAsRead(messageId) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', messageId);
    return { error };
  },
  subscribeToMessages(userId, callback) {
    if (!isConfigured()) return { unsubscribe: () => {} };
    const subscription = supabase.channel(`public:messages:receiver_id=eq.${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` }, payload => callback(payload.new))
      .subscribe();
    return subscription;
  },
  async uploadChatFile(file) {
    if (!isConfigured()) return { url: 'https://demo.webloom.ai/chat/file.png', error: null };
    const path = `${Date.now()}_${file.name}`;
    const { url, error } = await storageService.uploadFile('chat-files', path, file);
    return { url, error };
  }
};
