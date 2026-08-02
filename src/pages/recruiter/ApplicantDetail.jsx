import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Mail, Phone, MapPin, ExternalLink, 
  Download, Calendar, Check, X, FileText, BrainCircuit,
  MessageSquare, Briefcase
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

const mockApplicant = {
  id: '1',
  name: 'Alex Johnson',
  role: 'Senior React Developer',
  email: 'alex.j@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  status: 'Interview',
  appliedDate: 'Oct 15, 2023',
  links: { linkedin: '#', github: '#' },
  aiScore: 92,
  aiAnalysis: "Strong match for frontend requirements. Extensive React experience. Needs minor upskilling in DevOps/CI-CD.",
  skills: [
    { name: 'React', match: 'full' },
    { name: 'TypeScript', match: 'full' },
    { name: 'Redux', match: 'full' },
    { name: 'Node.js', match: 'partial' },
    { name: 'AWS', match: 'missing' }
  ],
  experience: [
    { title: 'Frontend Engineer', company: 'TechCorp', period: '2020 - Present', desc: 'Led development of core web application.' },
    { title: 'Web Developer', company: 'StartupInc', period: '2018 - 2020', desc: 'Built responsive UI components.' }
  ]
};

export default function ApplicantDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState(mockApplicant.status);
  
  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Top Nav */}
      <div className="flex items-center gap-4 mb-2">
        <Link to="/recruiter/applicants" className="text-text-muted hover:text-text flex items-center gap-1 text-sm transition-colors">
          <ChevronLeft size={16} /> Back to Applicants
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Actions */}
        <div className="space-y-6">
          <Card className="p-6 glass border-border text-center">
            <div className="flex justify-center mb-4">
              <Avatar src="" fallback={mockApplicant.name} size="xl" />
            </div>
            <h1 className="text-2xl serif font-bold text-text">{mockApplicant.name}</h1>
            <p className="text-primary font-medium">{mockApplicant.role}</p>
            
            <div className="mt-4 flex flex-col gap-2 text-sm text-text-secondary text-left bg-surface-alt p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2"><Mail size={14}/> {mockApplicant.email}</div>
              <div className="flex items-center gap-2"><Phone size={14}/> {mockApplicant.phone}</div>
              <div className="flex items-center gap-2"><MapPin size={14}/> {mockApplicant.location}</div>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" size="sm" icon={<ExternalLink size={14}/>}>LinkedIn</Button>
              <Button variant="outline" size="sm" icon={<ExternalLink size={14}/>}>GitHub</Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider text-left mb-2">Actions</h3>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="primary" 
                  className="w-full" 
                  icon={<Calendar size={16}/>}
                >
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full" icon={<MessageSquare size={16}/>}>Message Candidate</Button>
                
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 hover:border-primary text-text-secondary hover:text-primary" 
                    onClick={() => updateStatus('Offered')}
                  >
                    Offer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 hover:border-gold text-text-secondary hover:text-gold"
                    onClick={() => updateStatus('Rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Insights & Resume */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Match Card */}
          <Card className="p-6 glass border-border relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-border bg-surface flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary mono">{mockApplicant.aiScore}%</span>
                <span className="text-[10px] text-text-muted uppercase">Match</span>
              </div>
              <div>
                <h2 className="text-xl serif font-semibold text-text flex items-center gap-2">
                  <BrainCircuit className="text-primary" /> AI Candidate Analysis
                </h2>
                <p className="text-text-secondary mt-2">{mockApplicant.aiAnalysis}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-text mb-3">Skill Match Breakdown</h3>
              <div className="flex flex-wrap gap-2">
                {mockApplicant.skills.map((skill, i) => (
                  <Badge 
                    key={i} 
                    variant="outline"
                    className={cn(
                      "px-3 py-1",
                      skill.match === 'full' ? 'border-primary text-primary bg-primary/10' :
                      skill.match === 'partial' ? 'border-gold text-gold bg-gold/10' :
                      'border-border text-text-muted'
                    )}
                  >
                    {skill.name} {skill.match === 'full' && '✓'}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Resume & Experience Tabs */}
          <Card className="p-6 glass border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl serif font-semibold text-text">Experience & Education</h2>
              <Button variant="ghost" size="sm" icon={<Download size={14}/>}>Download Resume</Button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-border">
              {mockApplicant.experience.map((exp, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-border bg-surface text-text shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Briefcase size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-alt p-4 rounded-lg border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-text">{exp.title}</h4>
                      <span className="text-xs text-primary mono bg-primary/10 px-2 py-1 rounded-full">{exp.period}</span>
                    </div>
                    <div className="text-sm text-text-muted mb-2 font-medium">{exp.company}</div>
                    <p className="text-sm text-text-secondary">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
