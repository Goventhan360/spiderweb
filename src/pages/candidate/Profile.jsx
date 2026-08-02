import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Book, Briefcase, Code, Award, FileText, Upload, Save, Calendar, Plus, ExternalLink, Github, Medal, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import Input from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function Profile() {
  const { profile, updateProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  // Form State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Experience, Education, Skills, Projects arrays
  const [skills, setSkills] = useState(['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL']);
  const [experiences, setExperiences] = useState([
    { id: 1, title: 'Senior Frontend Engineer', company: 'OmniCorp', period: 'Jan 2024 - Present', desc: 'Lead frontend migration from Angular to React/Next.js. Implemented design system reducing UI bugs by 40%.' },
    { id: 2, title: 'UI Developer', company: 'CyberDyne Systems', period: 'Jun 2022 - Dec 2023', desc: 'Built responsive web dashboards using React, Redux Toolkit, and Tailwind CSS.' }
  ]);
  const [educationList, setEducationList] = useState([
    { id: 1, degree: 'B.S. in Computer Science', school: 'University of California, Berkeley', period: '2018 - 2022', grade: '3.8 GPA' }
  ]);
  const [projects, setProjects] = useState([
    { id: 1, name: 'Webloom Career Network', desc: 'AI-powered job matching and career coaching platform.', tags: ['React', 'Tailwind', 'Supabase'], url: 'https://github.com' }
  ]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || 'Alex Morgan');
      setHeadline(profile.headline || 'Senior React Developer');
      setBio(profile.bio || 'Passionate frontend developer with 5+ years of experience building scalable web applications.');
      setLocation(profile.location || 'San Francisco, CA');
      setPhone(profile.phone || '+1 (555) 123-4567');
      setLinkedin(profile.linkedin_url || 'https://linkedin.com/in/alexmorgan');
      setGithub(profile.github_url || 'https://github.com/alexm');
      if (profile.skills && profile.skills.length > 0) {
        setSkills(profile.skills);
      }
    }
  }, [profile]);

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    const { error } = await updateProfile({
      full_name: fullName,
      headline,
      bio,
      location,
      phone,
      linkedin_url: linkedin,
      github_url: github,
      skills,
    });

    if (error) {
      toast.error('Failed to save profile changes');
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already exists');
      return;
    }
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill('');
    updateProfile({ skills: updated });
    toast.success(`Added skill: ${newSkill}`);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    updateProfile({ skills: updated });
    toast.success(`Removed ${skillToRemove}`);
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Sidebar Card */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6 shrink-0">
          <Card className="bg-surface border border-border rounded-[8px] p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-surface-alt relative bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold serif border-border">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AM'}</span>
                )}
                <div 
                  onClick={() => toast.success('Avatar uploaded successfully!')}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-xs"
                >
                  <Upload size={20} className="mb-1" /> Change
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-xl serif font-bold text-text">{fullName || 'Alex Morgan'}</h2>
            <p className="text-text-secondary text-xs mt-1 mb-4">{headline}</p>
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Profile Strength</span>
                <span className="text-primary font-bold mono">85%</span>
              </div>
              <ProgressBar value={85} className="h-2" />
            </div>
          </Card>

          <Card className="bg-surface border border-border rounded-[8px] p-3">
            <TabsList className="flex-col bg-transparent h-auto space-y-1">
              <TabsTrigger value="personal" className="w-full justify-start p-3 data-[state=active]:bg-surface-alt data-[state=active]:text-primary border border-transparent data-[state=active]:border-border text-sm font-medium"><User size={18} className="mr-2.5 shrink-0"/> Personal Info</TabsTrigger>
              <TabsTrigger value="experience" className="w-full justify-start p-3 text-sm font-medium"><Briefcase size={18} className="mr-2.5 shrink-0"/> Experience</TabsTrigger>
              <TabsTrigger value="education" className="w-full justify-start p-3 text-sm font-medium"><Book size={18} className="mr-2.5 shrink-0"/> Education</TabsTrigger>
              <TabsTrigger value="skills" className="w-full justify-start p-3 text-sm font-medium"><Award size={18} className="mr-2.5 shrink-0"/> Skills ({skills.length})</TabsTrigger>
              <TabsTrigger value="projects" className="w-full justify-start p-3 text-sm font-medium"><Code size={18} className="mr-2.5 shrink-0"/> Projects</TabsTrigger>
              <TabsTrigger value="resume" className="w-full justify-start p-3 text-sm font-medium"><FileText size={18} className="mr-2.5 shrink-0"/> Resume</TabsTrigger>
            </TabsList>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3 lg:w-3/4">
            
          {/* PERSONAL INFO */}
          <TabsContent value="personal" className="mt-0">
            <Card className="bg-surface border border-border rounded-[8px] p-6">
              <h3 className="text-xl serif font-bold text-text mb-6">Personal Information</h3>
              <form onSubmit={handleSavePersonal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Full Name</label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="Alex Morgan" 
                      className="bg-surface-alt border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Headline</label>
                    <Input 
                      value={headline} 
                      onChange={(e) => setHeadline(e.target.value)} 
                      placeholder="Senior React Developer" 
                      className="bg-surface-alt border-border"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Bio / About</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="w-full bg-surface-alt border border-border rounded-[8px] p-3 text-text text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]" 
                      placeholder="Tell recruiters about yourself..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Location</label>
                    <Input 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      placeholder="San Francisco, CA" 
                      className="bg-surface-alt border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Phone</label>
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="+1 (555) 000-0000" 
                      className="bg-surface-alt border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">LinkedIn Profile</label>
                    <Input 
                      value={linkedin} 
                      onChange={(e) => setLinkedin(e.target.value)} 
                      placeholder="https://linkedin.com/in/username" 
                      className="bg-surface-alt border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">GitHub Profile</label>
                    <Input 
                      value={github} 
                      onChange={(e) => setGithub(e.target.value)} 
                      placeholder="https://github.com/username" 
                      className="bg-surface-alt border-border"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-gold hover:bg-gold-light text-[#201607] font-semibold px-6">
                    <Save size={18} className="mr-2"/> Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          {/* EXPERIENCE */}
          <TabsContent value="experience" className="mt-0">
            <Card className="bg-surface border border-border rounded-[8px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl serif font-bold text-text">Experience</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setExperiences([...experiences, { id: Date.now(), title: 'Software Engineer', company: 'Tech Corp', period: '2023 - Present', desc: 'Developed web tools.' }]);
                    toast.success('Experience entry added');
                  }}
                  className="border-border hover:border-primary"
                >
                  <Plus size={16} className="mr-1"/> Add Experience
                </Button>
              </div>
              
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-surface-alt border border-border rounded-[8px] relative group hover:border-primary transition-colors">
                    <button 
                      onClick={() => {
                        setExperiences(experiences.filter(e => e.id !== exp.id));
                        toast.success('Experience deleted');
                      }}
                      className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h4 className="text-base font-semibold text-text">{exp.title}</h4>
                    <p className="text-xs text-text-secondary mb-2">{exp.company} • {exp.period}</p>
                    <p className="text-sm text-text-muted">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* EDUCATION */}
          <TabsContent value="education" className="mt-0">
            <Card className="bg-surface border border-border rounded-[8px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl serif font-bold text-text">Education</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEducationList([...educationList, { id: Date.now(), degree: 'M.S. Software Engineering', school: 'Stanford University', period: '2022 - 2024', grade: '3.9 GPA' }]);
                    toast.success('Education entry added');
                  }}
                  className="border-border hover:border-primary"
                >
                  <Plus size={16} className="mr-1"/> Add Education
                </Button>
              </div>

              <div className="space-y-4">
                {educationList.map((edu) => (
                  <div key={edu.id} className="p-4 bg-surface-alt border border-border rounded-[8px] relative group hover:border-primary transition-colors">
                    <button 
                      onClick={() => {
                        setEducationList(educationList.filter(e => e.id !== edu.id));
                        toast.success('Education entry deleted');
                      }}
                      className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h4 className="text-base font-semibold text-text">{edu.degree}</h4>
                    <p className="text-xs text-text-secondary">{edu.school} • {edu.period}</p>
                    <p className="text-xs text-gold font-mono mt-1">{edu.grade}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* SKILLS */}
          <TabsContent value="skills" className="mt-0">
            <Card className="bg-surface border border-border rounded-[8px] p-6">
              <h3 className="text-xl serif font-bold text-text mb-4">Skills & Endorsements</h3>
              
              <div className="flex gap-2 mb-6">
                <Input 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(); }}
                  placeholder="Add a new skill (e.g. Python, AWS)..." 
                  className="bg-surface-alt border-border"
                />
                <Button onClick={handleAddSkill} className="bg-gold hover:bg-gold-light text-[#201607] px-5">Add</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} className="bg-surface-alt border border-border text-text px-3 py-1.5 flex items-center gap-2 text-sm">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="text-text-muted hover:text-danger">
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* PROJECTS */}
          <TabsContent value="projects" className="mt-0">
            <Card className="bg-surface border border-border rounded-[8px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl serif font-bold text-text">Featured Projects</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setProjects([...projects, { id: Date.now(), name: 'AI Resume Scanner', desc: 'ATS scanner built with OpenAI & React.', tags: ['AI', 'React'], url: 'https://github.com' }]);
                    toast.success('Project added');
                  }}
                  className="border-border hover:border-primary"
                >
                  <Plus size={16} className="mr-1"/> Add Project
                </Button>
              </div>

              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-surface-alt border border-border rounded-[8px] relative group hover:border-primary transition-colors">
                    <button 
                      onClick={() => {
                        setProjects(projects.filter(p => p.id !== proj.id));
                        toast.success('Project deleted');
                      }}
                      className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h4 className="text-base font-semibold text-text">{proj.name}</h4>
                    <p className="text-sm text-text-secondary my-2">{proj.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* RESUME */}
          <TabsContent value="resume" className="mt-0">
            <Card className="bg-surface border border-border rounded-[8px] p-6 space-y-6">
              <h3 className="text-xl serif font-bold text-text">Resume Management</h3>
              
              <div className="p-6 bg-surface-alt border-2 border-dashed border-border hover:border-primary rounded-[8px] text-center cursor-pointer transition-colors" onClick={() => toast.success('New resume uploaded successfully!')}>
                <Upload size={32} className="mx-auto text-primary mb-2" />
                <p className="font-semibold text-text">Click to upload new resume</p>
                <p className="text-xs text-text-muted mt-1">Supports PDF, DOCX (Max 10MB)</p>
              </div>

              <div className="p-4 bg-surface-alt border border-border rounded-[8px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-text text-sm">Alex_Morgan_Resume_2026.pdf</p>
                    <p className="text-xs text-text-muted">Uploaded 2 days ago • 1.4 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success('Downloading resume...')} className="border-border hover:border-primary">
                  Download
                </Button>
              </div>
            </Card>
          </TabsContent>
            
        </div>
      </Tabs>
    </motion.div>
  );
}
