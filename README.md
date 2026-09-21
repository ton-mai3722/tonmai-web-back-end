# 🌿 Tonmai Web Backend

[![Bun](https://img.shields.io/badge/Bun-1.4.2-black?style=for-the-badge&logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-Framework-E36002?style=for-the-badge&logo=hono)](https://hono.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

Backend API service for **[tonmai-web](https://github.com/ton-mai3722/tonmai-web)** personal portfolio, powered by **Bun**, **TypeScript**, **Hono**, and **Google Cloud Firestore**.

---

## ⚡ Tech Stack & Highlights

- **Runtime:** [Bun](https://bun.sh/) - Ultra-fast JavaScript/TypeScript engine & package manager
- **Web Framework:** [Hono](https://hono.dev/) - Lightweight, ultra-fast web framework with built-in CORS & logger
- **Database:** [Google Cloud Firestore](https://firebase.google.com/docs/firestore) - Managed NoSQL document database via `firebase-admin`
- **Development Tooling:** [Nodemon](https://nodemon.io/) & Bun native watcher for live hot-reload
- **Type Safety:** Strict TypeScript configuration

---

## 📁 Project Structure

```text
tonmai-web-back-end/
├── src/
│   ├── index.ts             # Entry point & Hono application configuration
│   ├── lib/
│   │   └── firebase.ts      # Firebase Admin & Firestore initialization
│   └── routes/
│       ├── test.ts          # Test API route
│       └── profile.ts       # Profile & Personal Info routes (CRUD with Firestore)
├── .env.example             # Environment variables template
├── nodemon.json             # Nodemon watcher configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── CHANGELOG.md             # Version release history
└── README.md                # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Bun** (v1.2+): Install via `curl -fsSL https://bun.sh/install | bash` or `brew install bun`
- **Node.js** (v18+) *optional*

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ton-mai3722/tonmai-web-back-end.git
cd tonmai-web-back-end
bun install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure `.env`:
```env
# Default port (macOS users: use 5001 to avoid AirPlay conflict on 5000)
PORT=5001

# Optional: Alternatively paste the raw JSON string of serviceAccountKey
# FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
```

### 4. Firebase Setup
Place your Firebase Admin SDK service account key file as:
```text
serviceAccountKey.json
```
*(This file is excluded in `.gitignore` to prevent credential exposure).*

### 5. Running the Application

```bash
# Run with Nodemon (auto-restarts on changes in src/ or .env)
bun run dev

# Or run with native Bun watcher
bun run dev:bun

# Production start
bun run start
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5001`

### 1. Health Check
- **Endpoint:** `GET /`
- **Response:**
  ```json
  {
    "service": "tonmai-web-back-end",
    "status": "healthy",
    "port": 5001,
    "endpoints": {
      "root": "/",
      "test": "/api/test",
      "profile": "/api/profile"
    }
  }
  ```

### 2. Test Route
- **Endpoint:** `GET /api/test`
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Bun + TypeScript backend test route is working!",
    "host": "localhost:5001",
    "runtime": "Bun v1.4.2",
    "timestamp": "2026-09-21T04:16:35.664Z"
  }
  ```

### 3. Get Profile (ข้อมูลของฉัน)
- **Endpoint:** `GET /api/profile`
- **Description:** Fetches personal profile data from Cloud Firestore (auto-seeds default data if document doesn't exist).
- **Response:**
  ```json
  {
    "status": "success",
    "source": "firestore",
    "data": {
      "name": "Ekgaparp Janchuaina",
      "nickname": "Tonmai",
      "role": "Flutter Developer",
      "location": "Bangkok, Thailand",
      "avatar": "/profile/profile.jpg",
      "introduction": "I'm Ekgaparp Janchuaina...",
      "approach": "I believe in Clean Architecture...",
      "stats": {
        "experience_start_date": "2022-05-23",
        "internship_start_date": "2022-05-23",
        "work_start_date": "2023-05-02",
        "projects_done": "6+"
      },
      "contact": {
        "email": "ekgaparp.dev@gmail.com",
        "phone": "080-107-8401",
        "github": "ton-mai3722",
        "linkedin": "#"
      }
    }
  }
  ```

### 4. Update Profile
- **Endpoint:** `PUT /api/profile`
- **Header:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "role": "Flutter & Full-Stack Developer",
    "location": "Bangkok, Thailand"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "อัปเดตข้อมูลใน Firestore สำเร็จเรียบร้อย"
  }
  ```

---

## 🌐 Production Deployment & Domain Integration

### Subdomain Strategy (e.g. `api.tonmai-space.com`)
1. Deploy this service to container platforms supporting Bun (e.g., Render, Railway, Fly.io, or Google Cloud Run).
2. Add a `CNAME` record in your DNS provider pointing `api` to your backend deploy target.
3. Configure `CORS` origins in `src/index.ts` to allow requests from your frontend domain.

### Next.js Reverse Proxy Strategy (Single Domain)
Configure rewrites in your frontend (`tonmai-web/next.config.ts`):
```typescript
async rewrites() {
  return [
    {
      source: '/api/backend/:path*',
      destination: 'https://your-backend-host/api/:path*',
    },
  ];
}
```

---

## 👤 Author

**ต้นไม้ (Ekgaparp Janchuaina)**
- GitHub: [@ton-mai3722](https://github.com/ton-mai3722)
- Portfolio: [tonmai-space.com](https://tonmai-space.com)
- Email: ekgaparp.dev@gmail.com

---

## 📄 License
MIT License © 2026 Ekgaparp Janchuaina
