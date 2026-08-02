import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Clock, Bookmark, Share2, ArrowLeft, Building, Users, Globe, CheckCircle, X, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleApply = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      toast.success('Application submitted successfully!');
    }, 1500);
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/candidate/jobs" className="flex items-center gap-2 text-text-secondary hover:text-text"><ArrowLeft size={16} /> Back to Search</Link>
      </Button>

      {/* Header Card */}
      <Card className="bg-surface border border-border rounded-[8px] p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-surface-alt flex items-center justify-center serif font-bold text-3xl text-primary border border-border shrink-0">
              C
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl serif font-bold text-text">Senior Frontend Engineer</h1>
              <p className="text-lg text-text-secondary mt-1">CyberDyne Systems</p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary mt-4">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> San Francisco, CA (Hybrid)</span>
                <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-primary" /> $140,000 - $180,000</span>
                <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-gold" /> Full-time</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-text-muted" /> Posted 2 days ago</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
            <Button 
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full md:w-48 h-12 text-lg bg-gold hover:bg-gold-light text-[#201607]"
            >
              Easy Apply
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border border-border hover:border-primary"><Bookmark size={18} className="mr-2" /> Save</Button>
              <Button variant="outline" className="border border-border hover:border-primary" size="icon"><Share2 size={18} /></Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card className="bg-surface border border-border rounded-[8px] p-6 md:p-8 space-y-6">
            <section>
              <h2 className="text-xl serif font-bold text-text mb-4">About the Role</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>We are looking for an experienced Senior Frontend Engineer to join our core product team. You will be responsible for building exceptional user experiences for our next-generation AI platform.</p>
                <p>The ideal candidate is deeply passionate about web performance, accessibility, and modern React patterns. You will work closely with design, product, and backend teams to deliver high-quality features.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl serif font-bold text-text mb-4">Key Responsibilities</h2>
              <ul className="space-y-3 text-text-secondary">
                {[
                  'Architect and implement complex UI components using React and Tailwind CSS.',
                  'Collaborate with product managers and designers to iterate on features.',
                  'Optimize application for maximum speed and scalability.',
                  'Mentor junior developers and participate in code reviews.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3"><CheckCircle size={20} className="text-primary shrink-0" /> <span>{item}</span></li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl serif font-bold text-text mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'].map(skill => (
                  <Badge key={skill} className="bg-surface-alt text-text border border-border px-3 py-1.5 text-sm">{skill}</Badge>
                ))}
              </div>
            </section>
          </Card>
        </div>

        <div className="space-y-6">
          {/* AI Match Card */}
          <Card className="bg-surface border border-border rounded-[8px] p-6 relative overflow-hidden">
            <h3 className="text-lg serif font-bold text-text mb-4">AI Match Analysis</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-surface-alt border-t-primary">
                <span className="text-2xl font-bold mono text-text">92%</span>
              </div>
              <div>
                <p className="font-semibold text-text">Excellent Match</p>
                <p className="text-sm text-text-secondary">Based on your profile and skills</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">Skills Match</span><span className="text-text mono">95%</span></div>
                <div className="w-full bg-surface-alt rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{width: '95%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">Experience Match</span><span className="text-text mono">88%</span></div>
                <div className="w-full bg-surface-alt rounded-full h-1.5"><div className="bg-gold h-1.5 rounded-full" style={{width: '88%'}}></div></div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-gold" /> Missing Skills
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">GraphQL</span>
                  <Link to="/candidate/learning" className="text-primary hover:underline">Take Course</Link>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Jest</span>
                  <Link to="/candidate/learning" className="text-primary hover:underline">Take Course</Link>
                </div>
              </div>
            </div>

          </Card>

          {/* Company Info */}
          <Card className="bg-surface border border-border rounded-[8px] p-6">
            <h3 className="text-lg serif font-bold text-text mb-4">About the Company</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Building size={18} className="text-text-muted" /> <span>Enterprise AI Solutions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Users size={18} className="text-text-muted" /> <span>500-1000 Employees</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Globe size={18} className="text-text-muted" /> <a href="#" className="hover:text-primary transition-colors">cyberdyne.ai</a>
              </div>
              <p className="text-sm text-text-secondary mt-2">CyberDyne is a leading artificial intelligence company focused on building tools for the future of work.</p>
              <Button variant="link" className="text-primary p-0 h-auto">View Company Profile &rarr;</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Easy Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border w-full max-w-lg rounded-[8px] shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-surface-alt/50">
                <h3 className="serif text-xl font-bold text-text">Easy Apply</h3>
                <button onClick={() => setIsApplyModalOpen(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleApply} className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-text mb-2">Review Profile</h4>
                  <div className="bg-bg border border-border p-4 rounded-[6px]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-text">Alex Morgan</p>
                        <p className="text-sm text-text-secondary">alex@demo.webloom.ai</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">All-Star Profile</Badge>
                    </div>
                    <Link to="/candidate/profile" className="text-xs text-primary hover:underline">Edit Profile</Link>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text mb-2">Resume</h4>
                  <div className="bg-bg border border-border p-4 rounded-[6px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-alt flex items-center justify-center text-primary">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Alex_Morgan_Resume_2026.pdf</p>
                        <p className="text-xs text-text-muted">Uploaded 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" type="button" className="text-xs">Replace</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text mb-2">Cover Letter (Optional)</h4>
                  <textarea 
                    className="w-full bg-bg border border-border rounded-[6px] p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                    placeholder="Write a short message to the hiring manager..."
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-gold hover:bg-gold-light text-[#201607] min-w-[120px]">
                    {isSubmitting ? <span className="animate-spin w-4 h-4 border-2 border-[#201607]/30 border-t-[#201607] rounded-full" /> : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
