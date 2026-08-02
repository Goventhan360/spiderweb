import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, Key, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '@/utils/helpers';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@demo.webloom.ai',
      password: 'password123',
    }
  });

  const onSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      switchRole('admin');
      setIsLoading(false);
      toast.success('Logged in to Super Admin Portal!');
      navigate('/admin/dashboard');
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-[440px] mx-auto p-[16px]"
    >
      {/* Top Header Row with Direct Home Page Access */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors bg-surface border border-border px-3 py-1.5 rounded-full shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Home size={14} /> Home Page
        </Link>
      </div>

      {/* Role Navigation Bar */}
      <div className="flex bg-surface-alt border border-border p-1 rounded-[8px] mb-4 text-xs font-semibold text-center">
        <Link to="/login" className="flex-1 py-2 rounded-[6px] text-text-muted hover:text-text">Candidate</Link>
        <Link to="/recruiter/login" className="flex-1 py-2 rounded-[6px] text-text-muted hover:text-text">Recruiter</Link>
        <div className="flex-1 py-2 rounded-[6px] bg-surface text-primary border border-border shadow-sm flex items-center justify-center gap-1">
          <Key size={14} /> Admin
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[8px] p-[32px] shadow-sm">
        <div className="text-center mb-[28px]">
          <Link to="/" className="inline-flex items-center gap-[10px] group mb-[16px]">
            <div className="w-10 h-10 rounded-[8px] bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <ShieldAlert size={22} />
            </div>
            <span className="serif font-semibold text-[22px] tracking-[0.01em] text-text">
              Webloom<span className="text-primary"> Admin</span>
            </span>
          </Link>
          <h1 className="serif text-[26px] font-semibold text-text mb-[6px]">Platform Admin Sign In</h1>
          <p className="text-[14px] text-text-muted">Manage system users, job moderation, and platform metrics.</p>
        </div>

        <div className="mb-[20px] p-[12px] bg-surface-alt border border-primary/30 rounded-[6px] text-xs text-text-muted">
          <strong className="text-primary">Demo Credentials:</strong><br/>
          Email: <span className="text-text font-mono">admin@demo.webloom.ai</span><br/>
          Password: <span className="text-text font-mono">password123</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
              <input 
                {...register('email')}
                type="email"
                className={cn(
                  "w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
                  errors.email ? "border-danger" : "border-border"
                )}
              />
            </div>
            {errors.email && <p className="text-danger text-[13px] mt-[6px]">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
              <input 
                {...register('password')}
                type="password"
                className={cn(
                  "w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
                  errors.password ? "border-danger" : "border-border"
                )}
              />
            </div>
            {errors.password && <p className="text-danger text-[13px] mt-[6px]">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[8px] text-[14.5px] border border-transparent cursor-pointer"
          >
            {isLoading ? <span className="animate-spin w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full" /> : 'Sign In to Admin Console'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-muted">
          Looking for job candidate access? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in as Candidate</Link>
        </div>
      </div>
    </motion.div>
  );
}
