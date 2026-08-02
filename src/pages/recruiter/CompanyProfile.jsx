import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Save, Building, MapPin, Globe, Mail, Phone, Users, Plus, X, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { INDUSTRIES } from '@/utils/constants';
import toast from 'react-hot-toast';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Must be a valid URL'),
  email: z.string().email('Must be a valid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  location: z.string().min(2, 'Location is required'),
  foundedYear: z.string().regex(/^\d{4}$/, 'Must be a valid 4-digit year'),
  size: z.string().min(1, 'Company size is required'),
  culture: z.string().min(20, 'Culture description is required')
});

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 Employees' },
  { value: '11-50', label: '11-50 Employees' },
  { value: '51-200', label: '51-200 Employees' },
  { value: '201-500', label: '201-500 Employees' },
  { value: '501-1000', label: '501-1000 Employees' },
  { value: '1000+', label: '1000+ Employees' },
];

export default function CompanyProfile() {
  const [logoPreview, setLogoPreview] = useState('https://via.placeholder.com/150/111827/4ADE80?text=Logo');
  const [benefits, setBenefits] = useState(['Health Insurance', 'Remote Work', '401k Match']);
  const [newBenefit, setNewBenefit] = useState('');
  const [techStack, setTechStack] = useState(['React', 'Node.js', 'AWS']);
  const [newTech, setNewTech] = useState('');

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: 'CyberDyne Systems',
      description: 'Leading the future of AI and robotics. We build solutions that push the boundaries of what is possible with machine learning and automated systems.',
      industry: 'Technology',
      website: 'https://cyberdyne.demo',
      email: 'contact@cyberdyne.demo',
      phone: '555-0199',
      location: 'San Francisco, CA',
      foundedYear: '2020',
      size: '51-200',
      culture: 'We value innovation, continuous learning, and pushing the boundaries of AI.'
    }
  });

  const formValues = watch();

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Company profile updated successfully!');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBenefit = (e) => {
    e.preventDefault();
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const addTech = (e) => {
    e.preventDefault();
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTech = (index) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Company Profile</h1>
          <p className="text-text-muted mt-1">Manage how your company appears to candidates.</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Save size={18} />} 
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 glass border-border">
            <h2 className="text-xl serif font-semibold text-text mb-6">Basic Information</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-xl border border-border overflow-hidden bg-surface relative group">
                  <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-bg/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload size={24} className="text-text mb-2" />
                    <span className="text-xs text-text">Upload Logo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                  </label>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <Input 
                  label="Company Name" 
                  {...register('name')} 
                  error={errors.name?.message} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        label="Industry" 
                        options={INDUSTRIES.map(i => ({ value: i, label: i }))} 
                        {...field}
                        error={errors.industry?.message}
                      />
                    )}
                  />
                  <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        label="Company Size" 
                        options={COMPANY_SIZES} 
                        {...field}
                        error={errors.size?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Textarea 
                label="Company Description" 
                rows={4}
                {...register('description')} 
                error={errors.description?.message} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Website" icon={<Globe size={16} />} {...register('website')} error={errors.website?.message} />
                <Input label="Location" icon={<MapPin size={16} />} {...register('location')} error={errors.location?.message} />
                <Input label="Email" type="email" icon={<Mail size={16} />} {...register('email')} error={errors.email?.message} />
                <Input label="Phone" icon={<Phone size={16} />} {...register('phone')} error={errors.phone?.message} />
                <Input label="Founded Year" icon={<Calendar size={16} />} {...register('foundedYear')} error={errors.foundedYear?.message} />
              </div>
            </div>
          </Card>

          <Card className="p-6 glass border-border">
            <h2 className="text-xl serif font-semibold text-text mb-6">Culture & Environment</h2>
            <Textarea 
              label="Culture Description" 
              rows={4}
              {...register('culture')} 
              error={errors.culture?.message} 
              className="mb-6"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Benefits & Perks</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {benefits.map((benefit, i) => (
                    <Badge key={i} variant="primary" className="pl-3 pr-2 py-1 flex items-center gap-1">
                      {benefit}
                      <button onClick={() => removeBenefit(i)} className="hover:text-bg transition-colors">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newBenefit} 
                    onChange={e => setNewBenefit(e.target.value)} 
                    placeholder="E.g. Free Gym" 
                    onKeyPress={e => e.key === 'Enter' && addBenefit(e)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={addBenefit} icon={<Plus size={16} />}>Add</Button>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {techStack.map((tech, i) => (
                    <Badge key={i} variant="outline" className="pl-3 pr-2 py-1 flex items-center gap-1 border-primary text-primary">
                      {tech}
                      <button onClick={() => removeTech(i)} className="hover:text-text transition-colors">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newTech} 
                    onChange={e => setNewTech(e.target.value)} 
                    placeholder="E.g. TypeScript" 
                    onKeyPress={e => e.key === 'Enter' && addTech(e)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={addTech} icon={<Plus size={16} />}>Add</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-sm serif text-text-muted mb-4 uppercase tracking-wider">Candidate Preview</h3>
            <Card className="p-0 overflow-hidden glass border-border">
              <div className="h-24 bg-surface-alt border-b border-border relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-xl border-4 border-surface bg-surface overflow-hidden">
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="p-6 pt-12 space-y-4">
                <div>
                  <h4 className="text-xl serif font-bold text-text">{formValues.name || 'Company Name'}</h4>
                  <div className="flex items-center text-sm text-text-muted mt-1 gap-4">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {formValues.location || 'Location'}</span>
                    <span className="flex items-center gap-1"><Users size={14}/> {formValues.size || 'Size'}</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary line-clamp-3">
                  {formValues.description || 'Company description will appear here...'}
                </p>
                
                {techStack.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-text-muted mb-2 uppercase">Tech Stack</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.slice(0, 5).map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">{tech}</Badge>
                      ))}
                      {techStack.length > 5 && <Badge variant="outline" className="text-[10px]">+{techStack.length - 5}</Badge>}
                    </div>
                  </div>
                )}
                
                <Button variant="primary" className="w-full mt-4" disabled>View Full Profile</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
