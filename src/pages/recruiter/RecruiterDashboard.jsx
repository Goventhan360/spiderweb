import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, CheckCircle, Calendar, Plus, Eye, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobsPosted: 0, totalApplicants: 0, activeJobs: 0, interviewsThisWeek: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [jobPerformance, setJobPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!user?.id || user.id.includes('demo')) {
        setStats({ jobsPosted: 6, totalApplicants: 42, activeJobs: 4, interviewsThisWeek: 3 });
        setRecentApps([
          { id: '1', status: 'Interview', match_score: 94, created_at: new Date().toISOString(), job: { title: 'Senior Frontend Developer' }, candidate: { full_name: 'Alex Morgan' } },
          { id: '2', status: 'Screening', match_score: 88, created_at: new Date(Date.now() - 86400000).toISOString(), job: { title: 'Full Stack Engineer' }, candidate: { full_name: 'Jordan Lee' } },
          { id: '3', status: 'Applied', match_score: 82, created_at: new Date(Date.now() - 172800000).toISOString(), job: { title: 'UI Designer' }, candidate: { full_name: 'Taylor Swift' } }
        ]);
        setJobPerformance([
          { title: 'Senior Frontend Developer', views: 240, applications: 18, conversionRate: 8 },
          { title: 'Full Stack Engineer', views: 180, applications: 14, conversionRate: 8 },
          { title: 'UI Designer', views: 120, applications: 10, conversionRate: 8 }
        ]);
        setLoading(false);
        return;
      }

      // Jobs posted
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, title, views_count, status, created_at')
        .eq('recruiter_id', user.id);
      
      if (jobsErr) {
        setLoading(false);
        return;
      }
      
      const jobIds = jobs?.map(j => j.id) || [];
      const activeJobs = jobs?.filter(j => j.status === 'active' || j.status === 'Active').length || 0;
      
      // Applications
      const { data: applications } = await supabase
        .from('applications')
        .select('id, status, match_score, candidate_id, created_at, job:jobs(title), candidate:profiles!candidate_id(full_name)')
        .in('job_id', jobIds.length > 0 ? jobIds : ['00000000-0000-0000-0000-000000000000'])
        .order('created_at', { ascending: false });

      // Interviews this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const { count: interviewsCount } = await supabase
        .from('interviews')
        .select('id', { count: 'exact' })
        .eq('recruiter_id', user.id)
        .gte('scheduled_at', startOfWeek.toISOString());

      setStats({
        jobsPosted: jobs?.length || 0,
        totalApplicants: applications?.length || 0,
        activeJobs,
        interviewsThisWeek: interviewsCount || 0
      });

      setRecentApps(applications?.slice(0, 5) || []);

      const perfData = (jobs || []).map(job => {
        const appsForJob = applications?.filter(a => a.job?.title === job.title) || [];
        const conversion = job.views_count ? Math.round((appsForJob.length / job.views_count) * 100) : 0;
        return {
          title: job.title,
          views: job.views_count || 0,
          applications: appsForJob.length,
          conversionRate: conversion
        };
      });
      setJobPerformance(perfData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-muted">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Recruiter Dashboard</h1>
          <p className="text-text-muted">Welcome back! Here's what's happening with your job postings.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/recruiter/jobs/create" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus size={20} /> Post New Job
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Briefcase size={24} />} label="Jobs Posted" value={stats.jobsPosted} color="text-blue-500" />
        <StatCard icon={<Users size={24} />} label="Total Applicants" value={stats.totalApplicants} color="text-green-500" />
        <StatCard icon={<CheckCircle size={24} />} label="Active Jobs" value={stats.activeJobs} color="text-primary" />
        <StatCard icon={<Calendar size={24} />} label="Interviews This Week" value={stats.interviewsThisWeek} color="text-gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-text">Recent Applications</h2>
            <Link to="/recruiter/applicants" className="text-primary text-sm hover:underline">View all</Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-text-muted">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {recentApps.map(app => (
                <div key={app.id} className="flex justify-between items-center p-4 bg-dark rounded-lg border border-border">
                  <div>
                    <h3 className="font-medium text-text">{app.candidate?.full_name || 'Unknown'}</h3>
                    <p className="text-sm text-text-muted">{app.job?.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{app.match_score}% Match</div>
                      <div className="text-xs text-text-muted">{app.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-6">Job Performance</h2>
          {jobPerformance.length === 0 ? (
            <p className="text-text-muted">No jobs posted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-muted text-sm border-b border-border">
                    <th className="pb-3 font-medium">Job Title</th>
                    <th className="pb-3 font-medium">Views</th>
                    <th className="pb-3 font-medium">Applicants</th>
                    <th className="pb-3 font-medium">Conversion</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {jobPerformance.map((job, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-3 text-text font-medium">{job.title}</td>
                      <td className="py-3 text-text-muted flex items-center gap-1"><Eye size={14}/> {job.views}</td>
                      <td className="py-3 text-text-muted flex items-center gap-1"><UserCheck size={14}/> {job.applications}</td>
                      <td className="py-3 text-primary">{job.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-surface border border-border rounded-xl p-6 flex items-center gap-4">
      <div className={`p-4 rounded-lg bg-dark ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-text-muted text-sm mb-1">{label}</p>
        <p className="text-2xl font-bold text-text">{value}</p>
      </div>
    </motion.div>
  );
}
