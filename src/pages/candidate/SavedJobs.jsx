import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Trash2, Bookmark, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function SavedJobs() {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Demo saved jobs
  const savedJobs = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    title: ['Frontend Engineer', 'React Developer', 'UI Engineer', 'Full Stack Developer'][i],
    company: ['CyberDyne', 'OmniCorp', 'Stark Industries', 'Wayne Enterprises'][i],
    location: 'Remote',
    salary: '$120k - $150k',
    type: 'Full-time',
    savedDate: `${i + 1} days ago`,
    match: 85 + i
  }));

  if (savedJobs.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <EmptyState 
          icon={<Bookmark size={48} className="text-text-muted" />}
          title="No saved jobs yet"
          description="Jobs you bookmark will appear here so you can easily find them later."
          action={<Button asChild><Link to="/candidate/jobs">Browse Jobs</Link></Button>}
        />
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Saved Jobs</h1>
          <p className="text-text-secondary mt-1">You have {savedJobs.length} jobs saved for later.</p>
        </div>
        <select className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-primary hidden md:block">
          <option>Date Saved (Newest)</option>
          <option>Date Saved (Oldest)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <motion.div key={job.id} variants={itemVariants}>
            <Card className="bg-surface border border-border hover:border-primary rounded-[8px] p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-[8px] bg-surface-alt flex items-center justify-center serif font-bold text-xl text-primary border border-border">
                  {job.company[0]}
                </div>
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-danger rounded-full">
                  <Trash2 size={18} />
                </Button>
              </div>
              
              <div className="flex-grow">
                <Link to={`/candidate/jobs/${job.id}`} className="text-lg serif font-semibold text-text hover:text-primary transition-colors block mb-1">
                  {job.title}
                </Link>
                <p className="text-text-secondary text-sm mb-4">{job.company}</p>
                
                <div className="space-y-2 text-xs text-text-secondary mb-4">
                  <div className="flex items-center gap-2"><MapPin size={14} /> {job.location}</div>
                  <div className="flex items-center gap-2"><DollarSign size={14} /> {job.salary}</div>
                  <div className="flex items-center gap-2"><Clock size={14} /> Saved {job.savedDate}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-center mt-auto">
                <Badge variant="outline" className="border-gold text-gold bg-gold/10 mono">Match: {job.match}%</Badge>
                <Button size="sm" className="bg-gold hover:bg-gold-light text-[#201607]" asChild><Link to={`/candidate/jobs/${job.id}`}>Apply</Link></Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
