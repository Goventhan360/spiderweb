import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, CheckCircle, Clock, PlayCircle, Award, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import toast from 'react-hot-toast';

export default function LearningHub() {
  const roadmaps = [
    { id: 1, title: 'Full Stack React & Node Mastery', progress: 65, totalLessons: 24, completed: 16, category: 'Frontend & Backend', color: 'text-primary' },
    { id: 2, title: 'AI & Large Language Model Integration', progress: 40, totalLessons: 18, completed: 7, category: 'Machine Learning', color: 'text-gold' },
    { id: 3, title: 'DevOps, Docker & Kubernetes Fundamentals', progress: 20, totalLessons: 15, completed: 3, category: 'Infrastructure', color: 'text-text-secondary' },
  ];

  const skillPaths = [
    { name: 'TypeScript Architect', duration: '6 hrs', level: 'Advanced', lessons: 12 },
    { name: 'Next.js 15 App Router Deep Dive', duration: '4 hrs', level: 'Intermediate', lessons: 8 },
    { name: 'GraphQL & Apollo Client', duration: '5 hrs', level: 'Intermediate', lessons: 10 },
    { name: 'System Design for Senior Engineers', duration: '8 hrs', level: 'Advanced', lessons: 15 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl serif font-bold text-text flex items-center gap-3">
          <GraduationCap className="text-primary" /> Learning & Skill Hub
        </h1>
        <p className="text-text-secondary mt-1">Level up your technical stack and bridge skill gaps for targeted roles.</p>
      </div>

      {/* Active Roadmaps */}
      <div className="space-y-4">
        <h2 className="text-xl serif font-semibold text-text flex items-center gap-2">
          <BookOpen size={20} className="text-gold" /> In-Progress Roadmaps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmaps.map((r) => (
            <Card key={r.id} className="bg-surface border border-border p-6 rounded-[8px] flex flex-col justify-between hover:border-primary transition-all">
              <div>
                <Badge variant="outline" className="text-[10px] mb-3 bg-surface-alt">{r.category}</Badge>
                <h3 className="font-semibold text-text text-base mb-2">{r.title}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Progress</span>
                    <span className="font-bold text-primary mono">{r.progress}%</span>
                  </div>
                  <ProgressBar value={r.progress} className="h-2" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
                <span className="text-text-secondary">{r.completed}/{r.totalLessons} lessons done</span>
                <Button size="sm" onClick={() => toast.success(`Resuming ${r.title}`)} className="bg-gold hover:bg-gold-light text-[#201607] font-semibold text-xs">
                  Resume
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Skill Paths */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl serif font-semibold text-text flex items-center gap-2">
          <Award size={20} className="text-primary" /> Recommended Skill Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillPaths.map((sp) => (
            <Card key={sp.name} className="bg-surface border border-border p-5 rounded-[8px] flex flex-col justify-between hover:border-primary transition-all">
              <div>
                <div className="p-3 rounded-lg bg-surface-alt border border-border w-fit mb-3 text-primary">
                  <PlayCircle size={24} />
                </div>
                <h4 className="font-semibold text-text text-sm mb-1">{sp.name}</h4>
                <p className="text-xs text-text-secondary">{sp.level} • {sp.duration}</p>
              </div>
              <Button onClick={() => toast.success(`Enrolled in ${sp.name}!`)} variant="outline" size="sm" className="mt-4 border-border hover:border-primary text-xs w-full">
                Enroll Path
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
