import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import toast from 'react-hot-toast';
import GoogleAuthLoading from '@/components/effects/GoogleAuthLoading';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code in URL for a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          // Try exchanging auth code for session (PKCE flow)
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          if (code) {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) throw exchangeError;
            if (!data?.session) {
              navigate('/login');
              return;
            }
          } else {
            navigate('/login');
            return;
          }
        }

        // Get the fresh session after possible code exchange
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        if (!activeSession) {
          navigate('/login');
          return;
        }

        const userId = activeSession.user.id;
        const userMeta = activeSession.user.user_metadata;

        // Poll for profile (created by DB trigger) — up to 5 attempts
        let profile = null;
        for (let i = 0; i < 5; i++) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
          if (data) {
            profile = data;
            break;
          }
          await new Promise(r => setTimeout(r, 800));
        }

        // If trigger didn't create it, create it manually
        if (!profile) {
          const newProfile = {
            id: userId,
            full_name: userMeta?.full_name || userMeta?.name || userMeta?.email?.split('@')[0] || 'User',
            role: userMeta?.role || 'candidate',
            avatar_url: userMeta?.avatar_url || userMeta?.picture || null,
          };
          const { data: created } = await supabase
            .from('profiles')
            .upsert(newProfile, { onConflict: 'id' })
            .select()
            .maybeSingle();
          profile = created || newProfile;
        }

        toast.success('Signed in successfully!');

        // Redirect based on role
        if (profile?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (profile?.role === 'recruiter') {
          navigate('/recruiter/dashboard', { replace: true });
        } else {
          navigate('/candidate/feed', { replace: true });
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark">
      <GoogleAuthLoading />
    </div>
  );
}
