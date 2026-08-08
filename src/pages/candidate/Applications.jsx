import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Building, MapPin, Calendar, Clock, ChevronRight, Search, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Applied', 'Screening', 'Interview', 'Offered', 'Rejected'];

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs (
            id, title, location, work_mode,
            company:companies (id, name, logo_url)
          )
        `)
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => prev.filter(app => app.id !== id));
      toast.success('Application withdrawn');
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Failed to withdraw application');
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

  const filteredApplications = activeTab === 'All' 
    ? applications 
    : applications.filter(app => app.status?.toLowerCase() === activeTab.toLowerCase());

  // Stats
  const total = applications.length;
  const active = applications.filter(a => !['offered', 'rejected'].includes(a.status?.toLowerCase())).length;
  const interviews = applications.filter(a => a.status?.toLowerCase() === 'interview').length;
  const offers = applications.filter(a => a.status?.toLowerCase() === 'offered').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text">My Applications</h1>
          <p className="text-text-muted mt-1">Track and manage your job applications.</p>
        </div>
        <Button as={Link} to="/candidate/jobs" leftIcon={<Search size={18} />}>
          Find More Jobs
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-center items-center text-center">
          <span className="text-3xl font-bold text-text">{loading ? <Skeleton className="h-8 w-12 mx-auto" /> : total}</span>
          <span className="text-sm text-text-muted mt-1">Total Applied</span>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center border-blue-500/20 bg-blue-500/5">
          <span className="text-3xl font-bold text-blue-500">{loading ? <Skeleton className="h-8 w-12 mx-auto" /> : active}</span>
          <span className="text-sm text-blue-500/80 mt-1">Active</span>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center border-purple-500/20 bg-purple-500/5">
          <span className="text-3xl font-bold text-purple-500">{loading ? <Skeleton className="h-8 w-12 mx-auto" /> : interviews}</span>
          <span className="text-sm text-purple-500/80 mt-1">Interviews</span>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center border-green-500/20 bg-green-500/5">
          <span className="text-3xl font-bold text-green-500">{loading ? <Skeleton className="h-8 w-12 mx-auto" /> : offers}</span>
          <span className="text-sm text-green-500/80 mt-1">Offers</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-primary text-primary-content' 
                : 'bg-surface border border-border text-text-muted hover:text-text hover:bg-surface-alt'
            }`}
          >
            {tab}
            {tab !== 'All' && applications.length > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-black/20' : 'bg-surface-alt'}`}>
                {applications.filter(a => a.status?.toLowerCase() === tab.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Avatar 
                      src={app.job.company?.logo_url} 
                      alt={app.job.company?.name} 
                      fallback={app.job.company?.name?.[0]} 
                      className="w-16 h-16 rounded-xl shrink-0" 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <Link to={`/candidate/jobs/${app.job.id}`} className="text-xl font-bold text-text hover:text-primary transition-colors truncate block">
                            {app.job.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
                            <span className="flex items-center gap-1 font-medium text-text">
                              <Building size={16} /> {app.job.company?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={16} /> {app.job.location || 'Remote'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={16} /> Applied {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text">Match Score:</span>
                          <div className="w-32 bg-surface-alt rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${app.match_score || 0}%` }}></div>
                          </div>
                          <span className="text-sm text-text-muted">{app.match_score || 0}%</span>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button variant="outline" size="sm" onClick={() => handleWithdraw(app.id)} className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                            Withdraw
                          </Button>
                          <Button variant="secondary" size="sm" as={Link} to={`/candidate/jobs/${app.job.id}`} className="flex-1 sm:flex-none">
                            View Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<FileText size={48} />}
            title={`No ${activeTab !== 'All' ? activeTab.toLowerCase() : ''} applications`}
            description={activeTab === 'All' ? "You haven't applied to any jobs yet. Start your journey today!" : `You don't have any applications in the ${activeTab} stage.`}
            action={<Button as={Link} to="/candidate/jobs">Browse Jobs</Button>}
          />
        )}
      </div>
    </div>
  );
}
