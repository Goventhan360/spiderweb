import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Check, X, Calendar, Star, MoreHorizontal, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

const mockApplicants = [
  { id: '1', name: 'Alex Johnson', role: 'Frontend Dev', score: 95, status: 'Applied', date: '2023-10-15', avatar: '', skills: ['React', 'TS', 'Tailwind'] },
  { id: '2', name: 'Sarah Williams', role: 'Frontend Dev', score: 88, status: 'Screening', date: '2023-10-14', avatar: '', skills: ['React', 'CSS', 'Redux'] },
  { id: '3', name: 'Michael Chen', role: 'UX Designer', score: 92, status: 'Interview', date: '2023-10-12', avatar: '', skills: ['Figma', 'UI/UX', 'Prototyping'] },
  { id: '4', name: 'Emily Davis', role: 'Product Manager', score: 75, status: 'Rejected', date: '2023-10-10', avatar: '', skills: ['Agile', 'Scrum', 'Jira'] },
  { id: '5', name: 'David Wilson', role: 'Frontend Dev', score: 82, status: 'Offered', date: '2023-10-05', avatar: '', skills: ['React', 'Node.js', 'MongoDB'] },
  { id: '6', name: 'Jessica Brown', role: 'UX Designer', score: 96, status: 'Applied', date: '2023-10-16', avatar: '', skills: ['Figma', 'User Research', 'Sketch'] },
];

export default function Applicants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredApplicants = mockApplicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesJob = jobFilter === 'All' || app.role === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredApplicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplicants.map(a => a.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;
    toast.success(`${selectedIds.length} applicants marked as ${action}`);
    setSelectedIds([]);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-primary border-primary/30 bg-primary/10';
    if (score >= 80) return 'text-gold border-gold/30 bg-gold/10';
    return 'text-text-muted border-border bg-surface-alt';
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Applicants</h1>
          <p className="text-text-muted mt-1">Review and manage candidates for your open positions.</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4 glass border-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
          <Input 
            icon={<Search size={18} />} 
            placeholder="Search candidates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:max-w-xs bg-surface"
          />
          <Select 
            options={[
              {value: 'All', label: 'All Jobs'},
              {value: 'Frontend Dev', label: 'Frontend Dev'},
              {value: 'UX Designer', label: 'UX Designer'},
              {value: 'Product Manager', label: 'Product Manager'}
            ]}
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          />
        </div>
        
        {/* Status Tabs */}
        <div className="flex bg-surface-alt rounded-lg p-1 border border-border w-full md:w-auto overflow-x-auto">
          {['All', 'Applied', 'Screening', 'Interview', 'Offered', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                statusFilter === status ? "bg-surface text-primary shadow-sm border border-border" : "text-text-secondary hover:text-text"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Bulk Actions (visible when items selected) */}
      {selectedIds.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-primary">{selectedIds.length} applicants selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="hover:border-primary text-text hover:text-primary" onClick={() => handleBulkAction('Screening')} icon={<Check size={14}/>}>Advance</Button>
            <Button size="sm" variant="outline" className="hover:border-gold text-text hover:text-gold" onClick={() => handleBulkAction('Rejected')} icon={<X size={14}/>}>Reject</Button>
          </div>
        </motion.div>
      )}

      {/* Applicants List */}
      <div className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center px-4 py-2 text-sm font-medium text-text-muted">
          <input type="checkbox" onChange={selectAll} checked={selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0} className="mr-4 accent-primary" />
          <div className="flex-1 grid grid-cols-12 gap-4">
            <div className="col-span-5">Candidate</div>
            <div className="col-span-2 text-center">AI Match</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Applied Date</div>
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <Card className="p-8 glass text-center text-text-muted border-border">No applicants found matching filters.</Card>
        ) : (
          filteredApplicants.map((app, index) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "p-4 glass border-border hover:border-primary/50 flex items-center transition-colors cursor-pointer",
                selectedIds.includes(app.id) ? "border-primary bg-primary/5" : ""
              )}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(app.id)} 
                  onChange={() => toggleSelect(app.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mr-4 accent-primary" 
                />
                
                <Link to={`/recruiter/applicants/${app.id}`} className="flex-1 grid grid-cols-12 gap-4 items-center">
                  {/* Info */}
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar src={app.avatar} fallback={app.name} />
                    <div>
                      <h3 className="font-semibold text-text group-hover:text-primary transition-colors">{app.name}</h3>
                      <p className="text-xs text-text-secondary">{app.role}</p>
                      <div className="flex gap-1 mt-1">
                        {app.skills.map(s => <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5">{s}</Badge>)}
                      </div>
                    </div>
                  </div>

                  {/* AI Score */}
                  <div className="col-span-2 flex justify-center">
                    <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold mono", getScoreColor(app.score))}>
                      {app.score}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-3">
                    <Badge variant="outline" className="text-text-secondary border-border">{app.status}</Badge>
                  </div>

                  {/* Date & Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-4 text-sm text-text-muted mono">
                    <span>{app.date}</span>
                    <button onClick={(e) => { e.preventDefault(); /* open menu */ }} className="p-1 hover:text-text rounded-md hover:bg-surface-alt">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
