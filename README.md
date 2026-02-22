# HoneyTalk Frontend

Next.js panels for Admin and Agency management.

## Panels

| Panel | Port | Purpose |
|-------|------|---------|
| **Admin Panel** | 3001 | Platform oversight: users, wallets, transactions, settings |
| **Agency Panel** | 3002 | Agency management: hosts, commissions, analytics, sub-agencies |

## Quick Start

```bash
# Admin Panel
cd admin-panel && npm install && npm run dev

# Agency Panel (in another terminal)
cd agency-panel && npm install && npm run dev
```

- **Admin:** http://localhost:3001
- **Agency:** http://localhost:3002

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- MUI (Material UI)
- Recharts
- Tailwind CSS
- Zustand
- Emotion

## Deployment

Each panel can be deployed separately (e.g. admin.domain.com, agency.domain.com):

```bash
npm run build
npm run start
```

Or use `output: 'standalone'` in next.config.js for Docker deployment.
# honeytalk
