import { z } from 'zod';

/* ===== AUTH SCHEMAS ===== */

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
  role: z.enum(['candidate', 'recruiter'], { required_error: 'Please select a role' }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

/* ===== PROFILE SCHEMAS ===== */

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name is required').max(100),
  headline: z.string().max(200).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field_of_study: z.string().optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  grade: z.string().optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  is_current: z.boolean().optional(),
});

export const experienceSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  is_current: z.boolean().optional(),
  description: z.string().max(2000).optional().or(z.literal('')),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().max(2000).optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  tech_stack: z.array(z.string()).optional(),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
});

export const certificateSchema = z.object({
  title: z.string().min(1, 'Certificate title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issue_date: z.string().optional().or(z.literal('')),
  expiry_date: z.string().optional().or(z.literal('')),
  credential_id: z.string().optional().or(z.literal('')),
  credential_url: z.string().url().optional().or(z.literal('')),
});

/* ===== JOB SCHEMAS ===== */

export const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional().or(z.literal('')),
  responsibilities: z.string().optional().or(z.literal('')),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  work_mode: z.enum(['remote', 'onsite', 'hybrid']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  location: z.string().optional().or(z.literal('')),
  salary_min: z.number().min(0).optional().nullable(),
  salary_max: z.number().min(0).optional().nullable(),
  salary_currency: z.string().default('USD'),
  skills_required: z.array(z.string()).min(1, 'At least one skill is required'),
  skills_preferred: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  application_deadline: z.string().optional().or(z.literal('')),
});

/* ===== COMPANY SCHEMAS ===== */

export const companySchema = z.object({
  name: z.string().min(2, 'Company name is required').max(200),
  description: z.string().max(5000).optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  founded_year: z.number().min(1800).max(2030).optional().nullable(),
  company_size: z.string().optional().or(z.literal('')),
  culture: z.string().max(5000).optional().or(z.literal('')),
  benefits: z.array(z.string()).optional(),
  tech_stack: z.array(z.string()).optional(),
});

/* ===== MESSAGE SCHEMAS ===== */

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000),
});

/* ===== REVIEW SCHEMAS ===== */

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional().or(z.literal('')),
  pros: z.string().max(2000).optional().or(z.literal('')),
  cons: z.string().max(2000).optional().or(z.literal('')),
  review: z.string().max(5000).optional().or(z.literal('')),
  is_anonymous: z.boolean().optional(),
});
