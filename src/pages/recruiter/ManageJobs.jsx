import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Edit, Eye, Users, Trash2, Power } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

const mockJobs = [
  { id: '1', title: 'Senior React Developer', department: 'Engineering', status: 'Active', applicants: 45, views: 1205, postedAt: '2023-10-01' },
  { id: '2', title: 'UX/UI Designer', department: 'Design', status: 'Active', applicants: 32, views: 890, postedAt: '2023-10-05' },
  { id: '3', title: 'Full Stack Engineer', department: 'Engineering', status: 'Inactive', applicants: 120, views: 3400, postedAt: '2023-09-15' },
  { id: '4', title: 'Product Manager', department: 'Product', status: 'Active', applicants: 15, views: 450, postedAt: '2023-10-10' },
  { id: '5', title: 'DevOps Specialist', department: 'Engineering', status: 'Active', applicants: 8, views: 310, postedAt: '2023-10-12' },
  { id: '6', title: 'Marketing Director', department: 'Marketing', status: 'Inactive', applicants: 85, views: 2100, postedAt: '2023-08-20' },
];

export default function ManageJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobs, setJobs] = useState(mockJobs);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id) => {
    setJobs(jobs.map(job => {
      if (job.id === id) {
        const newStatus = job.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(`Job marked as ${newStatus}`);
        return { ...job, status: newStatus };
      }
      return job;
    }));
  };

  const deleteJob = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== id));
      toast.success('Job deleted successfully');
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Manage Jobs</h1>
          <p className="text-text-muted mt-1">View, edit, and track the performance of your job listings.</p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button variant="primary">Post New Job</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 glass border-border flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            icon={<Search size={18} />} 
            placeholder="Search jobs by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted flex items-center gap-1"><Filter size={16}/> Status:</span>
          {['All', 'Active', 'Inactive'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors border",
                statusFilter === status 
                  ? "bg-primary/10 text-primary border-primary/50" 
                  : "bg-transparent text-text-secondary border-border hover:border-text-muted"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="glass border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border">
                <th className="p-4 text-sm font-medium text-text-secondary">Job Title</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Applicants</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Views</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Posted Date</th>
                <th className="p-4 text-sm font-medium text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted border-b border-border">
                    No jobs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr key={job.id} className="border-b border-border/50 hover:bg-surface-alt transition-colors group">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-text">{job.title}</div>
                        <div className="text-xs text-text-muted mt-1">{job.department}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={job.status === 'Active' ? 'text-primary border-primary/50' : 'text-text-muted border-border'}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-text-muted" />
                        <span className="font-medium mono">{job.applicants}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary mono">
                      {job.views.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-text-secondary mono">
                      {job.postedAt}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Power size={14} />} 
                          title={job.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleStatus(job.id)}
                          className={job.status === 'Active' ? 'hover:text-gold' : 'hover:text-primary'}
                        />
                        <Link to={`/recruiter/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm" icon={<Edit size={14} />} title="Edit" className="hover:text-primary" />
                        </Link>
                        <Link to={`/recruiter/applicants?jobId=${job.id}`}>
                          <Button variant="ghost" size="sm" icon={<Eye size={14} />} title="View Applicants" className="hover:text-primary" />
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Trash2 size={14} />} 
                          title="Delete" 
                          onClick={() => deleteJob(job.id)}
                          className="hover:text-[#F87171] hover:bg-[#F87171]/10" 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
