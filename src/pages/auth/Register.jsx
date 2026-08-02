import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleAuthLoading from '@/components/effects/GoogleAuthLoading';
import toast from 'react-hot-toast';
import { cn } from '@/utils/helpers';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const { signUp, signInWithGoogle, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [role, setRole] = useState('candidate');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { error } = await signUp({ 
      email: data.email, 
      password: data.password, 
      full_name: data.fullName, 
      role 
    });
    setIsLoading(false);
    
    if (error) {
      toast.error(error.message || 'Failed to register');
    } else {
      toast.success('Registration successful! Please check your email.');
      navigate('/login');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
  };

  const onGoogleAuthComplete = () => {
    setIsGoogleLoading(false);
    switchRole(role);
    toast.success('Registered & Signed in with Google successfully!');
    if (role === 'recruiter') navigate('/recruiter/dashboard');
    else navigate('/candidate/feed');
  };

  return (
    <>
      <AnimatePresence>
        {isGoogleLoading && (
          <GoogleAuthLoading onComplete={onGoogleAuthComplete} />
        )}
      </AnimatePresence>

      <motion.div 
        className="min-h-screen flex items-center justify-center p-4 bg-bg relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
      <div className="w-full max-w-lg bg-surface border border-border p-[40px] rounded-[8px] shadow-sm relative z-10">
        <div className="text-center mb-[32px]">
          <Link to="/" className="inline-flex items-center gap-[8px] mb-[24px]">
             <svg className="w-[28px] h-[28px] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="stroke-primary" d="M16 4C16 4 10 10 10 18C10 23 12.5 27 16 28C19.5 27 22 23 22 18C22 10 16 4 16 4Z" strokeWidth="1.4"/>
              <path className="stroke-primary" d="M16 8V26" strokeWidth="1.4"/>
              <path className="stroke-primary" d="M16 13C16 13 12.5 13.5 11 16.5" strokeWidth="1.2"/>
              <path className="stroke-primary" d="M16 17C16 17 12 17.5 10.3 21" strokeWidth="1.2"/>
              <path className="stroke-primary" d="M16 13C16 13 19.5 13.5 21 16.5" strokeWidth="1.2"/>
              <path className="stroke-primary" d="M16 17C16 17 20 17.5 21.7 21" strokeWidth="1.2"/>
            </svg>
            <span className="serif font-semibold text-[22px] tracking-[0.01em] text-text">
              Webloom<span className="text-gold">.</span>
            </span>
          </Link>
          <h1 className="serif text-[28px] font-semibold text-text mb-[8px]">Create Account</h1>
          <p className="text-[14.5px] text-text-muted">Start building your career ledger today.</p>
        </div>

        <div className="grid grid-cols-2 gap-[12px] mb-[24px]">
          <div
            onClick={() => setRole('candidate')}
            className={cn(
              "cursor-pointer p-[16px] rounded-[6px] border flex flex-col items-center justify-center gap-[8px] transition-colors",
              role === 'candidate' ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-border-light"
            )}
          >
            <UserCircle className={cn("w-[24px] h-[24px]", role === 'candidate' ? "text-primary" : "text-text-muted")} />
            <span className={cn("font-medium text-[14px]", role === 'candidate' ? "text-text" : "text-text-secondary")}>Candidate</span>
          </div>
          <div
            onClick={() => setRole('recruiter')}
            className={cn(
              "cursor-pointer p-[16px] rounded-[6px] border flex flex-col items-center justify-center gap-[8px] transition-colors",
              role === 'recruiter' ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-border-light"
            )}
          >
            <Briefcase className={cn("w-[24px] h-[24px]", role === 'recruiter' ? "text-primary" : "text-text-muted")} />
            <span className={cn("font-medium text-[14px]", role === 'recruiter' ? "text-text" : "text-text-secondary")}>Recruiter</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[16px]">
          <div>
            <div className="relative">
              <User className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
              <input 
                {...register('fullName')}
                type="text"
                placeholder="Full Name"
                className={cn("w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors", errors.fullName ? "border-danger" : "border-border")}
              />
            </div>
            {errors.fullName && <p className="text-danger text-[13px] mt-[4px]">{errors.fullName.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
              <input 
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className={cn("w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors", errors.email ? "border-danger" : "border-border")}
              />
            </div>
            {errors.email && <p className="text-danger text-[13px] mt-[4px]">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div>
              <div className="relative">
                <Lock className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
                <input 
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className={cn("w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors", errors.password ? "border-danger" : "border-border")}
                />
              </div>
              {errors.password && <p className="text-danger text-[13px] mt-[4px]">{errors.password.message}</p>}
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
                <input 
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm Password"
                  className={cn("w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors", errors.confirmPassword ? "border-danger" : "border-border")}
                />
              </div>
              {errors.confirmPassword && <p className="text-danger text-[13px] mt-[4px]">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-light text-[#201607] font-semibold py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[8px] text-[14.5px] border border-transparent mt-[24px]"
          >
            {isLoading ? <span className="animate-spin w-[18px] h-[18px] border-2 border-[#201607]/30 border-t-[#201607] rounded-full" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-[28px] flex items-center gap-[16px]">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-soft text-[12px] font-medium tracking-wider uppercase">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-[28px] bg-surface hover:bg-surface-alt border border-border text-text font-medium py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[10px] text-[14.5px] cursor-pointer hover:border-primary"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-[32px] text-text-muted text-[14px]">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </motion.div>
    </>
  );
}
