import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, Settings, Shield, Mail, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Platform settings saved');
    }, 1000);
  };

  return (
    <motion.div className="p-6 max-w-4xl mx-auto space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Platform Settings</h1>
          <p className="text-text-muted mt-1">Configure global application parameters.</p>
        </div>
        <Button variant="primary" onClick={handleSave} isLoading={saving} icon={<Save size={18}/>}>Save Changes</Button>
      </div>

      <div className="space-y-6">
        <Card className="p-6 glass space-y-4">
          <div className="flex items-center gap-2 mb-4 text-xl serif font-semibold text-text border-b border-border pb-2">
            <Settings className="text-primary" /> General
          </div>
          <Input label="Application Name" defaultValue="Webloom AI" />
          <Input label="Support Email" defaultValue="support@webloom.ai" />
          <Input label="Max File Upload Size (MB)" type="number" defaultValue="10" />
        </Card>

        <Card className="p-6 glass space-y-4">
          <div className="flex items-center gap-2 mb-4 text-xl serif font-semibold text-text border-b border-border pb-2">
            <Zap className="text-gold" /> Features
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-border-light">
            <div>
              <p className="font-medium text-text">AI Matching Engine</p>
              <p className="text-xs text-text-muted">Enable automated scoring of applicants</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-border-light">
            <div>
              <p className="font-medium text-text">In-App Messaging</p>
              <p className="text-xs text-text-muted">Allow direct candidate-recruiter chat</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
          </div>
        </Card>

        <Card className="p-6 glass space-y-4">
          <div className="flex items-center gap-2 mb-4 text-xl serif font-semibold text-text border-b border-border pb-2">
            <Shield className="text-warning" /> Security
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg border border-border-light">
            <div>
              <p className="font-medium text-text">Require Email Verification</p>
              <p className="text-xs text-text-muted">Users must verify email before applying/posting</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-3 bg-danger/10 border border-danger/30 rounded-lg">
            <div>
              <p className="font-medium text-danger">Maintenance Mode</p>
              <p className="text-xs text-danger/80">Disable access for non-admin users</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-danger cursor-pointer" />
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
