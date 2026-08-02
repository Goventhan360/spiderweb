import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, TrendingUp, FileText, Calendar, ChevronRight, Star, Activity, Sparkles, User, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Skeleton from '@/components/ui/Skeleton';

export default function CandidateDashboard() {
  const { user, profile, loading } = useAuth();
  
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Welcome back, {profile?.full_name || 'Candidate'}!</h1>
          <p className="text-text-secondary mt-1">Here's what's happening with your job search today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border border-border hover:border-primary" asChild><Link to="/candidate/profile">Update Resume</Link></Button>
          <Button className="bg-gold hover:bg-gold-light text-[#201607]" asChild><Link to="/candidate/jobs">Find Jobs</Link></Button>
        </div>
      </div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Applications" value="12" icon={<Briefcase />} change="+2 this week" />
        <StatCard title="Saved Jobs" value="8" icon={<Bookmark />} change="View all" />
        <StatCard title="Profile Score" value="85%" icon={<User />} change="Complete profile" />
        <StatCard title="Resume Score" value="78%" icon={<FileText />} change="+5% from last check" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-surface border border-border rounded-[8px] p-6">
             <h2 className="text-xl serif font-semibold text-text mb-4 flex items-center gap-2"><Sparkles className="text-gold" /> Recommended Jobs</h2>
             <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex justify-between items-center p-4 bg-surface-alt rounded-[8px] border border-border hover:border-primary transition-colors">
                    <div>
                      <h3 className="font-semibold text-text">Senior Frontend Developer</h3>
                      <p className="text-sm text-text-secondary">TechCorp Inc. • Remote</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="text-xs">React</Badge>
                        <Badge variant="outline" className="text-xs">TypeScript</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild><Link to={`/candidate/jobs/${i}`}>View <ArrowRight size={16} /></Link></Button>
                  </div>
                ))}
             </div>
           </Card>
           
           <Card className="bg-surface border border-border rounded-[8px] p-6">
             <h2 className="text-xl serif font-semibold text-text mb-4 flex items-center gap-2"><TrendingUp className="text-primary" /> Trending Skills</h2>
             <div className="flex flex-wrap gap-3">
               <Badge className="bg-surface-alt text-text px-3 py-1">React <span className="text-primary ml-1 mono">98%</span></Badge>
               <Badge className="bg-surface-alt text-text px-3 py-1">Node.js <span className="text-primary ml-1 mono">85%</span></Badge>
               <Badge className="bg-surface-alt text-text px-3 py-1">Python <span className="text-primary ml-1 mono">92%</span></Badge>
               <Badge className="bg-surface-alt text-text px-3 py-1">AWS <span className="text-primary ml-1 mono">78%</span></Badge>
               <Badge className="bg-surface-alt text-text px-3 py-1">GraphQL <span className="text-primary ml-1 mono">65%</span></Badge>
             </div>
           </Card>
        </div>
        
        <div className="space-y-6">
           <Card className="bg-surface border border-border rounded-[8px] p-6 relative overflow-hidden">
             <h2 className="text-xl serif font-semibold text-text mb-4 flex items-center gap-2"><Activity className="text-primary" /> AI Match Score</h2>
             <div className="flex flex-col items-center justify-center p-6">
               <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-surface-alt border-t-primary">
                 <span className="text-3xl font-bold mono text-text">92%</span>
               </div>
               <p className="mt-4 text-center text-sm text-text-secondary">Your profile matches well with top tech companies.</p>
               <Button className="mt-4 w-full bg-surface-alt hover:bg-surface border border-border hover:border-primary" asChild><Link to="/candidate/ai-tools">Improve Score</Link></Button>
             </div>
           </Card>
           
           <Card className="bg-surface border border-border rounded-[8px] p-6">
             <h2 className="text-xl serif font-semibold text-text mb-4 flex items-center gap-2"><Calendar className="text-gold" /> Upcoming Interviews</h2>
             <div className="space-y-3">
                <div className="p-3 bg-surface-alt rounded-[8px] border border-border hover:border-primary transition-colors">
                  <p className="text-sm font-semibold text-text">Technical Interview</p>
                  <p className="text-xs text-text-secondary mt-1">Tomorrow, 10:00 AM • CyberDyne</p>
                  <div className="mt-2 text-xs text-gold font-medium">Video Call</div>
                </div>
                <div className="p-3 bg-surface-alt rounded-[8px] border border-border hover:border-primary transition-colors">
                  <p className="text-sm font-semibold text-text">HR Screening</p>
                  <p className="text-xs text-text-secondary mt-1">Friday, 2:00 PM • OmniCorp</p>
                  <div className="mt-2 text-xs text-gold font-medium">Phone Call</div>
                </div>
             </div>
           </Card>
        </div>
      </div>
    </motion.div>
  );
}
