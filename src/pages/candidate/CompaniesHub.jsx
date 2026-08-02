import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, Users, Star, ArrowRight, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Link } from 'react-router-dom';

export default function CompaniesHub() {
  const [search, setSearch] = useState('');

  const companies = [
    { id: 'cyberdyne', name: 'CyberDyne Systems', industry: 'AI & Robotics', rating: 4.8, location: 'San Francisco, CA', employees: '1,000 - 5,000', openJobs: 12, tech: ['React', 'Python', 'PyTorch', 'ROS'] },
    { id: 'omnicorp', name: 'OmniCorp', industry: 'Enterprise SaaS', rating: 4.5, location: 'New York, NY', employees: '500 - 1,000', openJobs: 8, tech: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'] },
    { id: 'stark', name: 'Stark Industries', industry: 'Deep Tech & Aerospace', rating: 4.9, location: 'Austin, TX', employees: '5,000+', openJobs: 24, tech: ['React Native', 'Rust', 'C++', 'GraphQL'] },
    { id: 'wayne', name: 'Wayne Enterprises', industry: 'Cybersecurity & Defense', rating: 4.7, location: 'Chicago, IL', employees: '10,000+', openJobs: 15, tech: ['Docker', 'Kubernetes', 'Go', 'Linux'] },
    { id: 'nexatech', name: 'NexaTech AI', industry: 'Machine Learning Solutions', rating: 4.6, location: 'Remote', employees: '50 - 200', openJobs: 5, tech: ['Python', 'TensorFlow', 'React', 'FastAPI'] },
    { id: 'cloudsphere', name: 'CloudSphere', industry: 'Cloud Infrastructure', rating: 4.4, location: 'Seattle, WA', employees: '200 - 500', openJobs: 9, tech: ['Terraform', 'AWS', 'Python', 'Go'] },
  ];

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
            <Building2 className="text-gold" /> Verified Companies
          </h1>
          <p className="text-text-secondary mt-1">Explore top tech employers, company culture, and open job roles.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by company or industry..." 
            className="pl-9 bg-surface border-border text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <Card key={comp.id} className="bg-surface border border-border p-6 rounded-[8px] flex flex-col justify-between hover:border-primary transition-all group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center serif font-bold text-xl text-primary">
                  {comp.name[0]}
                </div>
                <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/30">
                  ★ {comp.rating}
                </Badge>
              </div>

              <h3 className="font-semibold text-text text-lg group-hover:text-primary transition-colors">{comp.name}</h3>
              <p className="text-xs text-text-secondary font-medium mt-1">{comp.industry}</p>
              
              <div className="mt-4 space-y-1.5 text-xs text-text-muted">
                <p className="flex items-center gap-1.5"><MapPin size={14} className="text-text-secondary" /> {comp.location}</p>
                <p className="flex items-center gap-1.5"><Users size={14} className="text-text-secondary" /> {comp.employees} employees</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {comp.tech.map(t => <Badge key={t} variant="outline" className="text-[10px] bg-surface-alt">{t}</Badge>)}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">{comp.openJobs} active jobs</span>
              <Button size="sm" variant="ghost" asChild className="text-xs hover:text-primary">
                <Link to={`/company/${comp.id}`}>View Profile <ArrowRight size={14} className="ml-1" /></Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
