import { isConfigured } from '@/utils/helpers';
import { supabase } from '@/supabase/client';
import { storageService } from './storageService';

const DEMO_COMPANIES = [
  { id: '1', name: 'CyberDyne Systems', slug: 'cyberdyne-systems', industry: 'AI', location: 'San Francisco, CA', description: 'Advanced AI systems.' }
];

export const companyService = {
  async getCompanies(filters = {}) {
    if (!isConfigured()) return { data: DEMO_COMPANIES, error: null };
    const { data, error } = await supabase.from('companies').select('*');
    return { data, error };
  },
  async getCompanyById(id) {
    if (!isConfigured()) return { data: DEMO_COMPANIES.find(c => c.id === id) || DEMO_COMPANIES[0], error: null };
    const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
    return { data, error };
  },
  async getCompanyBySlug(slug) {
    if (!isConfigured()) return { data: DEMO_COMPANIES.find(c => c.slug === slug) || DEMO_COMPANIES[0], error: null };
    const { data, error } = await supabase.from('companies').select('*').eq('slug', slug).single();
    return { data, error };
  },
  async createCompany(data) {
    if (!isConfigured()) return { data: { ...data, id: Date.now().toString() }, error: null };
    const { data: result, error } = await supabase.from('companies').insert([data]).select().single();
    return { data: result, error };
  },
  async updateCompany(id, data) {
    if (!isConfigured()) return { data, error: null };
    const { data: result, error } = await supabase.from('companies').update(data).eq('id', id).select().single();
    return { data: result, error };
  },
  async deleteCompany(id) {
    if (!isConfigured()) return { error: null };
    const { error } = await supabase.from('companies').delete().eq('id', id);
    return { error };
  },
  async uploadCompanyLogo(companyId, file) {
    if (!isConfigured()) return { url: 'https://demo.webloom.ai/logo.png', error: null };
    const path = `${companyId}/${Date.now()}_${file.name}`;
    const { url, error } = await storageService.uploadFile('company-logos', path, file);
    if (!error && url) {
      await this.updateCompany(companyId, { logo_url: url });
    }
    return { url, error };
  },
  async getCompanyByOwner(ownerId) {
    if (!isConfigured()) return { data: DEMO_COMPANIES[0], error: null };
    const { data, error } = await supabase.from('companies').select('*').eq('owner_id', ownerId).single();
    return { data, error };
  }
};
