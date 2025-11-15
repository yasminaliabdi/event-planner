# Garissa Event Planner — Development Plan

## 1. Project Overview

- Build a full-stack event management platform for Garissa County with three role-based experiences: user, university, and admin.
- Technology stack: React (Vite) + Tailwind CSS + Framer Motion (frontend), Flask REST API with JWT auth (backend), SQLite (initial DB).
- OTP-enabled registration flow using Gmail SMTP (`noreplyeventplanner1@gmail.com` | app password `juwl xoms qmgv jvxg`).

## 2. Repository Structure

- `frontend/` — React + Vite + Tailwind application.
- `backend/` — Flask application with API, models, schemas, and utilities.
- `plan.md` — Living roadmap (update as milestones evolve).
- Future additions: `docs/`, `deploy/` scripts, Postman collections, etc.

## 3. Phase Breakdown

### Phase 1 — Environment & Tooling

- [x] Scaffold Vite React TypeScript app with Tailwind configured.
- [x] Create Flask project skeleton, virtual environment, and install dependencies.
- [x] Configure shared linting/formatting (ESLint, Prettier, Ruff/Black optional).
- [ ] Set up GitHub repo, CI baseline, and project README.

### Phase 2 — Backend Foundations

- [x] Define SQLAlchemy models: `User`, `UniversityProfile`, `Event`, `Booking`.
- [x] Implement Marshmallow schemas and validation helpers.
- [x] Build auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/profile`) with OTP verification workflow.
- [x] Add email service utility (SMTP via Gmail app password) and OTP storage (DB-backed or cache).
- [x] Implement core event CRUD routes with role-based guards.
- [x] Implement booking routes (creation, approvals, cancellations).
- [x] Implement admin management routes (users, universities, stats).
- [x] Add error handling, pagination, and logging helpers.
- [x] Write unit/integration tests (pytest + coverage) for critical endpoints.

### Phase 3 — Frontend Foundations

- [x] Set up global layout, Tailwind config, theme tokens, and utility classes.
- [x] Implement routing structure (public + protected + role guards).
- [x] Build public pages (Home, About, Get Involved, Our Impact, Who We Are) with 10 content sections each, animations (Framer Motion, GSAP).
- [x] Create authentication screens (login, registration with OTP flow).
- [x] Integrate Axios instance with JWT interceptors and error handling.
- [ ] Implement dashboards:
  - User: event discovery, bookings, profile.
  - University: event management, attendee lists, booking approvals.
  - Admin: stats overview, manage users/universities/events, reports.
- [ ] Ensure responsive design, accessibility, and design polish.

### Phase 4 — Integration & QA

- [ ] Connect frontend to backend APIs; manage environment configs.
- [ ] Manual QA of full user journeys (user, university, admin).
- [ ] Strengthen validation (frontend + backend) and handle edge cases.
- [ ] Load sample seed data for demos/testing.
- [ ] Document API endpoints (OpenAPI/Swagger or Markdown).

### Phase 5 — Deployment & Maintenance

- [ ] Prepare production builds (Vite, Flask).
- [ ] Configure deployment targets (e.g., Vercel/Netlify for frontend, Render/Railway for backend).
- [ ] Set up environment variables, CORS, HTTPS, and logging.
- [ ] Add automated backups/migrations for database.
- [ ] Final smoke tests on live environment.
- [ ] Plan future enhancements (payments, notifications, analytics, chat, QR tickets, dark mode, mobile app).

## 4. Database & Security Notes

- Start with SQLite for development/testing; design schema to migrate to PostgreSQL.
- Use hashed passwords (`passlib[bcrypt]`) and store OTP codes securely with expirations.
- Enforce validation on emails, strong passwords, and phone numbers.
- Apply RBAC middleware on backend; guard routes on frontend with JWT role claims.
- Log suspicious activity and prepare for audit trails (timestamps, statuses).

## 5. Next Immediate Actions

- Configure linting and formatting tools; add pre-commit hooks.
- Implement database models and migrations scaffolding.
- Draft API request/response contracts for auth, events, bookings, and admin flows.
- Create UI wireframes or component inventory for dashboards and public pages.
- Set up shared environment variable handling for both frontend and backend.

---

_This plan should evolve as we make progress. Update completed items and refine tasks before each working session._\*\*\* End Patch
