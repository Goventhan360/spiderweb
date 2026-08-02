import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ShieldAlert, Trash2, Check, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockJobs = [
  { id: 1, title: 'Crypto Trader', company: 'ShadyCorp', flags: 15, status: 'Flagged', date: '2023-10-25' },
  { id: 2, title: 'Senior React Dev', company: 'TechNova', flags: 0, status: 'Active', date: '2023-10-24' },
  { id: 3, title: 'Remote Data Entry - $1000/day', company: 'Unknown', flags: 42, status: 'Flagged', date: '2023-10-23' },
];

export default function ManageJobs() {
  const [jobs, setJobs] = useState(mockJobs);

  const handleAction = (id, action) => {
    if(action === 'delete') {
      setJobs(jobs.filter(j => j.id !== id));
      toast.success('Job removed from platform');
    } else {
      setJobs(jobs.map(j => j.id === id ? { ...j, status: action, flags: 0 } : j));
      toast.success(`Job marked as ${action}`);
    }
  };

  return (
    <motion.div className="p-6 max-w-7xl mx-auto space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="text-3xl serif font-bold text-text">Job Moderation</h1>
        <p className="text-text-muted mt-1">Review flagged jobs to ensure platform safety and quality.</p>
      </div>

      <Card className="glass overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-alt/50 border-b border-border text-sm text-text-secondary">
            <tr>
              <th className="p-4">Job Post</th>
              <th className="p-4">Company</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Flags</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-b border-border/50 hover:bg-surface-alt/30">
                <td className="p-4 font-medium text-text">{job.title}</td>
                <td className="p-4 text-text-secondary">{job.company}</td>
                <td className="p-4">
                  <Badge variant={job.status === 'Flagged' ? 'danger' : 'success'}>
                    {job.status === 'Flagged' && <AlertTriangle size={12} className="mr-1 inline" />}
                    {job.status}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  <span className={`font-bold mono ${job.flags > 10 ? 'text-danger' : job.flags > 0 ? 'text-warning' : 'text-text-muted'}`}>
                    {job.flags}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {job.status === 'Flagged' && (
                    <Button variant="outline" size="sm" onClick={() => handleAction(job.id, 'Active')} className="border-success/50 text-success" icon={<Check size={14}/>}>Approve</Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleAction(job.id, 'delete')} className="border-danger/50 text-danger" icon={<Trash2 size={14}/>}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
