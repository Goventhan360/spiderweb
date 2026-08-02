import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, MessageSquare, Check, Building2, MapPin, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function Network() {
  const [activeTab, setActiveTab] = useState('suggested');
  const [search, setSearch] = useState('');
  const [connectedIds, setConnectedIds] = useState([]);

  const suggestions = [
    { id: 1, name: 'Sarah Chen', title: 'Senior AI Engineer', company: 'Google', mutual: 14, location: 'San Francisco, CA' },
    { id: 2, name: 'Marcus Rodriguez', title: 'Lead Product Designer', company: 'Meta', mutual: 8, location: 'New York, NY' },
    { id: 3, name: 'Priya Sharma', title: 'Tech Recruiter', company: 'Microsoft', mutual: 22, location: 'Seattle, WA' },
    { id: 4, name: 'James Wilson', title: 'Staff Data Scientist', company: 'Netflix', mutual: 5, location: 'Los Angeles, CA' },
    { id: 5, name: 'Elena Rostova', title: 'Frontend Lead', company: 'Stark Industries', mutual: 11, location: 'Austin, TX' },
    { id: 6, name: 'David Kim', title: 'Engineering Manager', company: 'OmniCorp', mutual: 19, location: 'San Francisco, CA' },
  ];

  const toggleConnect = (id, name) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(i => i !== id));
      toast.success(`Removed connection request to ${name}`);
    } else {
      setConnectedIds([...connectedIds, id]);
      toast.success(`Connection request sent to ${name}!`);
    }
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
            <Users className="text-primary" /> Professional Network
          </h1>
          <p className="text-text-secondary mt-1">Connect with industry peers, recruiters, and mentors.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search network..." 
            className="pl-9 bg-surface border-border text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuggestions.map((user) => {
          const isConnected = connectedIds.includes(user.id);
          return (
            <Card key={user.id} className="bg-surface border border-border p-5 rounded-[8px] flex flex-col items-center text-center hover:border-primary transition-all group">
              <Avatar name={user.name} size="lg" className="mb-3 border border-border" />
              <h3 className="font-semibold text-text text-base group-hover:text-primary transition-colors">{user.name}</h3>
              <p className="text-xs text-text-secondary font-medium mt-0.5">{user.title}</p>
              <p className="text-xs text-text-muted mt-1 flex items-center gap-1"><Building2 size={12} /> {user.company}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
                <Badge variant="outline" className="text-[10px] bg-surface-alt">{user.mutual} mutual connections</Badge>
              </div>

              <div className="mt-5 w-full flex gap-2">
                <Button 
                  onClick={() => toggleConnect(user.id, user.name)} 
                  variant={isConnected ? "outline" : "primary"}
                  className={`w-full text-xs font-semibold py-2 ${isConnected ? 'border-primary text-primary' : 'bg-gold text-[#201607] hover:bg-gold-light'}`}
                >
                  {isConnected ? <><Check size={14} className="mr-1" /> Pending</> : <><UserPlus size={14} className="mr-1" /> Connect</>}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
