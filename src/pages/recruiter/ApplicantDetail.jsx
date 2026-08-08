import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, Briefcase, Mail, Calendar, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicantDetail() {
  const { id } = useParams(); // application id
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    if (user && id) fetchApplicant();
  }, [user, id]);

  const fetchApplicant = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*),
          candidate:profiles!candidate_id(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setApp(data);
      setNotes(data.notes || '');
    } catch (err) {
      toast.error('Failed to load applicant details');
      navigate('/recruiter/applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setApp({ ...app, status: newStatus });
      toast.success(`Status changed to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const { error } = await supabase.from('applications').update({ notes }).eq('id', id);
      if (error) throw error;
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading details...</div>;
  if (!app) return null;

  const stages = ['Applied', 'Screening', 'Interview', 'Offered', 'Rejected'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Applicants
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <img 
              src={app.candidate.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate.full_name || 'U')}&background=random`} 
              alt={app.candidate.full_name} 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-border"
            />
            <h2 className="text-xl font-bold text-text">{app.candidate.full_name}</h2>
            <p className="text-text-muted mb-4">{app.candidate.headline}</p>
            
            <div className="flex flex-col gap-2 text-left text-sm text-text-muted mt-4">
              {app.candidate.location && (
                <div className="flex items-center gap-2"><MapPin size={16}/> {app.candidate.location}</div>
              )}
              {app.candidate.role && (
                <div className="flex items-center gap-2"><Briefcase size={16}/> {app.candidate.role}</div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {app.candidate.skills?.map((skill, i) => (
                <span key={i} className="bg-dark border border-border px-3 py-1 rounded-full text-xs text-text">{skill}</span>
              ))}
            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <MessageSquare size={16} /> Message Candidate
            </button>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="font-semibold text-text mb-4">Recruiter Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your private notes here..."
              className="w-full h-32 bg-dark border border-border rounded-lg p-3 text-sm text-text focus:border-primary outline-none resize-none mb-3"
            />
            <button 
              onClick={saveNotes}
              disabled={savingNotes}
              className="w-full py-2 bg-dark border border-border text-text rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        {/* Right Col - App Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-text-muted mb-1">Applying for</p>
                <h2 className="text-2xl font-bold text-text">{app.job.title}</h2>
                <p className="text-sm text-primary mt-1">{app.match_score}% Match Score</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted mb-1">Applied on</p>
                <p className="text-text font-medium">{new Date(app.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-text mb-4">Application Status</h3>
              <div className="flex flex-wrap gap-2">
                {stages.map(stage => (
                  <button
                    key={stage}
                    onClick={() => updateStatus(stage)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      app.status === stage 
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-dark border-border text-text-muted hover:border-primary/50'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {app.status === 'Screening' && (
              <button onClick={() => setShowInterviewModal(true)} className="w-full py-3 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                <Calendar size={18} /> Schedule Interview
              </button>
            )}
          </div>

          {app.cover_letter && (
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold text-text mb-4">Cover Letter</h3>
              <div className="p-4 bg-dark border border-border rounded-lg whitespace-pre-wrap text-sm text-text-muted leading-relaxed">
                {app.cover_letter}
              </div>
            </div>
          )}
        </div>
      </div>

      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-text mb-4">Schedule Interview</h2>
            {/* Simple mock form for interview scheduling */}
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Interview scheduled'); setShowInterviewModal(false); updateStatus('Interview'); }} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Date & Time</label>
                <input type="datetime-local" required className="w-full bg-dark border border-border rounded-lg p-2 text-text" />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Type</label>
                <select className="w-full bg-dark border border-border rounded-lg p-2 text-text">
                  <option>Video Call</option>
                  <option>Phone Call</option>
                  <option>In Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Meeting Link</label>
                <input type="url" placeholder="https://..." className="w-full bg-dark border border-border rounded-lg p-2 text-text" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowInterviewModal(false)} className="flex-1 py-2 border border-border rounded-lg text-text hover:bg-dark">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
