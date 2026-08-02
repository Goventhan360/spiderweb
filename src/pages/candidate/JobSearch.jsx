import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Briefcase, Filter, X, Bookmark, Clock, Bell, Star, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ALL_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'CyberDyne Systems', rating: 4.8, location: 'San Francisco, CA', salary: '$140k - $180k', salaryMin: 140000, salaryMax: 180000, type: 'Full-time', mode: 'Hybrid', experience: 'Senior Level', posted: '1 day ago', skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'], match: 94 },
  { id: 2, title: 'Full Stack Engineer', company: 'OmniCorp', rating: 4.5, location: 'Remote', salary: '$120k - $150k', salaryMin: 120000, salaryMax: 150000, type: 'Full-time', mode: 'Remote', experience: 'Mid Level', posted: '2 days ago', skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'], match: 89 },
  { id: 3, title: 'React Native Developer', company: 'Stark Industries', rating: 4.9, location: 'New York, NY', salary: '$130k - $160k', salaryMin: 130000, salaryMax: 160000, type: 'Contract', mode: 'On-site', experience: 'Senior Level', posted: '3 days ago', skills: ['React Native', 'Mobile', 'Redux', 'TypeScript'], match: 86 },
  { id: 4, title: 'UI/UX Product Designer', company: 'Wayne Enterprises', rating: 4.7, location: 'Austin, TX', salary: '$110k - $140k', salaryMin: 110000, salaryMax: 140000, type: 'Full-time', mode: 'Hybrid', experience: 'Mid Level', posted: '4 days ago', skills: ['Figma', 'UI Design', 'Prototyping', 'Design Systems'], match: 82 },
  { id: 5, title: 'Junior Frontend Developer', company: 'NexaTech', rating: 4.2, location: 'Remote', salary: '$70k - $90k', salaryMin: 70000, salaryMax: 90000, type: 'Full-time', mode: 'Remote', experience: 'Entry Level', posted: '5 days ago', skills: ['HTML', 'CSS', 'JavaScript', 'React'], match: 78 },
  { id: 6, title: 'Lead Backend Engineer', company: 'CloudSphere', rating: 4.6, location: 'Seattle, WA', salary: '$170k - $210k', salaryMin: 170000, salaryMax: 210000, type: 'Full-time', mode: 'On-site', experience: 'Lead / Manager', posted: 'Just now', skills: ['Python', 'Go', 'Kubernetes', 'Docker'], match: 91 },
  { id: 7, title: 'AI Engineering Specialist', company: 'DataForge', rating: 4.9, location: 'Remote', salary: '$160k - $200k', salaryMin: 160000, salaryMax: 200000, type: 'Freelance', mode: 'Remote', experience: 'Senior Level', posted: '1 day ago', skills: ['Python', 'PyTorch', 'LLMs', 'OpenAI'], match: 96 },
  { id: 8, title: 'DevOps & Infrastructure Lead', company: 'CyberVault', rating: 4.4, location: 'Chicago, IL', salary: '$150k - $190k', salaryMin: 150000, salaryMax: 190000, type: 'Contract', mode: 'Hybrid', experience: 'Lead / Manager', posted: '6 days ago', skills: ['Terraform', 'AWS', 'CI/CD', 'Linux'], match: 84 },
];

