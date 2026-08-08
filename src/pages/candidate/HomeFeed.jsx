import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MapPin, Briefcase, Filter, Bookmark, Clock, DollarSign, Building } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function HomeFeed() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
    fetchJobs(true);
  }, [user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs(true);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, jobType, workMode]);

  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);
      
      if (data) {
        setSavedJobIds(new Set(data.map(s => s.job_id)));
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const fetchJobs = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }
      
      const currentPage = reset ? 1 : page;
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('jobs')
        .select(`
          *,
          company:companies (name, logo_url)
        `, { count: 'exact' })
        .eq('status', 'open');

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (jobType) {
        query = query.eq('job_type', jobType);
      }
      if (workMode) {
        query = query.eq('work_mode', workMode);
      }

      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      if (reset) {
        setJobs(data || []);
        setTotalCount(count || 0);
      } else {
        setJobs(prev => [...prev, ...(data || [])]);
      }

      setHasMore(count > to + 1);

    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(p => p + 1);
    fetchJobs(false);
  };

  const toggleSaveJob = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return toast.error('Please login to save jobs');

    const isSaved = savedJobIds.has(jobId);
    
    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId);
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success('Job removed from saved');
      } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId });
        setSavedJobIds(prev => new Set([...prev, jobId]));
        toast.success('Job saved');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to update saved job');
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTimeAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-text mb-2">
            {getTimeOfDay()}, <span className="text-primary">{profile?.full_name?.split(' ')[0] || 'Candidate'}</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl">
            Discover your next career move. We have <span className="text-text font-medium">{totalCount} open roles</span> matching your profile.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none rounded-r-2xl" />
      </div>

      {/* Filters Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center z-20 relative">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <Input 
            placeholder="Search by job title or keyword..." 
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="flex h-10 w-full md:w-40 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <select 
            className="flex h-10 w-full md:w-40 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
          >
            <option value="">Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
          <Button variant="outline" as={Link} to="/candidate/jobs" className="shrink-0">
            <Filter size={18} className="mr-2" /> Advanced
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      <div>
        <h2 className="text-xl font-bold text-text mb-6">Recommended for you</h2>
        
        {loading && page === 1 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Link to={`/candidate/jobs/${job.id}`} className="block">
                  <Card className="p-6 hover:border-primary/50 transition-colors group">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Avatar 
                        src={job.company.logo_url} 
                        alt={job.company.name} 
                        fallback={job.company.name?.[0]} 
                        className="w-16 h-16 rounded-xl shrink-0" 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors truncate">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
                              <span className="flex items-center gap-1 font-medium text-text">
                                <Building size={16} /> {job.company.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={16} /> {job.location || 'Not specified'}
                              </span>
                              {(job.salary_min || job.salary_max) && (
                                <span className="flex items-center gap-1">
                                  <DollarSign size={16} /> 
                                  {job.salary_min ? `$${(job.salary_min/1000).toFixed(0)}k` : ''} 
                                  {job.salary_min && job.salary_max ? ' - ' : ''} 
                                  {job.salary_max ? `$${(job.salary_max/1000).toFixed(0)}k` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => toggleSaveJob(e, job.id)}
                            className={`p-2 rounded-lg transition-colors ${savedJobIds.has(job.id) ? 'text-yellow-500 bg-yellow-500/10' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
                          >
                            <Bookmark size={20} fill={savedJobIds.has(job.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.work_mode && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">{job.work_mode}</Badge>
                          )}
                          {job.job_type && (
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">{job.job_type}</Badge>
                          )}
                          {job.skills?.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                          {job.skills?.length > 3 && (
                            <Badge variant="secondary">+{job.skills.length - 3}</Badge>
                          )}
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock size={14} /> Posted {formatTimeAgo(job.created_at)}
                          </span>
                          <Button size="sm" onClick={(e) => { e.preventDefault(); /* nav handled by link wrapper */ }}>
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={loadMore} isLoading={loading} className="w-full sm:w-auto">
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState 
            icon={<Search size={40} />}
            title="No jobs found"
            description="Try adjusting your filters or search terms."
            action={<Button variant="outline" onClick={() => { setSearch(''); setJobType(''); setWorkMode(''); }}>Clear Filters</Button>}
          />
        )}
      </div>
    </div>
  );
}
