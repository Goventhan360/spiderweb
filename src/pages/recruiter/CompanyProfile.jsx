import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Building2, Save, X, Plus } from 'lucide-react';

export default function CompanyProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  
  const [benefits, setBenefits] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [benefitInput, setBenefitInput] = useState('');
  const [techInput, setTechInput] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) fetchCompany();
  }, [user]);

  const fetchCompany = async () => {
    try {
      if (!user?.id || user.id.includes('demo')) {
        setCompanyId('demo-company-1');
        reset({
          name: 'NexaTech AI',
          logo_url: null,
          industry: 'AI & Software',
          size: '50-200',
          location: 'San Francisco, CA',
          website: 'https://nexatech.ai',
          description: 'Building intelligent career solutions and next-generation Web3 AI matching systems.',
          culture: 'Innovative, fast-paced, collaborative, and human-centric.',
        });
        setBenefits(['Health Insurance', 'Unlimited PTO', '401k Matching', 'Remote Stipend']);
        setTechStack(['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS']);
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
        
      if (data) {
        setCompanyId(data.id);
        reset({
          name: data.name,
          logo_url: data.logo_url,
          industry: data.industry,
          size: data.size,
          location: data.location,
          website: data.website,
          description: data.description,
          culture: data.culture,
        });
        setBenefits(data.benefits || []);
        setTechStack(data.tech_stack || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const companyData = {
        ...data,
        owner_id: user.id,
        benefits,
        tech_stack: techStack,
      };

      if (companyId) {
        const { error } = await supabase.from('companies').update(companyData).eq('id', companyId);
        if (error) throw error;
        toast.success('Company profile updated');
      } else {
        const { data: newCompany, error } = await supabase.from('companies').insert([companyData]).select().single();
        if (error) throw error;
        setCompanyId(newCompany.id);
        toast.success('Company profile created');
      }
    } catch (err) {
      toast.error('Failed to save profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (e, inputState, setInputState, arrayState, setArrayState) => {
    if (e.key === 'Enter' && inputState.trim()) {
      e.preventDefault();
      if (!arrayState.includes(inputState.trim())) {
        setArrayState([...arrayState, inputState.trim()]);
      }
      setInputState('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Building2 className="text-primary" size={32} />
        <h1 className="text-3xl font-bold text-text">Company Profile</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Company Name *</label>
            <input required {...register('name')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Logo URL</label>
            <input type="url" {...register('logo_url')} placeholder="https://..." className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Industry</label>
            <select {...register('industry')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none">
              <option value="">Select...</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Company Size</label>
            <select {...register('size')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none">
              <option value="">Select...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Location</label>
            <input {...register('location')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Website</label>
            <input type="url" {...register('website')} placeholder="https://..." className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Company Description</label>
          <textarea {...register('description')} rows={4} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Company Culture</label>
          <textarea {...register('culture')} rows={3} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Benefits & Perks (Press Enter)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {benefits.map((b, i) => (
                <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {b} <X size={14} className="cursor-pointer" onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))} />
                </span>
              ))}
            </div>
            <input type="text" value={benefitInput} onChange={e => setBenefitInput(e.target.value)} onKeyDown={e => handleAddItem(e, benefitInput, setBenefitInput, benefits, setBenefits)} placeholder="e.g. Health Insurance, Remote Work" className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text outline-none" />
          </div>
          
          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Tech Stack (Press Enter)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStack.map((t, i) => (
                <span key={i} className="bg-dark border border-border text-text px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {t} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setTechStack(techStack.filter((_, idx) => idx !== i))} />
                </span>
              ))}
            </div>
            <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => handleAddItem(e, techInput, setTechInput, techStack, setTechStack)} placeholder="e.g. React, Node.js, AWS" className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text outline-none" />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-border">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Save size={18} /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
