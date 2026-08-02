import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Ambient floating neon orb component
 */
export default function GlowOrb({ 
  className,
  color = 'primary', // primary, secondary, accent
  size = 'md',
  blur = 'lg',
  delay = 0,
}) {
  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  };

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]',
  };

  const blurs = {
    md: 'blur-2xl',
    lg: 'blur-3xl',
    xl: 'blur-[100px]',
  };

  return (
    <motion.div
      className={cn(
        'absolute rounded-full opacity-20 pointer-events-none mix-blend-screen',
        colors[color],
        sizes[size],
        blurs[blur],
        className
      )}
      animate={{
        x: [0, 20, 0, -20, 0],
        y: [0, -20, 0, 20, 0],
        scale: [1, 1.05, 1, 0.95, 1],
      }}
      transition={{
        duration: 10,
        ease: "linear",
        repeat: Infinity,
        delay: delay,
      }}
    />
  );
}
