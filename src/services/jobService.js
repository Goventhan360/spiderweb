import { supabase } from '@/supabase/client';

const DEMO_JOBS = [
  { id: '1', title: 'Frontend Developer', company_id: '1', location: 'Remote', salary_min: 80000, salary_max: 120000, job_type: 'Full-time', work_mode: 'Remote', experience_level: 'Mid-Level', description: 'React dev needed', status: 'active', is_featured: true, views_count: 100 },
  { id: '2', title: 'Backend Developer', company_id: '1', location: 'New York', salary_min: 90000, salary_max: 130000, job_type: 'Full-time', work_mode: 'Hybrid', experience_level: 'Senior', description: 'Node.js dev needed', status: 'active', is_featured: false, views_count: 50 },
  { id: '3', title: 'UI Designer', company_id: '2', location: 'San Francisco', salary_min: 70000, salary_max: 110000, job_type: 'Contract', work_mode: 'On-site', experience_level: 'Junior', description: 'Figma expert', status: 'active', is_featured: true, views_count: 200 },
  { id: '4', title: 'Product Manager', company_id: '3', location: 'Remote', salary_min: 100000, salary_max: 150000, job_type: 'Full-time', work_mode: 'Remote', experience_level: 'Senior', description: 'Lead product strategy', status: 'active', is_featured: false, views_count: 120 },
  { id: '5', title: 'Data Scientist', company_id: '2', location: 'Boston', salary_min: 95000, salary_max: 140000, job_type: 'Full-time', work_mode: 'Hybrid', experience_level: 'Mid-Level', description: 'Python, ML', status: 'active', is_featured: true, views_count: 80 },
  { id: '6', title: 'DevOps Engineer', company_id: '1', location: 'Remote', salary_min: 110000, salary_max: 160000, job_type: 'Full-time', work_mode: 'Remote', experience_level: 'Senior', description: 'AWS, CI/CD', status: 'active', is_featured: false, views_count: 150 }
];

export const jobService = {
  async getJobs(filters = {}) {
    let query = supabase.from('jobs').select('*, company:companies(*)', { count: 'exact' }).eq('status', 'active');
    
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);
    if (filters.job_type) query = query.eq('job_type', filters.job_type);
    if (filters.work_mode) query = query.eq('work_mode', filters.work_mode);
    if (filters.experience_level) query = query.eq('experience_level', filters.experience_level);
    if (filters.salary_min) query = query.gte('salary_max', filters.salary_min);
    if (filters.salary_max) query = query.lte('salary_min', filters.salary_max);
    if (filters.skills && filters.skills.length > 0) query = query.overlaps('skills', filters.skills);

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) {
       console.error("getJobs error", error);
       return { data: DEMO_JOBS, count: DEMO_JOBS.length, error: null };
    }
    return { data, count, error };
  },

  async getJobById(id) {
    const { data, error } = await supabase.from('jobs').select('*, company:companies(*)').eq('id', id).single();
    return { data, error };
  },

  async getJobsByRecruiter(recruiterId) {
    const { data, error } = await supabase.from('jobs').select('*, applications(count)').eq('recruiter_id', recruiterId).order('created_at', { ascending: false });
    return { data, error };
  },

  async createJob(data) {
    const { data: result, error } = await supabase.from('jobs').insert(data).select().single();
    return { data: result, error };
  },

  async updateJob(id, data) {
    const { data: result, error } = await supabase.from('jobs').update(data).eq('id', id).select().single();
    return { data: result, error };
  },

  async deleteJob(id) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    return { error };
  },

  async getFeaturedJobs() {
    const { data, error } = await supabase.from('jobs').select('*, company:companies(*)').eq('is_featured', true).eq('status', 'active').limit(6);
    if (error || !data || data.length === 0) return { data: DEMO_JOBS.filter(j => j.is_featured).slice(0, 6), error: null };
    return { data, error };
  },

  async getRecommendedJobs(skills = [], limit = 10) {
    if (!skills.length) return this.getFeaturedJobs();
    const { data, error } = await supabase.from('jobs').select('*, company:companies(*)').eq('status', 'active').overlaps('skills', skills).limit(limit);
    return { data, error };
  },

  async searchJobs(queryText) {
    const { data, error } = await supabase.from('jobs').select('*, company:companies(*)').eq('status', 'active').or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%`);
    return { data, error };
  },

  async incrementJobViews(id) {
    const { error } = await supabase.rpc('increment_job_views', { job_id: id });
    return { error };
  },

  async toggleJobStatus(id, status) {
    const { data, error } = await supabase.from('jobs').update({ status }).eq('id', id).select().single();
    return { data, error };
  }
};
