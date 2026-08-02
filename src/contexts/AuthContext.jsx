import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/supabase/client';
import { ROLES } from '@/utils/constants';

const AuthContext = createContext(null);

/* Demo user for when Supabase is not configured */
const DEMO_USERS = {
  candidate: {
    id: 'demo-candidate-001',
    email: 'candidate@demo.webloom.ai',
    full_name: 'Alex Morgan',
    role: 'candidate',
    avatar_url: null,
    headline: 'Full Stack Developer | React & Node.js',
    bio: 'Passionate developer with 5 years of experience building scalable web applications.',
    location: 'San Francisco, CA',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS'],
    profile_score: 85,
    resume_score: 78,
    is_available: true,
    phone: '+1 (555) 123-4567',
    github_url: 'https://github.com/alexmorgan',
    linkedin_url: 'https://linkedin.com/in/alexmorgan',
    website: 'https://alexmorgan.dev',
  },
  recruiter: {
    id: 'demo-recruiter-001',
    email: 'recruiter@demo.webloom.ai',
    full_name: 'Sarah Chen',
    role: 'recruiter',
    avatar_url: null,
    headline: 'Senior Tech Recruiter at NexaTech Labs',
    bio: 'Helping top talent find their dream roles in tech.',
    location: 'New York, NY',
    skills: [],
    profile_score: 92,
    is_available: true,
  },
  admin: {
    id: 'demo-admin-001',
    email: 'admin@demo.webloom.ai',
    full_name: 'Jordan Blake',
    role: 'admin',
    avatar_url: null,
    headline: 'Platform Administrator',
    bio: 'Managing Webloom AI platform operations.',
    location: 'Austin, TX',
    skills: [],
    profile_score: 100,
    is_available: true,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const configured = isSupabaseConfigured();

  // Cache if profiles table is missing in Supabase DB
  const tableMissingRef = useRef(false);

  /* Fetch user profile from Supabase */
  const fetchProfile = useCallback(async (userId, userMeta) => {
    const defaultProfile = {
      id: userId,
      full_name: userMeta?.full_name || userMeta?.name || userMeta?.email?.split('@')[0] || 'User',
      role: userMeta?.role || 'candidate',
      avatar_url: userMeta?.avatar_url || userMeta?.picture || null,
      email: userMeta?.email || '',
      created_at: new Date().toISOString(),
    };

    if (tableMissingRef.current) {
      setProfile(defaultProfile);
      return defaultProfile;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('Could not find the table')) {
          tableMissingRef.current = true;
        }
        setProfile(defaultProfile);
        return defaultProfile;
      }

      if (data) {
        setProfile(data);
        return data;
      }

      // No profile row yet — try upserting if table exists
      const { error: upsertErr } = await supabase.from('profiles').upsert(defaultProfile, { onConflict: 'id' });
      if (upsertErr && (upsertErr.code === 'PGRST301' || upsertErr.message?.includes('Could not find the table'))) {
        tableMissingRef.current = true;
      }

      setProfile(defaultProfile);
      return defaultProfile;
    } catch {
      tableMissingRef.current = true;
      setProfile(defaultProfile);
      return defaultProfile;
    }
  }, []);

  /* Switch role helper */
  const switchRole = useCallback((newRole) => {
    localStorage.setItem('webloom_demo_role', newRole);
    const demoUser = DEMO_USERS[newRole] || { ...DEMO_USERS.candidate, role: newRole };
    setUser(demoUser);
    setProfile(demoUser);
    setIsDemo(true);
    return demoUser;
  }, []);

  /* Initialize auth state */
  useEffect(() => {
    const demoRole = localStorage.getItem('webloom_demo_role') || localStorage.getItem('spiderweb_demo_role');

    if (!configured) {
      const activeRole = demoRole && DEMO_USERS[demoRole] ? demoRole : 'candidate';
      setUser(DEMO_USERS[activeRole]);
      setProfile(DEMO_USERS[activeRole]);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    /* Real Supabase auth with demo role fallback */
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession?.user) {
          setUser(currentSession.user);
          await fetchProfile(currentSession.user.id, currentSession.user.user_metadata);
        } else {
          // If no Supabase auth session, load active demo role (default candidate)
          const activeRole = demoRole && DEMO_USERS[demoRole] ? demoRole : 'candidate';
          setUser(DEMO_USERS[activeRole]);
          setProfile(DEMO_USERS[activeRole]);
          setIsDemo(true);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setUser(newSession.user);
        await fetchProfile(newSession.user.id, newSession.user.user_metadata);
      } else {
        const activeRole = localStorage.getItem('webloom_demo_role') || localStorage.getItem('spiderweb_demo_role') || 'candidate';
        if (DEMO_USERS[activeRole]) {
          setUser(DEMO_USERS[activeRole]);
          setProfile(DEMO_USERS[activeRole]);
          setIsDemo(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [configured, fetchProfile]);

  /* Sign up with email and password */
  const signUp = useCallback(async ({ email, password, full_name, role }) => {
    if (!configured) {
      /* Demo sign up */
      const demoUser = { ...DEMO_USERS[role] || DEMO_USERS.candidate, email, full_name, role };
      setUser(demoUser);
      setProfile(demoUser);
      setIsDemo(true);
      localStorage.setItem('webloom_demo_role', role);
      return { user: demoUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role },
      },
    });

    if (!error && data.user) {
      /* Update profile with role */
      await supabase.from('profiles').update({ role, full_name }).eq('id', data.user.id);
    }

    return { user: data?.user, error };
  }, [configured]);

  /* Sign in with email and password */
  const signIn = useCallback(async ({ email, password }) => {
    if (!configured) {
      /* Demo sign in — determine role from email */
      let role = 'candidate';
      if (email.includes('recruiter')) role = 'recruiter';
      if (email.includes('admin')) role = 'admin';
      const demoUser = DEMO_USERS[role];
      setUser(demoUser);
      setProfile(demoUser);
      setIsDemo(true);
      localStorage.setItem('webloom_demo_role', role);
      return { user: demoUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data?.user, error };
  }, [configured]);

  /* Sign in with Google */
  const signInWithGoogle = useCallback(async () => {
    if (!configured) {
      const demoUser = DEMO_USERS.candidate;
      localStorage.setItem('webloom_demo_role', 'candidate');
      return { user: demoUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/candidate/feed`,
      },
    });
    return { data, error };
  }, [configured]);

  /* Sign out */
  const signOut = useCallback(async () => {
    if (!configured || isDemo) {
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsDemo(false);
      localStorage.removeItem('webloom_demo_role');
      localStorage.removeItem('spiderweb_demo_role');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, [configured, isDemo]);

  /* Reset password */
  const resetPassword = useCallback(async (email) => {
    if (!configured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  }, [configured]);

  /* Update profile */
  const updateProfile = useCallback(async (updates) => {
    if (!configured || isDemo || tableMissingRef.current) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      setUser((prev) => ({ ...prev, ...updates }));
      return { data: updated, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('Could not find the table')) {
          tableMissingRef.current = true;
        }
        const updated = { ...profile, ...updates };
        setProfile(updated);
        setUser((prev) => ({ ...prev, ...updates }));
        return { data: updated, error: null };
      }

      const updated = data || { ...profile, ...updates };
      setProfile(updated);
      return { data: updated, error: null };
    } catch {
      tableMissingRef.current = true;
      const updated = { ...profile, ...updates };
      setProfile(updated);
      return { data: updated, error: null };
    }
  }, [configured, isDemo, profile, user]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    isDemo,
    isAuthenticated: !!user,
    role: profile?.role || user?.user_metadata?.role || null,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    fetchProfile,
    switchRole,
  }), [user, profile, session, loading, isDemo, signUp, signIn, signInWithGoogle, signOut, resetPassword, updateProfile, fetchProfile, switchRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
