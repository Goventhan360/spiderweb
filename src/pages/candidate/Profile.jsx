import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Briefcase, GraduationCap, MapPin, Phone, Globe, Github, Linkedin, 
  Plus, X, Edit2, Check, Upload, Trash2 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile State
  const [formData, setFormData] = useState({
    full_name: '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    github_url: '',
    linkedin_url: '',
    skills: [],
    is_available: true
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Lists state
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);

  // UI state
  const [skillInput, setSkillInput] = useState('');
  const [editingExp, setEditingExp] = useState(null);
  const [editingEdu, setEditingEdu] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Main profile
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profErr) throw profErr;

      setFormData({
        full_name: profData.full_name || '',
        headline: profData.headline || '',
        bio: profData.bio || '',
        location: profData.location || '',
        phone: profData.phone || '',
        website: profData.website || '',
        github_url: profData.github_url || '',
        linkedin_url: profData.linkedin_url || '',
        skills: profData.skills || [],
        is_available: profData.is_available ?? true
      });
      setAvatarUrl(profData.avatar_url || '');

      // Fetch experiences
      const { data: expData } = await supabase.from('experiences').select('*').eq('profile_id', user.id).order('start_date', { ascending: false });
      if (expData) setExperiences(expData);

      // Fetch education
      const { data: eduData } = await supabase.from('educations').select('*').eq('profile_id', user.id).order('start_year', { ascending: false });
      if (eduData) setEducations(eduData);

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          // basic scoring logic based on filled fields
          profile_score: calculateProfileScore(formData)
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      refreshProfile(); // update context
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const calculateProfileScore = (data) => {
    let score = 0;
    if (data.full_name) score += 10;
    if (data.headline) score += 10;
    if (data.bio) score += 20;
    if (data.location) score += 10;
    if (data.skills?.length > 0) score += 20;
    if (avatarUrl) score += 10;
    if (experiences.length > 0) score += 10;
    if (educations.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      
      setAvatarUrl(publicUrl);
      refreshProfile();
      toast.success('Avatar updated');
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Skills
  const addSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (formData.skills.includes(skillInput.trim())) {
      toast.error('Skill already added');
      return;
    }
    setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };
  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Experience Handlers
  const saveExperience = async (exp) => {
    try {
      if (exp.id) {
        await supabase.from('experiences').update(exp).eq('id', exp.id);
      } else {
        await supabase.from('experiences').insert({ ...exp, profile_id: user.id });
      }
      fetchProfileData();
      setEditingExp(null);
      toast.success('Experience saved');
    } catch (error) {
      toast.error('Failed to save experience');
    }
  };
  const deleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await supabase.from('experiences').delete().eq('id', id);
      setExperiences(prev => prev.filter(e => e.id !== id));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Education Handlers
  const saveEducation = async (edu) => {
    try {
      if (edu.id) {
        await supabase.from('educations').update(edu).eq('id', edu.id);
      } else {
        await supabase.from('educations').insert({ ...edu, profile_id: user.id });
      }
      fetchProfileData();
      setEditingEdu(null);
      toast.success('Education saved');
    } catch (error) {
      toast.error('Failed to save education');
    }
  };
  const deleteEducation = async (id) => {
    if (!window.confirm('Delete this education?')) return;
    try {
      await supabase.from('educations').delete().eq('id', id);
      setEducations(prev => prev.filter(e => e.id !== id));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const profileScore = calculateProfileScore(formData);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text">My Profile</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <span className={formData.is_available ? "text-green-500" : "text-text-muted"}>
              {formData.is_available ? 'Open to Work' : 'Not Available'}
            </span>
            <input 
              type="checkbox" 
              name="is_available" 
              checked={formData.is_available} 
              onChange={handleInputChange}
              className="sr-only" 
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${formData.is_available ? 'bg-green-500' : 'bg-surface-alt'} relative`}>
              <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_available ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
          <Button onClick={handleSaveProfile} isLoading={saving} leftIcon={<Check size={18} />}>
            Save Profile
          </Button>
        </div>
      </div>

      {/* Profile Completeness */}
      <Card className="p-6 bg-gradient-to-r from-surface to-surface-alt">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-text">Profile Completeness</span>
          <span className="font-bold text-primary">{profileScore}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-3 border border-border">
          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${profileScore}%` }}></div>
        </div>
        {profileScore < 100 && (
          <p className="text-sm text-text-muted mt-3">Complete your profile to stand out to recruiters.</p>
        )}
      </Card>

      {/* Basic Info */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar src={avatarUrl} alt="Profile" fallback={<User size={40} />} className="w-32 h-32 rounded-2xl" />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                {uploadingAvatar ? <Skeleton className="w-8 h-8 rounded-full" /> : <Upload size={24} />}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
              </label>
            </div>
            <p className="text-xs text-text-muted text-center max-w-[120px]">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
              <Input label="Headline" name="headline" value={formData.headline} onChange={handleInputChange} placeholder="e.g. Senior Frontend Engineer" />
              <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} icon={<MapPin size={16} />} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} icon={<Phone size={16} />} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">About Me (Bio)</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 rounded-lg border border-border bg-surface text-text focus:ring-2 focus:ring-primary outline-none"
                placeholder="Write a brief introduction about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-border pt-6 mt-6">
          <h3 className="text-lg font-semibold text-text mb-4">Social & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="website" value={formData.website} onChange={handleInputChange} placeholder="Personal Website" icon={<Globe size={16} />} />
            <Input name="github_url" value={formData.github_url} onChange={handleInputChange} placeholder="GitHub URL" icon={<Github size={16} />} />
            <Input name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} placeholder="LinkedIn URL" icon={<Linkedin size={16} />} />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Skills</h3>
        <form onSubmit={addSkill} className="flex gap-2 mb-4">
          <Input 
            value={skillInput} 
            onChange={(e) => setSkillInput(e.target.value)} 
            placeholder="Add a skill (e.g. React, Python)" 
            className="flex-1"
          />
          <Button type="submit" variant="secondary">Add</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-surface-alt border border-border rounded-full px-3 py-1 text-sm text-text">
              {skill}
              <button onClick={() => removeSkill(skill)} className="text-text-muted hover:text-red-500 ml-1"><X size={14} /></button>
            </div>
          ))}
          {formData.skills.length === 0 && <span className="text-text-muted text-sm">No skills added yet.</span>}
        </div>
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2"><Briefcase size={20} className="text-primary"/> Experience</h3>
          <Button variant="outline" size="sm" onClick={() => setEditingExp({})} leftIcon={<Plus size={16} />}>Add</Button>
        </div>

        {editingExp && (
          <div className="bg-surface-alt p-4 rounded-xl border border-border mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Company" value={editingExp.company || ''} onChange={(e) => setEditingExp({...editingExp, company: e.target.value})} />
              <Input label="Title" value={editingExp.title || ''} onChange={(e) => setEditingExp({...editingExp, title: e.target.value})} />
              <Input type="date" label="Start Date" value={editingExp.start_date || ''} onChange={(e) => setEditingExp({...editingExp, start_date: e.target.value})} />
              <div>
                <Input type="date" label="End Date" value={editingExp.end_date || ''} onChange={(e) => setEditingExp({...editingExp, end_date: e.target.value})} disabled={editingExp.is_current} />
                <label className="flex items-center gap-2 mt-2 text-sm text-text cursor-pointer">
                  <input type="checkbox" checked={editingExp.is_current || false} onChange={(e) => setEditingExp({...editingExp, is_current: e.target.checked, end_date: e.target.checked ? null : editingExp.end_date})} className="rounded bg-surface border-border text-primary" />
                  I currently work here
                </label>
              </div>
            </div>
            <textarea 
              placeholder="Description" 
              className="w-full p-3 rounded-lg border border-border bg-surface text-text outline-none" rows={3}
              value={editingExp.description || ''} onChange={(e) => setEditingExp({...editingExp, description: e.target.value})} 
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingExp(null)}>Cancel</Button>
              <Button size="sm" onClick={() => saveExperience(editingExp)}>Save</Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {experiences.length === 0 && !editingExp && <p className="text-text-muted text-sm text-center py-4">Add your work experience</p>}
          {experiences.map(exp => (
            <div key={exp.id} className="relative group pl-6 border-l-2 border-surface-alt pb-6 last:pb-0">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-text text-lg">{exp.title}</h4>
                  <p className="text-primary font-medium">{exp.company}</p>
                  <p className="text-sm text-text-muted mt-1">
                    {exp.start_date ? new Date(exp.start_date).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : ''} - 
                    {exp.is_current ? ' Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : '')}
                  </p>
                  {exp.description && <p className="mt-3 text-text-muted whitespace-pre-wrap">{exp.description}</p>}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingExp(exp)} className="p-2 text-text-muted hover:text-primary"><Edit2 size={16} /></button>
                  <button onClick={() => deleteExperience(exp.id)} className="p-2 text-text-muted hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2"><GraduationCap size={20} className="text-primary"/> Education</h3>
          <Button variant="outline" size="sm" onClick={() => setEditingEdu({})} leftIcon={<Plus size={16} />}>Add</Button>
        </div>

        {editingEdu && (
          <div className="bg-surface-alt p-4 rounded-xl border border-border mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Institution" value={editingEdu.institution || ''} onChange={(e) => setEditingEdu({...editingEdu, institution: e.target.value})} />
              <Input label="Degree" value={editingEdu.degree || ''} onChange={(e) => setEditingEdu({...editingEdu, degree: e.target.value})} placeholder="e.g. Bachelor of Science" />
              <Input label="Field of Study" value={editingEdu.field || ''} onChange={(e) => setEditingEdu({...editingEdu, field: e.target.value})} />
              <div className="flex gap-2">
                <Input label="Start Year" type="number" className="w-1/2" value={editingEdu.start_year || ''} onChange={(e) => setEditingEdu({...editingEdu, start_year: e.target.value})} />
                <Input label="End Year" type="number" className="w-1/2" value={editingEdu.end_year || ''} onChange={(e) => setEditingEdu({...editingEdu, end_year: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingEdu(null)}>Cancel</Button>
              <Button size="sm" onClick={() => saveEducation(editingEdu)}>Save</Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {educations.length === 0 && !editingEdu && <p className="text-text-muted text-sm text-center py-4">Add your educational background</p>}
          {educations.map(edu => (
            <div key={edu.id} className="relative group pl-6 border-l-2 border-surface-alt pb-6 last:pb-0">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-text text-lg">{edu.institution}</h4>
                  <p className="text-text-muted">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-sm text-text-muted mt-1">{edu.start_year} - {edu.end_year || 'Present'}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingEdu(edu)} className="p-2 text-text-muted hover:text-primary"><Edit2 size={16} /></button>
                  <button onClick={() => deleteEducation(edu.id)} className="p-2 text-text-muted hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Mobile save button floating at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden">
        <Button onClick={handleSaveProfile} isLoading={saving} className="shadow-lg shadow-primary/25 rounded-full px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
