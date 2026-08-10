import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Button from './Button';

/**
 * Empty state component for lists/tables
 */
export default function EmptyState({
  title = 'No items found',
  description = "We couldn't find anything matching your criteria.",
  icon: Icon = Search,
  action,
  actionLabel,
  onAction,
  className,
}) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (typeof Icon === 'function') {
      const IconComponent = Icon;
      return <IconComponent className="h-10 w-10 text-text-muted" strokeWidth={1.5} />;
    }
    return <span className="flex items-center justify-center h-10 w-10 text-text-muted">{Icon}</span>;
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed border-border-light rounded-xl bg-card/30',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-card-light border border-border mb-6"
      >
        {renderIcon()}
      </motion.div>
      
      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-heading font-semibold text-text mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-text-muted max-w-sm mb-6"
      >
        {description}
      </motion.p>
      
      {(action || (actionLabel && onAction)) && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {action ? (
            action
          ) : (
            <Button onClick={onAction} variant="outline">
              {actionLabel}
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
