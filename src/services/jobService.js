import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';

const DEMO_JOBS = [
  { id: '1', title: 'Senior AI Engineer', company: 'CyberDyne Systems', location: 'San Francisco, CA', salary_min: 150000, salary_max: 200000, type: 'full-time', mode: 'hybrid', level: 'senior', skills: ['Python', 'TensorFlow', 'LLMs'], description: 'Leading AI systems development.', company_logo: null },
  { id: '2', title: 'Frontend Developer', company: 'Web3 Innovators', location: 'Remote', salary_min: 100000, salary_max: 140000, type: 'full-time', mode: 'remote', level: 'mid', skills: ['React', 'TypeScript', 'Tailwind CSS'], description: 'Building next-gen UIs.', company_logo: null }
];

export const jobService = {
  async getJobs(filters = {}) {
    if (!isConfigured()) return { data: DEMO_JOBS, count: DEMO_JOBS.length, error: null };
    let q = supabase.from('jobs').select('*', { count: 'exact' });
    // Apply basic filters here...
    const { data, error, count } = await q.order('created_at', { ascending: false });
    return { data, count, error };
  },
  async getJobById(id) {
    if (!isConfigured()) return { data: DEMO_JOBS.find(j => j.id === id) || DEMO_JOBS[0], error: null };
    const { data, error } = await supabase.from('jobs').select('*, company:companies(*)').eq('id', id).single();
    return { data, error };
  },
  async createJob(data) {
    if (!isConfigured()) return { data: { ...data, id: Date.now().toString() }, error: null };
    const { data: result, error } = await supabase.from('jobs').insert([data]).select().single();
    return { data: result, error };
  },
  async updateJob(id, data) {
    if (!isConfigured()) return { data, error: null };
    const { data: result, error } = await supabase.from('jobs').update(data).eq('id', id).select().single();
    return { data: result, error };
  },
  async deleteJob(id) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    return { error };
  },
  async getJobsByRecruiter(recruiterId) {
    if (!isConfigured()) return { data: DEMO_JOBS, error: null };
    const { data, error } = await supabase.from('jobs').select('*').eq('recruiter_id', recruiterId);
    return { data, error };
  },
  async getFeaturedJobs() {
    if (!isConfigured()) return { data: DEMO_JOBS, error: null };
    const { data, error } = await supabase.from('jobs').select('*').eq('is_featured', true).limit(5);
    return { data, error };
  },
  async incrementJobViews(id) {
    if (!isConfigured()) return { error: null };
    // Usually calls an RPC
    const { error } = await supabase.rpc('increment_job_views', { job_id: id });
    return { error };
  },
  async searchJobs(query) {
    if (!isConfigured()) return { data: DEMO_JOBS, error: null };
    const { data, error } = await supabase.from('jobs').select('*').or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    return { data, error };
  }
};
