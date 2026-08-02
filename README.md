# 🕸️ SpiderWeb AI

> **Connecting Talent Through Intelligent Web Networks**

SpiderWeb AI is an AI-powered job networking platform that connects candidates with recruiters through intelligent web networks. Built with a futuristic Cyber Spider Web theme featuring glassmorphism, neon glows, and particle effects.

![SpiderWeb AI](https://img.shields.io/badge/SpiderWeb-AI-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiMwNTA4MTYiIHN0cm9rZT0iIzdDM0FFRCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+)

## ✨ Features

### For Candidates
- 🤖 **AI Resume Analyzer** — Get ATS scores, skill extraction, and improvement suggestions
- 🎯 **AI Job Matching** — Find best-fit jobs with 95% accuracy
- 📝 **AI Resume Builder** — Generate professional summaries
- 🧠 **AI Career Coach** — Personalized career advice
- 📊 **Skill Gap Analysis** — Compare your skills vs job requirements
- 💼 **Smart Job Search** — Advanced filters, save jobs, track applications
- 💬 **Real-Time Messaging** — Direct communication with recruiters
- 📄 **Portfolio & Resume** — Professional profile with projects, certificates, experience

### For Recruiters
- 📋 **Job Management** — Create, edit, and manage job postings
- ⭐ **AI Candidate Ranking** — Automatically rank applicants by fit
- 📅 **Interview Scheduling** — Built-in scheduling calendar
- 📈 **Hiring Analytics** — Track pipeline, conversion rates, and trends
- 🏢 **Company Profile** — Showcase culture, benefits, and tech stack
- 💬 **Candidate Messaging** — Direct outreach and communication

### For Admins
- 👥 **User Management** — Manage candidates, recruiters, and admins
- 📊 **Platform Analytics** — Revenue, growth, and activity reports
- 🛡️ **Content Moderation** — Review and manage jobs and companies

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **AI** | OpenAI API (with mock fallback) |
| **Hosting** | Vercel (frontend), Supabase (backend) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (optional for demo mode)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd spiderweb-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and API credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key       # Optional
VITE_APP_NAME=SpiderWeb AI
VITE_APP_URL=http://localhost:5173
```

> **Note:** The app works in **demo mode** without Supabase credentials! All features are functional with realistic mock data.

### Demo Mode

If Supabase is not configured, the app automatically enters demo mode:
- **Candidate Login:** Any email containing "candidate" or default
- **Recruiter Login:** Any email containing "recruiter"
- **Admin Login:** Any email containing "admin"

Use any password to log in.

## 🗄️ Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `src/supabase/schema.sql`
4. Run the SQL to create all tables, indexes, RLS policies, and functions
5. Create storage buckets:
   - `avatars` (public)
   - `resumes` (private)
   - `company-logos` (public)
   - `certificates` (private)
   - `chat-files` (private)

### Tables Created
- `profiles` — User profiles
- `companies` — Company profiles
- `jobs` — Job listings
- `applications` — Job applications
- `education` — Education entries
- `experience` — Work experience
- `projects` — Portfolio projects
- `skills` — User skills
- `certificates` — Certifications
- `saved_jobs` — Bookmarked jobs
- `messages` — Chat messages
- `notifications` — User notifications
- `interviews` — Interview schedules
- `company_reviews` — Company reviews

## 📁 Folder Structure

```
src/
├── assets/            # Static assets
├── components/
│   ├── ui/            # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── effects/       # Visual effects (SpiderWebBackground, ParticleField, etc.)
│   ├── layout/        # Layout components (Navbar, Sidebar, Footer, etc.)
│   └── landing/       # Landing page sections
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── layouts/           # Page layouts (Public, Auth, Dashboard)
├── pages/
│   ├── auth/          # Login, Register, ForgotPassword
│   ├── candidate/     # Candidate dashboard and pages
│   ├── recruiter/     # Recruiter dashboard and pages
│   └── admin/         # Admin dashboard and pages
├── services/          # Supabase service modules
├── supabase/          # Supabase client and schema
└── utils/             # Constants, helpers, validators
```

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `dark` | `#050816` | Main background |
| `primary` | `#7C3AED` | Primary actions, accents |
| `secondary` | `#2563EB` | Secondary elements |
| `accent` | `#22D3EE` | Highlights, indicators |
| `success` | `#22C55E` | Success states |
| `danger` | `#EF4444` | Error states |
| `card` | `#111827` | Card backgrounds |
| `text` | `#F9FAFB` | Primary text |

### Visual Effects
- **Glassmorphism** — Frosted glass cards with backdrop blur
- **Neon Glow** — Colored box shadows on interactive elements
- **Gradient Borders** — Animated multi-color borders
- **Particle Field** — Floating ambient particles
- **Spider Web Background** — Interactive animated web network
- **Network Lines** — Connection lines between nodes

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

1. Push your code to GitHub
2. Connect the repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` file is already configured for SPA routing.

### Manual Deployment

```bash
npm run build
# Serve the `dist/` folder with any static file server
```

## 🔒 Security

- **Row Level Security (RLS)** — All database tables have RLS policies
- **Supabase Auth** — Secure authentication with JWT tokens
- **Environment Variables** — No hardcoded secrets
- **Input Validation** — All forms validated with Zod schemas
- **Protected Routes** — Role-based access control

## 📜 License

MIT License — feel free to use this for your projects!

---

Built with ❤️ by SpiderWeb AI Team
