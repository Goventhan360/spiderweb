import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, Calendar, MoreHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';

export default function Applications() {
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const applications = [
    { id: 1, title: 'Senior React Developer', company: 'CyberDyne', appliedDate: '2 days ago', status: 'Interview', match: 92, statusColor: 'text-gold border-gold bg-gold/10' },
    { id: 2, title: 'Frontend Engineer', company: 'OmniCorp', appliedDate: '1 week ago', status: 'Screening', match: 88, statusColor: 'text-primary border-primary bg-primary/10' },
    { id: 3, title: 'UI Developer', company: 'Stark Industries', appliedDate: '2 weeks ago', status: 'Applied', match: 85, statusColor: 'text-text-secondary border-border-light bg-surface-alt' },
    { id: 4, title: 'Lead Web Developer', company: 'Wayne Ent.', appliedDate: '3 weeks ago', status: 'Rejected', match: 75, statusColor: 'text-text-muted border-border bg-surface' },
  ];

  const filteredApps = activeTab === 'All' ? applications : applications.filter(a => a.status === activeTab);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const pipeline = ['Applied', 'Screening', 'Interview', 'Offered'];

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl serif font-bold text-text">My Applications</h1>
        <p className="text-text-secondary mt-1">Track your job applications and interview status.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-surface border border-border flex overflow-x-auto p-1 mb-6">
          {['All', 'Applied', 'Screening', 'Interview', 'Offered', 'Rejected'].map(tab => (
            <TabsTrigger key={tab} value={tab} className="flex-1 min-w-[100px] data-[state=active]:bg-primary data-[state=active]:text-white">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <EmptyState 
              icon={<Briefcase size={48} className="text-text-muted" />}
              title={`No ${activeTab !== 'All' ? activeTab.toLowerCase() : ''} applications`}
              description="You haven't reached this stage for any applications yet."
            />
          ) : (
            filteredApps.map((app) => (
              <motion.div key={app.id} variants={itemVariants}>
                <Card className="bg-surface rounded-[8px] overflow-hidden border border-border hover:border-primary transition-colors">
                  <div 
                    className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer gap-4"
                    onClick={() => toggleExpand(app.id)}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-[8px] bg-surface-alt flex items-center justify-center serif font-bold text-xl text-primary border border-border-light shrink-0">
                        {app.company[0]}
                      </div>
                      <div>
                        <h3 className="text-lg serif font-semibold text-text">{app.title}</h3>
                        <p className="text-sm text-text-secondary">{app.company} • Applied {app.appliedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex flex-col items-center md:items-end hidden sm:flex">
                        <span className="text-xs text-text-secondary mb-1">AI Match</span>
                        <span className="text-primary mono font-bold text-sm">{app.match}%</span>
                      </div>
                      <Badge className={app.statusColor}>{app.status}</Badge>
                      <Button variant="ghost" size="icon" className="text-text-secondary">
                        {expandedId === app.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === app.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-border-light p-5 bg-surface-alt"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          {/* Status Pipeline Visualization */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-text mb-3">Application Pipeline</h4>
                            <div className="flex items-center w-full">
                              {pipeline.map((step, index) => {
                                const currentIndex = pipeline.indexOf(app.status !== 'Rejected' ? app.status : 'Applied');
                                const isCompleted = index <= currentIndex;
                                const isCurrent = index === currentIndex;
                                return (
                                  <div key={step} className="flex-1 relative">
                                    <div className="flex items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                                        ${isCompleted ? 'bg-primary text-white' : 'bg-surface border-2 border-border-light text-text-muted'}`}>
                                        {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs">{index + 1}</span>}
                                      </div>
                                      {index < pipeline.length - 1 && (
                                        <div className={`h-1 flex-1 mx-2 rounded-full ${index < currentIndex ? 'bg-primary' : 'bg-border-light'}`}></div>
                                      )}
                                    </div>
                                    <p className={`text-xs mt-2 font-medium ${isCurrent ? 'text-primary' : (isCompleted ? 'text-text' : 'text-text-muted')}`}>
                                      {step}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-text flex items-center gap-2"><FileText size={16} className="text-text-secondary" /> Cover Letter snippet</h4>
                            <p className="text-sm text-text-secondary p-3 bg-surface rounded-[8px] border border-border-light italic">
                              "I am writing to express my interest in the {app.title} position at {app.company}. With my background in building highly scalable applications using React..."
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-text flex items-center gap-2"><Calendar size={16} className="text-primary" /> Application Timeline</h4>
                          <div className="relative border-l border-border ml-2 space-y-6 pb-2">
                            {/* Current/Latest Step */}
                            <div className="relative pl-6">
                              <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-primary ring-4 ring-bg"></div>
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-primary">{app.status}</p>
                                <span className="text-[11px] text-text-muted">Today, 2:30 PM</span>
                              </div>
                              <p className="text-xs text-text-secondary">Your application was moved to {app.status}.</p>
                            </div>
                            
                            {/* Previous Step 1 */}
                            {app.status !== 'Applied' && (
                              <div className="relative pl-6">
                                <div className="absolute -left-[4px] top-1.5 w-[7px] h-[7px] rounded-full bg-border ring-4 ring-bg"></div>
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm font-medium text-text">Under Review</p>
                                  <span className="text-[11px] text-text-muted">2 days ago</span>
                                </div>
                                <p className="text-xs text-text-secondary">Hiring team began reviewing your profile.</p>
                              </div>
                            )}

                            {/* Initial Step */}
                            <div className="relative pl-6">
                              <div className="absolute -left-[4px] top-1.5 w-[7px] h-[7px] rounded-full bg-border ring-4 ring-bg"></div>
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-text">Applied</p>
                                <span className="text-[11px] text-text-muted">{app.appliedDate}</span>
                              </div>
                              <p className="text-xs text-text-secondary">Application submitted successfully.</p>
                            </div>
                          </div>
                          
                          <Button className="w-full mt-4 bg-surface hover:bg-surface-alt border border-border">View Full Details</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </Tabs>
    </motion.div>
  );
}
