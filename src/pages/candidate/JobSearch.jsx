import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MapPin, Filter, Bookmark, Clock, DollarSign, Building, SlidersHorizontal, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SEARCH_DEMO_JOBS = [
  { 
    id: '1', 
    title: 'Senior Frontend Developer', 
    location: 'Remote', 
    salary_min: 120000, 
    salary_max: 160000, 
    job_type: 'Full-time', 
    work_mode: 'Remote', 
    experience_level: 'Senior', 
    description: 'We are looking for a Senior Frontend Developer proficient in React, TypeScript, and Tailwind CSS.', 
    created_at: new Date().toISOString(),
    company: { name: 'NexaTech AI', logo_url: null }
  },
  { 
    id: '2', 
    title: 'Full Stack Engineer', 
    location: 'San Francisco, CA', 
    salary_min: 130000, 
    salary_max: 175000, 
    job_type: 'Full-time', 
    work_mode: 'Hybrid', 
    experience_level: 'Mid', 
    description: 'Join CloudSphere to build next-generation cloud infrastructure management tools.', 
    created_at: new Date(Date.now() - 86400000).toISOString(),
    company: { name: 'CloudSphere', logo_url: null }
  },
  { 
    id: '3', 
    title: 'UI/UX Designer', 
    location: 'New York, NY', 
    salary_min: 90000, 
    salary_max: 130000, 
    job_type: 'Contract', 
    work_mode: 'On-site', 
    experience_level: 'Mid', 
    description: 'Craft beautiful, intuitive design systems and user interfaces.', 
    created_at: new Date(Date.now() - 172800000).toISOString(),
    company: { name: 'DataForge Design', logo_url: null }
  },
  { 
    id: '4', 
    title: 'Backend Developer (Node.js)', 
    location: 'Remote', 
    salary_min: 110000, 
    salary_max: 150000, 
    job_type: 'Full-time', 
    work_mode: 'Remote', 
    experience_level: 'Senior', 
    description: 'Build high-performance REST APIs and microservices.', 
    created_at: new Date(Date.now() - 259200000).toISOString(),
    company: { name: 'MetaFlow', logo_url: null }
  },
  { 
    id: '5', 
    title: 'DevOps & Cloud Specialist', 
    location: 'Austin, TX', 
    salary_min: 125000, 
    salary_max: 165000, 
    job_type: 'Contract', 
    work_mode: 'On-site', 
    experience_level: 'Senior', 
    description: 'Manage AWS infrastructure, Terraform, and Kubernetes clusters.', 
    created_at: new Date(Date.now() - 345600000).toISOString(),
    company: { name: 'CyberVault', logo_url: null }
  },
  { 
    id: '6', 
    title: 'Junior React Developer', 
    location: 'Remote', 
    salary_min: 70000, 
    salary_max: 95000, 
    job_type: 'Internship', 
    work_mode: 'Remote', 
    experience_level: 'Entry', 
    description: 'Great opportunity for entry level React developers.', 
    created_at: new Date(Date.now() - 432000000).toISOString(),
    company: { name: 'BioNova', logo_url: null }
  }
];

