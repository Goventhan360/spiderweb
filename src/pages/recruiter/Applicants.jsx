import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Filter, MessageSquare, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Applicants() {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'All', jobId: 'All', search: '' });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user?.id || user.id.includes('demo')) {
        setJobs([
          { id: '1', title: 'Senior Frontend Developer' },
          { id: '2', title: 'Full Stack Engineer' },
          { id: '3', title: 'UI Designer' }
        ]);
        setApplicants([
          {
            id: 'demo-app-1',
            status: 'Interview',
            match_score: 94,
            created_at: new Date().toISOString(),
            job: { title: 'Senior Frontend Developer', location: 'Remote' },
            candidate: { id: 'demo-c1', full_name: 'Alex Morgan', headline: 'Full Stack Developer', avatar_url: null, skills: ['React', 'TypeScript', 'Node.js'], location: 'San Francisco, CA' }
          },
          {
            id: 'demo-app-2',
            status: 'Screening',
            match_score: 88,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            job: { title: 'Full Stack Engineer', location: 'San Francisco, CA' },
            candidate: { id: 'demo-c2', full_name: 'Jordan Lee', headline: 'Backend Engineer', avatar_url: null, skills: ['Node.js', 'PostgreSQL', 'AWS'], location: 'Austin, TX' }
          },
          {
            id: 'demo-app-3',
            status: 'Applied',
            match_score: 82,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            job: { title: 'UI Designer', location: 'New York, NY' },
            candidate: { id: 'demo-c3', full_name: 'Taylor Swift', headline: 'UI/UX Designer', avatar_url: null, skills: ['Figma', 'Design Systems', 'CSS'], location: 'New York, NY' }
          }
        ]);
        setLoading(false);
        return;
      }

      // 1. Get all jobs for this recruiter
      const { data: recruiterJobs } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('recruiter_id', user.id);
        
      setJobs(recruiterJobs || []);

      const jobIds = recruiterJobs?.map(j => j.id) || [];
      if (jobIds.length === 0) {
        setApplicants([]);
        setLoading(false);
        return;
      }

      // 2. Get all applications for these jobs
      const { data: apps } = await supabase
        .from('applications')
        .select('*, job:jobs(title, location), candidate:profiles!candidate_id(id, full_name, headline, avatar_url, skills, location)')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      setApplicants(apps || []);
    } catch (err) {
      console.error(err);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
      if (error) throw error;
      toast.success('Status updated');
      setApplicants(applicants.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.candidate?.full_name?.toLowerCase().includes(filters.search.toLowerCase()) || 
                          app.job?.title?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'All' || app.status === filters.status;
    const matchesJob = filters.jobId === 'All' || app.job_id === filters.jobId;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-500/20 text-blue-500';
      case 'Screening': return 'bg-purple-500/20 text-purple-500';
      case 'Interview': return 'bg-yellow-500/20 text-yellow-500';
      case 'Offered': return 'bg-green-500/20 text-green-500';
      case 'Rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Applicants</h1>
        <p className="text-text-muted">Manage candidates across all your job postings.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name or job..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-dark border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:border-primary outline-none"
          />
        </div>
        <select
          value={filters.jobId}
          onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
          className="bg-dark border border-border rounded-lg px-4 py-2 text-sm text-text focus:border-primary outline-none"
        >
          <option value="All">All Jobs</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-dark border border-border rounded-lg px-4 py-2 text-sm text-text focus:border-primary outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Offered">Offered</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-text-muted">Loading applicants...</div>
      ) : filteredApplicants.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-text-muted">No applicants found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplicants.map(app => (
            <div key={app.id} className="bg-surface border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <img 
                  src={app.candidate?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate?.full_name || 'U')}&background=random`} 
                  alt={app.candidate?.full_name} 
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
                <div>
                  <h3 className="text-lg font-semibold text-text">{app.candidate?.full_name || 'Anonymous User'}</h3>
                  <p className="text-sm text-text-muted">{app.candidate?.headline}</p>
                  <div className="text-sm text-primary mt-1">Applied for: {app.job?.title}</div>
                </div>
              </div>

              <div className="flex-1 w-full md:w-auto">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-muted">Match Score</span>
                  <span className="font-bold text-primary">{app.match_score || 0}%</span>
                </div>
                <div className="w-full bg-dark rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${app.match_score || 0}%` }}></div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <select 
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium outline-none appearance-none cursor-pointer border border-transparent hover:border-border transition-colors ${getStatusColor(app.status)}`}
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <div className="flex gap-2">
                  <button className="p-2 bg-dark border border-border rounded-lg text-text-muted hover:text-primary transition-colors" title="Message">
                    <MessageSquare size={18} />
                  </button>
                  <Link to={`/recruiter/applicants/${app.id}`} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
