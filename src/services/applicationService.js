import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';

const DEMO_APPLICATIONS = [
  { id: '1', job_id: '1', candidate_id: 'demo-user-123', status: 'pending', notes: 'Initial submission', created_at: new Date().toISOString() }
];

export const applicationService = {
  async applyToJob(jobId, candidateId, data) {
    if (!isConfigured()) return { data: { id: Date.now().toString(), job_id: jobId, candidate_id: candidateId, status: 'pending', ...data }, error: null };
    const { data: result, error } = await supabase.from('applications').insert([{ job_id: jobId, candidate_id: candidateId, ...data }]).select().single();
    return { data: result, error };
  },
  async getApplicationsByCandidate(candidateId) {
    if (!isConfigured()) return { data: DEMO_APPLICATIONS, error: null };
    const { data, error } = await supabase.from('applications').select('*, job:jobs(*)').eq('candidate_id', candidateId);
    return { data, error };
  },
  async getApplicationsByJob(jobId) {
    if (!isConfigured()) return { data: DEMO_APPLICATIONS, error: null };
    const { data, error } = await supabase.from('applications').select('*, candidate:profiles(*)').eq('job_id', jobId);
    return { data, error };
  },
  async updateApplicationStatus(applicationId, status, notes) {
    if (!isConfigured()) return { data: { id: applicationId, status, notes }, error: null };
    const { data, error } = await supabase.from('applications').update({ status, notes }).eq('id', applicationId).select().single();
    return { data, error };
  },
  async withdrawApplication(applicationId) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('applications').delete().eq('id', applicationId);
    return { error };
  },
  async getApplicationDetails(applicationId) {
    if (!isConfigured()) return { data: DEMO_APPLICATIONS[0], error: null };
    const { data, error } = await supabase.from('applications').select('*, job:jobs(*), candidate:profiles(*)').eq('id', applicationId).single();
    return { data, error };
  }
};
