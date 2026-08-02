import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { pageVariants } from '@/hooks/useAnimations';
import toast from 'react-hot-toast';
import { cn } from '@/utils/helpers';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { error } = await resetPassword(data.email);
    setIsLoading(false);
    
    if (error) {
      toast.error(error.message || 'Failed to send reset email');
    } else {
      setIsSent(true);
      toast.success('Password reset email sent');
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-4 bg-bg relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-md bg-surface border border-border p-[40px] rounded-[8px] shadow-sm relative z-10">
        
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
          </Link>
          <h1 className="serif text-[28px] font-semibold text-text mb-[8px]">Reset Password</h1>
          <p className="text-[14.5px] text-text-muted">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {isSent ? (
          <div className="text-center">
            <div className="w-[64px] h-[64px] bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-[24px]">
              <Mail className="w-[32px] h-[32px] text-primary" />
            </div>
            <h3 className="serif text-[20px] font-semibold text-text mb-[12px]">Check your email</h3>
            <p className="text-[14.5px] text-text-muted mb-[32px]">
              We've sent password reset instructions to your email address.
            </p>
            <Link to="/login" className="w-full bg-gold hover:bg-gold-light text-[#201607] font-semibold py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[8px] text-[14.5px] border border-transparent">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[20px]">
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
              {errors.email && <p className="text-danger text-[13px] mt-[6px]">{errors.email.message}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-light text-[#201607] font-semibold py-[11px] rounded-[6px] transition-colors flex items-center justify-center gap-[8px] text-[14.5px] border border-transparent"
            >
              {isLoading ? <span className="animate-spin w-[18px] h-[18px] border-2 border-[#201607]/30 border-t-[#201607] rounded-full" /> : 'Send Reset Link'}
            </button>
            
            <div className="text-center mt-[32px]">
              <Link to="/login" className="inline-flex items-center text-[14px] text-text-muted hover:text-text transition-colors">
                <ArrowLeft className="w-[16px] h-[16px] mr-[6px]" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
