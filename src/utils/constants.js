/* Application-wide constants */

export const APP_NAME = 'Webloom AI';
export const APP_TAGLINE = 'A Career Network Built For People Who Take Their Next Move Seriously';
export const APP_DESCRIPTION = 'Find your next role with intelligent matching, career coaching, and professional networking.';

export const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

export const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead / Principal' },
  { value: 'executive', label: 'Executive' },
];

export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', color: 'text-secondary' },
  { value: 'screening', label: 'Screening', color: 'text-warning' },
  { value: 'interview', label: 'Interview', color: 'text-accent' },
  { value: 'offered', label: 'Offered', color: 'text-success' },
  { value: 'accepted', label: 'Accepted', color: 'text-success' },
  { value: 'rejected', label: 'Rejected', color: 'text-danger' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'text-text-muted' },
];

export const SKILL_CATEGORIES = [
  'Frontend', 'Backend', 'Mobile', 'DevOps', 'Data Science',
  'Machine Learning', 'Design', 'Product Management', 'Marketing',
  'Sales', 'Finance', 'HR', 'Legal', 'Operations',
];

export const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Java', 'Go', 'Rust', 'SQL', 'MongoDB', 'PostgreSQL',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API',
  'Figma', 'Git', 'CI/CD', 'Agile', 'Machine Learning',
  'TensorFlow', 'PyTorch', 'Next.js', 'Vue.js', 'Angular',
  'Swift', 'Kotlin', 'Flutter', 'React Native', 'Tailwind CSS',
];

export const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
  'SaaS', 'AI/ML', 'Blockchain', 'Gaming', 'Media',
  'Consulting', 'Manufacturing', 'Real Estate', 'Transportation',
  'Food & Beverage', 'Deep Tech', 'Cybersecurity', 'Biotech',
];

export const COMPANY_SIZES = [
  '1-10', '11-50', '50-200', '200-500', '500-1000', '1000-5000', '5000+',
];

