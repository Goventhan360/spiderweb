import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Video, Clock, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function Events() {
  const [rsvpIds, setRsvpIds] = useState([]);

  const eventsList = [
    { id: 1, title: 'Webloom AI Career Fair 2026', date: 'Tomorrow, 10:00 AM PST', type: 'Virtual Conference', speakers: 'Recruiters from Google, Meta, CyberDyne', attendees: 1240 },
    { id: 2, title: 'Mastering System Design for Senior Roles', date: 'August 15, 2:00 PM PST', type: 'Webinar', speakers: 'Alex Rivera (Staff Engineer)', attendees: 580 },
    { id: 3, title: 'React 19 & Next.js 15 Live Hackathon', date: 'August 22, All Day', type: 'Hackathon', speakers: 'Webloom Dev Team', attendees: 2100 },
  ];

  const toggleRsvp = (id, title) => {
    if (rsvpIds.includes(id)) {
      setRsvpIds(rsvpIds.filter(i => i !== id));
      toast.success(`Cancelled RSVP for ${title}`);
    } else {
      setRsvpIds([...rsvpIds, id]);
      toast.success(`RSVP confirmed for ${title}! Added to calendar.`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
          <Calendar className="text-gold" /> Tech Events & Career Fairs
        </h1>
        <p className="text-text-secondary mt-1">Join live webinars, virtual hiring expos, and technical workshops.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventsList.map((item) => {
          const isAttending = rsvpIds.includes(item.id);
          return (
            <Card key={item.id} className="bg-surface border border-border p-6 rounded-[8px] flex flex-col justify-between hover:border-primary transition-all">
              <div>
                <Badge variant="outline" className="text-xs bg-surface-alt mb-3 w-fit">{item.type}</Badge>
                <h3 className="font-semibold text-text text-lg mb-2">{item.title}</h3>
                
                <div className="space-y-1.5 text-xs text-text-muted my-4">
                  <p className="flex items-center gap-2"><Clock size={14} className="text-gold" /> {item.date}</p>
                  <p className="flex items-center gap-2"><Video size={14} className="text-primary" /> {item.speakers}</p>
                  <p className="flex items-center gap-2"><Users size={14} className="text-text-secondary" /> {item.attendees} registered</p>
                </div>
              </div>

              <Button 
                onClick={() => toggleRsvp(item.id, item.title)}
                className={`w-full text-xs font-semibold py-2.5 ${isAttending ? 'bg-surface-alt text-primary border border-primary' : 'bg-gold hover:bg-gold-light text-[#201607]'}`}
              >
                {isAttending ? <><CheckCircle size={14} className="mr-1" /> Reserved</> : "RSVP Spot"}
              </Button>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
