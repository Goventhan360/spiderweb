import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Eye, UserCheck, Search, Award } from 'lucide-react';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

export default function CandidateAnalytics() {
  const profileViewsData = [
    { name: 'Mon', views: 12, searches: 45 },
    { name: 'Tue', views: 19, searches: 60 },
    { name: 'Wed', views: 24, searches: 80 },
    { name: 'Thu', views: 32, searches: 95 },
    { name: 'Fri', views: 40, searches: 110 },
    { name: 'Sat', views: 28, searches: 70 },
    { name: 'Sun', views: 35, searches: 88 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
          <BarChart3 className="text-primary" /> Career & Profile Analytics
        </h1>
        <p className="text-text-secondary mt-1">Track your profile visibility, recruiter searches, and application conversion rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Profile Views" value="190" icon={<Eye className="text-primary" />} change="+18% this week" changeType="positive" />
        <StatCard title="Recruiter Searches" value="548" icon={<Search className="text-gold" />} change="+24% this week" changeType="positive" />
        <StatCard title="Application Response Rate" value="68%" icon={<UserCheck className="text-accent" />} change="Above Average" changeType="positive" />
        <StatCard title="AI Match Score Average" value="88%" icon={<Award className="text-success" />} change="+5% vs last month" changeType="positive" />
      </div>

      <Card className="bg-surface border border-border p-6 rounded-[8px] space-y-4">
        <h3 className="serif font-bold text-text text-lg">Weekly Profile Visibility</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profileViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F9FAFB' }} />
              <Line type="monotone" dataKey="views" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="searches" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
