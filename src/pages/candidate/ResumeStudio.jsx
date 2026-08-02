import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileEdit, Download, Sparkles, CheckCircle, Eye, RefreshCw, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function ResumeStudio() {
  const [summary, setSummary] = useState(
    "Senior Frontend Developer with 5+ years of experience specializing in React, Next.js, and TypeScript. Passionate about building accessible, performant UI components and leading frontend migrations."
  );

  const handleAISummary = () => {
    toast.loading('AI is crafting your summary...', { duration: 1500 });
    setTimeout(() => {
      setSummary(
        "Results-driven Senior Frontend Engineer with 5+ years of expertise delivering high-impact web applications using React, TypeScript, and modern CSS architecture. Proven history of optimizing web performance by 40%."
      );
      toast.success('AI Summary Generated!');
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
            <FileEdit className="text-gold" /> Resume Studio & ATS Builder
          </h1>
          <p className="text-text-secondary mt-1">Craft, optimize, and preview ATS-friendly resumes backed by AI.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => toast.success('Exporting PDF...')} className="bg-gold hover:bg-gold-light text-[#201607] font-semibold text-sm">
            <Download size={16} className="mr-1.5" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <Card className="bg-surface border border-border p-6 rounded-[8px] space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="serif font-bold text-text text-lg">Professional Summary</h3>
            <Button onClick={handleAISummary} variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold/10 text-xs">
              <Sparkles size={14} className="mr-1" /> AI Rewrite
            </Button>
          </div>

          <textarea 
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full h-36 bg-surface-alt border border-border rounded-[8px] p-3 text-text text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="Write or generate your resume summary..."
          />

          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-text text-sm">Target Role Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Next.js', 'State Management', 'Performance Optimization', 'Tailwind CSS'].map(kw => (
                <Badge key={kw} variant="outline" className="text-xs bg-surface-alt">{kw}</Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Live Preview Panel */}
        <Card className="bg-surface-alt border border-border p-6 rounded-[8px] space-y-4 font-serif text-sm">
          <div className="flex justify-between items-center border-b border-border pb-3 font-sans">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={14} /> Live ATS Preview
            </span>
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">88% ATS Score</Badge>
          </div>

          <div className="space-y-4 p-4 bg-surface rounded-[6px] border border-border shadow-inner">
            <div className="border-b border-border-light pb-3">
              <h2 className="text-xl font-bold text-text">Alex Morgan</h2>
              <p className="text-xs text-text-secondary">San Francisco, CA • alex@example.com • +1 (555) 123-4567</p>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider mb-1 font-sans">Summary</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider mb-1 font-sans">Experience</h4>
              <p className="text-xs font-bold text-text">Senior Frontend Engineer — OmniCorp</p>
              <p className="text-[11px] text-text-muted mb-1">Jan 2024 - Present</p>
              <ul className="list-disc list-inside text-[11px] text-text-secondary space-y-0.5">
                <li>Spearheaded frontend architecture migration to Next.js.</li>
                <li>Reduced bundle load times by 40% across key user flows.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
