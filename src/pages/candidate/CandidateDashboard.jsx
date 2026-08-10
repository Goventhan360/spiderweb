import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/supabase/client';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, Calendar, Clock, Bookmark, Bell, ChevronRight, Settings, ExternalLink, Activity } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function CandidateDashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applicationsSent: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
    profileScore: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);

      if (user.id?.includes('demo')) {
        setStats({
          applicationsSent: 12,
          interviewsScheduled: 2,
          savedJobs: 5,
          profileScore: profile?.profile_score || 85
        });
        setRecentApplications([
          {
            id: 'demo-app-1',
            status: 'Interview',
            created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
            job: { title: 'Senior Frontend Developer', company: { name: 'NexaTech AI' } }
          },
          {
            id: 'demo-app-2',
            status: 'Applied',
            created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
            job: { title: 'Full Stack Engineer', company: { name: 'CloudSphere' } }
          }
        ]);
        
        // Fetch Recommended Jobs from Supabase or Fallback
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*, company:companies(name, logo_url)')
          .eq('status', 'active')
          .limit(4);

        setRecommendedJobs(jobsData || []);
        setLoading(false);
        return;
      }
      
      // Fetch Applications Count
      const { count: appsCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('candidate_id', user.id);
        
      // Fetch Saved Jobs Count
      const { count: savedCount } = await supabase
        .from('saved_jobs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      // Fetch Interviews
      const { count: interviewsCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('candidate_id', user.id)
        .eq('status', 'Interview');

      setStats({
        applicationsSent: typeof appsCount === 'number' ? appsCount : 0,
        interviewsScheduled: typeof interviewsCount === 'number' ? interviewsCount : 0,
        savedJobs: typeof savedCount === 'number' ? savedCount : 0,
        profileScore: typeof profile?.profile_score === 'number' ? profile.profile_score : 80
      });

      // Fetch Recent Applications
      const { data: recentApps } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          job:jobs (
            id,
            title,
            company:companies (
              name,
              logo_url
            )
          )
        `)
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (recentApps) setRecentApplications(recentApps);

      // Fetch Recommended Jobs
      let query = supabase.from('jobs').select(`
        id, title, location, salary_min, salary_max, work_mode, created_at,
        company:companies(name, logo_url)
      `).eq('status', 'active').order('created_at', { ascending: false }).limit(3);
      
      const { data: recommended } = await query;
      if (recommended) setRecommendedJobs(recommended);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'screening': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'interview': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'offered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome back, {profile?.full_name || 'Candidate'}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" as={Link} to="/candidate/profile" leftIcon={<Settings size={18} />}>
            Update Profile
          </Button>
          <Button as={Link} to="/candidate/jobs" leftIcon={<Briefcase size={18} />}>
            Browse Jobs
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Applications Sent" value={loading ? <Skeleton className="h-8 w-16" /> : stats.applicationsSent} icon={<Briefcase size={24} className="text-blue-500" />} />
        <StatCard title="Interviews" value={loading ? <Skeleton className="h-8 w-16" /> : stats.interviewsScheduled} icon={<Calendar size={24} className="text-purple-500" />} />
        <StatCard title="Saved Jobs" value={loading ? <Skeleton className="h-8 w-16" /> : stats.savedJobs} icon={<Bookmark size={24} className="text-yellow-500" />} />
        <StatCard title="Profile Score" value={loading ? <Skeleton className="h-8 w-16" /> : `${stats.profileScore}%`} icon={<Activity size={24} className="text-green-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text">Recent Applications</h2>
              <Link to="/candidate/applications" className="text-primary hover:text-primary-focus text-sm font-medium flex items-center">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            ) : recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-alt hover:bg-surface transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar src={app.job?.company?.logo_url} alt={app.job?.company?.name || 'Company'} fallback={app.job?.company?.name?.[0] || 'C'} />
                      <div>
                        <Link to={`/candidate/jobs/${app.job?.id}`} className="font-medium text-text hover:text-primary transition-colors">
                          {app.job?.title || 'Job Title'}
                        </Link>
                        <p className="text-sm text-text-muted flex items-center gap-1">
                          <Building size={14} /> {app.job?.company?.name || 'Company'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                        {app.status || 'Applied'}
                      </span>
                      <span className="text-xs text-text-muted">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<Briefcase size={32} />}
                title="No applications yet"
                description="Start applying to jobs to see them here."
                action={<Button as={Link} to="/candidate/jobs">Find Jobs</Button>}
              />
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text mb-4">Profile Completion</h3>
            <div className="mb-2 flex justify-between items-end">
              <span className="text-3xl font-bold text-text">{stats.profileScore}%</span>
            </div>
            <div className="w-full bg-surface-alt rounded-full h-2.5 mb-4 overflow-hidden">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${stats.profileScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-text-muted mb-4">
              Complete your profile to increase your chances of being noticed by recruiters.
            </p>
            <Button variant="outline" className="w-full" as={Link} to="/candidate/profile">
              Complete Profile
            </Button>
          </Card>

          {/* Recommended Jobs */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text">Recommended Jobs</h3>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <Link key={job.id} to={`/candidate/jobs/${job.id}`} className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-surface-alt transition-colors">
                    <Avatar src={job.company?.logo_url} alt={job.company?.name || 'Company'} fallback={job.company?.name?.[0] || 'C'} className="w-10 h-10 rounded-md" />
                    <div>
                      <h4 className="font-medium text-text group-hover:text-primary transition-colors line-clamp-1">{job.title}</h4>
                      <p className="text-sm text-text-muted">{job.company?.name || 'Company'}</p>
                      <div className="flex gap-2 mt-1">
                        {job.location && (
                          <span className="text-xs text-text-muted flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No recommendations available right now.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-surface-alt border border-border">
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-muted font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-text mt-1">{value}</h3>
      </div>
    </Card>
  );
}
