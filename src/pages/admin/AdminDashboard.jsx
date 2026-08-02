import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Building, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';

const userGrowth = [
  { month: 'Jan', users: 45000 }, { month: 'Feb', users: 52000 },
  { month: 'Mar', users: 58000 }, { month: 'Apr', users: 65000 },
  { month: 'May', users: 72000 }, { month: 'Jun', users: 85243 },
];

export default function AdminDashboard() {
  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Platform Overview</h1>
          <p className="text-text-muted mt-1">Global platform statistics and health monitoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="85,243" icon={<Users />} trend="+12% MoM" trendUp={true} />
        <StatCard title="Active Jobs" value="12,500" icon={<Briefcase />} trend="+5% MoM" trendUp={true} />
        <StatCard title="Companies" value="3,200" icon={<Building />} trend="+8% MoM" trendUp={true} />
        <StatCard title="Total Applications" value="156K" icon={<Activity />} trend="+15% MoM" trendUp={true} />
        <StatCard title="MRR (Revenue)" value="$45.2K" icon={<TrendingUp />} trend="+10% MoM" trendUp={true} />
        <Card className="p-6 glass border-danger/30 bg-danger/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-danger/20 text-danger rounded-lg"><AlertTriangle /></div>
            <div>
              <p className="text-text-muted text-sm font-medium">Flagged Content</p>
              <h3 className="text-2xl font-bold text-text mt-1 mono">24 Items</h3>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4 border-danger/50 text-danger hover:bg-danger/10">Review Now</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <Card className="p-6 glass lg:col-span-2">
          <h2 className="text-xl serif font-semibold text-text mb-6">User Growth (YTD)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="p-6 glass">
          <h2 className="text-xl serif font-semibold text-text mb-4">System Health & Activity</h2>
          <div className="space-y-4">
            <div className="bg-surface-alt p-3 rounded-lg border border-border-light text-sm">
              <div className="flex justify-between text-text-muted mb-1"><span>API Uptime</span> <span className="text-success mono">99.99%</span></div>
              <div className="w-full bg-border rounded-full h-1.5"><div className="bg-success h-1.5 rounded-full w-[99.99%]"></div></div>
            </div>
            <div className="bg-surface-alt p-3 rounded-lg border border-border-light text-sm">
              <div className="flex justify-between text-text-muted mb-1"><span>Server Load</span> <span className="text-warning mono">65%</span></div>
              <div className="w-full bg-border rounded-full h-1.5"><div className="bg-warning h-1.5 rounded-full w-[65%]"></div></div>
            </div>
            
            <h3 className="font-semibold text-text-muted text-xs uppercase tracking-wider mt-6 mb-2">Live Activity</h3>
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
              {[
                {text: 'New company verified: CyberDyne Systems', time: '2 mins ago', color: 'text-success'},
                {text: 'High traffic alert: 1500 concurrent users', time: '15 mins ago', color: 'text-warning'},
                {text: 'System backup completed', time: '1 hour ago', color: 'text-primary'},
              ].map((log, i) => (
                <div key={i} className="relative pl-6 text-sm">
                  <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-surface bg-current ${log.color} -ml-2.5`}></span>
                  <p className="text-text">{log.text}</p>
                  <span className="text-xs text-text-muted mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
