import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Image as ImageIcon, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeCandidate && user) {
      fetchMessages(activeCandidate.id);
      
      const channel = supabase.channel('realtime:messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          if (payload.new.sender_id === activeCandidate.id) {
            setMessages(prev => [...prev, payload.new]);
            scrollToBottom();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeCandidate, user]);

  const fetchConversations = async () => {
    // Basic mock logic - normally you'd query distinct sender/receivers where you are involved
    // and join with profiles. Here we just fetch people who applied to your jobs.
    try {
      const { data: jobs } = await supabase.from('jobs').select('id').eq('recruiter_id', user.id);
      const jobIds = jobs?.map(j => j.id) || [];
      if (!jobIds.length) return;

      const { data: apps } = await supabase
        .from('applications')
        .select('candidate:profiles!candidate_id(id, full_name, avatar_url, headline)')
        .in('job_id', jobIds);
      
      if (apps) {
        // Unique candidates
        const unique = [];
        const seen = new Set();
        apps.forEach(app => {
          if (app.candidate && !seen.has(app.candidate.id)) {
            seen.add(app.candidate.id);
            unique.push(app.candidate);
          }
        });
        setConversations(unique);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      scrollToBottom();
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeCandidate) return;

    const msg = {
      sender_id: user.id,
      receiver_id: activeCandidate.id,
      content: newMessage.trim()
    };

    try {
      // Optimistic update
      const tempMsg = { ...msg, id: Date.now().toString(), created_at: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage('');
      scrollToBottom();

      const { error } = await supabase.from('messages').insert([msg]);
      if (error) throw error;
      
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-dark border-t border-border">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border bg-surface flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <div 
              key={c.id} 
              onClick={() => setActiveCandidate(c)}
              className={`flex items-center gap-3 p-4 border-b border-border cursor-pointer transition-colors ${activeCandidate?.id === c.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-dark'}`}
            >
              <img src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name)}&background=random`} className="w-12 h-12 rounded-full border border-border" alt={c.full_name} />
              <div>
                <p className="font-medium text-text">{c.full_name}</p>
                <p className="text-xs text-text-muted truncate w-40">{c.headline}</p>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="p-8 text-center text-text-muted">No candidates available to message.</p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeCandidate ? (
          <>
            <div className="p-4 border-b border-border bg-surface flex items-center gap-3">
              <img src={activeCandidate.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeCandidate.full_name)}&background=random`} className="w-10 h-10 rounded-full" alt="" />
              <h3 className="font-semibold text-text">{activeCandidate.full_name}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => {
                const isMine = m.sender_id === user.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl p-3 ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-surface border border-border text-text rounded-bl-sm'}`}>
                      <p className="text-sm">{m.content}</p>
                      <span className={`text-[10px] mt-1 block ${isMine ? 'text-white/70' : 'text-text-muted'}`}>
                        {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-border bg-surface flex gap-2">
              <button type="button" className="p-2 text-text-muted hover:text-primary transition-colors">
                <ImageIcon size={20} />
              </button>
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-dark border border-border rounded-lg px-4 py-2 text-sm text-text focus:border-primary outline-none"
              />
              <button type="submit" disabled={!newMessage.trim()} className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <UserCircle size={64} className="mb-4 opacity-50" />
            <p>Select a candidate to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
