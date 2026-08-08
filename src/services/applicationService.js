import { supabase } from '@/supabase/client';

export const applicationService = {
  async apply({ job_id, candidate_id, cover_letter }) {
    const { data, error } = await supabase
      .from('applications')
      .insert({ job_id, candidate_id, cover_letter })
      .select()
      .single();
    return { data, error };
  },

  async getByCandidate(candidateId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, job:jobs(*, company:companies(*))')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getByJob(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, candidate:profiles(*)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getByRecruiter(recruiterId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, job:jobs!inner(*), candidate:profiles(*)')
      .eq('job.recruiter_id', recruiterId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .select()
      .single();
    return { data, error };
  },

  async getStats(userId, role) {
    try {
      let query = supabase.from('applications').select('status');
      
      if (role === 'recruiter') {
        query = query.eq('job.recruiter_id', userId).innerJoin('jobs', 'job_id', 'id');
      } else {
        query = query.eq('candidate_id', userId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const stats = { total: 0, pending: 0, interviews: 0, offers: 0 };
      data.forEach(app => {
        stats.total++;
        if (app.status === 'Applied' || app.status === 'Screening') stats.pending++;
        if (app.status === 'Interview') stats.interviews++;
        if (app.status === 'Offered') stats.offers++;
      });
      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async withdraw(applicationId, candidateId) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .match({ id: applicationId, candidate_id: candidateId });
    return { error };
  },

  async hasApplied(jobId, candidateId) {
    const { count, error } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .match({ job_id: jobId, candidate_id: candidateId });
    return { data: count > 0, error };
  }
};
