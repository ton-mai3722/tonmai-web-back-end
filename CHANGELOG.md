# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] - 2026-09-21

### Fixed & Added
- **Vercel Build Support:** Moved `@types/bun`, `bun-types`, and `@types/node` into `dependencies` to eliminate `error TS2688: Cannot find type definition file for 'bun'` during Vercel production builds.
- **Vercel Serverless Integration:** Added `api/index.ts` with `hono/vercel` adapter and `vercel.json` rewrites for seamless zero-config serverless deployment on Vercel.

---

## [1.0.1] - 2026-09-21

### Enhanced
- **Environment Credentials:** Migrated Firebase Service Account keys directly into `.env` (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`), removing dependency on local JSON files for seamless cloud container deployments.
- **Documentation:** Updated `.env.example` with Firebase environment variables template.

---

## [1.0.0] - 2026-09-21

### Added
- **Initial Setup:** Initialized backend project using [Bun](https://bun.sh/) runtime and TypeScript.
- **Web Framework:** Integrated [Hono](https://hono.dev/) with CORS middleware and request logging.
- **Database Integration:**
  - Added [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) (`firebase-admin`) for Google Cloud Firestore integration.
  - Implemented modular Firestore connector with automatic credential resolution (`serviceAccountKey.json` or `FIREBASE_SERVICE_ACCOUNT_KEY` env).
- **API Endpoints:**
  - `GET /`: Health check & API directory.
  - `GET /api/test`: Diagnostics test endpoint returning server status, runtime, and timestamp.
  - `GET /api/profile`: Live query for "ข้อมูลของฉัน" (Personal Info & Profile) with automatic initial document seeding and fallback protection.
  - `PUT /api/profile`: Real-time update endpoint to modify personal details directly in Firestore.
- **Development Tooling:**
  - Configured [Nodemon](https://nodemon.io/) via `nodemon.json` for auto-reloading on changes in `src/` and `.env`.
  - Added `bun run dev` (Nodemon) and `bun run dev:bun` (Native Bun watcher) scripts in `package.json`.
  - Added dynamic port support via `PORT` environment variable (default: `5001` to prevent macOS AirPlay receiver port 5000 conflict).
- **Security:**
  - Configured `.gitignore` to prevent credential leaks (`serviceAccountKey.json`, `.env`, keys, logs).
- **Documentation:**
  - Comprehensive `README.md` with architectural layout, API specifications, and deployment guide.
