import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Search, GraduationCap, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function Internships() {
  const [search, setSearch] = useState('');
  const [appliedIds, setAppliedIds] = useState([]);

  const internships = [
    { id: 1, title: 'Frontend Developer Intern', company: 'Google', stipend: '$45/hr', duration: '12 Weeks (Summer 2026)', location: 'Mountain View, CA (Hybrid)', skills: ['React', 'JavaScript', 'HTML/CSS'] },
    { id: 2, title: 'Software Engineering Intern', company: 'Meta', stipend: '$50/hr', duration: '10 Weeks', location: 'Remote', skills: ['Python', 'C++', 'Algorithms'] },
    { id: 3, title: 'AI & Data Science Intern', company: 'OpenAI', stipend: '$55/hr', duration: '12 Weeks', location: 'San Francisco, CA', skills: ['Python', 'PyTorch', 'Linear Algebra'] },
    { id: 4, title: 'Product Design Intern', company: 'Figma', stipend: '$40/hr', duration: '12 Weeks', location: 'Remote', skills: ['Figma', 'Prototyping', 'UI Research'] },
  ];

  const toggleApply = (id, title) => {
    if (appliedIds.includes(id)) {
      setAppliedIds(appliedIds.filter(i => i !== id));
      toast.success(`Withdrew internship application for ${title}`);
    } else {
      setAppliedIds([...appliedIds, id]);
      toast.success(`Application submitted for ${title}!`);
    }
  };

  const filtered = internships.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
            <GraduationCap className="text-primary" /> Student & Graduate Internships
          </h1>
          <p className="text-text-secondary mt-1">Kickstart your tech career with paid internships and co-op opportunities.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search internships..." 
            className="pl-9 bg-surface border-border text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const isApplied = appliedIds.includes(item.id);
          return (
            <Card key={item.id} className="bg-surface border border-border p-6 rounded-[8px] flex flex-col justify-between hover:border-primary transition-all">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-[8px] bg-surface-alt flex items-center justify-center serif font-bold text-lg text-primary border border-border">
                    {item.company[0]}
                  </div>
                  <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/30">
                    Paid • {item.stipend}
                  </Badge>
                </div>

                <h3 className="font-semibold text-text text-lg">{item.title}</h3>
                <p className="text-xs text-text-secondary font-medium mt-0.5">{item.company}</p>

                <div className="mt-4 space-y-1.5 text-xs text-text-muted">
                  <p className="flex items-center gap-1.5"><MapPin size={14} /> {item.location}</p>
                  <p className="flex items-center gap-1.5"><Clock size={14} /> {item.duration}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.skills.map(s => <Badge key={s} variant="outline" className="text-[10px] bg-surface-alt">{s}</Badge>)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-end">
                <Button 
                  onClick={() => toggleApply(item.id, item.title)}
                  className={isApplied ? "bg-surface-alt text-primary border border-primary" : "bg-gold hover:bg-gold-light text-[#201607] font-semibold text-xs"}
                >
                  {isApplied ? <><CheckCircle size={14} className="mr-1" /> Applied</> : "Apply Now"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
