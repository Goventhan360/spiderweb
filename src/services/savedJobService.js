import { supabase } from '@/supabase/client';

export const savedJobService = {
  async saveJob(userId, jobId) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({ user_id: userId, job_id: jobId })
      .select()
      .single();
    return { data, error };
  },

  async unsaveJob(userId, jobId) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .match({ user_id: userId, job_id: jobId });
    return { error };
  },

  async getSavedJobs(userId) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*, job:jobs(*, company:companies(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async isSaved(userId, jobId) {
    const { count, error } = await supabase
      .from('saved_jobs')
      .select('id', { count: 'exact', head: true })
      .match({ user_id: userId, job_id: jobId });
    return { data: count > 0, error };
  }
};
