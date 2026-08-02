import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ROLES } from '@/utils/constants';

/* Layout imports */
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

/* Loading fallback */
const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-glow" />
        <div className="absolute inset-2 rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-secondary/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        <div className="absolute inset-[26px] rounded-full bg-primary/60" />
      </div>
      <p className="text-text-secondary text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

/* Lazy-loaded pages */
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/auth/Login'));
const RecruiterLogin = lazy(() => import('@/pages/auth/RecruiterLogin'));
const AdminLogin = lazy(() => import('@/pages/auth/AdminLogin'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

const CandidateDashboard = lazy(() => import('@/pages/candidate/CandidateDashboard'));
const Profile = lazy(() => import('@/pages/candidate/Profile'));
const JobSearch = lazy(() => import('@/pages/candidate/JobSearch'));
const JobDetail = lazy(() => import('@/pages/candidate/JobDetail'));
const SavedJobs = lazy(() => import('@/pages/candidate/SavedJobs'));
const Applications = lazy(() => import('@/pages/candidate/Applications'));
const CandidateMessages = lazy(() => import('@/pages/candidate/Messages'));
const Notifications = lazy(() => import('@/pages/candidate/Notifications'));
const Settings = lazy(() => import('@/pages/candidate/Settings'));
const AITools = lazy(() => import('@/pages/candidate/AITools'));
const HomeFeed = lazy(() => import('@/pages/candidate/HomeFeed'));
const Network = lazy(() => import('@/pages/candidate/Network'));
const CompaniesHub = lazy(() => import('@/pages/candidate/CompaniesHub'));
const LearningHub = lazy(() => import('@/pages/candidate/LearningHub'));
const ResumeStudio = lazy(() => import('@/pages/candidate/ResumeStudio'));
const Internships = lazy(() => import('@/pages/candidate/Internships'));
const Events = lazy(() => import('@/pages/candidate/Events'));
const CandidateAnalytics = lazy(() => import('@/pages/candidate/CandidateAnalytics'));

const RecruiterDashboard = lazy(() => import('@/pages/recruiter/RecruiterDashboard'));
const CompanyProfile = lazy(() => import('@/pages/recruiter/CompanyProfile'));
const CreateJob = lazy(() => import('@/pages/recruiter/CreateJob'));
const ManageJobs = lazy(() => import('@/pages/recruiter/ManageJobs'));
const Applicants = lazy(() => import('@/pages/recruiter/Applicants'));
const ApplicantDetail = lazy(() => import('@/pages/recruiter/ApplicantDetail'));
const InterviewSchedule = lazy(() => import('@/pages/recruiter/InterviewSchedule'));
const RecruiterMessages = lazy(() => import('@/pages/recruiter/RecruiterMessages'));
const Analytics = lazy(() => import('@/pages/recruiter/Analytics'));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));
const AdminManageJobs = lazy(() => import('@/pages/admin/ManageJobs'));
const ManageCompanies = lazy(() => import('@/pages/admin/ManageCompanies'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

const CompanyPage = lazy(() => import('@/pages/CompanyPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Contact = lazy(() => import('@/pages/Contact'));

/* Protected Route Component */
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified and role is known, enforce it
  // If role is null (profile not yet loaded or no role set), allow through as candidate
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const dashboardMap = {
      [ROLES.CANDIDATE]: '/candidate/feed',
      [ROLES.RECRUITER]: '/recruiter/dashboard',
      [ROLES.ADMIN]: '/admin/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/candidate/feed'} replace />;
  }

  return children;
}

/* Public Route — redirect authenticated users to their dashboard */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (isAuthenticated) {
    const dashboardMap = {
      [ROLES.CANDIDATE]: '/candidate/feed',
      [ROLES.RECRUITER]: '/recruiter/dashboard',
      [ROLES.ADMIN]: '/admin/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/candidate/feed'} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/company/:id" element={<CompanyPage />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/recruiter/login" element={<PublicOnlyRoute><RecruiterLogin /></PublicOnlyRoute>} />
          <Route path="/admin/login" element={<PublicOnlyRoute><AdminLogin /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        </Route>

        {/* Candidate Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
            <DashboardLayout role={ROLES.CANDIDATE} />
          </ProtectedRoute>
        }>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/feed" element={<HomeFeed />} />
          <Route path="/candidate/network" element={<Network />} />
          <Route path="/candidate/companies" element={<CompaniesHub />} />
          <Route path="/candidate/learning" element={<LearningHub />} />
          <Route path="/candidate/resume-studio" element={<ResumeStudio />} />
          <Route path="/candidate/internships" element={<Internships />} />
          <Route path="/candidate/events" element={<Events />} />
          <Route path="/candidate/analytics" element={<CandidateAnalytics />} />
          <Route path="/candidate/profile" element={<Profile />} />
          <Route path="/candidate/jobs" element={<JobSearch />} />
          <Route path="/candidate/jobs/:id" element={<JobDetail />} />
          <Route path="/candidate/saved" element={<SavedJobs />} />
          <Route path="/candidate/applications" element={<Applications />} />
          <Route path="/candidate/messages" element={<CandidateMessages />} />
          <Route path="/candidate/notifications" element={<Notifications />} />
          <Route path="/candidate/settings" element={<Settings />} />
          <Route path="/candidate/ai-tools" element={<AITools />} />
        </Route>

        {/* Recruiter Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
            <DashboardLayout role={ROLES.RECRUITER} />
          </ProtectedRoute>
        }>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/company" element={<CompanyProfile />} />
          <Route path="/recruiter/jobs/new" element={<CreateJob />} />
          <Route path="/recruiter/jobs/:id/edit" element={<CreateJob />} />
          <Route path="/recruiter/jobs" element={<ManageJobs />} />
          <Route path="/recruiter/applicants" element={<Applicants />} />
          <Route path="/recruiter/applicants/:id" element={<ApplicantDetail />} />
          <Route path="/recruiter/interviews" element={<InterviewSchedule />} />
          <Route path="/recruiter/messages" element={<RecruiterMessages />} />
          <Route path="/recruiter/analytics" element={<Analytics />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout role={ROLES.ADMIN} />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/jobs" element={<AdminManageJobs />} />
          <Route path="/admin/companies" element={<ManageCompanies />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-surface border border-border p-8 rounded-[8px] space-y-4">
            <h2 className="text-2xl serif font-bold text-text">Something went wrong</h2>
            <p className="text-text-secondary text-sm">An unexpected UI error occurred. Don't worry, your data is safe.</p>
            <div className="flex gap-3 justify-center pt-2">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-[4px] cursor-pointer"
              >
                Reload Page
              </button>
              <a 
                href="/" 
                className="px-4 py-2 border border-border text-text text-sm font-semibold rounded-[4px]"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SearchProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#111827',
                  color: '#F9FAFB',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '12px',
                },
              }}
            />
          </SearchProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
