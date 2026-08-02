import { motion } from 'framer-motion';
import { MapPin, Globe, Users } from 'lucide-react';
import { DEMO_COMPANIES } from '@/utils/constants';
import { useParams } from 'react-router-dom';

export default function CompanyPage() {
  const { id } = useParams();
  const company = DEMO_COMPANIES[0]; // fallback demo data
  
  if (!company) return <div className="p-[40px] text-center text-text">Company not found</div>;

  return (
    <div className="max-w-[1000px] mx-auto space-y-[32px] pb-[48px] px-4 md:px-0 mt-8">
      {/* Header Profile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-[8px] overflow-hidden border border-border"
      >
        <div className="h-[120px] bg-primary relative"></div>
        <div className="px-[32px] pb-[32px] relative">
          <div className="w-[80px] h-[80px] bg-surface rounded-[6px] border-[4px] border-surface flex items-center justify-center -mt-[40px] mb-[16px] text-[32px] font-semibold text-primary serif shadow-sm">
            {company.name.charAt(0)}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px]">
            <div>
              <h1 className="serif text-[28px] font-semibold text-text mb-[8px]">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-[16px] text-text-muted text-[13.5px]">
                <span className="flex items-center gap-[6px]"><MapPin className="w-[16px] h-[16px]" /> San Francisco, CA</span>
                <span className="flex items-center gap-[6px]"><Users className="w-[16px] h-[16px]" /> 500-1000 Employees</span>
                <span className="flex items-center gap-[6px]"><Globe className="w-[16px] h-[16px]" /> {company.industry}</span>
              </div>
            </div>
            <button className="px-[20px] py-[10px] rounded-[6px] bg-gold text-[#201607] font-semibold hover:bg-gold-light transition-colors text-[14px]">
              Follow Company
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[32px]">
        {/* Left Column */}
        <div className="space-y-[32px]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-surface p-[24px] rounded-[8px] border border-border">
            <h2 className="serif text-[20px] font-semibold mb-[16px] text-text">About Us</h2>
            <p className="text-text-muted leading-relaxed text-[14.5px]">
              We are a leading innovative company revolutionizing the {company.industry} space using cutting-edge technology and AI. 
              Our mission is to build tools that empower developers and creators globally.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-surface p-[24px] rounded-[8px] border border-border">
            <h2 className="serif text-[20px] font-semibold mb-[16px] text-text">Open Positions</h2>
            <div className="space-y-[12px]">
              {[1, 2, 3].map((job) => (
                <div key={job} className="p-[16px] rounded-[6px] border border-border hover:border-border-light bg-surface transition-all flex flex-col md:flex-row justify-between gap-[16px]">
                  <div>
                    <h3 className="serif font-semibold text-text mb-[4px] text-[16px]">Senior AI Engineer</h3>
                    <div className="flex items-center gap-[8px] text-[13px] text-text-muted">
                      <span>Full-time</span> &bull; <span>Remote</span> &bull; <span>$150k - $200k</span>
                    </div>
                  </div>
                  <button className="px-[16px] py-[8px] rounded-[4px] border border-border text-text font-medium text-[13.5px] hover:border-primary hover:text-primary transition-colors self-start md:self-center">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-[32px]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-surface p-[24px] rounded-[8px] border border-border">
            <h2 className="serif text-[18px] font-semibold mb-[16px] text-text">Tech Stack</h2>
            <div className="flex flex-wrap gap-[8px]">
              {['React', 'Node.js', 'Python', 'TensorFlow', 'PostgreSQL', 'AWS'].map(tech => (
                <span key={tech} className="px-[10px] py-[4px] rounded-[4px] bg-surface-alt text-[12.5px] font-medium text-text-secondary border border-border">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-surface p-[24px] rounded-[8px] border border-border">
            <h2 className="serif text-[18px] font-semibold mb-[16px] text-text">Benefits</h2>
            <ul className="space-y-[12px] text-[14px] text-text-muted">
              <li className="flex items-center gap-[8px]"><div className="w-[6px] h-[6px] rounded-full bg-gold"></div> Fully Remote Work</li>
              <li className="flex items-center gap-[8px]"><div className="w-[6px] h-[6px] rounded-full bg-gold"></div> Health, Dental, Vision</li>
              <li className="flex items-center gap-[8px]"><div className="w-[6px] h-[6px] rounded-full bg-gold"></div> Unlimited PTO</li>
              <li className="flex items-center gap-[8px]"><div className="w-[6px] h-[6px] rounded-full bg-gold"></div> 401(k) Matching</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
