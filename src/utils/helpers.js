import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return isValid(date) ? format(date, formatStr) : '';
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '';
};

/**
 * Format salary range
 */
export const formatSalary = (min, max, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `${formatter.format(min)}+`;
  if (max) return `Up to ${formatter.format(max)}`;
  return 'Competitive';
};

/**
 * Format large numbers (e.g., 12500 -> "12.5K")
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
  return num?.toString() || '0';
};

/**
 * Truncate text to a max length
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generate initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Generate a slug from text
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate a color from a string (for avatars)
 */
export const stringToColor = (str) => {
  if (!str) return '#7C3AED';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#7C3AED', '#2563EB', '#22D3EE', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Calculate profile completion percentage
 */
export const calculateProfileScore = (profile) => {
  if (!profile) return 0;
  const fields = [
    'full_name', 'bio', 'headline', 'location', 'phone',
    'avatar_url', 'resume_url', 'skills', 'github_url', 'linkedin_url',
  ];
  const filled = fields.filter((field) => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    return value && value.trim?.() !== '';
  });
  return Math.round((filled.length / fields.length) * 100);
};

/**
 * Debounce function
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Classnames helper (simple cn alternative)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get status badge styling
 */
export const getStatusStyle = (status) => {
  const styles = {
    applied: 'bg-secondary/20 text-secondary-light border-secondary/30',
    screening: 'bg-warning/20 text-warning border-warning/30',
    interview: 'bg-accent/20 text-accent border-accent/30',
    offered: 'bg-success/20 text-success border-success/30',
    accepted: 'bg-success/20 text-success-light border-success/30',
    rejected: 'bg-danger/20 text-danger border-danger/30',
    withdrawn: 'bg-card-lighter/40 text-text-muted border-border-light',
    scheduled: 'bg-accent/20 text-accent border-accent/30',
    completed: 'bg-success/20 text-success border-success/30',
    cancelled: 'bg-danger/20 text-danger border-danger/30',
    active: 'bg-success/20 text-success border-success/30',
    inactive: 'bg-card-lighter/40 text-text-muted border-border-light',
  };
  return styles[status] || styles.applied;
};

/**
 * Extract file extension from URL or filename
 */
export const getFileExtension = (filename) => {
  return filename?.split('.').pop()?.toLowerCase() || '';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if Supabase is properly configured
 */
export const isConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && !url.includes('placeholder') && !key.includes('placeholder');
};
