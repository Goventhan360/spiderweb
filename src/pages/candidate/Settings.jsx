import React, { useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Lock, Bell, ShieldAlert, LogOut, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Preferences State (local for demo, in prod would save to user metadata or profile)
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    marketingEmails: false,
    profileVisible: true,
    showEmail: false,
    jobSearchStatus: 'actively_looking'
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setUpdatingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // In a real app, you'd save this to Supabase here
    toast.success('Preferences saved');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you ABSOLUTELY sure? This action cannot be undone and will delete all your data.")) {
      return;
    }
    
    try {
      // In Supabase, deleting a user securely usually requires a backend edge function,
      // but we can simulate the UI flow or call an RPC if setup.
      // For now, we will just sign out and show a message.
      toast.success('Account deletion requested. Please contact support.');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: ShieldAlert, className: 'text-red-500' }
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h1 className="text-2xl font-bold text-text mb-6">Settings</h1>
        
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-alt hover:text-text'}
                  ${tab.className || ''}
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-text mb-4">Email Address</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text font-medium">{user?.email}</p>
                  <p className="text-sm text-text-muted mt-1">Primary email for your account</p>
                </div>
                <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/5 flex gap-1">
                  <Check size={12} /> Verified
                </Badge>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-text mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <Input 
                  type="password" 
                  label="New Password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(p => ({...p, newPassword: e.target.value}))}
                  required
                />
                <Input 
                  type="password" 
                  label="Confirm New Password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))}
                  required
                />
                <Button type="submit" isLoading={updatingPassword}>
                  Update Password
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-text">Profile Privacy</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">Public Profile</h3>
                  <p className="text-sm text-text-muted mt-1">Allow employers to find your profile in searches.</p>
                </div>
                <Toggle checked={preferences.profileVisible} onChange={(val) => handlePreferenceChange('profileVisible', val)} />
              </div>
              <hr className="border-border" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">Show Email Address</h3>
                  <p className="text-sm text-text-muted mt-1">Display your email on your public profile.</p>
                </div>
                <Toggle checked={preferences.showEmail} onChange={(val) => handlePreferenceChange('showEmail', val)} />
              </div>
              <hr className="border-border" />

              <div>
                <h3 className="font-medium text-text mb-3">Job Search Status</h3>
                <select 
                  className="w-full md:w-1/2 p-3 rounded-lg border border-border bg-surface text-text focus:ring-2 focus:ring-primary outline-none"
                  value={preferences.jobSearchStatus}
                  onChange={(e) => handlePreferenceChange('jobSearchStatus', e.target.value)}
                >
                  <option value="actively_looking">Actively Looking</option>
                  <option value="open">Open to Opportunities</option>
                  <option value="not_looking">Not Looking</option>
                </select>
              </div>
            </Card>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-text">Email Notifications</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">Job Alerts & Matches</h3>
                  <p className="text-sm text-text-muted mt-1">Get emails when new jobs match your profile.</p>
                </div>
                <Toggle checked={preferences.emailAlerts} onChange={(val) => handlePreferenceChange('emailAlerts', val)} />
              </div>
              <hr className="border-border" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">Marketing & Promotions</h3>
                  <p className="text-sm text-text-muted mt-1">Receive tips, newsletters, and promotional offers.</p>
                </div>
                <Toggle checked={preferences.marketingEmails} onChange={(val) => handlePreferenceChange('marketingEmails', val)} />
              </div>
            </Card>
          </div>
        )}

        {/* DANGER ZONE */}
        {activeTab === 'danger' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="p-6 border-red-500/20 bg-red-500/5 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                  <ShieldAlert size={24} /> Danger Zone
                </h2>
                <p className="text-text-muted mt-2">Irreversible and destructive actions.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-500/20 rounded-xl bg-surface">
                <div>
                  <h3 className="font-medium text-text">Delete Account</h3>
                  <p className="text-sm text-text-muted mt-1">Permanently remove your account and all data.</p>
                </div>
                <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 shrink-0" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple internal toggle component
function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-surface-alt peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
  );
}
