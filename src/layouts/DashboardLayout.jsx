import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import { CANDIDATE_NAV, RECRUITER_NAV, ADMIN_NAV } from '@/utils/constants';

export default function DashboardLayout({ role = 'candidate' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = 
    role === 'admin' ? ADMIN_NAV :
    role === 'recruiter' ? RECRUITER_NAV : 
    CANDIDATE_NAV;

  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden font-body relative">
      <Sidebar 
        role={role} 
        navItems={navItems} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden z-10 bg-bg">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      <RightSidebar role={role} />
    </div>
  );
}
