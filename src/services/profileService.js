import { supabase } from '@/supabase/client';

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId, data) {
    const { data: result, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...data, updated_at: new Date().toISOString() })
      .select()
      .single();
    return { data: result, error };
  },

  async uploadAvatar(file, userId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return { data: publicUrl, error: null };
  },

  async getExperiences(profileId) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('profile_id', profileId)
      .order('start_date', { ascending: false });
    return { data, error };
  },

  async addExperience(data) {
    const { data: result, error } = await supabase
      .from('experiences')
      .insert(data)
      .select()
      .single();
    return { data: result, error };
  },

  async updateExperience(id, data) {
    const { data: result, error } = await supabase
      .from('experiences')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return { data: result, error };
  },

  async deleteExperience(id) {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    return { error };
  },

  async getEducations(profileId) {
    const { data, error } = await supabase
      .from('educations')
      .select('*')
      .eq('profile_id', profileId)
      .order('start_year', { ascending: false });
    return { data, error };
  },

  async addEducation(data) {
    const { data: result, error } = await supabase
      .from('educations')
      .insert(data)
      .select()
      .single();
    return { data: result, error };
  },

  async updateEducation(id, data) {
    const { data: result, error } = await supabase
      .from('educations')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return { data: result, error };
  },

  async deleteEducation(id) {
    const { error } = await supabase
      .from('educations')
      .delete()
      .eq('id', id);
    return { error };
  },

  async getPublicProfile(userId) {
    const [profile, experiences, educations] = await Promise.all([
      this.getProfile(userId),
      this.getExperiences(userId),
      this.getEducations(userId)
    ]);
    
    if (profile.error) return { data: null, error: profile.error };
    
    return {
      data: {
        ...profile.data,
        experiences: experiences.data || [],
        educations: educations.data || []
      },
      error: null
    };
  },

  calcProfileScore(profile) {
    let score = 0;
    if (profile.full_name) score += 20;
    if (profile.headline) score += 10;
    if (profile.bio) score += 10;
    if (profile.avatar_url) score += 10;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.location) score += 10;
    if (profile.phone) score += 10;
    if (profile.linkedin_url || profile.github_url || profile.website) score += 10;
    return Math.min(score, 100);
  }
};
