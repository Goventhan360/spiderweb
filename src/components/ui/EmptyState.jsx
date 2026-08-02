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
  actionLabel,
  onAction,
  className,
}) {
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
        <Icon className="h-10 w-10 text-text-muted" strokeWidth={1.5} />
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
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
