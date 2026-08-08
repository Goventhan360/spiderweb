import { supabase } from '@/supabase/client';

export const companyService = {
  async getCompanyByOwner(ownerId) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    return { data, error };
  },

  async getCompanyById(id) {
    const { data, error } = await supabase
      .from('companies')
      .select('*, owner:profiles(*)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async createCompany(data) {
    const { data: result, error } = await supabase
      .from('companies')
      .insert(data)
      .select()
      .single();
    return { data: result, error };
  },

  async updateCompany(id, data) {
    const { data: result, error } = await supabase
      .from('companies')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return { data: result, error };
  },

  async getAllCompanies(filters = {}) {
    let query = supabase.from('companies').select('*', { count: 'exact' });
    
    if (filters.search) query = query.ilike('name', `%${filters.search}%`);
    if (filters.industry) query = query.eq('industry', filters.industry);
    
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    return { data, count, error };
  },

  async getCompanyJobs(companyId) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async uploadLogo(file, companyId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${companyId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  }
};
