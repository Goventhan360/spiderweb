import { supabase } from '@/supabase/client';

export const interviewService = {
  async scheduleInterview(data) {
    const { data: result, error } = await supabase
      .from('interviews')
      .insert(data)
      .select()
      .single();
    return { data: result, error };
  },

  async getInterviewsByCandidate(candidateId) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*, job:jobs(title, company:companies(name))')
      .eq('candidate_id', candidateId)
      .order('scheduled_at', { ascending: true });
    return { data, error };
  },

  async getInterviewsByRecruiter(recruiterId) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*, candidate:profiles(full_name, avatar_url), job:jobs(title)')
      .eq('recruiter_id', recruiterId)
      .order('scheduled_at', { ascending: true });
    return { data, error };
  },

  async updateInterview(id, data) {
    const { data: result, error } = await supabase
      .from('interviews')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return { data: result, error };
  },

  async cancelInterview(id) {
    const { data, error } = await supabase
      .from('interviews')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
};