export default function JobSearch() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleMode = (mode) => {
    setSelectedModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  };

  const toggleLevel = (level) => {
    setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const toggleSaveJob = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(jId => jId !== id));
      toast.success('Job removed from saved');
    } else {
      setSavedJobs([...savedJobs, id]);
      toast.success('Job saved successfully');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedModes([]);
    setSelectedLevels([]);
    setSortBy('relevance');
    toast.success('Filters cleared');
  };

  // Filter & Sort jobs
  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter(job => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesSkill = job.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkill) {
          return false;
        }
      }

      // Job Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(job.type)) {
        return false;
      }

      // Work Mode filter
      if (selectedModes.length > 0 && !selectedModes.includes(job.mode)) {
        return false;
      }

      // Experience Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(job.experience)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') return b.salaryMax - a.salaryMax;
      if (sortBy === 'recent') return a.id - b.id;
      return b.match - a.match; // Default: Most Relevant (highest AI match)
    });
  }, [searchQuery, selectedTypes, selectedModes, selectedLevels, sortBy]);

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedModes.length > 0 || selectedLevels.length > 0;

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl serif font-bold text-text">Find Your Next Role</h1>
            <p className="text-text-muted mt-1">Discover opportunities tailored to your skills.</p>
          </div>
          <Button 
            variant="outline" 
            className="border-border hover:border-gold hover:text-gold bg-surface gap-2 w-fit"
            onClick={() => toast.success('Job alert created for current search preferences!')}
          >
            <Bell size={16} /> Create Job Alert
          </Button>
        </div>

        <div className="flex gap-2 w-full max-w-4xl mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 h-12 bg-surface border-border text-lg" 
              placeholder="Search by job title, skill, company, or location..." 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button variant="outline" className="h-12 md:hidden border border-border hover:border-primary" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <motion.div 
          variants={itemVariants}
          className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6 flex-shrink-0`}
        >
          <Card className="bg-surface border border-border rounded-[8px] p-5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="serif font-bold text-text text-lg">Filters</h3>
              {hasActiveFilters && (
                <button 
                  onClick={resetFilters} 
                  className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={12} /> Clear all
                </button>
              )}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsFilterOpen(false)}><X size={16} /></Button>
            </div>
            
            {/* Job Type Filter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-text border-b border-border-light pb-2 text-sm">Job Type</h4>
              {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                <label key={type} className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer hover:text-text transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="rounded border-border bg-surface-alt text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Work Mode Filter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-text border-b border-border-light pb-2 text-sm">Work Mode</h4>
              {['Remote', 'Hybrid', 'On-site'].map(mode => (
                <label key={mode} className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer hover:text-text transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedModes.includes(mode)}
                    onChange={() => toggleMode(mode)}
                    className="rounded border-border bg-surface-alt text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  {mode}
                </label>
              ))}
            </div>

            {/* Experience Level Filter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-text border-b border-border-light pb-2 text-sm">Experience Level</h4>
              {['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Manager'].map(level => (
                <label key={level} className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer hover:text-text transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedLevels.includes(level)}
                    onChange={() => toggleLevel(level)}
                    className="rounded border-border bg-surface-alt text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  {level}
                </label>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-text-secondary text-sm">
              Showing <span className="text-text font-bold mono">{filteredJobs.length}</span> of <span className="text-text font-bold mono">{ALL_JOBS.length}</span> jobs
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted hidden sm:inline">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="relevance">Most Relevant (AI Match)</option>
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <Card className="p-8 bg-surface border border-border rounded-[8px] text-center">
              <EmptyState 
                icon={<Search size={48} className="text-text-muted" />}
                title="No matching jobs found"
                description="Try broadening your search query or unchecking some filters."
              />
              <Button onClick={resetFilters} className="mt-4 bg-primary text-white">Reset All Filters</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card className="bg-surface p-5 border border-border hover:border-primary rounded-[8px] transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-[8px] bg-surface-alt flex items-center justify-center serif font-bold text-xl text-primary border border-border shrink-0">
                          {job.company[0]}
                        </div>
                        <div>
                          <Link to={`/candidate/jobs/${job.id}`} className="text-lg serif font-semibold text-text group-hover:text-primary transition-colors">
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                            <span>{job.company}</span>
                            <span className="flex items-center gap-1 text-gold"><Star size={12} fill="currentColor" /> {job.rating}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary mb-3">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location} • {job.mode}</span>
                            <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {job.posted}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs bg-surface-alt border-border">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => toggleSaveJob(job.id, e)}
                          className={`rounded-full transition-colors ${savedJobs.includes(job.id) ? 'text-gold hover:text-gold-light' : 'text-text-muted hover:text-primary'}`}
                          title={savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
                        >
                          <Bookmark size={20} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                        </Button>
                        <div className="flex flex-col items-center">
                          <div className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">AI Match</div>
                          <div className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-surface-alt border-t-primary text-xs font-bold text-text mono">
                            {job.match}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

