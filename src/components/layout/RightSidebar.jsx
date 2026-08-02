import { TrendingUp, Users, Briefcase, Calendar, BookOpen, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RightSidebar({ role }) {
  // Right sidebar is primarily for candidates, but we can customize based on role
  if (role !== 'candidate') return null;

  return (
    <div className="w-[300px] h-screen border-l border-border bg-bg flex-shrink-0 hidden lg:block overflow-y-auto no-scrollbar pt-[80px] pb-6 px-4">
      <div className="space-y-6">
        
        {/* Profile Completion Widget */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-[8px] p-4">
          <h3 className="serif font-semibold text-text mb-3 flex items-center justify-between">
            Profile Strength <span className="text-primary mono text-sm">85%</span>
          </h3>
          <div className="w-full h-2 bg-surface-alt rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-text-muted mb-3">Add your latest projects to reach All-Star status.</p>
          <button className="w-full py-1.5 rounded-[4px] border border-border text-text hover:border-primary transition-colors text-xs font-medium">
            Update Profile
          </button>
        </motion.div>

        {/* Trending Skills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface border border-border rounded-[8px] p-4">
          <h3 className="serif font-semibold text-text mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-gold" /> Trending Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
              <span key={skill} className="px-2 py-1 bg-surface-alt rounded-[4px] text-xs text-text-secondary border border-border hover:border-gold cursor-pointer transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Suggested Connections */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface border border-border rounded-[8px] p-4">
          <h3 className="serif font-semibold text-text mb-3 flex items-center gap-2">
            <Users size={16} className="text-gold" /> Suggested Connections
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Sarah Chen', role: 'Senior Engineer', initial: 'S' },
              { name: 'Alex Rivera', role: 'Tech Recruiter', initial: 'A' },
              { name: 'David Kim', role: 'Product Manager', initial: 'D' }
            ].map((person, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center text-xs font-semibold text-primary">
                    {person.initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text leading-none">{person.name}</p>
                    <p className="text-[11px] text-text-muted mt-1">{person.role}</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-full hover:bg-surface-alt transition-colors text-text-secondary">
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 pt-3 border-t border-border text-xs text-text-secondary hover:text-text transition-colors">
            View All Recommendations
          </button>
        </motion.div>

        {/* Recruiters Hiring */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface border border-border rounded-[8px] p-4">
          <h3 className="serif font-semibold text-text mb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-gold" /> Actively Hiring
          </h3>
          <div className="space-y-3">
             {[
              { company: 'NexaTech', roles: 12, initial: 'N' },
              { company: 'CloudSphere', roles: 8, initial: 'C' }
            ].map((company, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-[4px] bg-gold flex items-center justify-center text-[#201607] font-bold text-sm">
                  {company.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-text group-hover:text-gold transition-colors">{company.company}</p>
                  <p className="text-xs text-text-muted">{company.roles} open roles</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
