import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, User, Plus, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';

const upcomingInterviews = [
  { id: 1, candidate: 'Alex Johnson', role: 'Senior React Dev', date: '2023-10-25', time: '14:00', duration: '60 min', type: 'Technical', status: 'Scheduled', link: 'meet.google.com/abc' },
  { id: 2, candidate: 'Sarah Williams', role: 'UX Designer', date: '2023-10-25', time: '16:30', duration: '45 min', type: 'Portfolio', status: 'Scheduled', link: 'meet.google.com/def' },
  { id: 3, candidate: 'Michael Chen', role: 'Full Stack', date: '2023-10-26', time: '10:00', duration: '30 min', type: 'Screening', status: 'Scheduled', link: 'zoom.us/j/123' },
  { id: 4, candidate: 'Emily Davis', role: 'Product Manager', date: '2023-10-24', time: '11:00', duration: '60 min', type: 'Final', status: 'Completed', link: '' },
];

export default function InterviewSchedule() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Interviews</h1>
          <p className="text-text-muted mt-1">Manage your upcoming candidate interviews.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />}>Schedule Interview</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Side (Placeholder for simplicity) */}
        <Card className="p-4 glass border-border lg:col-span-1 h-fit">
          <h3 className="serif font-semibold text-text mb-4">Quick Calendar</h3>
          <div className="bg-surface-alt rounded-lg p-4 border border-border text-center aspect-square flex flex-col justify-center items-center text-text-muted">
            <CalendarIcon size={48} className="mb-4 opacity-50 text-text-secondary" />
            <p>Select a date to view schedules</p>
            <p className="text-xs mt-2 mono">Oct 25, 2023</p>
          </div>
        </Card>

        {/* Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4 mb-2">
            <Input 
              icon={<Search size={16}/>} 
              placeholder="Search by candidate or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-surface"
            />
          </div>

          {upcomingInterviews.map((interview) => (
            <Card key={interview.id} className="p-4 glass border-border hover:border-primary/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-l-4 border-l-primary">
              <div className="flex items-center gap-4">
                <Avatar fallback={interview.candidate} />
                <div>
                  <h3 className="font-bold text-text">{interview.candidate}</h3>
                  <p className="text-sm text-text-secondary">{interview.role} • {interview.type}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end gap-2 text-sm w-full sm:w-auto">
                <div className="flex items-center gap-3 text-text-muted bg-surface-alt border border-border px-3 py-1.5 rounded-md mono">
                  <span className="flex items-center gap-1"><CalendarIcon size={14}/> {interview.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {interview.time} ({interview.duration})</span>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                  <Badge variant="outline" className={interview.status === 'Completed' ? 'border-primary text-primary' : 'border-gold text-gold'}>
                    {interview.status}
                  </Badge>
                  {interview.status === 'Scheduled' && (
                    <Button variant="outline" size="sm" icon={<Video size={14}/>} className="hover:text-primary hover:border-primary">
                      Join Call
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
