import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';

const TabsContext = createContext(null);

export function Tabs({
  value: controlledValue,
  onValueChange,
  defaultValue,
  className,
  children,
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn('w-full flex flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div className={cn('flex items-center overflow-x-auto', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const isActive = context.value === value;

  return (
    <button
      type="button"
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'relative flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap outline-none',
        isActive ? 'text-primary neon-text' : 'text-text-muted hover:text-text-secondary',
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  if (context.value !== value) return null;

  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn('w-full focus:outline-none', className)}
    >
      {children}
    </motion.div>
  );
}

export default Tabs;
