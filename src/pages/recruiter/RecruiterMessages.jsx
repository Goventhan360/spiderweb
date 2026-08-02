import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Paperclip, MoreVertical, Circle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const mockContacts = [
  { id: 1, name: 'Alex Johnson', role: 'Senior React Dev', lastMsg: 'I have attached my portfolio.', time: '10:30 AM', unread: true },
  { id: 2, name: 'Sarah Williams', role: 'UX Designer', lastMsg: 'Thanks for the interview!', time: 'Yesterday', unread: false },
  { id: 3, name: 'Michael Chen', role: 'Full Stack Engineer', lastMsg: 'When can I expect to hear back?', time: 'Oct 22', unread: false },
];

export default function RecruiterMessages() {
  const [activeContact, setActiveContact] = useState(mockContacts[0]);
  const [message, setMessage] = useState('');

  return (
    <motion.div 
      className="p-4 md:p-6 h-[calc(100vh-4rem)] max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="glass border-border h-full flex overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-border flex flex-col bg-surface">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg serif font-bold text-text mb-4">Messages</h2>
            <Input icon={<Search size={16}/>} placeholder="Search messages..." className="bg-surface-alt" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockContacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-colors border-b border-border/50 ${
                  activeContact.id === contact.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-surface-alt'
                }`}
              >
                <div className="relative">
                  <Avatar fallback={contact.name} />
                  {contact.unread && <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-text truncate text-sm">{contact.name}</h4>
                    <span className="text-xs text-text-muted mono">{contact.time}</span>
                  </div>
                  <p className="text-xs text-primary mb-1">{contact.role}</p>
                  <p className="text-xs text-text-secondary truncate">{contact.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-bg/50">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
            <div className="flex items-center gap-3">
              <Avatar fallback={activeContact.name} />
              <div>
                <h3 className="font-bold text-text">{activeContact.name}</h3>
                <p className="text-xs text-text-muted">{activeContact.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" icon={<MoreVertical size={18}/>} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-surface-alt p-3 rounded-2xl rounded-tl-none border border-border max-w-[80%]">
                <p className="text-sm text-text">Hello, I'm excited about the Senior React role!</p>
              </div>
              <span className="text-[10px] text-text-muted ml-1 mono">10:00 AM</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <div className="bg-primary/10 text-text p-3 rounded-2xl rounded-tr-none border border-primary/20 max-w-[80%]">
                <p className="text-sm">Great to connect with you, Alex! Could you send your portfolio?</p>
              </div>
              <span className="text-[10px] text-text-muted mr-1 mono">10:15 AM</span>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-surface-alt p-3 rounded-2xl rounded-tl-none border border-border max-w-[80%]">
                <p className="text-sm text-text">Absolutely. I have attached my portfolio.</p>
              </div>
              <span className="text-[10px] text-text-muted ml-1 mono">10:30 AM</span>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex items-center gap-2">
              <button className="p-2 text-text-muted hover:text-text transition-colors">
                <Paperclip size={20} />
              </button>
              <div className="flex-1">
                <Input 
                  placeholder="Type your message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-surface-alt border-border"
                />
              </div>
              <Button 
                variant="primary" 
                icon={<Send size={18} />} 
                className="px-3 md:px-4"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
