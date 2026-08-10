import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleAuthLoading from '@/components/effects/GoogleAuthLoading';
import toast from 'react-hot-toast';
import { cn } from '@/utils/helpers';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });


  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const { user, error } = await signIn({ email, password });
      if (error) {
        toast.error(error.message || 'Invalid credentials. Please try again.');
        return;
      }
      if (user) {
        toast.success('Signed in successfully!');
        const role = user?.user_metadata?.role || 'candidate';
        const dashboardMap = {
          recruiter: '/recruiter/dashboard',
          admin: '/admin/dashboard',
        };
        navigate(dashboardMap[role] || '/candidate/feed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message || 'Google sign-in failed.');
      setIsGoogleLoading(false);
    }
    // On success, browser is redirected to Google — AuthCallback handles the return
  };


  return (
    <>
      <AnimatePresence>
        {isGoogleLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GoogleAuthLoading />
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="flex-1 py-2 rounded-[6px] bg-surface text-primary border border-border shadow-sm flex items-center justify-center gap-1">
          <LogIn size={14} /> Candidate
        </div>
        <Link to="/recruiter/login" className="flex-1 py-2 rounded-[6px] text-text-muted hover:text-text">Recruiter</Link>
        <Link to="/admin/login" className="flex-1 py-2 rounded-[6px] text-text-muted hover:text-text">Admin</Link>
      </div>

      <div className="bg-surface border border-border rounded-[8px] p-[32px] shadow-sm">
        <div className="text-center mb-[28px]">
          <Link to="/" className="inline-flex items-center gap-[10px] group mb-[16px]">
            <svg className="w-[32px] h-[32px] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h1 className="serif text-[26px] font-semibold text-text mb-[6px]">Candidate Sign In</h1>
          <p className="text-[14px] text-text-muted">Access jobs, career coaching, and AI resume studio.</p>
        </div>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]">
          <div>
            <div className="relative">
              <Mail className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
              <input 
                {...register('email')}
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                className={cn(
                  "w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
                  errors.email ? "border-danger" : "border-border"
                )}
              />
            </div>
            {errors.email && <p className="text-danger text-[13px] mt-[6px]">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-[14px] top-[12px] w-[18px] h-[18px] text-text-muted" />
              <input 
                {...register('password')}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className={cn(
                  "w-full bg-surface border rounded-[6px] py-[10px] pl-[42px] pr-[16px] text-[14.5px] text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
                  errors.password ? "border-danger" : "border-border"
                )}
              />
            </div>
            {errors.password && <p className="text-danger text-[13px] mt-[6px]">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-[13.5px]">
            <label className="flex items-center gap-[8px] cursor-pointer">
              <input type="checkbox" className="rounded-[4px] border-border bg-surface text-primary focus:ring-primary w-[16px] h-[16px]" />
              <span className="text-text-muted">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-primary hover:text-primary-dark transition-colors font-medium">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-light text-[#201607] font-semibold py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[8px] text-[14.5px] border border-transparent cursor-pointer"
          >
            {isLoading ? <span className="animate-spin w-[18px] h-[18px] border-2 border-[#201607]/30 border-t-[#201607] rounded-full" /> : 'Sign In as Candidate'}
          </button>
        </form>

        <div className="mt-[24px] flex items-center gap-[16px]">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-soft text-[12px] font-medium tracking-wider uppercase">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full mt-[24px] bg-surface hover:bg-surface-alt border border-border text-text font-medium py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[10px] text-[14.5px] cursor-pointer hover:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-[28px] text-text-muted text-[14px]">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary-dark font-semibold transition-colors">Create one</Link>
        </p>
      </div>
    </motion.div>
    </>
  );
}
