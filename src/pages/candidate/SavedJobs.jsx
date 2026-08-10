import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark, MapPin, Building, DollarSign, Clock, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date'); // date, salary

  useEffect(() => {
    if (user) fetchSavedJobs();
  }, [user, sortBy]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      if (!user?.id || user.id.includes('demo')) {
        setSavedJobs([
          {
            id: 'demo-saved-1',
            created_at: new Date().toISOString(),
            job: {
              id: '1',
              title: 'Senior Frontend Developer',
              location: 'Remote',
              salary_min: 120000,
              salary_max: 160000,
              work_mode: 'Remote',
              job_type: 'Full-time',
              company: { name: 'NexaTech AI', logo_url: null }
            }
          },
          {
            id: 'demo-saved-2',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            job: {
              id: '2',
              title: 'Full Stack Engineer',
              location: 'San Francisco, CA',
              salary_min: 130000,
              salary_max: 175000,
              work_mode: 'Hybrid',
              job_type: 'Full-time',
              company: { name: 'CloudSphere', logo_url: null }
            }
          }
        ]);
        setLoading(false);
        return;
      }
      
      let query = supabase
        .from('saved_jobs')
        .select(`
          id, created_at,
          job:jobs (
            *,
            company:companies (name, logo_url)
          )
        `)
        .eq('user_id', user.id);

      const { data, error } = await query;
      if (error) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      let formattedJobs = data || [];

      // Sort in JS since we need to sort by nested relation for salary
      if (sortBy === 'salary') {
        formattedJobs.sort((a, b) => (b.job.salary_max || 0) - (a.job.salary_max || 0));
      } else {
        formattedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      setSavedJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSavedJobs(prev => prev.filter(job => job.id !== id));
      toast.success('Removed from saved jobs');
    } catch (error) {
      toast.error('Failed to remove job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text flex items-center gap-3">
            <Bookmark className="text-primary" size={32} />
            Saved Jobs
          </h1>
          <p className="text-text-muted mt-1">Keep track of jobs you're interested in.</p>
        </div>
        
        {savedJobs.length > 0 && (
          <div className="flex items-center gap-2 text-sm bg-surface p-2 rounded-lg border border-border">
            <span className="text-text-muted px-2">Sort by:</span>
            <select 
              className="bg-transparent border-none text-text font-medium focus:ring-0 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Recently Saved</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(({ id, job, created_at }) => (
            <motion.div key={id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Link to={`/candidate/jobs/${job.id}`} className="block h-full">
                <Card className="p-6 h-full flex flex-col hover:border-primary/50 transition-colors group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <Avatar 
                      src={job.company?.logo_url} 
                      alt={job.company?.name} 
                      fallback={job.company?.name?.[0]} 
                      className="w-12 h-12 rounded-lg shrink-0" 
                    />
                    <button 
                      onClick={(e) => handleUnsave(id, e)}
                      className="p-2 rounded-full bg-surface-alt hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors z-10"
                      title="Remove from saved"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-text mt-1">{job.company?.name}</p>
                    
                    <div className="space-y-2 mt-4 text-sm text-text-muted">
                      <div className="flex items-center gap-2"><MapPin size={14} /> {job.location || 'Remote'}</div>
                      {(job.salary_min || job.salary_max) && (
                        <div className="flex items-center gap-2 text-green-500">
                          <DollarSign size={14} /> 
                          {job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : ''} 
                          {job.salary_min && job.salary_max ? ' - ' : ''} 
                          {job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock size={12} /> Saved {new Date(created_at).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Apply
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<Bookmark size={48} className="text-text-muted" />}
          title="No saved jobs"
          description="You haven't saved any jobs yet. Browse jobs and click the bookmark icon to save them for later."
          action={<Button as={Link} to="/candidate/jobs" leftIcon={<Search size={16} />}>Browse Jobs</Button>}
        />
      )}
    </div>
  );
}
