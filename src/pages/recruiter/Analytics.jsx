import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';

const appData = [
  { month: 'May', apps: 120 }, { month: 'Jun', apps: 210 },
  { month: 'Jul', apps: 180 }, { month: 'Aug', apps: 290 },
  { month: 'Sep', apps: 350 }, { month: 'Oct', apps: 420 },
];

const sourceData = [
  { name: 'Organic Search', value: 400 },
  { name: 'LinkedIn', value: 300 },
  { name: 'Referrals', value: 150 },
  { name: 'Job Boards', value: 100 },
];

const funnelData = [
  { stage: 'Views', count: 5000 },
  { stage: 'Applied', count: 420 },
  { stage: 'Screened', count: 150 },
  { stage: 'Interview', count: 45 },
  { stage: 'Hired', count: 12 },
];

const COLORS = ['#4ADE80', '#D4AF37', '#A3E635', '#FCD34D'];

export default function Analytics() {
  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <h1 className="text-3xl serif font-bold text-text">Hiring Analytics</h1>
        <p className="text-text-muted mt-1">Data-driven insights to optimize your recruitment process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applications" value="1,270" icon={<Users/>} trend="+24% vs last month" trendUp={true} />
        <StatCard title="Avg Time to Hire" value="18 Days" icon={<Clock/>} trend="-2 days vs avg" trendUp={true} />
        <StatCard title="Offer Acceptance" value="85%" icon={<TrendingUp/>} trend="+5% vs last year" trendUp={true} />
        <StatCard title="Cost per Hire" value="$1,250" icon={<DollarSign/>} trend="Within budget" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="p-6 glass border-border h-[350px]">
          <h3 className="serif font-semibold text-text mb-6">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={appData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a312c" vertical={false} />
              <XAxis dataKey="month" stroke="#87958e" className="mono text-xs" />
              <YAxis stroke="#87958e" className="mono text-xs" />
              <Tooltip contentStyle={{ backgroundColor: '#131614', border: '1px solid #2a312c' }} />
              <Line type="monotone" dataKey="apps" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Funnel Chart */}
        <Card className="p-6 glass border-border h-[350px]">
          <h3 className="serif font-semibold text-text mb-6">Hiring Pipeline Conversion</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a312c" horizontal={false} />
              <XAxis type="number" stroke="#87958e" className="mono text-xs" />
              <YAxis dataKey="stage" type="category" stroke="#87958e" className="mono text-xs" />
              <Tooltip contentStyle={{ backgroundColor: '#131614', border: '1px solid #2a312c' }} />
              <Bar dataKey="count" fill="#4ADE80" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 glass border-border h-[350px]">
          <h3 className="serif font-semibold text-text mb-6">Candidate Sources</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#131614', border: '1px solid #2a312c' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Job Performance Table */}
        <Card className="p-6 glass border-border h-[350px] overflow-auto">
          <h3 className="serif font-semibold text-text mb-4">Top Performing Jobs</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-text-muted border-b border-border">
              <tr>
                <th className="pb-2">Job Title</th>
                <th className="pb-2 text-right">Views</th>
                <th className="pb-2 text-right">Apps</th>
                <th className="pb-2 text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr><td className="py-3 font-medium text-text">Senior React Dev</td><td className="py-3 text-right mono">2,450</td><td className="py-3 text-right text-primary mono">120</td><td className="py-3 text-right text-primary mono">4.9%</td></tr>
              <tr><td className="py-3 font-medium text-text">UX Designer</td><td className="py-3 text-right mono">1,890</td><td className="py-3 text-right text-primary mono">85</td><td className="py-3 text-right text-primary mono">4.5%</td></tr>
              <tr><td className="py-3 font-medium text-text">Product Manager</td><td className="py-3 text-right mono">1,200</td><td className="py-3 text-right text-primary mono">45</td><td className="py-3 text-right text-gold mono">3.7%</td></tr>
              <tr><td className="py-3 font-medium text-text">Data Scientist</td><td className="py-3 text-right mono">950</td><td className="py-3 text-right text-primary mono">25</td><td className="py-3 text-right text-text-muted mono">2.6%</td></tr>
            </tbody>
          </table>
        </Card>
      </div>
    </motion.div>
  );
}

