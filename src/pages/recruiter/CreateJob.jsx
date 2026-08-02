import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ChevronRight, ChevronLeft, Briefcase, MapPin, DollarSign, ListChecks } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '@/utils/constants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  jobType: z.string().min(1, 'Required'),
  workMode: z.string().min(1, 'Required'),
  experienceLevel: z.string().min(1, 'Required'),
  location: z.string().min(2, 'Required'),
  description: z.string().min(50, 'Provide a detailed description (min 50 chars)'),
  requirements: z.string().min(20, 'Required'),
  salaryMin: z.string().min(1, 'Required'),
  salaryMax: z.string().min(1, 'Required'),
  currency: z.string().default('USD'),
});

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Briefcase },
  { id: 2, title: 'Details', icon: ListChecks },
  { id: 3, title: 'Compensation', icon: DollarSign },
  { id: 4, title: 'Review', icon: CheckCircle2 }
];

export default function CreateJob() {
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState(['React', 'TypeScript']);
  const [newSkill, setNewSkill] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      currency: 'USD'
    },
    mode: 'onChange'
  });

  const formValues = watch();

  const handleNext = async () => {
    const fieldsToValidate = 
      currentStep === 1 ? ['title', 'jobType', 'workMode', 'experienceLevel', 'location'] :
      currentStep === 2 ? ['description', 'requirements'] :
      currentStep === 3 ? ['salaryMin', 'salaryMax', 'currency'] : [];
      
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const payload = { ...data, skills };
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Job posted successfully!');
    navigate('/recruiter/jobs');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl serif font-bold text-text">Create New Job Post</h1>
        <p className="text-text-muted mt-2">Find your next great hire using our AI-powered matching.</p>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive ? 'bg-surface border-primary text-primary' :
                  isCompleted ? 'bg-primary border-primary text-bg' : 'bg-surface border-border text-text-muted'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`mt-2 text-xs font-medium absolute -bottom-6 w-24 text-center ${
                  isActive ? 'text-primary' : isCompleted ? 'text-text' : 'text-text-muted'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card className="p-8 glass border-border mt-12 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl serif font-semibold text-text mb-4">Basic Information</h2>
                <Input 
                  label="Job Title" 
                  placeholder="e.g. Senior Frontend Developer" 
                  {...register('title')} 
                  error={errors.title?.message} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller name="jobType" control={control} render={({field}) => (
                    <Select label="Job Type" options={JOB_TYPES} {...field} error={errors.jobType?.message} />
                  )} />
                  <Controller name="workMode" control={control} render={({field}) => (
                    <Select label="Work Mode" options={WORK_MODES} {...field} error={errors.workMode?.message} />
                  )} />
                  <Controller name="experienceLevel" control={control} render={({field}) => (
                    <Select label="Experience Level" options={EXPERIENCE_LEVELS} {...field} error={errors.experienceLevel?.message} />
                  )} />
                  <Input label="Location" placeholder="e.g. New York, NY" {...register('location')} error={errors.location?.message} />
                </div>
              </div>
            )}

            {/* STEP 2: Description & Skills */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl serif font-semibold text-text mb-4">Job Details & Requirements</h2>
                <Textarea 
                  label="Job Description" 
                  rows={5} 
                  placeholder="Describe the role..." 
                  {...register('description')} 
                  error={errors.description?.message} 
                />
                <Textarea 
                  label="Key Requirements (one per line)" 
                  rows={4} 
                  placeholder="- 5+ years experience..." 
                  {...register('requirements')} 
                  error={errors.requirements?.message} 
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Required Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="pl-3 pr-2 py-1 flex items-center gap-1 border-primary text-primary">
                        {skill}
                        <button type="button" onClick={() => removeSkill(i)} className="hover:text-text transition-colors">
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      value={newSkill} 
                      onChange={e => setNewSkill(e.target.value)} 
                      placeholder="Add a skill and press Enter" 
                      onKeyPress={e => e.key === 'Enter' && addSkill(e)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Compensation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl serif font-semibold text-text mb-4">Compensation & Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input type="number" label="Minimum Salary" placeholder="e.g. 80000" {...register('salaryMin')} error={errors.salaryMin?.message} />
                  <Input type="number" label="Maximum Salary" placeholder="e.g. 120000" {...register('salaryMax')} error={errors.salaryMax?.message} />
                  <Select label="Currency" options={[{value:'USD', label:'USD ($)'}, {value:'EUR', label:'EUR (€)'}, {value:'GBP', label:'GBP (£)'}]} {...register('currency')} />
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3 mt-4">
                  <DollarSign className="text-primary mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-primary">Transparent Salaries Attract Better Candidates</h4>
                    <p className="text-sm text-text-secondary mt-1">Jobs with clear salary ranges receive 30% more applications and rank higher in our AI search results.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl serif font-semibold text-text mb-4">Review Job Post</h2>
                <div className="bg-surface-alt rounded-xl p-6 border border-border space-y-4">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-2xl font-bold text-text">{formValues.title || 'Untitled Job'}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
                      <span className="flex items-center gap-1"><Briefcase size={14}/> {formValues.jobType} • {formValues.workMode}</span>
                      <span className="flex items-center gap-1"><MapPin size={14}/> {formValues.location}</span>
                      <span className="flex items-center gap-1 mono"><DollarSign size={14}/> {formValues.salaryMin} - {formValues.salaryMax} {formValues.currency}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text mb-2">Description</h4>
                    <p className="text-text-secondary whitespace-pre-wrap text-sm">{formValues.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text mb-2">Skills Needed</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 1 || isSubmitting}
            icon={<ChevronLeft size={18} />}
          >
            Back
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button 
              variant="primary" 
              onClick={handleNext}
              iconPosition="right"
              icon={<ChevronRight size={18} />}
            >
              Continue
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              icon={<CheckCircle2 size={18} />}
            >
              Post Job
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
