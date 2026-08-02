-- Webloom AI PostgreSQL Database Schema & Migration Script
-- Run this script in the Supabase SQL Editor to initialize all tables and policies.

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('candidate', 'recruiter', 'admin')) DEFAULT 'candidate',
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  website TEXT,
  skills TEXT[] DEFAULT '{}',
  profile_score INT DEFAULT 80,
  resume_score INT DEFAULT 75,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  website TEXT,
  description TEXT,
  culture TEXT,
  benefits TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INT,
  salary_max INT,
  job_type TEXT NOT NULL,
  work_mode TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'inactive', 'closed')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Applied', 'Screening', 'Interview', 'Offered', 'Rejected')) DEFAULT 'Applied',
  match_score INT DEFAULT 85,
  cover_letter TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);

-- User Write Policies
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage applications" ON public.applications FOR ALL USING (auth.uid() = candidate_id);
CREATE POLICY "Recruiters manage jobs" ON public.jobs FOR ALL USING (auth.uid() = recruiter_id);
CREATE POLICY "Users read own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
