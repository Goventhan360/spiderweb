import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { Search, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, company:companies(name), recruiter:profiles!recruiter_id(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (job) => {
    try {
      const { error } = await supabase.from('jobs').update({ is_featured: !job.is_featured }).eq('id', job.id);
      if (error) throw error;
      setJobs(jobs.map(j => j.id === job.id ? { ...j, is_featured: !job.is_featured } : j));
      toast.success(job.is_featured ? 'Removed from featured' : 'Marked as featured');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm('Delete this job? This bypasses standard rules.')) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        setJobs(jobs.filter(j => j.id !== id));
        toast.success('Job deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-text mb-6">Manage All Jobs</h1>
      
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-dark border-b border-border text-text-muted text-sm">
              <tr>
                <th className="p-4 font-medium">Job Title</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Loading...</td></tr>
              ) : filteredJobs.map(j => (
                <tr key={j.id} className="border-b border-border/50 hover:bg-dark/50">
                  <td className="p-4">
                    <p className="font-medium text-text">{j.title}</p>
                    <p className="text-xs text-text-muted">By {j.recruiter?.full_name}</p>
                  </td>
                  <td className="p-4 text-text">{j.company?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${j.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleFeatured(j)} className={`p-1 rounded ${j.is_featured ? 'text-gold' : 'text-text-muted'}`}>
                      {j.is_featured ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteJob(j.id)} className="text-text-muted hover:text-red-500 p-1" title="Delete Job">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
