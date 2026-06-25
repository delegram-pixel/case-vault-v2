Here's your prompt. Copy and paste this into your IDE's AI assistant (Cursor, Copilot, etc.):

---

> **"Build a complete web-based court case management system called Case Vault from scratch with the following specifications:**
>
> **Tech Stack:**
> - Next.js 14 (App Router)
> - TypeScript
> - Tailwind CSS v4
> - shadcn/ui components (built on Radix UI)
> - PostgreSQL database with Prisma ORM
> - NextAuth.js for authentication
> - Node.js API routes (Next.js built-in)
>
> **User Roles & Dashboards:**
> 1. Court Clerk — file cases, manage parties and attorneys, update case status, print records
> 2. Judge — view case details, docket entries, hearing schedules, make rulings
> 3. Attorney — track cases, view documents, check hearing dates
> 4. Admin — manage users, verify lawyer credentials, system settings
> 5. Public — search cases by ID, browse courts by type and state (no login required)
>
> **Core Modules:**
> 1. Authentication — login, logout, role-based routing, lawyer verification on registration
> 2. Case Filing — validated form capturing case number, title, description, status, parties, attorneys, documents
> 3. Case Dashboard — searchable, sortable, filterable table of all cases with status badges
> 4. Case Detail Viewer — tabbed view showing parties, attorneys, docket entries, event schedule, service records
> 5. Document Management — upload, store, retrieve case documents securely
> 6. Hearing Scheduler — create and manage hearing dates, auto-conflict detection, send email/SMS reminders
> 7. Court Finder (Public) — 4-step wizard: select court type → select state → search case by ID or browse courts with address, phone, hours, directions
> 8. Docket Management — chronological log of all filings and actions per case
>
> **Database Schema (PostgreSQL + Prisma):**
> - User (id, name, email, password, role, verified, createdAt)
> - Case (id, caseNumber, title, description, status, filingDate, judgeId, courtType, courtState)
> - Party (id, caseId, name, role: Plaintiff/Defendant/Witness/Other)
> - Attorney (id, caseId, userId, representing)
> - Document (id, caseId, name, type, url, uploadDate)
> - DocketEntry (id, caseId, filingDate, docketType, docketText, filingParty)
> - HearingSchedule (id, caseId, eventType, dateTime, roomNumber, judgeId, status)
> - Court (id, name, type, state, address, phone, hours, rating)
>
> **Key Differentiators to build in:**
> - Targets state-level courts (not just federal)
> - Fully paperless — no mandatory physical copies
> - Public case search portal — no login required
> - Role-based access control enforced server-side
> - Lawyer/practitioner verification before filing
> - Automated hearing scheduling with conflict detection
> - Cloud-based storage so files survive physical disasters
> - Mobile-responsive and offline-aware design
> - All 36 Nigerian states and major court types supported
>
> **UI Requirements:**
> - Clean, professional design — white background, black and grey tones
> - Mobile-first, responsive on all screen sizes
> - Color-coded case status badges (green = Open, yellow = Pending, red = Closed)
> - Toast notifications for all actions
> - Form validation on all inputs using react-hook-form + Zod
>
> **Start by:**
> 1. Setting up the Next.js 14 project with TypeScript and Tailwind
> 2. Configuring Prisma with PostgreSQL and creating all database models
> 3. Setting up NextAuth.js with role-based session handling
> 4. Building the authentication pages (login, register with role selection)
> 5. Then build each dashboard module one at a time starting with the Clerk Dashboard
>
> Build this production-ready, with proper error handling, loading states, and clean component structure."**

NO AI SLOP IN DESIGN!!!
USE MY FRONTEND DESIGN SKILLS LIKE IMPECCABLE, SHADCN, 21ST.DEV

and make it mobile responsive

---

Once you paste this and it scaffolds the project, come back and share what it generates. We will review it together and fill in any gaps. 💪