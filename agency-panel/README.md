# HoneyTalk Agency Panel

Next.js agency dashboard for hosts, commissions, and sub-agency management.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **MUI (Material UI)**
- **Recharts** – commission charts
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
│   │       ├── hosts
│   │       ├── commissions
│   │       ├── analytics
│   │       └── sub-agencies
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
cd frontend/agency-panel
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend API.

## Usage

```bash
# Development (port 3002)
npm run dev

# Production
npm run build
npm run start
```

- **URL:** http://localhost:3002
- **Login:** Use Firebase UID for demo
