import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Users, Eye, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      toast.error('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        toast.success('Job deleted successfully');
        setJobs(jobs.filter(j => j.id !== id));
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', job.id);
      if (error) throw error;
      toast.success(`Job marked as ${newStatus}`);
      setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    return matchesSearch && job.status === filter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Manage Jobs</h1>
          <p className="text-text-muted mt-1">View and manage your posted jobs.</p>
        </div>
        <Link to="/recruiter/jobs/create" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus size={20} /> Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-text-muted text-sm">Total Jobs</p>
          <p className="text-2xl font-bold text-text mt-1">{jobs.length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-text-muted text-sm">Active Jobs</p>
          <p className="text-2xl font-bold text-primary mt-1">{jobs.filter(j => j.status === 'Active').length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-text-muted text-sm">Total Applicants</p>
          <p className="text-2xl font-bold text-text mt-1">{jobs.reduce((acc, job) => acc + (job.applications?.[0]?.count || 0), 0)}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {['All', 'Active', 'Inactive', 'Draft', 'Closed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-white' : 'text-text-muted hover:bg-dark'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:border-primary outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Briefcase className="text-text-muted" size={24} />
            </div>
            <h3 className="text-lg font-medium text-text mb-2">No jobs found</h3>
            <p className="text-text-muted mb-6">You haven't posted any jobs matching this criteria.</p>
            {jobs.length === 0 && (
              <Link to="/recruiter/jobs/create" className="inline-flex bg-primary text-white px-4 py-2 rounded-lg items-center gap-2 hover:bg-primary/90 transition-colors">
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-dark border-b border-border">
                <tr>
                  <th className="p-4 text-sm font-medium text-text-muted">Job Details</th>
                  <th className="p-4 text-sm font-medium text-text-muted">Stats</th>
                  <th className="p-4 text-sm font-medium text-text-muted">Status</th>
                  <th className="p-4 text-sm font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id} className="border-b border-border/50 hover:bg-dark/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-text flex items-center gap-2">
                          {job.title}
                          {job.is_featured && <span className="bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded uppercase font-bold">Featured</span>}
                        </div>
                        <div className="text-sm text-text-muted mt-1">{job.location} • {job.job_type}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <div className="text-center" title="Views">
                          <Eye size={16} className="text-text-muted mx-auto mb-1" />
                          <span className="text-sm text-text">{job.views_count || 0}</span>
                        </div>
                        <div className="text-center" title="Applicants">
                          <Users size={16} className="text-text-muted mx-auto mb-1" />
                          <span className="text-sm text-text">{job.applications?.[0]?.count || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'Active' ? 'bg-green-500/20 text-green-500' : 
                        job.status === 'Draft' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleStatus(job)} className="text-text-muted hover:text-primary transition-colors text-sm" title="Toggle Status">
                          {job.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <Link to={`/recruiter/jobs/${job.id}/edit`} className="text-text-muted hover:text-blue-500 transition-colors">
                          <Edit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(job.id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Briefcase({ className, size }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
}
