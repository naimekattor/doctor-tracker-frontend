# Doctor Tracker — Clinical Operations & Practitioner Management Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6_(Turbopack)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade healthcare management application designed for clinical administrators, medical directors, and healthcare practitioners to monitor hospital operations, track doctor workload distribution, and manage patient intake lifecycles in real time.

---

## 🌐 Live Deployment & Demo Credentials

| Resource | URL |
| :--- | :--- |
| **Live Web Application** | [https://doctor-tracker-rosy.vercel.app](https://doctor-tracker-rosy.vercel.app) |
| **Backend API Gateway** | [https://doctor-tracker-8nhc.onrender.com/api](https://doctor-tracker-8nhc.onrender.com/api) |
| **Backend Repository** | [https://github.com/naimekattor/doctor-tracker-backend](https://github.com/naimekattor/doctor-tracker-backend) |

### 🔐 Demo Credentials
- **Email:** `admin@doctortracker.com`
- **Password:** `AdminPassword123!`
- *(Or click the **"Fill Demo Admin Credentials"** button on the login screen for instant 1-click access)*

> **Note on Render Cold Start:** The backend is hosted on Render's managed tier. If idle, the initial login request may take 15–30 seconds while the server spins up. The login interface includes an automated cold-start indicator.

---

## 🩺 Core Capabilities

### 1. Clinical Analytics Dashboard
- **Real-Time KPI Cards:** Active medical staff count, admitted patient metrics, daily case allocations, and critical observation counts.
- **Time-Series Admissions Trend:** Dynamic Recharts AreaChart with chronological aggregation across `Last 7 Days`, `Last 30 Days`, and `All Time`.
- **Condition & Specialty Breakdown:** Visual distribution bars highlighting patient clinical status and doctor specializations across partner hospitals.
- **Top Doctors Leaderboard:** Case load rankings showing practitioner patient volumes with real avatar badges.
- **JSON Export Utility:** Single-click export of clinical operational metrics for administrative reporting.

### 2. Practitioner Directory (`/doctors`)
- **Doctor Profiles:** Searchable by doctor name, medical specialization (e.g., Cardiology, Neurology, Pediatrics), and hospital affiliation.
- **Date-Range Filtering:** Precision `From` and `To` date pickers to audit practitioner onboarding chronologically.
- **Doctor Detail View (`/doctors/[id]`):** Dedicated practitioner dossier showing contact credentials, hospital department, and active assigned patients.
- **Clinical Case Assignment:** Modal workflow to register new medical staff or assign patients directly to a physician's active caseload.

### 3. Patient Intake & Observation Directory (`/patients`)
- **6-State Observation Status Lifecycle:** Strict clinical state classification:
  - `Stable`
  - `Critical`
  - `Under Observation`
  - `Recovered`
  - `Chronic`
  - `Routine Checkup`
- **Dynamic Multi-Parameter Search:** Real-time search across patient names, telephone contacts, and assigned physician.
- **Date-Based Admissions Auditing:** Filter patients by exact admission dates (`startDate` and `endDate`).
- **Patient Intake Registration:** Validated modal dialog with automated doctor association and emergency contact formatting.

### 4. Human-Centered Medical Design System
- **Executive Dark Emerald & Mint Palette:** Deep forest canvas (`#0C2B24`), calm medical emerald surfaces (`#154C3F`), and soothing clinical mint (`#00D084`) engineered to eliminate optical fatigue during prolonged clinical shifts.
- **Tactile Action Buttons:** Standardized `6px` border radius (`rounded-[6px]`) with subtle depth gradients and interactive micro-animations.
- **Floating Segmented Navigation:** Bottom-anchored capsule navigation bar for rapid one-thumb switching between Home, Doctors, and Patients on mobile and tablet displays.

---

## 🛠️ Technology Stack & Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict type-checking across all API DTOs)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with custom medical color tokens and micro-animations
- **Data Fetching & State:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query) for optimistic cache updates, automatic background refetching, and query invalidation
- **Charts & Data Visualization:** [Recharts](https://recharts.org/) (ResponsiveContainer, AreaChart, Tooltip, Area)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Security:** HTTP-only cookies, JWT storage in secure context, and Next.js middleware route protection

---

## 📁 Directory Structure

```text
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/                  # Dedicated administrative sign-in view
│   ├── (dashboard)/
│   │   ├── dashboard/              # Analytics KPI cards & admissions trend chart
│   │   ├── doctors/                # Practitioner directory table & modal forms
│   │   │   └── [id]/               # Individual doctor dossier & assigned patients
│   │   ├── patients/               # Patient intake directory & status classification
│   │   └── layout.tsx              # Authenticated shell layout wrapper
│   ├── globals.css                 # Medical design tokens, utilities & theme variables
│   └── layout.tsx                  # Root layout with Font & Query/Auth providers
├── components/
│   ├── layout/
│   │   ├── DashboardShell.tsx      # Responsive desktop & mobile container
│   │   ├── FloatingNav.tsx         # Mobile segmented capsule navigation
│   │   ├── Sidebar.tsx             # Collapsible medical sidebar
│   │   └── Topbar.tsx              # Mobile hamburger & clinical header
│   └── ui/                         # Reusable atomic design components
│       ├── Badge.tsx               # 6-state clinical condition badges
│       ├── Button.tsx              # Standardized 6px tactile gradient buttons
│       ├── Card.tsx                # Clinical content containers
│       ├── Dialog.tsx              # Accessible modal dialog primitives
│       ├── Input.tsx               # Form text fields with validation states
│       ├── Pagination.tsx          # Server-driven page navigation
│       ├── Select.tsx              # Accessible select dropdowns
│       └── Table.tsx               # Responsive tabular data grid
├── features/                       # Domain-driven feature modules
│   ├── auth/                       # LoginForm & demo credential helpers
│   ├── dashboard/                  # KPI cards, AdmissionsTrendChart, TopDoctorCard
│   ├── doctors/                    # DoctorTable, DoctorModal, DoctorFilters
│   └── patients/                   # PatientTable, PatientModal, PatientFilters
├── lib/
│   ├── api/                        # Typed Axios/Fetch service endpoints
│   ├── auth/                       # Cookie management & auth session helpers
│   └── utils/                      # Tailwind class merger (cn)
├── providers/
│   ├── AuthProvider.tsx            # Global authentication context & session state
│   └── QueryProvider.tsx           # TanStack Query client & cache configuration
└── types/                          # TypeScript interfaces (Doctor, Patient, Analytics)
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root of the `frontend` directory based on [`.env.example`](.env.example):

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=https://doctor-tracker-8nhc.onrender.com/api

# For local development with a local backend:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js:** `>= 18.17.0` (Recommended: `20.x` or `22.x`)
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/naimekattor/doctor-tracker-frontend.git
cd doctor-tracker-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Type-Check
```bash
npm run build
npm run start
```

---

## 🚢 Production Deployment (Vercel)

1. Import the repository `doctor-tracker-frontend` into **[Vercel](https://vercel.com/)**.
2. Framework Preset will automatically detect **Next.js**.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://doctor-tracker-8nhc.onrender.com/api`
4. Click **Deploy**. Turbopack builds the production bundle in under 60 seconds.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