export default function JobSearch() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    location: searchParams.get('loc') || '',
    jobType: searchParams.getAll('type') || [],
    workMode: searchParams.getAll('mode') || [],
    expLevel: searchParams.getAll('exp') || []
  });

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState('latest'); // latest, salary

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  useEffect(() => {
    setPage(1);
    fetchJobs(true);
    // Update URL
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.location) params.set('loc', filters.location);
    filters.jobType.forEach(t => params.append('type', t));
    filters.workMode.forEach(m => params.append('mode', m));
    filters.expLevel.forEach(e => params.append('exp', e));
    setSearchParams(params, { replace: true });
  }, [filters, sortBy]); // Re-fetch when filters or sort change

  const fetchSavedJobs = async () => {
    if (!user || user.id?.includes('demo')) return;
    try {
      const { data } = await supabase.from('saved_jobs').select('job_id').eq('user_id', user.id);
      if (data) setSavedJobIds(new Set(data.map(s => s.job_id)));
    } catch (err) {
      console.error('Saved jobs error:', err);
    }
  };

  const fetchJobs = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('jobs')
        .select('*, company:companies(name, logo_url)', { count: 'exact' })
        .eq('status', 'active');

      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.jobType.length > 0) {
        query = query.in('job_type', filters.jobType);
      }
      if (filters.workMode.length > 0) {
        query = query.in('work_mode', filters.workMode);
      }
      if (filters.expLevel.length > 0) {
        query = query.in('experience_level', filters.expLevel);
      }

      if (sortBy === 'salary') {
        query = query.order('salary_max', { ascending: false, nullsFirst: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(from, to);

      const { data, count, error } = await query;
      
      let resultJobs = data;
      let resultCount = count;

      // If database has no matching jobs or error occurs, fallback to SEARCH_DEMO_JOBS
      if (error || !data || data.length === 0) {
        let filtered = [...SEARCH_DEMO_JOBS];
        if (filters.query) {
          const q = filters.query.toLowerCase();
          filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q));
        }
        if (filters.location) {
          const loc = filters.location.toLowerCase();
          filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
        }
        if (filters.jobType.length > 0) {
          filtered = filtered.filter(j => filters.jobType.some(t => t.toLowerCase() === j.job_type.toLowerCase()));
        }
        if (filters.workMode.length > 0) {
          filtered = filtered.filter(j => filters.workMode.some(m => m.toLowerCase() === j.work_mode.toLowerCase()));
        }
        if (filters.expLevel.length > 0) {
          filtered = filtered.filter(j => filters.expLevel.some(e => e.toLowerCase() === j.experience_level.toLowerCase()));
        }

        // If strict filter yields 0 items, show all demo jobs instead of empty screen
        if (filtered.length === 0 && !filters.query && !filters.location) {
          filtered = SEARCH_DEMO_JOBS;
        }

        resultJobs = filtered;
        resultCount = filtered.length;
      }

      if (reset) {
        setJobs(resultJobs);
        setTotalCount(resultCount);
      } else {
        setJobs(prev => [...prev, ...resultJobs]);
      }
      setHasMore(resultCount > to + 1);

    } catch (error) {
      console.error('Fetch error:', error);
      setJobs(SEARCH_DEMO_JOBS);
      setTotalCount(SEARCH_DEMO_JOBS.length);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const toggleSaveJob = async (e, jobId) => {
    e.preventDefault();
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
        toast.success('Removed from saved');
      } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId });
        setSavedJobIds(prev => new Set([...prev, jobId]));
        toast.success('Job saved');
      }
    } catch (error) {
      toast.error('Error saving job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center bg-surface p-4 rounded-xl border border-border">
        <h2 className="font-semibold text-text">Job Search</h2>
        <Button variant="outline" size="sm" onClick={() => setShowMobileFilters(!showMobileFilters)}>
          <SlidersHorizontal size={16} className="mr-2" /> Filters
        </Button>
      </div>

      {/* Sidebar Filters */}
      <AnimatePresence>
        {(showMobileFilters || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full md:w-64 shrink-0 space-y-6 md:block overflow-hidden md:overflow-visible"
          >
            <Card className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-text">Filters</h3>
                {(filters.jobType.length > 0 || filters.workMode.length > 0 || filters.expLevel.length > 0) && (
                  <button 
                    onClick={() => setFilters(prev => ({...prev, jobType: [], workMode: [], expLevel: []}))}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-medium text-sm text-text-muted mb-3">Job Type</h4>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm text-text cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border bg-surface text-primary focus:ring-primary h-4 w-4"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange('jobType', type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div className="mb-6">
                <h4 className="font-medium text-sm text-text-muted mb-3">Work Mode</h4>
                <div className="space-y-2">
                  {['Remote', 'Hybrid', 'On-site'].map(mode => (
                    <label key={mode} className="flex items-center gap-2 text-sm text-text cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border bg-surface text-primary focus:ring-primary h-4 w-4"
                        checked={filters.workMode.includes(mode)}
                        onChange={() => handleFilterChange('workMode', mode)}
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="font-medium text-sm text-text-muted mb-3">Experience</h4>
                <div className="space-y-2">
                  {['Entry', 'Mid', 'Senior', 'Lead', 'Executive'].map(level => (
                    <label key={level} className="flex items-center gap-2 text-sm text-text cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border bg-surface text-primary focus:ring-primary h-4 w-4"
                        checked={filters.expLevel.includes(level)}
                        onChange={() => handleFilterChange('expLevel', level)}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Search Header */}
        <Card className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <Input 
              placeholder="Search jobs, skills, companies..." 
              className="pl-10"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({...prev, query: e.target.value}))}
            />
          </div>
          <div className="sm:w-1/3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <Input 
              placeholder="Location..." 
              className="pl-10"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
            />
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-text">
            {loading && page === 1 ? 'Searching...' : `${totalCount} Jobs Found`}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Sort by:</span>
            <select 
              className="bg-transparent border-none text-text font-medium focus:ring-0 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        {/* Active Filters Tags */}
        <div className="flex flex-wrap gap-2">
          {filters.jobType.map(t => (
            <Badge key={t} variant="secondary" className="flex items-center gap-1 py-1 px-3">
              {t} <button onClick={() => handleFilterChange('jobType', t)}><X size={12} /></button>
            </Badge>
          ))}
          {filters.workMode.map(m => (
            <Badge key={m} variant="secondary" className="flex items-center gap-1 py-1 px-3">
              {m} <button onClick={() => handleFilterChange('workMode', m)}><X size={12} /></button>
            </Badge>
          ))}
          {filters.expLevel.map(e => (
            <Badge key={e} variant="secondary" className="flex items-center gap-1 py-1 px-3">
              {e} <button onClick={() => handleFilterChange('expLevel', e)}><X size={12} /></button>
            </Badge>
          ))}
        </div>

        {/* Jobs List */}
        {loading && page === 1 ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} to={`/candidate/jobs/${job.id}`} className="block">
                <Card className="p-6 hover:border-primary/50 transition-all hover:shadow-md group">
                  <div className="flex gap-4">
                    <Avatar 
                      src={job.company?.logo_url} 
                      alt={job.company?.name} 
                      fallback={job.company?.name?.[0]} 
                      className="w-12 h-12 rounded-lg shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-text-muted mt-1 flex items-center gap-2 text-sm">
                            <span className="font-medium text-text">{job.company?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || 'Remote'}</span>
                          </p>
                        </div>
                        <button 
                          onClick={(e) => toggleSaveJob(e, job.id)}
                          className={`p-2 rounded-lg transition-colors ${savedJobIds.has(job.id) ? 'text-yellow-500 bg-yellow-500/10' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
                        >
                          <Bookmark size={20} fill={savedJobIds.has(job.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.salary_min && (
                          <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/5">
                            ${(job.salary_min/1000).toFixed(0)}k {job.salary_max ? `- ${(job.salary_max/1000).toFixed(0)}k` : ''}
                          </Badge>
                        )}
                        {job.work_mode && <Badge variant="secondary">{job.work_mode}</Badge>}
                        {job.job_type && <Badge variant="secondary">{job.job_type}</Badge>}
                        {job.experience_level && <Badge variant="secondary">{job.experience_level}</Badge>}
                      </div>
                      
                      <div className="mt-4 text-xs text-text-muted flex items-center gap-1">
                        <Clock size={14} /> {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-6">
                <Button variant="outline" onClick={() => { setPage(p => p + 1); fetchJobs(false); }} isLoading={loading}>
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState 
            icon={<Search size={48} className="text-text-muted" />}
            title="No matching jobs found"
            description="Try adjusting your filters or search terms to find more opportunities."
            action={<Button variant="outline" onClick={() => setFilters({query:'', location:'', jobType:[], workMode:[], expLevel:[]})}>Clear All Filters</Button>}
          />
        )}
      </div>
    </div>
  );
}