export const SALARY_RANGES = [
  { min: 0, max: 30000, label: 'Under $30K' },
  { min: 30000, max: 50000, label: '$30K - $50K' },
  { min: 50000, max: 80000, label: '$50K - $80K' },
  { min: 80000, max: 120000, label: '$80K - $120K' },
  { min: 120000, max: 180000, label: '$120K - $180K' },
  { min: 180000, max: 250000, label: '$180K - $250K' },
  { min: 250000, max: Infinity, label: '$250K+' },
];

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with basic job searching',
    features: [
      'Create Profile',
      'Search & Apply to Jobs',
      'Basic AI Resume Score',
      '5 Job Applications/month',
      'Email Notifications',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'Unlock full AI-powered career tools',
    features: [
      'Everything in Free',
      'Unlimited Applications',
      'AI Resume Builder',
      'AI Career Coach',
      'AI Job Matching',
      'AI Interview Prep',
      'Priority Support',
      'Advanced Analytics',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    description: 'For recruiters and growing teams',
    features: [
      'Everything in Pro',
      'Unlimited Job Postings',
      'AI Candidate Ranking',
      'Team Collaboration',
      'Hiring Analytics',
      'ATS Integration',
      'Custom Branding',
      'Dedicated Account Manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'AI Tools', href: '#ai-showcase' },
  { label: 'Companies', href: '#companies' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const CANDIDATE_NAV = [
  { label: 'Dashboard', path: '/candidate/dashboard', icon: 'LayoutDashboard' },
  { label: 'Home Feed', path: '/candidate/feed', icon: 'Home' },
  { label: 'Jobs', path: '/candidate/jobs', icon: 'Search' },
  { label: 'Network', path: '/candidate/network', icon: 'Users' },
  { label: 'Companies', path: '/candidate/companies', icon: 'Building2' },
  { label: 'Learning Hub', path: '/candidate/learning', icon: 'GraduationCap' },
  { label: 'Resume Studio', path: '/candidate/resume-studio', icon: 'FileEdit' },
  { label: 'AI Assistant', path: '/candidate/ai-tools', icon: 'Brain' },
  { label: 'Internships', path: '/candidate/internships', icon: 'Briefcase' },
  { label: 'Events', path: '/candidate/events', icon: 'Calendar' },
  { label: 'Applications', path: '/candidate/applications', icon: 'FileText' },
  { label: 'Saved Jobs', path: '/candidate/saved', icon: 'Bookmark' },
  { label: 'Analytics', path: '/candidate/analytics', icon: 'BarChart3' },
  { label: 'Messages', path: '/candidate/messages', icon: 'MessageSquare' },
  { label: 'Notifications', path: '/candidate/notifications', icon: 'Bell' },
  { label: 'Profile', path: '/candidate/profile', icon: 'User' },
  { label: 'Settings', path: '/candidate/settings', icon: 'Settings' },
];

export const RECRUITER_NAV = [
  { label: 'Dashboard', path: '/recruiter/dashboard', icon: 'LayoutDashboard' },
  { label: 'Post Job', path: '/recruiter/jobs/new', icon: 'PlusCircle' },
  { label: 'Manage Jobs', path: '/recruiter/jobs', icon: 'Briefcase' },
  { label: 'Applicants', path: '/recruiter/applicants', icon: 'Users' },
  { label: 'Interviews', path: '/recruiter/interviews', icon: 'Calendar' },
  { label: 'Company', path: '/recruiter/company', icon: 'Building2' },
  { label: 'Analytics', path: '/recruiter/analytics', icon: 'BarChart3' },
  { label: 'Messages', path: '/recruiter/messages', icon: 'MessageSquare' },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Users', path: '/admin/users', icon: 'Users' },
  { label: 'Jobs', path: '/admin/jobs', icon: 'Briefcase' },
  { label: 'Companies', path: '/admin/companies', icon: 'Building2' },
  { label: 'Reports', path: '/admin/reports', icon: 'FileBarChart' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
];

export const FAQ_DATA = [
  {
    question: 'What is Webloom AI?',
    answer: 'Webloom AI is a professional career network that connects talent with opportunities through intelligent matching. Our AI analyzes your resume, matches you with relevant jobs, and provides career coaching to accelerate your professional growth.',
  },
  {
    question: 'How does the AI Resume Analyzer work?',
    answer: 'Our AI scans your resume, extracts skills and experience, generates an ATS compatibility score, identifies gaps, and suggests improvements. It compares your profile against job requirements to give you a real-world match percentage.',
  },
  {
    question: 'Is Webloom AI free to use?',
    answer: 'Yes! Our Free plan lets you create a profile, search jobs, apply to positions, and get a basic AI resume score. Upgrade to Pro for unlimited applications, AI career coaching, and advanced tools.',
  },
  {
    question: 'How does AI Job Matching work?',
    answer: 'Our AI analyzes your skills, experience, and preferences against thousands of job listings to find the best matches. It considers factors like skill overlap, experience level, location preference, salary range, and career trajectory.',
  },
  {
    question: 'Can recruiters use Webloom AI?',
    answer: 'Absolutely! Recruiters get access to job posting tools, AI-powered candidate ranking, interview scheduling, hiring analytics, and real-time messaging with candidates.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use enterprise-grade encryption, Row Level Security (RLS) policies, and follow industry best practices for data protection. Your data is stored securely in PostgreSQL with Supabase.',
  },
  {
    question: 'Can I use Webloom AI on mobile?',
    answer: 'Yes! Webloom AI is fully responsive and works seamlessly on desktop, tablet, and mobile devices.',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: null,
    content: 'Webloom AI helped me land my dream job! The AI resume analyzer found gaps I never noticed, and the job matching was incredibly accurate.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Product Manager at Meta',
    avatar: null,
    content: 'The AI career coaching feature gave me a clear roadmap. Within 3 months, I transitioned from engineering to product management.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Tech Lead at Microsoft',
    avatar: null,
    content: 'As a recruiter, the AI candidate ranking saves me hours. I can instantly see the best-fit applicants and schedule interviews seamlessly.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Data Scientist at Netflix',
    avatar: null,
    content: 'The skill gap analysis showed me exactly what to learn. The AI learning roadmap was spot-on, and I got hired within weeks.',
    rating: 5,
  },
];

export const STATS = [
  { label: 'Active Jobs', value: 12500, suffix: '+' },
  { label: 'Companies', value: 3200, suffix: '+' },
  { label: 'Candidates', value: 85000, suffix: '+' },
  { label: 'AI Matches', value: 95, suffix: '%' },
];

export const FEATURES = [
  {
    icon: 'Brain',
    title: 'AI Resume Analyzer',
    description: 'Get instant ATS scores, skill extraction, and improvement suggestions powered by advanced AI.',
  },
  {
    icon: 'Target',
    title: 'Smart Job Matching',
    description: 'Our AI matches your profile against thousands of jobs to find your perfect fit with 95% accuracy.',
  },
  {
    icon: 'Sparkles',
    title: 'AI Career Coach',
    description: 'Receive personalized career advice, learning roadmaps, and growth strategies tailored to your goals.',
  },
  {
    icon: 'Shield',
    title: 'Verified Companies',
    description: 'Every company is verified. Browse genuine reviews, culture insights, and real employee experiences.',
  },
  {
    icon: 'MessageSquare',
    title: 'Real-Time Messaging',
    description: 'Connect directly with recruiters through our secure, real-time chat with file sharing.',
  },
  {
    icon: 'BarChart3',
    title: 'Hiring Analytics',
    description: 'Recruiters get powerful analytics dashboards to track hiring pipeline and optimize recruitment.',
  },
];

export const DEMO_COMPANIES = [
  { name: 'NexaTech', industry: 'AI/ML' },
  { name: 'CloudSphere', industry: 'Cloud Computing' },
  { name: 'QuantumBit', industry: 'Deep Tech' },
  { name: 'DataForge', industry: 'Data Analytics' },
  { name: 'CyberVault', industry: 'Cybersecurity' },
  { name: 'MetaFlow', industry: 'SaaS' },
  { name: 'BioNova', industry: 'Biotech' },
  { name: 'RoboSync', industry: 'Robotics' },
];
