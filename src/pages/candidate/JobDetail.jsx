import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Building, MapPin, DollarSign, Clock, Bookmark, Share2, 
  Briefcase, GraduationCap, CheckCircle2, AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

const FALLBACK_DEMO_JOBS = [
  { 
    id: '1', 
    title: 'Senior Frontend Developer', 
    location: 'Remote', 
    salary_min: 120000, 
    salary_max: 160000, 
    job_type: 'Full-time', 
    work_mode: 'Remote', 
    experience_level: 'Senior', 
    description: 'We are looking for a Senior Frontend Developer proficient in React, TypeScript, and Tailwind CSS to join our core product team.', 
    requirements: ['5+ years React experience', 'Strong TypeScript skills', 'Experience with modern CSS/Tailwind'],
    responsibilities: ['Build scalable UI components', 'Optimize application performance', 'Collaborate with product managers'],
    benefits: ['Full health/dental', 'Unlimited PTO', 'Remote stipend', '401(k) matching'],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    status: 'active', 
    company: { name: 'NexaTech AI', logo_url: null, industry: 'AI & Software', size: '50-200' }
  },
  { 
    id: '2', 
    title: 'Full Stack Engineer', 
    location: 'San Francisco, CA', 
    salary_min: 130000, 
    salary_max: 175000, 
    job_type: 'Full-time', 
    work_mode: 'Hybrid', 
    experience_level: 'Mid-Level', 
    description: 'Join CloudSphere to build next-generation cloud infrastructure management tools.', 
    requirements: ['3+ years Node.js and React', 'PostgreSQL database design', 'AWS / Cloud deployment experience'],
    responsibilities: ['Design REST and GraphQL APIs', 'Maintain CI/CD pipelines', 'Participate in code reviews'],
    benefits: ['Competitive equity', 'Flexible work hours', 'Learning & development budget'],
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker'],
    status: 'active', 
    company: { name: 'CloudSphere', logo_url: null, industry: 'Cloud Infrastructure', size: '200-500' }
  },
  { 
    id: '3', 
    title: 'UI/UX Designer', 
    location: 'New York, NY', 
    salary_min: 90000, 
    salary_max: 130000, 
    job_type: 'Contract', 
    work_mode: 'On-site', 
    experience_level: 'Mid-Level', 
    description: 'Craft beautiful, intuitive design systems and user interfaces for high-growth tech companies.', 
    requirements: ['Figma mastery', 'Strong portfolio of web/mobile products', 'User research experience'],
    responsibilities: ['Create wireframes and prototypes', 'Develop design tokens and UI components', 'Conduct usability testing'],
    benefits: ['Daily catered lunches', 'Transit pass', 'Latest MacBook Pro'],
    skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems'],
    status: 'active', 
    company: { name: 'DataForge Design', logo_url: null, industry: 'Design Agency', size: '11-50' }
  }
];

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isSaved, setIsSaved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  
  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user) {
      checkUserStatus();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (!isUuid) {
        const demoMatch = FALLBACK_DEMO_JOBS.find(j => j.id === id) || FALLBACK_DEMO_JOBS[0];
        setJob(demoMatch);
        setSimilarJobs(FALLBACK_DEMO_JOBS.filter(j => j.id !== demoMatch.id));
        setLoading(false);
        return;
      }

      // Fetch job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (jobError || !jobData) {
        const demoMatch = FALLBACK_DEMO_JOBS.find(j => j.id === id) || FALLBACK_DEMO_JOBS[0];
        setJob(demoMatch);
        setSimilarJobs(FALLBACK_DEMO_JOBS.filter(j => j.id !== demoMatch.id));
        return;
      }

      setJob(jobData);

      // Fetch similar jobs
      const { data: similar } = await supabase
        .from('jobs')
        .select('*, company:companies(name, logo_url)')
        .eq('status', 'active')
        .neq('id', id)
        .limit(3);
      
      setSimilarJobs(similar || []);

    } catch (err) {
      console.error('Error fetching job details:', err);
      const demoMatch = FALLBACK_DEMO_JOBS[0];
      setJob(demoMatch);
      setSimilarJobs(FALLBACK_DEMO_JOBS.slice(1));
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!user || user.id?.includes('demo')) return;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) return;

    try {
      // Check if saved
      const { data: savedData } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', id)
        .maybeSingle();
      
      if (savedData) setIsSaved(true);

      // Check if applied
      const { data: appData } = await supabase
        .from('applications')
        .select('status, created_at')
        .eq('candidate_id', user.id)
        .eq('job_id', id)
        .maybeSingle();

      if (appData) setApplicationStatus(appData);

    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const handleToggleSave = async () => {
    if (!user) return toast.error('Please sign in to save jobs.');
    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', id);
        setIsSaved(false);
        toast.success('Job removed from saved');
      } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: id });
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      toast.error('Failed to update saved job');
    }
  };

  const handleApply = async () => {
    if (!user) return toast.error('Please sign in to apply.');
    try {
      setApplying(true);
      const { data, error } = await supabase
        .from('applications')
        .insert({
          job_id: id,
          candidate_id: user.id,
          cover_letter: coverLetter,
          status: 'Applied'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      setApplicationStatus(data);
      setShowApplyModal(false);
    } catch (error) {
      console.error('Error applying:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-24" />
        <Card className="p-8 space-y-6">
          <div className="flex gap-6">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />} className="mb-6">
          Back
        </Button>
        <EmptyState 
          icon={<AlertCircle size={48} className="text-red-500" />}
          title="Job Not Found"
          description={error || "The job you're looking for doesn't exist or has been removed."}
          action={<Button as={Link} to="/candidate/jobs">Browse Other Jobs</Button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />} className="mb-2">
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar 
                src={job.company?.logo_url} 
                alt={job.company?.name} 
                fallback={job.company?.name?.[0]} 
                className="w-20 h-20 rounded-xl"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-text mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-text-muted mb-4">
                  <Link to={`/companies/${job.company?.id}`} className="flex items-center gap-1 font-medium text-primary hover:underline">
                    <Building size={18} /> {job.company?.name}
                  </Link>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {job.location || 'Remote'}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.job_type && <Badge variant="secondary" className="flex items-center gap-1"><Briefcase size={14} /> {job.job_type}</Badge>}
                  {job.work_mode && <Badge variant="secondary" className="flex items-center gap-1"><MapPin size={14} /> {job.work_mode}</Badge>}
                  {job.experience_level && <Badge variant="secondary" className="flex items-center gap-1"><GraduationCap size={14} /> {job.experience_level}</Badge>}
                  {(job.salary_min || job.salary_max) && (
                    <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/5 flex items-center gap-1">
                      <DollarSign size={14} /> 
                      {job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : ''} 
                      {job.salary_min && job.salary_max ? ' - ' : ''} 
                      {job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <Card className="p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-text mb-4">About the Role</h2>
              <div className="text-text-muted leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text mb-4">Requirements</h2>
                <ul className="list-disc list-outside ml-5 space-y-2 text-text-muted">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="pl-2">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text mb-4">Responsibilities</h2>
                <ul className="list-disc list-outside ml-5 space-y-2 text-text-muted">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="pl-2">{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Company Info inside Details for Mobile, but typically we have it separate. */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-text mb-4">About {job.company?.name}</h2>
              <p className="text-text-muted mb-4">{job.company?.description || 'No company description provided.'}</p>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
                  Visit Website
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Sticky Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card className="p-6">
            <div className="space-y-4">
              {applicationStatus ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-green-500" />
                  <h3 className="font-bold text-green-500">Applied Successfully</h3>
                  <p className="text-sm text-green-500/80">
                    Status: {applicationStatus.status}<br/>
                    On {new Date(applicationStatus.created_at).toLocaleDateString()}
                  </p>
                  <Button variant="outline" className="w-full mt-4" as={Link} to="/candidate/applications">
                    View Applications
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full py-6 text-lg" 
                  onClick={() => user ? setShowApplyModal(true) : toast.error('Please login to apply')}
                  disabled={job.status !== 'open'}
                >
                  {job.status === 'open' ? 'Apply Now' : 'Position Closed'}
                </Button>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleToggleSave}
                >
                  <Bookmark size={18} className="mr-2" fill={isSaved ? 'currentColor' : 'none'} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 size={18} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>

          {similarJobs.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-text mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {similarJobs.map(sj => (
                  <Link key={sj.id} to={`/candidate/jobs/${sj.id}`} className="group flex gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-alt transition-colors">
                    <Avatar src={sj.company?.logo_url} fallback={sj.company?.name?.[0]} className="w-10 h-10 rounded-md" />
                    <div>
                      <h4 className="font-medium text-text group-hover:text-primary transition-colors line-clamp-1">{sj.title}</h4>
                      <p className="text-sm text-text-muted">{sj.company?.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-text mb-2">Apply to {job.company?.name}</h2>
            <p className="text-text-muted mb-6">Position: <span className="font-medium text-text">{job.title}</span></p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Cover Letter (Optional)</label>
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-lg border border-border bg-surface-alt text-text focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
                  placeholder="Explain why you are a good fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <p className="text-sm text-text-muted">
                Your profile information and resume will be automatically included with this application.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setShowApplyModal(false)} disabled={applying}>
                Cancel
              </Button>
              <Button onClick={handleApply} isLoading={applying}>
                Submit Application
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
