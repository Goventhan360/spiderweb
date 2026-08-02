import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import toast from 'react-hot-toast';

export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, role, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'recruiter') {
      navigate('/recruiter/dashboard');
      toast.success('Switched to Recruiter Workspace');
    } else if (newRole === 'admin') {
      navigate('/admin/dashboard');
      toast.success('Switched to Admin Portal');
    } else {
      navigate('/candidate/feed');
      toast.success('Switched to Candidate Feed');
    }
  };
  
  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean).pop();
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-[64px] bg-surface border-b border-border flex items-center justify-between px-[24px] z-10 shrink-0">
      <div className="flex items-center gap-[16px]">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-[8px] -ml-[8px] text-text-secondary hover:text-text transition-colors"
        >
          <Menu className="w-[24px] h-[24px]" />
        </button>
        <h1 className="text-[20px] serif font-semibold text-text">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-[14px]">
        {/* Role Badge - Shown per active role workspace */}
        {location.pathname.startsWith('/recruiter') && (
          <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-xs font-medium text-gold">
            <ShieldCheck size={14} /> Recruiter Workspace
          </div>
        )}
        
        {location.pathname.startsWith('/admin') && (
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-xs font-medium text-primary">
            <ShieldCheck size={14} /> Admin Portal
          </div>
        )}

        <button 
          onClick={toggleTheme}
          className="w-[36px] h-[36px] rounded-full border border-border bg-surface flex items-center justify-center cursor-pointer text-text-muted hover:border-primary hover:text-primary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4 block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          ) : (
            <svg className="w-4 h-4 block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          )}
        </button>

        <button className="relative p-[8px] text-text-muted hover:text-primary transition-colors rounded-full hover:bg-surface-alt">
          <Bell className="w-[20px] h-[20px]" />
          <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] bg-[#EF4444] rounded-full border-2 border-surface"></span>
        </button>

        <div className="w-[36px] h-[36px] rounded-full bg-primary flex items-center justify-center text-[#FFFFFF] font-medium text-[14px] serif cursor-pointer border border-primary-dark">
          {profile?.full_name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
