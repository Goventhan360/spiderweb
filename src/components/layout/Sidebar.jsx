import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar({ role, navItems, isOpen, setIsOpen }) {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Circle;
    return <IconComponent className="w-[20px] h-[20px]" />;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border w-64">
      <div className="p-[24px] flex items-center gap-[10px] border-b border-border">
         <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="stroke-primary" d="M16 4C16 4 10 10 10 18C10 23 12.5 27 16 28C19.5 27 22 23 22 18C22 10 16 4 16 4Z" strokeWidth="1.4"/>
          <path className="stroke-primary" d="M16 8V26" strokeWidth="1.4"/>
          <path className="stroke-primary" d="M16 13C16 13 12.5 13.5 11 16.5" strokeWidth="1.2"/>
          <path className="stroke-primary" d="M16 17C16 17 12 17.5 10.3 21" strokeWidth="1.2"/>
          <path className="stroke-primary" d="M16 13C16 13 19.5 13.5 21 16.5" strokeWidth="1.2"/>
          <path className="stroke-primary" d="M16 17C16 17 20 17.5 21.7 21" strokeWidth="1.2"/>
        </svg>
        <span className="serif font-semibold text-[19px] tracking-[0.01em] text-text">
          Webloom<span className="text-gold">.</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-[16px]">
        <nav className="space-y-[4px] px-[12px]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-[12px] px-[12px] py-[10px] rounded-[6px] transition-all',
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary font-medium' 
                    : 'text-text-secondary hover:bg-surface-alt hover:text-text'
                )}
              >
                {renderIcon(item.icon)}
                <span className="text-[14px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-[16px] border-t border-border bg-surface-alt/50">
        <div className="flex items-center gap-[12px] mb-[16px]">
          <div className="w-[36px] h-[36px] rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-[14px] serif">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-text truncate">{profile?.full_name || 'User'}</p>
            <p className="text-[12.5px] text-text-muted truncate capitalize">{role}</p>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[6px] border border-border bg-surface hover:bg-surface-alt transition-colors text-[13.5px] font-medium text-text-muted hover:text-text"
        >
          <Icons.LogOut className="w-[16px] h-[16px]" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-full z-20 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-text/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="relative z-10 w-64 h-full"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-[24px] right-[-40px] text-surface p-2 bg-text/20 rounded-full"
            >
              <Icons.X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
}
