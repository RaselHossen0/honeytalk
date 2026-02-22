# HoneyTalk Admin Panel

Next.js admin dashboard for HoneyTalk live streaming platform.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **MUI (Material UI)** – components, Data Grid, Date Pickers
- **Recharts** – charts & analytics
- **Tailwind CSS**
- **Zustand** – auth state
- **Emotion** – MUI styling

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth routes (login)
│   │   └── login/
│   ├── (dashboard)/      # Protected dashboard
│   │   └── dashboard/
│   │       ├── users
│   │       ├── wallets
│   │       ├── transactions
│   │       └── settings
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── providers/
├── lib/
│   └── api.ts           # API client
├── store/
│   └── auth.ts          # Auth state
└── types/
```

## Setup

```bash
cd frontend/admin-panel
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend API (e.g. `http://localhost:3000/api/v1`).

## Usage

```bash
# Development (port 3001)
npm run dev

# Production
npm run build
npm run start
```

- **URL:** http://localhost:3001
- **Login:** Use Firebase UID for demo (backend creates user if new)
