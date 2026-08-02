import { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn, formatNumber } from '@/utils/helpers';
import Card from './Card';

/**
 * Animated counter hook
 */
function useCounter(end, duration = 2, start = 0) {
  const [count, setCount] = useState(start);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px 0px" });

  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    let animationFrame;
    
    // Parse value if it's a string with formatting
    const endValue = typeof end === 'string' ? parseFloat(end.replace(/,/g, '')) : end;
    
    if (isNaN(endValue)) {
      setCount(end);
      return;
    }

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = start + easeOut * (endValue - start);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration, start, inView]);

  return { count, nodeRef };
}

/**
 * Dashboard stat card
 */
export default function StatCard({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  isCurrency = false,
  suffix = '',
  className,
  color = 'primary',
}) {
  const { count, nodeRef } = useCounter(value);

  const colors = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    secondary: 'text-secondary bg-secondary/10 border-secondary/20',
    accent: 'text-accent bg-accent/10 border-accent/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
  };

  // Format the display value
  const displayValue = () => {
    if (typeof value === 'string' && isNaN(parseFloat(value.replace(/,/g, '')))) {
      return value;
    }
    
    const formatted = formatNumber(count, isCurrency ? 2 : 0);
    return isCurrency ? `$${formatted}` : formatted;
  };

  return (
    <Card 
      className={cn('relative overflow-hidden', className)}
      padding="lg"
      hoverable
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 
              ref={nodeRef}
              className="text-3xl font-heading font-bold text-text tracking-tight"
            >
              {displayValue()}{suffix}
            </h3>
            
            {change && (
              <span 
                className={cn(
                  'flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full',
                  changeType === 'positive' && 'text-success bg-success/10',
                  changeType === 'negative' && 'text-danger bg-danger/10',
                  changeType === 'neutral' && 'text-text-secondary bg-card-lighter'
                )}
              >
                {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
                {changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
                {change}
              </span>
            )}
          </div>
        </div>
        
        {icon && (
          <div className={cn('p-3 rounded-xl border', colors[color])}>
            {/* Support both JSX elements (<Briefcase/>) and component types (Briefcase) */}
            {typeof icon === 'function'
              ? (() => { const IconComp = icon; return <IconComp className="w-6 h-6" />; })()
              : <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
            }
          </div>
        )}
      </div>
      
      {/* Decorative background element */}
      <div 
        className={cn(
          'absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl',
          colors[color].split(' ')[1] // Gets the bg color class
        )} 
      />
    </Card>
  );
}
