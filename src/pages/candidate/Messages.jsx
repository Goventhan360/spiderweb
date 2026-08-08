import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Image as ImageIcon, Check, CheckCheck, Paperclip } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activePartner) {
      fetchMessages(activePartner.id);
      markAsRead(activePartner.id);
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`messages:${user.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          if (payload.new.sender_id === activePartner.id) {
            setMessages(prev => [...prev, payload.new]);
            markAsRead(activePartner.id);
          } else {
            // New message from someone else, refresh conversations list to update unread
            fetchConversations();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activePartner, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // To get unique conversations, we fetch all messages involving the user, then group.
      // A proper messaging schema would have a 'conversations' table, but we use 'messages' grouping here.
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, full_name, avatar_url, role),
          receiver:profiles!receiver_id(id, full_name, avatar_url, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by partner
      const map = new Map();
      (data || []).forEach(msg => {
        const partner = msg.sender_id === user.id ? msg.receiver : msg.sender;
        if (!map.has(partner.id)) {
          map.set(partner.id, {
            partner,
            lastMessage: msg,
            unreadCount: (msg.receiver_id === user.id && !msg.is_read) ? 1 : 0
          });
        } else {
          const existing = map.get(partner.id);
          if (msg.receiver_id === user.id && !msg.is_read) {
            existing.unreadCount += 1;
          }
        }
      });

      setConversations(Array.from(map.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (partnerId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', partnerId)
        .eq('is_read', false);
      
      // Update local state to remove unread badge
      setConversations(prev => prev.map(c => 
        c.partner.id === partnerId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;
    
    const content = newMessage.trim();
    setNewMessage('');
    
    try {
      setSending(true);
      
      // Optimistic update
      const tempMsg = {
        id: 'temp-' + Date.now(),
        sender_id: user.id,
        receiver_id: activePartner.id,
        content,
        created_at: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, tempMsg]);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activePartner.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      
      // Replace optimistic message with actual
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? data : m));
      
      // Update conversation list last message
      setConversations(prev => {
        const idx = prev.findIndex(c => c.partner.id === activePartner.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx].lastMessage = data;
          // move to top
          const [moved] = updated.splice(idx, 1);
          updated.unshift(moved);
          return updated;
        }
        return prev;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove optimistic message
      setMessages(prev => prev.filter(m => !m.id.toString().startsWith('temp-')));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      
      {/* Conversations List (Sidebar) */}
      <div className={`w-full md:w-80 border-r border-border flex flex-col bg-surface-alt ${activePartner ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border bg-surface">
          <h2 className="text-xl font-bold text-text">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((c) => (
              <div 
                key={c.partner.id} 
                onClick={() => setActivePartner(c.partner)}
                className={`flex gap-3 p-4 cursor-pointer transition-colors border-b border-border/50 hover:bg-surface ${activePartner?.id === c.partner.id ? 'bg-surface border-l-4 border-l-primary' : ''}`}
              >
                <div className="relative">
                  <Avatar src={c.partner.avatar_url} fallback={c.partner.full_name?.[0]} className="w-12 h-12" />
                  {c.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-text truncate">{c.partner.full_name}</h3>
                    <span className="text-xs text-text-muted shrink-0">
                      {new Date(c.lastMessage.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${c.unreadCount > 0 ? 'text-text font-medium' : 'text-text-muted'}`}>
                    {c.lastMessage.sender_id === user.id ? 'You: ' : ''}{c.lastMessage.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-text-muted">
              <p>No messages yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Thread (Main area) */}
      <div className={`flex-1 flex flex-col bg-surface ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
        {activePartner ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-border flex items-center gap-4 bg-surface z-10 shadow-sm">
              <button className="md:hidden text-text-muted hover:text-text" onClick={() => setActivePartner(null)}>
                ← Back
              </button>
              <Avatar src={activePartner.avatar_url} fallback={activePartner.full_name?.[0]} className="w-10 h-10" />
              <div>
                <h3 className="font-semibold text-text">{activePartner.full_name}</h3>
                <p className="text-xs text-primary capitalize">{activePartner.role || 'User'}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-alt/30">
              {messages.map((msg, idx) => {
                const isOwn = msg.sender_id === user.id;
                const showAvatar = idx === 0 || messages[idx-1].sender_id !== msg.sender_id;
                
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isOwn ? 'ml-auto flex-row-reverse' : ''}`}>
                    {showAvatar ? (
                      <Avatar 
                        src={isOwn ? user.user_metadata?.avatar_url : activePartner.avatar_url} 
                        fallback={isOwn ? 'U' : activePartner.full_name?.[0]} 
                        className="w-8 h-8 shrink-0 mt-auto" 
                      />
                    ) : <div className="w-8" />}
                    
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl ${isOwn ? 'bg-primary text-primary-content rounded-br-none' : 'bg-surface border border-border text-text rounded-bl-none'}`}>
                        <p className="whitespace-pre-wrap break-words text-sm">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {isOwn && (msg.is_read ? <CheckCheck size={12} className="text-blue-400" /> : <Check size={12} />)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-border">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                <button type="button" className="p-3 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-surface-alt shrink-0">
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 max-h-32 min-h-[44px] p-3 bg-surface-alt border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={1}
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || sending} 
                  className="shrink-0 h-11 w-11 rounded-full p-0 flex items-center justify-center"
                >
                  <Send size={18} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <EmptyState 
            icon={<Send size={48} className="text-text-muted/50" />}
            title="Your Messages"
            description="Select a conversation from the sidebar to start messaging."
          />
        )}
      </div>
    </div>
  );
}
