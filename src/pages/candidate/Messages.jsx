import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Paperclip, MoreVertical, Image as ImageIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');

  const conversations = [
    { id: 1, name: 'Sarah Connor', company: 'CyberDyne Systems', role: 'Technical Recruiter', lastMessage: 'Great, see you then!', time: '10:30 AM', unread: 2, avatar: null },
    { id: 2, name: 'John Smith', company: 'OmniCorp', role: 'Hiring Manager', lastMessage: 'Can you share your portfolio?', time: 'Yesterday', unread: 0, avatar: null },
    { id: 3, name: 'AI Assistant', company: 'Webloom AI', role: 'System', lastMessage: 'Your application has been viewed.', time: 'Tuesday', unread: 0, avatar: null },
  ];

  const messages = [
    { id: 1, sender: 'them', text: 'Hi! We reviewed your profile and would love to schedule a technical interview.', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hello Sarah! Thank you, I would be happy to interview. When are you available?', time: '10:15 AM' },
    { id: 3, sender: 'them', text: 'How about tomorrow at 10 AM PST?', time: '10:20 AM' },
    { id: 4, sender: 'me', text: 'That works perfectly for me. Should I prepare anything specific?', time: '10:25 AM' },
    { id: 5, sender: 'them', text: 'Just be ready to discuss your recent React projects. Great, see you then!', time: '10:30 AM' },
  ];

  const activeContact = conversations.find(c => c.id === activeChat);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-80px)] flex flex-col md:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
      
      {/* Sidebar - Conversations */}
      <Card className="bg-surface border border-border rounded-[8px] w-full md:w-80 flex-shrink-0 flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl serif font-bold text-text mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <Input className="pl-9 h-9 text-sm bg-surface-alt border-border" placeholder="Search messages..." />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`p-4 border-b border-border flex gap-3 cursor-pointer transition-colors hover:bg-surface-alt ${activeChat === chat.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
            >
              <div className="relative">
                <Avatar name={chat.name} src={chat.avatar} size="md" className="border border-border" />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] flex items-center justify-center text-white rounded-full font-bold">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-text' : 'font-medium text-text-secondary'}`}>{chat.name}</h3>
                  <span className="text-[10px] text-text-muted whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <p className="text-xs text-text-muted mb-0.5">{chat.company}</p>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-medium text-text' : 'text-text-muted'}`}>{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className="bg-surface border border-border rounded-[8px] flex-1 flex flex-col overflow-hidden h-full hidden md:flex">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-alt">
              <div className="flex items-center gap-3">
                <Avatar name={activeContact.name} src={activeContact.avatar} size="md" />
                <div>
                  <h3 className="serif font-semibold text-text">{activeContact.name}</h3>
                  <p className="text-xs text-text-secondary">{activeContact.role} at {activeContact.company}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-text-secondary"><MoreVertical size={20} /></Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-bg">
              <div className="text-center my-4">
                <span className="text-xs text-text-muted bg-surface-alt px-3 py-1 rounded-full border border-border">Today</span>
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.sender === 'me' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-surface-alt border border-border text-text rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'me' ? 'text-white/70' : 'text-text-muted'} mono`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-surface-alt">
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="icon" className="text-text-secondary hover:text-primary"><Paperclip size={20} /></Button>
                <div className="flex-1 relative">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full bg-surface border-border pr-10 focus:border-primary"
                    onKeyDown={(e) => { if (e.key === 'Enter') setMessage(''); }}
                  />
                </div>
                <Button className="bg-gold hover:bg-gold-light text-[#201607]" size="icon" onClick={() => setMessage('')}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </motion.div>
  );
}
