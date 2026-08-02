import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CheckCircle2, ShieldOff, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const mockCompanies = [
  { id: 1, name: 'TechNova', industry: 'Technology', verified: true, jobs: 45 },
  { id: 2, name: 'Global Finance', industry: 'Finance', verified: true, jobs: 12 },
  { id: 3, name: 'StartupXYZ', industry: 'E-commerce', verified: false, jobs: 3 },
];

export default function ManageCompanies() {
  const [companies, setCompanies] = useState(mockCompanies);

  const toggleVerify = (id) => {
    setCompanies(companies.map(c => {
      if (c.id === id) {
        toast.success(c.verified ? 'Verification removed' : 'Company verified');
        return { ...c, verified: !c.verified };
      }
      return c;
    }));
  };

  return (
    <motion.div className="p-6 max-w-7xl mx-auto space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="text-3xl serif font-bold text-text">Manage Companies</h1>
        <p className="text-text-muted mt-1">Verify and manage company profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <Card key={company.id} className="p-6 glass hover-card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface border border-border-light rounded-lg flex items-center justify-center">
                  <Building size={24} className="text-text-muted" />
                </div>
                <div>
                  <h3 className="font-bold text-text flex items-center gap-2">
                    {company.name}
                    {company.verified && <CheckCircle2 size={16} className="text-primary" />}
                  </h3>
                  <p className="text-xs text-text-secondary">{company.industry}</p>
                </div>
              </div>
              <Badge variant={company.verified ? 'primary' : 'default'}>{company.verified ? 'Verified' : 'Pending'}</Badge>
            </div>
            
            <div className="flex justify-between items-center text-sm mb-6">
              <span className="text-text-muted">Active Jobs</span>
              <span className="font-bold text-text mono">{company.jobs}</span>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toggleVerify(company.id)}
              icon={company.verified ? <ShieldOff size={16}/> : <CheckCircle2 size={16}/>}
            >
              {company.verified ? 'Revoke Verification' : 'Verify Company'}
            </Button>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
