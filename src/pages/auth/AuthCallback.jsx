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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
          navigate('/login');
          return;
        }

        // Wait a bit and poll for profile creation (trigger)
        let profile = null;
        let retries = 5;
        while (retries > 0 && !profile) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (data) {
            profile = data;
            break;
          }
          await new Promise(r => setTimeout(r, 1000));
          retries--;
        }

        if (!profile) {
          throw new Error("Could not load user profile.");
        }

        if (profile.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (profile.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/candidate/feed');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
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
