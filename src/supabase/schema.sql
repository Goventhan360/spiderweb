/* ===== SPIDERWEB AI — COMPLETE DATABASE SCHEMA ===== */
/* Run this SQL in your Supabase SQL Editor */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== ENUMS =====
CREATE TYPE user_role AS ENUM ('candidate', 'recruiter', 'admin');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship', 'freelance');
CREATE TYPE work_mode AS ENUM ('remote', 'onsite', 'hybrid');
CREATE TYPE application_status AS ENUM ('applied', 'screening', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE experience_level AS ENUM ('entry', 'mid', 'senior', 'lead', 'executive');
CREATE TYPE notification_type AS ENUM ('resume_viewed', 'interview_scheduled', 'application_accepted', 'application_rejected', 'new_job_match', 'new_message', 'general');

-- ===== PROFILES TABLE =====
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'candidate',
  avatar_url TEXT,
  bio TEXT,
  headline TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  skills TEXT[] DEFAULT '{}',
  profile_score INTEGER DEFAULT 0,
  resume_score INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== COMPANIES TABLE =====
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  description TEXT,
  industry TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  founded_year INTEGER,
  company_size TEXT,
  culture TEXT,
  benefits TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  employee_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== JOBS TABLE =====
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  recruiter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  job_type job_type NOT NULL DEFAULT 'full-time',
  work_mode work_mode NOT NULL DEFAULT 'onsite',
  experience_level experience_level NOT NULL DEFAULT 'mid',
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  skills_required TEXT[] DEFAULT '{}',
  skills_preferred TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  application_deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== APPLICATIONS TABLE =====
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'applied',
  cover_letter TEXT,
  resume_url TEXT,
  ai_match_score INTEGER DEFAULT 0,
  ai_ranking INTEGER,
  recruiter_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- ===== EDUCATION TABLE =====
CREATE TABLE education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  grade TEXT,
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== EXPERIENCE TABLE =====
CREATE TABLE experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== PROJECTS TABLE =====
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  github_url TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SKILLS TABLE =====
CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  level TEXT DEFAULT 'intermediate',
  years_of_experience INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== CERTIFICATES TABLE =====
CREATE TABLE certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SAVED JOBS TABLE =====
CREATE TABLE saved_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- ===== MESSAGES TABLE =====
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== NOTIFICATIONS TABLE =====
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INTERVIEWS TABLE =====
CREATE TABLE interviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  interviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== COMPANY REVIEWS TABLE =====
CREATE TABLE company_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  pros TEXT,
  cons TEXT,
  review TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_skills ON jobs USING GIN(skills_required);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);

-- ===== ROW LEVEL SECURITY =====

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies: public read, owner write
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Company owners can update" ON companies FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Recruiters can create companies" ON companies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Company owners can delete" ON companies FOR DELETE USING (auth.uid() = owner_id);

-- Jobs: public read (active), recruiter write
CREATE POLICY "Active jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Recruiters can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = recruiter_id);

-- Applications: candidate + recruiter access
CREATE POLICY "Candidates can view own applications" ON applications FOR SELECT USING (auth.uid() = candidate_id OR auth.uid() IN (SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id));
CREATE POLICY "Candidates can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);
CREATE POLICY "Application stakeholders can update" ON applications FOR UPDATE USING (auth.uid() = candidate_id OR auth.uid() IN (SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id));

-- Education, Experience, Projects, Skills, Certificates: own read/write, public read
CREATE POLICY "Education viewable by everyone" ON education FOR SELECT USING (true);
CREATE POLICY "Users can manage own education" ON education FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Experience viewable by everyone" ON experience FOR SELECT USING (true);
CREATE POLICY "Users can manage own experience" ON experience FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Projects viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Skills viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON skills FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Certificates viewable by everyone" ON certificates FOR SELECT USING (true);
CREATE POLICY "Users can manage own certificates" ON certificates FOR ALL USING (auth.uid() = profile_id);

-- Saved Jobs: own access only
CREATE POLICY "Users can view own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Messages: sender + receiver access
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Notifications: own access only
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Interviews: participant access
CREATE POLICY "Participants can view interviews" ON interviews FOR SELECT USING (auth.uid() = interviewer_id OR auth.uid() = candidate_id);
CREATE POLICY "Interviewers can manage interviews" ON interviews FOR ALL USING (auth.uid() = interviewer_id);

-- Company Reviews: public read, own write
CREATE POLICY "Reviews viewable by everyone" ON company_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON company_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON company_reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- ===== FUNCTIONS =====

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment application count
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_created
  AFTER INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION increment_application_count();

-- ===== STORAGE BUCKETS =====
-- Run in Supabase dashboard or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', false);

-- ===== SEED DATA =====

-- Sample companies (use after creating recruiter profiles)
-- INSERT INTO companies (owner_id, name, slug, description, industry, location, company_size, founded_year, tech_stack, benefits) VALUES
-- ('recruiter-uuid', 'NexaTech Labs', 'nexatech-labs', 'Building the future of AI-powered developer tools.', 'Technology', 'San Francisco, CA', '50-200', 2020, ARRAY['React', 'Node.js', 'Python', 'AWS'], ARRAY['Remote Work', 'Health Insurance', 'Stock Options', 'Unlimited PTO']),
-- ('recruiter-uuid', 'Quantum Systems', 'quantum-systems', 'Enterprise quantum computing solutions.', 'Deep Tech', 'Boston, MA', '200-500', 2018, ARRAY['Python', 'Rust', 'Kubernetes', 'GCP'], ARRAY['Flexible Hours', '401k Match', 'Learning Budget', 'Gym Membership']);
