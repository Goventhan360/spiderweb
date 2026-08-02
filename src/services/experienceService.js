import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';

const DEMO_EXPERIENCE = [
  { id: '1', title: 'Senior AI Engineer', company: 'NeuralTech', start_date: '2020-01-01', end_date: null, description: 'Led development of LLM pipelines.' },
  { id: '2', title: 'Software Engineer', company: 'DataSystems', start_date: '2019-06-01', end_date: '2019-12-31', description: 'Backend APIs using Node.js.' }
];

export const experienceService = {
  async getExperience(profileId) {
    if (!isConfigured()) return { data: DEMO_EXPERIENCE, error: null };
    const { data, error } = await supabase.from('experience').select('*').eq('profile_id', profileId).order('start_date', { ascending: false });
    return { data, error };
  },
  async addExperience(data) {
    if (!isConfigured()) return { data: { ...data, id: Date.now().toString() }, error: null };
    const { data: result, error } = await supabase.from('experience').insert([data]).select().single();
    return { data: result, error };
  },
  async updateExperience(id, data) {
    if (!isConfigured()) return { data, error: null };
    const { data: result, error } = await supabase.from('experience').update(data).eq('id', id).select().single();
    return { data: result, error };
  },
  async deleteExperience(id) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('experience').delete().eq('id', id);
    return { error };
  }
};
