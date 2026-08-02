import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Target, Edit3, Compass, LayoutDashboard, MessageSquare, BookOpen, Sparkles, X, ChevronRight, CheckCircle, AlertTriangle, Copy, Play } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';

export default function AITools() {
  const [activeTool, setActiveTool] = useState(null);
  const [toolState, setToolState] = useState('input'); // 'input', 'loading', 'result'

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tools = [
    { id: 'resume', title: 'Resume Analyzer', desc: 'Get ATS score and analysis for your resume', icon: <FileText size={24} />, color: 'text-primary' },
    { id: 'cover', title: 'Cover Letter Gen', desc: 'Generate tailored letters for specific jobs', icon: <FileText size={24} />, color: 'text-gold' },
    { id: 'interview', title: 'Interview Prep', desc: 'AI-generated questions and mock interviews', icon: <MessageSquare size={24} />, color: 'text-primary' },
    { id: 'match', title: 'AI Job Matching', desc: 'Find best-fit jobs based on your exact profile', icon: <Target size={24} />, color: 'text-gold' },
    { id: 'builder', title: 'Resume Builder', desc: 'AI-generated professional summary & bullets', icon: <Edit3 size={24} />, color: 'text-text-secondary' },
    { id: 'coach', title: 'Career Coach', desc: 'Personalized career advice & next steps', icon: <Compass size={24} />, color: 'text-primary' },
    { id: 'gap', title: 'Skill Gap Analysis', desc: 'Compare your skills vs job requirements', icon: <LayoutDashboard size={24} />, color: 'text-gold' },
    { id: 'learning', title: 'Learning Roadmap', desc: 'Structured learning path to reach your goals', icon: <BookOpen size={24} />, color: 'text-text-secondary' },
  ];

  const handleSimulateAI = () => {
    setToolState('loading');
    setTimeout(() => {
      setToolState('result');
    }, 2500);
  };

  const closeTool = () => {
    setActiveTool(null);
    setToolState('input');
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-7xl mx-auto space-y-8 relative">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl serif font-bold text-text mb-4 inline-flex items-center justify-center gap-3">
          <Sparkles className="text-gold" size={32} /> AI Tools Hub
        </h1>
        <p className="text-text-secondary text-lg">Supercharge your job search with our suite of intelligent career tools designed to give you the competitive edge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={itemVariants}>
            <Card 
              className="bg-surface p-6 hover-card cursor-pointer h-full flex flex-col items-start border-border-light hover:border-primary group rounded-[8px] transition-colors"
              onClick={() => setActiveTool(tool.id)}
            >
              <div className={`p-3 rounded-xl bg-surface-alt mb-4 border border-border-light group-hover:border-primary/50 transition-colors ${tool.color}`}>
                {tool.icon}
              </div>
              <h3 className="text-lg serif font-bold text-text mb-2">{tool.title}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">{tool.desc}</p>
              <Button variant="ghost" className="w-full justify-between px-0 text-text group-hover:text-primary mt-auto">
                Launch Tool <ChevronRight size={16} />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tool Modal Overlay */}
      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeTool}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border shadow-2xl w-full max-w-4xl rounded-[12px] overflow-hidden relative flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-border flex justify-between items-center bg-surface-alt">
                <h2 className="text-xl serif font-bold text-text flex items-center gap-2">
                  <Sparkles className="text-gold" size={20} /> 
                  {tools.find(t => t.id === activeTool)?.title}
                </h2>
                <button onClick={closeTool} className="text-text-muted hover:text-white transition-colors"><X size={24} /></button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto flex-grow relative bg-bg">
                
                {/* === LOADING STATE === */}
                {toolState === 'loading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/90 backdrop-blur-sm z-10">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 border-4 border-surface-alt rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto text-gold animate-pulse" size={24} />
                    </div>
                    <h3 className="text-xl serif font-bold text-text mb-2 animate-pulse">AI is thinking...</h3>
                    <p className="text-text-secondary">Analyzing millions of data points for your optimal result.</p>
                  </div>
                )}

                {/* === RESUME ANALYZER === */}
                {activeTool === 'resume' && (
                  <>
                    {toolState === 'input' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="bg-surface-alt p-4 rounded-[8px] border border-border-light text-sm text-text-secondary">
                          <AlertTriangle size={16} className="inline mr-2 text-gold" />
                          Paste your resume text below. Our AI will evaluate it against standard ATS systems.
                        </div>
                        <textarea 
                          className="w-full h-64 bg-surface p-4 rounded-[8px] border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text font-mono text-sm" 
                          placeholder="Paste resume text here..."
                          defaultValue="Alex Morgan\nSenior Frontend Developer\n\nExperience:\n- OmniCorp (2024-Present)\nLead frontend migration to React.\n\nSkills: React, JavaScript, HTML, CSS"
                        ></textarea>
                        <div className="flex justify-end">
                          <Button onClick={handleSimulateAI} className="bg-gold hover:bg-gold-light text-[#201607] h-12 px-8">Analyze Resume</Button>
                        </div>
                      </motion.div>
                    )}
                    {toolState === 'result' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center gap-6 p-6 bg-surface-alt rounded-[8px] border border-border">
                          <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-surface border-t-primary shrink-0">
                            <span className="text-3xl font-bold mono text-text">78</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-text">Good, but needs work</h3>
                            <p className="text-text-secondary mt-1">Your resume passes basic ATS checks but lacks quantifiable achievements and certain high-value keywords.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="bg-surface p-5 border-border">
                            <h4 className="font-semibold text-text mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-primary"/> Keyword Matches</h4>
                            <div className="flex flex-wrap gap-2">
                              {['React', 'JavaScript', 'Frontend'].map(kw => <span key={kw} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{kw}</span>)}
                            </div>
                          </Card>
                          <Card className="bg-surface p-5 border-border">
                            <h4 className="font-semibold text-text mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-gold"/> Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {['TypeScript', 'Redux', 'Jest', 'CI/CD'].map(kw => <span key={kw} className="px-3 py-1 bg-surface-alt text-text-secondary border border-border rounded-full text-sm">{kw}</span>)}
                            </div>
                          </Card>
                        </div>

                        <Card className="bg-surface p-5 border-border">
                          <h4 className="font-semibold text-text mb-4">AI Suggestions</h4>
                          <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-text-secondary">
                              <span className="w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center text-primary shrink-0">1</span>
                              Quantify your experience at OmniCorp (e.g., "Led migration that reduced load times by 40%").
                            </li>
                            <li className="flex gap-3 text-sm text-text-secondary">
                              <span className="w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center text-primary shrink-0">2</span>
                              Add a "Professional Summary" section at the top of your resume.
                            </li>
                          </ul>
                        </Card>
                        
                        <div className="flex justify-end pt-4">
                          <Button variant="outline" onClick={() => setToolState('input')} className="border-border hover:border-primary">Analyze Another</Button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* === COVER LETTER GENERATOR === */}
                {activeTool === 'cover' && (
                  <>
                    {toolState === 'input' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Target Job Title</label>
                            <Input placeholder="e.g. Full Stack Engineer" defaultValue="Senior Frontend Engineer" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Company Name</label>
                            <Input placeholder="e.g. Google" defaultValue="CyberDyne Systems" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-text-secondary">Job Description (Optional)</label>
                            <textarea className="w-full h-32 bg-surface p-3 rounded-[8px] border border-border focus:border-primary outline-none text-text text-sm" placeholder="Paste the job requirements..."></textarea>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-text-secondary">Tone</label>
                            <select className="w-full h-10 bg-surface border border-border rounded-md px-3 text-text focus:outline-none focus:border-primary">
                              <option>Professional & Confident</option>
                              <option>Enthusiastic & Passionate</option>
                              <option>Direct & Concise</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleSimulateAI} className="bg-gold hover:bg-gold-light text-[#201607] h-12 px-8">Generate Cover Letter</Button>
                        </div>
                      </motion.div>
                    )}
                    {toolState === 'result' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="bg-surface border border-border rounded-[8px] p-6 text-sm text-text-secondary leading-relaxed font-serif whitespace-pre-line relative">
                          <button className="absolute top-4 right-4 p-2 bg-surface-alt hover:bg-border rounded-md text-text transition-colors" title="Copy to clipboard">
                            <Copy size={16} />
                          </button>
                          {`Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at CyberDyne Systems. With over 5 years of experience specializing in React and modern UI architectures, I have a proven track record of delivering high-performance web applications that scale.

In my recent role, I spearheaded the frontend migration from legacy systems to a modern Next.js stack, resulting in a 40% improvement in load times and a significant boost in developer productivity. I am deeply impressed by CyberDyne's commitment to artificial intelligence and its application in enterprise solutions, and I am eager to bring my expertise in building resilient user interfaces to your talented team.

I welcome the opportunity to discuss how my technical skills and product mindset align with the goals of CyberDyne Systems. Thank you for your time and consideration.

Sincerely,
Alex Morgan`}
                        </div>
                        <div className="flex justify-end pt-4 gap-3">
                          <Button variant="ghost" onClick={() => setToolState('input')}>Edit Inputs</Button>
                          <Button className="bg-gold hover:bg-gold-light text-[#201607]"><Copy size={16} className="mr-2"/> Copy to Clipboard</Button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* === INTERVIEW PREP COACH === */}
                {activeTool === 'interview' && (
                  <>
                    {toolState === 'input' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                        <MessageSquare size={48} className="text-primary mb-4" />
                        <h3 className="text-2xl serif font-bold text-text mb-2">Mock Interview Simulator</h3>
                        <p className="text-text-secondary mb-8 max-w-md">Practice your interviewing skills with our AI coach. We'll simulate a real interview tailored to your role.</p>
                        
                        <div className="w-full max-w-sm space-y-4 text-left">
                          <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Target Role</label>
                            <Input defaultValue="Frontend Engineer" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Experience Level</label>
                            <select className="w-full h-10 bg-surface border border-border rounded-md px-3 text-text focus:outline-none focus:border-primary">
                              <option>Mid-Level</option>
                              <option>Senior</option>
                              <option>Junior</option>
                            </select>
                          </div>
                          <Button onClick={handleSimulateAI} className="w-full bg-gold hover:bg-gold-light text-[#201607] h-12 mt-6">
                            <Play size={16} className="mr-2" /> Start Interview
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    {toolState === 'result' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex flex-col h-full">
                        <div className="flex-grow space-y-4">
                          {/* AI Message */}
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shrink-0">
                              <Sparkles size={20} />
                            </div>
                            <div className="bg-surface-alt border border-border p-4 rounded-2xl rounded-tl-none">
                              <p className="text-text text-sm leading-relaxed">
                                Welcome, Alex. Let's begin the mock interview for the Senior Frontend Engineer role. 
                                <br/><br/>
                                <strong>Question 1:</strong> Can you describe a time when you had to optimize the performance of a complex React application? What specific techniques did you use?
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <textarea 
                            className="w-full h-24 bg-surface p-3 rounded-[8px] border border-border focus:border-primary outline-none text-text text-sm mb-3" 
                            placeholder="Type your answer here to get AI feedback..."
                          ></textarea>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-text-muted">Pro tip: Use the STAR method (Situation, Task, Action, Result).</span>
                            <Button className="bg-primary hover:bg-primary/90 text-white">Submit Answer</Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* === MATCH / BUILDER / COACH / GAP / LEARNING TOOLS === */}
                {activeTool === 'match' && (
                  <div className="space-y-6">
                    <h3 className="text-xl serif font-bold text-text">Top AI-Matched Jobs</h3>
                    <p className="text-sm text-text-secondary">Based on your skills: React, TypeScript, Node.js, Next.js</p>
                    <div className="space-y-3">
                      {[
                        { title: 'Senior AI Frontend Lead', company: 'NexaTech Labs', match: 98 },
                        { title: 'Full Stack Engineer', company: 'OmniCorp', match: 94 },
                        { title: 'React Systems Architect', company: 'CyberDyne Systems', match: 91 }
                      ].map((m, idx) => (
                        <div key={idx} className="p-4 bg-surface border border-border rounded-[8px] flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-text text-sm">{m.title}</h4>
                            <p className="text-xs text-text-muted">{m.company}</p>
                          </div>
                          <Badge className="bg-gold/10 text-gold border-gold/30">{m.match}% Match</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTool === 'builder' && (
                  <div className="space-y-4">
                    <h3 className="text-xl serif font-bold text-text">AI Resume Summary Builder</h3>
                    <div className="p-4 bg-surface border border-border rounded-[8px] text-sm text-text-secondary font-serif leading-relaxed">
                      "Results-driven Senior Software Engineer with 5+ years of experience engineering high-throughput React applications, optimizing design system tokens, and boosting core web vitals by 40%."
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText("Results-driven Senior Software Engineer with 5+ years of experience engineering high-throughput React applications, optimizing design system tokens, and boosting core web vitals by 40%."); toast.success('Summary copied to clipboard!'); }} className="bg-gold hover:bg-gold-light text-[#201607]"><Copy size={16} className="mr-2"/> Copy Summary</Button>
                  </div>
                )}

                {activeTool === 'coach' && (
                  <div className="space-y-4">
                    <h3 className="text-xl serif font-bold text-text">AI Career Coach Recommendations</h3>
                    <ul className="space-y-3">
                      {[
                        'Master GraphQL & Server Actions to qualify for Staff Engineer roles.',
                        'Lead an open-source UI component library to build domain authority.',
                        'Obtain AWS Certified Solutions Architect credential to unlock $180k+ compensation bracket.'
                      ].map((advice, i) => (
                        <li key={i} className="p-3 bg-surface border border-border rounded-[6px] text-sm text-text-secondary flex items-start gap-2">
                          <Sparkles size={16} className="text-gold shrink-0 mt-0.5" />
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTool === 'gap' && (
                  <div className="space-y-4">
                    <h3 className="text-xl serif font-bold text-text">Skill Gap Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface border border-border rounded-[8px]">
                        <h4 className="font-semibold text-text text-sm mb-2 text-primary">Your Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {['React', 'TypeScript', 'Node.js', 'Tailwind'].map(s => <Badge key={s} className="bg-primary/10 text-primary border-primary/20">{s}</Badge>)}
                        </div>
                      </div>
                      <div className="p-4 bg-surface border border-border rounded-[8px]">
                        <h4 className="font-semibold text-text text-sm mb-2 text-gold">Missing Skills for Senior Roles</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {['Docker', 'Kubernetes', 'System Design'].map(s => <Badge key={s} className="bg-gold/10 text-gold border-gold/20">{s}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTool === 'learning' && (
                  <div className="space-y-4">
                    <h3 className="text-xl serif font-bold text-text">AI Learning Roadmap</h3>
                    <div className="space-y-3">
                      {[
                        { step: 'Week 1-2', title: 'System Design Principles', desc: 'Load balancing, caching, database sharding' },
                        { step: 'Week 3-4', title: 'Docker & Kubernetes Deep Dive', desc: 'Container orchestration and CI/CD pipelines' },
                        { step: 'Week 5-6', title: 'GraphQL & Microservices', desc: 'Distributed GraphQL schemas and Apollo Server' }
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-surface border border-border rounded-[8px] flex items-start gap-3">
                          <span className="px-2.5 py-1 bg-surface-alt border border-border text-gold text-xs font-mono rounded">{item.step}</span>
                          <div>
                            <h4 className="font-semibold text-text text-sm">{item.title}</h4>
                            <p className="text-xs text-text-muted">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
