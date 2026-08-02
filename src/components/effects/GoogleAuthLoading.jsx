import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function GoogleAuthLoading({ onComplete, userEmail = "candidate@demo.webloom.ai", userName = "Loading..." }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const steps = [
    { icon: <Lock className="text-[#4285F4]" size={18} />, text: "Connecting to Google OAuth 2.0 Gateway..." },
    { icon: <ShieldCheck className="text-[#34A853]" size={18} />, text: "Verifying security tokens & user identity..." },
    { icon: <Sparkles className="text-[#FBBC05]" size={18} />, text: "Initializing Webloom AI Career Match Engine..." },
    { icon: <CheckCircle2 className="text-[#EA4335]" size={18} />, text: "Preparing your candidate workspace..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
          }, 200);
          return 100;
        }
        const next = prev + 5;
        if (next > 75) setStepIndex(3);
        else if (next > 50) setStepIndex(2);
        else if (next > 25) setStepIndex(1);
        return next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0B0D]/92 backdrop-blur-xl flex flex-col items-center justify-center p-4"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -top-10 -left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10 animate-pulse" />

      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-surface border border-border/80 rounded-[16px] p-8 shadow-2xl relative z-10 text-center space-y-6"
      >
        {/* Animated Google Logo Ring */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#4285F4] border-r-[#34A853] border-b-[#FBBC05] border-l-[#EA4335] animate-spin" />
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center shadow-inner">
            <svg className="w-9 h-9" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
        </div>

        {/* User Card Info */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-alt border border-border rounded-full text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-[#34A853] animate-ping" />
            Google Account Authenticated
          </div>
          <h2 className="text-xl serif font-semibold text-text pt-2">{userName}</h2>
          <p className="text-xs text-text-muted font-mono">{userEmail}</p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-mono text-text-muted">
            <span>Authenticating...</span>
            <span className="text-gold font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-surface-alt border border-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Animated Step Messages */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface-alt/70 px-3 py-1.5 rounded-lg border border-border-light"
            >
              {steps[stepIndex].icon}
              <span>{steps[stepIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-[11px] text-text-muted pt-2 border-t border-border/60">
          Webloom AI Security • Encrypted OAuth 2.0 Session
        </p>
      </motion.div>
    </motion.div>
  );
}
