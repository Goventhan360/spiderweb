import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Video, Phone, Users, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewSchedule() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchInterviews();
  }, [user]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidate:profiles!candidate_id(full_name, avatar_url),
          job:jobs(title)
        `)
        .eq('recruiter_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setInterviews(data || []);
    } catch (err) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    if (type?.toLowerCase().includes('video')) return <Video size={16} />;
    if (type?.toLowerCase().includes('phone')) return <Phone size={16} />;
    return <Users size={16} />;
  };

  const upcoming = interviews.filter(i => new Date(i.scheduled_at) >= new Date());
  const past = interviews.filter(i => new Date(i.scheduled_at) < new Date());

  const renderInterviewCard = (interview) => (
    <div key={interview.id} className="bg-surface border border-border rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-primary/50 transition-colors">
      <div className="flex gap-4 items-center">
        <img 
          src={interview.candidate?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidate?.full_name || 'U')}&background=random`} 
          alt={interview.candidate?.full_name} 
          className="w-12 h-12 rounded-full border border-border"
        />
        <div>
          <h3 className="font-semibold text-text">{interview.candidate?.full_name}</h3>
          <p className="text-sm text-text-muted">For: {interview.job?.title}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto">
        <div>
          <div className="flex items-center gap-2 text-text font-medium mb-1">
            <CalendarIcon size={16} className="text-primary"/>
            {new Date(interview.scheduled_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Clock size={14}/>
            {new Date(interview.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
            ({interview.duration_minutes || 45} min)
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <span className="flex items-center gap-1 text-sm bg-dark border border-border px-3 py-1 rounded-full text-text-muted mb-2">
            {getIcon(interview.type)} {interview.type || 'Interview'}
          </span>
          {interview.meeting_link && (
            <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
              Join Meeting <ExternalLink size={14}/>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Interviews</h1>
        <p className="text-text-muted">Manage your upcoming candidate interviews.</p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-text-muted">Loading schedule...</div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-text mb-4 border-b border-border pb-2">Upcoming Interviews</h2>
            {upcoming.length === 0 ? (
              <p className="text-text-muted bg-surface p-6 rounded-xl border border-border text-center">No upcoming interviews scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcoming.map(renderInterviewCard)}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text mb-4 border-b border-border pb-2">Past Interviews</h2>
            {past.length === 0 ? (
              <p className="text-text-muted text-sm italic">No past interviews.</p>
            ) : (
              <div className="space-y-4 opacity-75">
                {past.map(renderInterviewCard)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
