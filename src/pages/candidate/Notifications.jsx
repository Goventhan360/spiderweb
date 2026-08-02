import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Briefcase, MessageSquare, Star, Zap, CheckCircle2, Circle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const [filter, setFilter] = useState('All');
  
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const initialNotifications = [
    { id: 1, type: 'interview', title: 'Interview Invitation', message: 'CyberDyne Systems wants to schedule a technical interview.', time: '2 hours ago', read: false, icon: <Briefcase size={20} className="text-primary" /> },
    { id: 2, type: 'message', title: 'New Message', message: 'Sarah Connor sent you a message.', time: '3 hours ago', read: false, icon: <MessageSquare size={20} className="text-gold" /> },
    { id: 3, type: 'match', title: 'High AI Match', message: 'We found a new job that matches 95% of your skills.', time: 'Yesterday', read: true, icon: <Star size={20} className="text-primary" /> },
    { id: 4, type: 'system', title: 'Profile Tip', message: 'Add 2 more projects to boost your profile score by 10%.', time: 'Yesterday', read: true, icon: <Zap size={20} className="text-gold" /> },
    { id: 5, type: 'application', title: 'Application Update', message: 'Your application for Senior Developer at OmniCorp was viewed.', time: '2 days ago', read: true, icon: <CheckCircle2 size={20} className="text-primary" /> },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const filteredNotifications = filter === 'Unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
            <Bell className="text-gold" /> Notifications
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-surface border border-border p-1 rounded-[8px] flex">
            <button 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'All' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'}`}
              onClick={() => setFilter('All')}
            >All</button>
            <button 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'Unread' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text'}`}
              onClick={() => setFilter('Unread')}
            >Unread</button>
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead} className="whitespace-nowrap border border-border hover:border-primary">Mark all read</Button>
        </div>
      </div>

      <Card className="bg-surface border border-border rounded-[8px] overflow-hidden min-h-[400px]">
        {filteredNotifications.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              icon={<Bell size={48} className="text-text-muted" />}
              title="All caught up!"
              description="You have no new notifications at the moment."
            />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 flex gap-4 transition-colors hover:bg-surface-alt ${!notif.read ? 'bg-primary/5' : ''}`}
              >
                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${!notif.read ? 'bg-surface border-primary' : 'bg-surface-alt border-border'}`}>
                  {notif.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-base ${!notif.read ? 'font-bold text-text' : 'font-medium text-text-secondary'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-text-muted whitespace-nowrap ml-4">{notif.time}</span>
                  </div>
                  <p className={`text-sm ${!notif.read ? 'text-text-secondary' : 'text-text-muted'}`}>{notif.message}</p>
                  
                  {/* Action link based on type */}
                  {notif.type === 'interview' && (
                    <Link to="/candidate/applications" className="text-xs text-primary font-medium hover:underline mt-2 inline-block">View Details &rarr;</Link>
                  )}
                  {notif.type === 'message' && (
                    <Link to="/candidate/messages" className="text-xs text-gold font-medium hover:underline mt-2 inline-block">Reply &rarr;</Link>
                  )}
                  {notif.type === 'match' && (
                    <Link to="/candidate/jobs" className="text-xs text-primary font-medium hover:underline mt-2 inline-block">View Job &rarr;</Link>
                  )}
                </div>
                <button 
                  onClick={() => toggleRead(notif.id)}
                  className="mt-1 text-text-muted hover:text-primary transition-colors shrink-0"
                >
                  {!notif.read ? <Circle size={16} className="fill-primary text-primary" /> : <Circle size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
