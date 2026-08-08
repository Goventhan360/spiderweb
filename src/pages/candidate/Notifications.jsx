import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Briefcase, MessageSquare, Star, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up real-time subscription
      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link = null) => {
    try {
      if (id === 'all') {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
          
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success('All marked as read');
      } else {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id);
          
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        if (link) {
          window.location.href = link;
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'application': return <Briefcase className="text-blue-500" />;
      case 'message': return <MessageSquare className="text-green-500" />;
      case 'recommendation': return <Star className="text-yellow-500" />;
      case 'interview': return <CheckCircle className="text-purple-500" />;
      default: return <Bell className="text-text-muted" />;
    }
  };

  const getIconBg = (type) => {
    switch (type?.toLowerCase()) {
      case 'application': return 'bg-blue-500/10 border-blue-500/20';
      case 'message': return 'bg-green-500/10 border-green-500/20';
      case 'recommendation': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'interview': return 'bg-purple-500/10 border-purple-500/20';
      default: return 'bg-surface-alt border-border';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-surface p-6 rounded-xl border border-border">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Bell size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Notifications</h1>
            <p className="text-text-muted text-sm">You have {unreadCount} unread messages</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAsRead('all')}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-content' : 'bg-surface text-text-muted hover:text-text'}`}
        >
          All Notifications
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-primary text-primary-content' : 'bg-surface text-text-muted hover:text-text'}`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4 flex gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2 py-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <div 
                  onClick={() => markAsRead(notification.id, notification.link)}
                  className={`p-4 rounded-xl border flex gap-4 transition-all cursor-pointer group
                    ${!notification.is_read 
                      ? 'bg-surface border-primary/30 shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.1)]' 
                      : 'bg-surface-alt/50 border-border hover:bg-surface'
                    }
                  `}
                >
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center border ${getIconBg(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-sm font-semibold truncate ${!notification.is_read ? 'text-text' : 'text-text-muted'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-text-muted shrink-0 ml-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {notification.link && (
                      <button className="p-2 text-text-muted hover:text-primary bg-surface rounded-lg border border-border" title="Open Link">
                        <ExternalLink size={16} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => deleteNotification(e, notification.id)} 
                      className="p-2 text-text-muted hover:text-red-500 bg-surface rounded-lg border border-border"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {!notification.is_read && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState 
          icon={<Bell size={48} className="text-text-muted/50" />}
          title="All caught up!"
          description={filter === 'unread' ? "You don't have any unread notifications." : "You don't have any notifications yet."}
        />
      )}
    </div>
  );
}
