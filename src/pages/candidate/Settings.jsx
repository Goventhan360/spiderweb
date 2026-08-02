import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, Eye, Sliders, Trash2, Key, Save, User, CreditCard, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useAuth } from '@/contexts/AuthContext';
import Badge from '@/components/ui/Badge';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [showToast, setShowToast] = useState(false);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl serif font-bold text-text">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account preferences, security, and notifications.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <Card className="bg-surface border border-border rounded-[8px] p-4 sticky top-24">
            <TabsList className="flex-col bg-transparent h-auto space-y-2">
              <TabsTrigger value="account" className="w-full justify-start p-3 data-[state=active]:bg-surface-alt data-[state=active]:text-primary border border-transparent data-[state=active]:border-border">
                <User size={18} className="mr-3 shrink-0"/> Account Details
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start p-3">
                <Key size={18} className="mr-3 shrink-0"/> Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start p-3">
                <Bell size={18} className="mr-3 shrink-0"/> Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="w-full justify-start p-3">
                <Eye size={18} className="mr-3 shrink-0"/> Privacy & Visibility
              </TabsTrigger>
              <TabsTrigger value="billing" className="w-full justify-start p-3">
                <CreditCard size={18} className="mr-3 shrink-0"/> Subscription
              </TabsTrigger>
            </TabsList>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3 lg:w-3/4">
            
            {/* ACCOUNT DETAILS */}
            <TabsContent value="account" className="mt-0 space-y-6">
              <Card className="bg-surface border border-border rounded-[8px] p-6">
                <h2 className="text-xl serif font-semibold text-text mb-6">Account Details</h2>
                <form className="space-y-6 max-w-md" onSubmit={handleSave}>
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">Email Address</label>
                    <div className="flex gap-3">
                      <Input value={user?.email || 'alex.morgan@example.com'} disabled className="bg-surface-alt text-text-muted flex-grow" />
                      <Button variant="outline" type="button" className="border-border hover:border-primary shrink-0">Change</Button>
                    </div>
                    <p className="text-xs text-text-muted mt-2">Your email address is verified.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">Connected Accounts</label>
                    <div className="flex items-center justify-between p-3 border border-border rounded-md bg-surface-alt">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="none" d="M1 1h22v22H1z" /></svg>
                        <span className="text-sm font-medium text-text">Google</span>
                      </div>
                      <Button variant="ghost" size="sm" type="button" className="text-danger hover:text-danger hover:bg-danger/10">Disconnect</Button>
                    </div>
                  </div>
                </form>
              </Card>

              <Card className="bg-surface p-6 border-danger/30 rounded-[8px] border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>
                <h2 className="text-xl serif font-semibold text-danger mb-2 flex items-center gap-2"><Trash2 size={20} /> Danger Zone</h2>
                <p className="text-sm text-text-secondary mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <Button variant="outline" className="border-danger/50 text-danger hover:bg-danger hover:text-white transition-colors">Delete Account</Button>
              </Card>
            </TabsContent>

            {/* SECURITY */}
            <TabsContent value="security" className="mt-0">
              <Card className="bg-surface border border-border rounded-[8px] p-6">
                <h2 className="text-xl serif font-semibold text-text mb-6 flex items-center gap-2"><Key className="text-primary" size={20} /> Authentication</h2>
                <form className="space-y-6 max-w-md" onSubmit={handleSave}>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-text">Change Password</h3>
                    <div>
                      <Input type="password" placeholder="Current Password" />
                    </div>
                    <div>
                      <Input type="password" placeholder="New Password" />
                    </div>
                    <div>
                      <Input type="password" placeholder="Confirm New Password" />
                    </div>
                    <Button type="submit" className="bg-gold hover:bg-gold-light text-[#201607]"><Save size={16} className="mr-2" /> Update Password</Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* NOTIFICATIONS */}
            <TabsContent value="notifications" className="mt-0">
              <Card className="bg-surface border border-border rounded-[8px] p-6">
                <h2 className="text-xl serif font-semibold text-text mb-6 flex items-center gap-2"><Bell className="text-gold" size={20} /> Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Job Alerts', desc: 'Get notified when new jobs match your skills', checked: true },
                    { title: 'Application Updates', desc: 'Get notified when your application status changes', checked: true },
                    { title: 'Direct Messages', desc: 'Get notified when recruiters message you', checked: true },
                    { title: 'Push Notifications', desc: 'Receive real-time alerts in the browser', checked: false },
                    { title: 'Marketing Emails', desc: 'Receive tips, newsletters, and promotional offers', checked: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-surface-alt rounded-[8px] border border-border">
                      <div>
                        <h3 className="font-medium text-text">{item.title}</h3>
                        <p className="text-sm text-text-secondary">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} onChange={() => {}} />
                        <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} className="bg-gold hover:bg-gold-light text-[#201607]">Save Preferences</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* PRIVACY */}
            <TabsContent value="privacy" className="mt-0">
              <Card className="bg-surface border border-border rounded-[8px] p-6">
                <h2 className="text-xl serif font-semibold text-text mb-6 flex items-center gap-2"><Eye className="text-primary" size={20} /> Privacy & Visibility</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-alt rounded-[8px] border border-border">
                    <div>
                      <h3 className="font-medium text-text">Profile Visibility</h3>
                      <p className="text-sm text-text-secondary">Allow recruiters to find your profile in searches</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => {}} />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-alt rounded-[8px] border border-border">
                    <div>
                      <h3 className="font-medium text-text">Show Salary Expectations</h3>
                      <p className="text-sm text-text-secondary">Display your target salary on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" onChange={() => {}} />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-alt rounded-[8px] border border-border">
                    <div>
                      <h3 className="font-medium text-text">Search Engine Indexing</h3>
                      <p className="text-sm text-text-secondary">Allow public search engines (Google) to index your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" onChange={() => {}} />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                    </label>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} className="bg-gold hover:bg-gold-light text-[#201607]">Save Privacy</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* BILLING / SUBSCRIPTION */}
            <TabsContent value="billing" className="mt-0">
              <Card className="bg-surface border border-border rounded-[8px] p-6">
                <h2 className="text-xl serif font-semibold text-text mb-6 flex items-center gap-2"><CreditCard className="text-gold" size={20} /> Subscription Plan</h2>
                <div className="border border-primary/50 bg-primary/5 rounded-[8px] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-primary text-white border-none">Active</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-2">Pro Tier</h3>
                  <p className="text-text-secondary mb-6 max-w-md">You are currently on the Pro plan, giving you full access to AI tools, premium job matching, and unlimited resume scans.</p>
                  
                  <div className="flex items-center gap-4 border-t border-primary/20 pt-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white">Manage Subscription</Button>
                    <span className="text-sm text-text-muted">Next billing date: Oct 15, 2026</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
        </div>
      </Tabs>

      {/* Success Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-surface-alt border border-primary/50 p-4 rounded-[8px] shadow-lg flex items-center gap-3 z-50"
        >
          <CheckCircle className="text-primary" size={20} />
          <p className="text-sm font-medium text-text">Settings saved successfully!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
