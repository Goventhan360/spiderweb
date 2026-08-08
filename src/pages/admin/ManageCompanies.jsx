import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { Search, BadgeCheck, XCircle, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*, owner:profiles!owner_id(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (comp) => {
    try {
      const { error } = await supabase.from('companies').update({ is_verified: !comp.is_verified }).eq('id', comp.id);
      if (error) throw error;
      setCompanies(companies.map(c => c.id === comp.id ? { ...c, is_verified: !comp.is_verified } : c));
      toast.success(comp.is_verified ? 'Company unverified' : 'Company verified');
    } catch (err) {
      toast.error('Verification update failed');
    }
  };

  const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-text mb-6">Manage Companies</h1>
      
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-dark border-b border-border text-text-muted text-sm">
              <tr>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Industry</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium">Verified</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Loading...</td></tr>
              ) : filteredCompanies.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-dark/50">
                  <td className="p-4 flex items-center gap-3">
                    {c.logo_url ? <img src={c.logo_url} className="w-10 h-10 rounded border border-border object-cover"/> : <div className="w-10 h-10 rounded bg-dark border border-border flex items-center justify-center text-text-muted"><Building2 size={20}/></div>}
                    <div>
                      <p className="font-medium text-text">{c.name}</p>
                      <p className="text-xs text-text-muted">{c.location}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text">{c.industry || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-muted">{c.owner?.full_name}</td>
                  <td className="p-4">
                    {c.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-500">
                        <BadgeCheck size={12}/> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleVerification(c)} 
                      className={`text-sm px-3 py-1 rounded border ${c.is_verified ? 'border-border text-text-muted hover:text-text' : 'border-blue-500 text-blue-500 hover:bg-blue-500/10'}`}
                    >
                      {c.is_verified ? 'Remove Verification' : 'Verify Company'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
