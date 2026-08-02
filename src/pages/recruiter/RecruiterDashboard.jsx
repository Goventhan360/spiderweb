import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, Calendar, CheckCircle, 
  TrendingUp, Plus, Search, Filter, MoreVertical, 
  MapPin, Clock, DollarSign
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import StatCard from '@/components/ui/StatCard';
import { cn, getInitials } from '@/utils/helpers';

const pipelineData = [
  { name: 'Applied', count: 243 },
  { name: 'Screening', count: 85 },
  { name: 'Interview', count: 32 },
  { name: 'Offered', count: 12 },
  { name: 'Hired', count: 5 },
];

const recentApplicants = [
  { id: 1, name: 'Alex Johnson', role: 'Senior React Developer', score: 92, status: 'Interview', date: '2h ago', avatar: '' },
  { id: 2, name: 'Sarah Williams', role: 'UX Designer', score: 88, status: 'Screening', date: '5h ago', avatar: '' },
  { id: 3, name: 'Michael Chen', role: 'Full Stack Engineer', score: 95, status: 'Applied', date: '1d ago', avatar: '' },
  { id: 4, name: 'Emily Davis', role: 'Product Manager', score: 78, status: 'Rejected', date: '1d ago', avatar: '' },
  { id: 5, name: 'David Wilson', role: 'Senior React Developer', score: 85, status: 'Offered', date: '2d ago', avatar: '' },
];

const activeJobs = [
  { id: 1, title: 'Senior React Developer', applicants: 45, status: 'Active', days: 12 },
  { id: 2, title: 'UX Designer', applicants: 32, status: 'Active', days: 8 },
  { id: 3, title: 'Full Stack Engineer', applicants: 89, status: 'Active', days: 20 },
  { id: 4, title: 'Product Manager', applicants: 15, status: 'Closing Soon', days: 28 },
  { id: 5, title: 'DevOps Engineer', applicants: 62, status: 'Active', days: 15 },
];

const upcomingInterviews = [
  { id: 1, candidate: 'Alex Johnson', role: 'Senior React Developer', time: 'Today, 2:00 PM', type: 'Technical' },
  { id: 2, candidate: 'Sarah Williams', role: 'UX Designer', time: 'Tomorrow, 10:30 AM', type: 'Portfolio Review' },
  { id: 3, candidate: 'Jessica Brown', role: 'Full Stack Engineer', time: 'Oct 25, 1:00 PM', type: 'Cultural Fit' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function RecruiterDashboard() {
  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl serif font-bold text-text mb-2">Welcome Back, Recruiter</h1>
          <p className="text-text-muted">Here's what's happening with your job postings today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Search size={18} />}>Search Candidates</Button>
          <Button variant="primary" icon={<Plus size={18} />}>Post New Job</Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Posted Jobs" value="15" icon={<Briefcase />} trend="+2 this week" trendUp={true} />
        <StatCard title="Total Applicants" value="243" icon={<Users />} trend="+18% vs last month" trendUp={true} />
        <StatCard title="Interviews Scheduled" value="8" icon={<Calendar />} trend="3 today" trendUp={true} />
        <StatCard title="Hired This Month" value="3" icon={<CheckCircle />} trend="Target: 5" trendUp={false} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6 h-full glass border-border hover-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl serif font-semibold text-text">Hiring Pipeline</h2>
              <Button variant="ghost" size="sm">View Detailed Report</Button>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a312c" vertical={false} />
                  <XAxis dataKey="name" stroke="#87958e" tick={{fill: '#87958e'}} axisLine={false} tickLine={false} className="mono text-xs" />
                  <YAxis stroke="#87958e" tick={{fill: '#87958e'}} axisLine={false} tickLine={false} className="mono text-xs" />
                  <Tooltip 
                    cursor={{fill: '#1a1f1b', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#131614', borderColor: '#2a312c', borderRadius: '8px' }}
                    itemStyle={{ color: '#4ADE80' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#4ADE80' : index === 3 ? '#D4AF37' : '#2a312c'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full glass border-border hover-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl serif font-semibold text-text">Upcoming Interviews</h2>
              <Button variant="ghost" size="sm">View Calendar</Button>
            </div>
            <div className="space-y-4">
              {upcomingInterviews.map(interview => (
                <div key={interview.id} className="p-4 rounded-lg bg-surface-alt border border-border relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold group-hover:w-2 transition-all duration-300"></div>
                  <div className="pl-3">
                    <h3 className="font-medium text-text">{interview.candidate}</h3>
                    <p className="text-sm text-text-secondary">{interview.role}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-text-muted mono">
                      <Clock size={14} className="text-gold" />
                      <span>{interview.time}</span>
                      <span className="mx-1">•</span>
                      <span>{interview.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" icon={<Plus size={16}/>}>Schedule New</Button>
          </Card>
        </motion.div>

        {/* Recent Applicants */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6 glass border-border hover-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl serif font-semibold text-text">Recent Applicants</h2>
              <Link to="/recruiter/applicants"><Button variant="ghost" size="sm">View All</Button></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-sm text-text-muted">
                    <th className="pb-3 font-medium">Candidate</th>
                    <th className="pb-3 font-medium">Applied For</th>
                    <th className="pb-3 font-medium text-center">AI Match</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map((app) => (
                    <tr key={app.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={app.avatar} fallback={getInitials(app.name)} size="sm" />
                          <span className="font-medium text-text">{app.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-text-secondary">{app.role}</td>
                      <td className="py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border mono",
                          app.score >= 90 ? "bg-primary/10 text-primary border-primary/20" : 
                          app.score >= 80 ? "bg-gold/10 text-gold border-gold/20" : 
                          "bg-surface-alt text-text-muted border-border"
                        )}>
                          {app.score}%
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="border-border text-text-secondary">{app.status}</Badge>
                      </td>
                      <td className="py-3 text-sm text-text-muted text-right mono">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Active Jobs Summary */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 glass border-border hover-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl serif font-semibold text-text">Active Jobs</h2>
              <Link to="/recruiter/jobs"><Button variant="ghost" size="sm">Manage</Button></Link>
            </div>
            <div className="space-y-4">
              {activeJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-alt border border-transparent hover:border-border transition-all">
                  <div>
                    <h3 className="font-medium text-text truncate max-w-[150px]" title={job.title}>{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", job.status === 'Active' ? 'text-primary border-primary/50' : 'text-gold border-gold/50')}>
                        {job.status}
                      </Badge>
                      <span className="text-xs text-text-muted mono">{job.days}d ago</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary mono">{job.applicants}</div>
                    <div className="text-xs text-text-muted">applicants</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
