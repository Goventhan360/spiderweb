import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import Button from '@/components/ui/Button';

const data = [
  { name: 'Q1', revenue: 12000, users: 5000 },
  { name: 'Q2', revenue: 19000, users: 8000 },
  { name: 'Q3', revenue: 25000, users: 12000 },
  { name: 'Q4', revenue: 32000, users: 18000 },
];

export default function Reports() {
  return (
    <motion.div className="p-6 max-w-7xl mx-auto space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl serif font-bold text-text">Platform Reports</h1>
          <p className="text-text-muted mt-1">Exportable analytics and financial data.</p>
        </div>
        <Button variant="primary" icon={<Download size={18}/>}>Export PDF</Button>
      </div>

      <Card className="p-6 glass">
        <h2 className="text-xl serif font-semibold text-text mb-6">Revenue vs User Growth</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
              <YAxis yAxisId="right" orientation="right" stroke="#D4AF37" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#10B981" radius={[4,4,0,0]} name="Revenue ($)" />
              <Bar yAxisId="right" dataKey="users" fill="#D4AF37" radius={[4,4,0,0]} name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
