import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Save, Eye, X, Plus } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  job_type: z.string().min(1, 'Job type is required'),
  work_mode: z.string().min(1, 'Work mode is required'),
  experience_level: z.string().min(1, 'Experience level is required'),
  location: z.string().min(2, 'Location is required'),
  salary_min: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(0)),
  salary_max: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(0)),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  status: z.string().default('Active'),
  is_featured: z.boolean().default(false),
});

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [requirements, setRequirements] = useState(['']);
  const [responsibilities, setResponsibilities] = useState(['']);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: 'Active',
      is_featured: false,
    }
  });

  useEffect(() => {
    if (user) {
      fetchCompanyId();
      if (id) {
        fetchJob();
      }
    }
  }, [user, id]);

  const fetchCompanyId = async () => {
    const { data } = await supabase.from('companies').select('id').eq('owner_id', user.id).single();
    if (data) setCompanyId(data.id);
  };

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (error) throw error;
      
      reset({
        title: data.title,
        job_type: data.job_type,
        work_mode: data.work_mode,
        experience_level: data.experience_level,
        location: data.location,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        description: data.description,
        status: data.status,
        is_featured: data.is_featured,
      });
      setRequirements(data.requirements || ['']);
      setResponsibilities(data.responsibilities || ['']);
      setSkills(data.skills || []);
    } catch (err) {
      toast.error('Failed to load job');
    }
  };

  const onSubmit = async (data) => {
    if (!companyId) {
      toast.error('You must create a company profile first');
      navigate('/recruiter/company');
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        ...data,
        company_id: companyId,
        recruiter_id: user.id,
        requirements: requirements.filter(r => r.trim() !== ''),
        responsibilities: responsibilities.filter(r => r.trim() !== ''),
        skills: skills,
      };

      if (id) {
        const { error } = await supabase.from('jobs').update(jobData).eq('id', id);
        if (error) throw error;
        toast.success('Job updated successfully');
      } else {
        const { error } = await supabase.from('jobs').insert([jobData]);
        if (error) throw error;
        toast.success('Job created successfully');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error saving job');
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (setter, state) => setter([...state, '']);
  const updateArrayItem = (setter, state, index, value) => {
    const newArr = [...state];
    newArr[index] = value;
    setter(newArr);
  };
  const removeArrayItem = (setter, state, index) => setter(state.filter((_, i) => i !== index));

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">{id ? 'Edit Job' : 'Post a New Job'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface p-8 rounded-xl border border-border">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Job Title</label>
            <input type="text" {...register('title')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Location</label>
            <input type="text" {...register('location')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Job Type</label>
            <select {...register('job_type')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none">
              <option value="">Select...</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Work Mode</label>
            <select {...register('work_mode')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none">
              <option value="">Select...</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Experience Level</label>
            <select {...register('experience_level')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none">
              <option value="">Select...</option>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">Min Salary</label>
              <input type="number" {...register('salary_min')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-2">Max Salary</label>
              <input type="number" {...register('salary_max')} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Description</label>
          <textarea {...register('description')} rows={5} className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none"></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Dynamic Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-text mb-2 flex justify-between">
              Requirements <button type="button" onClick={() => addArrayItem(setRequirements, requirements)} className="text-primary text-xs flex items-center"><Plus size={14}/> Add</button>
            </label>
            {requirements.map((req, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={req} onChange={(e) => updateArrayItem(setRequirements, requirements, i, e.target.value)} className="w-full bg-dark border border-border rounded-lg px-3 py-1 text-sm text-text outline-none" />
                <button type="button" onClick={() => removeArrayItem(setRequirements, requirements, i)} className="text-text-muted hover:text-red-500"><X size={16}/></button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2 flex justify-between">
              Responsibilities <button type="button" onClick={() => addArrayItem(setResponsibilities, responsibilities)} className="text-primary text-xs flex items-center"><Plus size={14}/> Add</button>
            </label>
            {responsibilities.map((res, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={res} onChange={(e) => updateArrayItem(setResponsibilities, responsibilities, i, e.target.value)} className="w-full bg-dark border border-border rounded-lg px-3 py-1 text-sm text-text outline-none" />
                <button type="button" onClick={() => removeArrayItem(setResponsibilities, responsibilities, i)} className="text-text-muted hover:text-red-500"><X size={16}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Required Skills (Press Enter to add)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill, i) => (
              <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {skill} <X size={14} className="cursor-pointer" onClick={() => removeArrayItem(setSkills, skills, i)} />
              </span>
            ))}
          </div>
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} placeholder="e.g. React, Python, Leadership" className="w-full bg-dark border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" />
        </div>

        {/* Status & Featured */}
        <div className="flex items-center gap-8">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Status</label>
            <select {...register('status')} className="bg-dark border border-border rounded-lg px-4 py-2 text-text outline-none">
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input type="checkbox" {...register('is_featured')} id="featured" className="w-4 h-4 rounded bg-dark border-border" />
            <label htmlFor="featured" className="text-sm font-medium text-text">Featured Job</label>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <button type="button" onClick={() => navigate('/recruiter/jobs')} className="px-6 py-2 rounded-lg border border-border text-text hover:bg-dark transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Save size={18} /> {loading ? 'Saving...' : (id ? 'Update Job' : 'Post Job')}
          </button>
        </div>
      </form>
    </div>
  );
}
