import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';

const DEMO_EDUCATION = [
  { id: '1', degree: 'B.S. Computer Science', institution: 'MIT', start_date: '2015-09-01', end_date: '2019-05-30', description: 'Focus on AI and ML' }
];

export const educationService = {
  async getEducation(profileId) {
    if (!isConfigured()) return { data: DEMO_EDUCATION, error: null };
    const { data, error } = await supabase.from('education').select('*').eq('profile_id', profileId).order('end_date', { ascending: false });
    return { data, error };
  },
  async addEducation(data) {
    if (!isConfigured()) return { data: { ...data, id: Date.now().toString() }, error: null };
    const { data: result, error } = await supabase.from('education').insert([data]).select().single();
    return { data: result, error };
  },
  async updateEducation(id, data) {
    if (!isConfigured()) return { data, error: null };
    const { data: result, error } = await supabase.from('education').update(data).eq('id', id).select().single();
    return { data: result, error };
  },
  async deleteEducation(id) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('education').delete().eq('id', id);
    return { error };
  }
};
