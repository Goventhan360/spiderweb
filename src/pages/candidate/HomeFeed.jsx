import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, TrendingUp, BookOpen, Clock, ChevronRight, 
  ThumbsUp, MessageCircle, Share2, Award, Zap, Building2, Bookmark
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/* Inline mock data for Phase 4 Feed */
const MOCK_POSTS = [
  {
    id: 1,
    author: { name: 'Sarah Chen', role: 'Senior AI Engineer at Meta', avatar: 'S' },
    time: '2h ago',
    content: 'Just published a new article on optimizing LLM inference times using quantization techniques. The results are incredible - we saw a 4x speedup with minimal accuracy loss. Check out the link below!',
    likes: 245,
    comments: 42,
    type: 'post'
  },
  {
    id: 2,
    author: { name: 'NexaTech', role: 'Company Update', avatar: 'N', isCompany: true },
    time: '5h ago',
    content: 'We are thrilled to announce our Series B funding round of $50M! We are expanding our engineering team rapidly. If you are passionate about deep learning, check out our open roles.',
    likes: 892,
    comments: 156,
    type: 'update'
  },
  {
    id: 3,
    author: { name: 'David Kim', role: 'Product Manager', avatar: 'D' },
    time: '1d ago',
    content: 'Completed the "Advanced Product Strategy" certification. Thanks to the Webloom AI learning recommendations for pointing me to this course!',
    likes: 124,
    comments: 18,
    type: 'achievement'
  }
];

const MOCK_NEWS = [
  { title: 'The Future of AI in Healthcare', source: 'TechCrunch', time: '3h ago' },
  { title: 'Remote Work Trends 2026', source: 'Forbes', time: '6h ago' },
  { title: 'Top 10 Emerging Tech Hubs', source: 'Wired', time: '12h ago' },
];

const RECOMMENDED_JOBS = [
  { title: 'Machine Learning Engineer', company: 'QuantumBit', salary: '$160k - $200k', match: '98%' },
  { title: 'Senior Full Stack Dev', company: 'MetaFlow', salary: '$140k - $180k', match: '94%' },
  { title: 'Data Scientist', company: 'DataForge', salary: '$130k - $170k', match: '89%' },
];

const INTERNSHIPS = [
  { title: 'Software Engineering Intern', company: 'Google', location: 'Remote' },
  { title: 'AI Research Intern', company: 'OpenAI', location: 'San Francisco' },
];

export default function HomeFeed() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl serif font-semibold text-text">Home Feed</h1>
        <p className="text-text-muted mt-1">Stay updated with your network and industry trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Quick Insights (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Career Progress */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <h3 className="text-text font-semibold serif mb-4 flex items-center gap-2">
              <Zap size={18} className="text-gold" /> Career Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Profile Completeness</span>
                  <span className="text-primary mono">85%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Resume Score</span>
                  <span className="text-primary mono">92/100</span>
                </div>
                <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2">
              <button className="text-xs py-1.5 rounded-[4px] bg-surface-alt border border-border hover:border-primary transition-colors">
                Update Resume
              </button>
              <button className="text-xs py-1.5 rounded-[4px] bg-gold text-[#201607] hover:bg-gold-light transition-colors font-medium">
                Skill Test
              </button>
            </div>
          </div>

          {/* Upcoming Events/Interviews */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <h3 className="text-text font-semibold serif mb-4 flex items-center gap-2">
              <Clock size={18} className="text-gold" /> Upcoming
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-[6px] bg-surface-alt border border-border flex flex-col items-center justify-center text-xs shrink-0">
                  <span className="font-bold text-primary">12</span>
                  <span className="text-[10px] text-text-muted">OCT</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Technical Interview</p>
                  <p className="text-xs text-text-muted">QuantumBit • 2:00 PM</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-[6px] bg-surface-alt border border-border flex flex-col items-center justify-center text-xs shrink-0">
                  <span className="font-bold text-primary">15</span>
                  <span className="text-[10px] text-text-muted">OCT</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">AI Networking Mixer</p>
                  <p className="text-xs text-text-muted">Virtual Event • 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Applications Tracker */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <h3 className="text-text font-semibold serif mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-gold" /> Applications
            </h3>
            <div className="space-y-3">
              {[
                { title: 'AI Engineer', status: 'In Review', color: 'text-gold' },
                { title: 'Frontend Dev', status: 'Interview', color: 'text-primary' },
              ].map((app, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">{app.title}</span>
                  <span className={`text-xs ${app.color}`}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* CENTER COLUMN: Main Feed (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Create Post Input */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold text-primary shrink-0">
                {user?.user_metadata?.full_name?.charAt(0) || 'U'}
              </div>
              <input 
                type="text" 
                placeholder="Share an update, project, or insight..." 
                className="w-full bg-bg border border-border rounded-[24px] px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {MOCK_POSTS.map(post => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={post.id} 
                className="bg-surface border border-border rounded-[8px] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full border border-border flex items-center justify-center font-bold text-sm ${post.author.isCompany ? 'bg-gold text-[#201607] rounded-[8px]' : 'bg-surface-alt text-primary'}`}>
                      {post.author.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-text text-sm leading-none flex items-center gap-2">
                        {post.author.name}
                        {post.type === 'achievement' && <Award size={14} className="text-gold" />}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{post.author.role}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{post.time}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {post.content}
                </p>
                
                <div className="flex items-center gap-4 pt-3 border-t border-border">
                  <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                    <ThumbsUp size={16} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-gold transition-colors">
                    <MessageCircle size={16} /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors ml-auto">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Recommendations (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Recommended Jobs */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <h3 className="text-text font-semibold serif mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-gold" /> Recommended Jobs
            </h3>
            <div className="space-y-3">
              {RECOMMENDED_JOBS.map((job, i) => (
                <div key={i} className="p-3 bg-bg border border-border rounded-[6px] hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-text text-sm group-hover:text-primary transition-colors">{job.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 bg-surface border border-primary text-primary rounded-[4px] font-bold">
                      {job.match}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-2">{job.company}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary mono">{job.salary}</span>
                    <Bookmark size={14} className="text-text-muted hover:text-gold" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs text-primary font-medium hover:underline flex items-center justify-center">
              View all matches <ChevronRight size={14} />
            </button>
          </div>

          {/* Internships for Early Career */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <h3 className="text-text font-semibold serif mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-gold" /> Internships
            </h3>
            <div className="space-y-3">
              {INTERNSHIPS.map((intern, i) => (
                <div key={i} className="flex gap-2 items-start text-sm">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                  <div>
                    <p className="font-medium text-text hover:text-primary cursor-pointer">{intern.title}</p>
                    <p className="text-xs text-text-muted">{intern.company} • {intern.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career News */}
          <div className="bg-surface border border-border rounded-[8px] p-4">
            <h3 className="text-text font-semibold serif mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-gold" /> Career News
            </h3>
            <div className="space-y-4">
              {MOCK_NEWS.map((news, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-sm font-medium text-text leading-tight group-hover:text-primary transition-colors">
                    {news.title}
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    {news.source} • {news.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
