# Vitrin - Restaurant SaaS Dashboard (Production)

A full-stack restaurant management SaaS platform featuring a modern React frontend and NestJS backend with Prisma ORM.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Google OAuth Setup](#google-oauth-setup)
- [Database](#database)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)

## Overview

Vitrin is a comprehensive restaurant management platform that provides:

- Dashboard with analytics and reporting
- Restaurant profile management
- Menu and product management
- Order tracking and management
- User authentication (JWT + Google OAuth)
- Responsive design for desktop and mobile

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Library |
| TypeScript | 5.8.x | Type Safety |
| Vite | 6.x | Build Tool & Dev Server |
| Tailwind CSS | - | Styling |
| Framer Motion | 12.x | Animations |
| Recharts | 3.x | Charts & Data Visualization |
| Lucide React | 0.562.x | Icons |
| Phosphor Icons | 2.1.x | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| NestJS | Node.js Framework |
| Prisma | ORM & Database Management |
| PostgreSQL / SQLite | Database |
| JWT | Authentication |
| Swagger | API Documentation |

## Project Structure

```
vitrin-production/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── data/              # API implementations & repositories
│   │   ├── utils/             # Utility functions
│   │   ├── domain/            # Domain models & interfaces
│   │   ├── constants.tsx      # Application constants
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── App.tsx            # Main application component
│   │   └── index.tsx          # Application entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   ├── vite.config.ts         # Vite configuration
│   └── .env.example           # Environment variables template
│
├── backend/                   # NestJS backend application
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   ├── common/            # Shared utilities & guards
│   │   └── main.ts            # Application entry point
│   ├── prisma/                # Prisma schema & migrations
│   ├── test/                  # Backend tests
│   ├── package.json           # Backend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   ├── nest-cli.json          # NestJS CLI configuration
│   └── .env.example           # Environment variables template
│
└── README.md                  # This file
```

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** (for production) or **SQLite** (for development)
- **Google Cloud Console** account (for Google OAuth)

## Environment Variables

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | `http://localhost:3000/api/v1` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | No | - | Google OAuth Client ID |

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_ACCESS_SECRET` | Yes | - | JWT signing secret (min 32 chars) |
| `JWT_ACCESS_TTL` | Yes | `15m` | Access token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | Yes | `30` | Refresh token lifetime in days |
| `GOOGLE_CLIENT_ID` | Yes | - | Google OAuth Client ID |
| `DATABASE_URL` | Yes | - | Database connection string |

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

6. Build the application:
   ```bash
   npm run build
   ```

7. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory (root):
   ```bash
   cd .
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable **Google Identity Services** API
4. Navigate to **Credentials > OAuth 2.0 Client IDs**
5. Create a **Web application** client
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-production-domain.com` (production)
7. Copy the **Client ID**
8. Set `VITE_GOOGLE_CLIENT_ID` in frontend `.env`
9. Set `GOOGLE_CLIENT_ID` in backend `.env`

> **Note:** No client secret is required for frontend — only the Client ID.

## Database

### Development (SQLite)

For local development, you can use SQLite:

```bash
# In backend/.env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)

For production, use PostgreSQL:

```bash
# In backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/vitrin?schema=public"
```

### Running Migrations

```bash
cd backend
npx prisma migrate deploy
```

### Seeding Data (Optional)

```bash
cd backend
npx prisma db seed
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Production Build

**Frontend:**
```bash
npm run build
npm run preview  # Preview production build locally
```

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

## Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Type Checking

```bash
npx tsc --noEmit
```

## Deployment

### Frontend Deployment

The frontend builds to a `dist/` folder. Deploy to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

**Recommended hosting:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- Nginx

### Backend Deployment

```bash
cd backend
npm run build
npm run start:prod
```

**Recommended hosting:**
- Railway
- Render
- AWS EC2/ECS
- DigitalOcean App Platform

### Environment Variables for Production

Ensure all required environment variables are set in your production environment. Never commit `.env` files to version control.

## API Documentation

Once the backend is running, access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

### API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/google` | Google OAuth login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/restaurants` | List restaurants |
| GET | `/api/v1/restaurants/:id` | Get restaurant details |
| PUT | `/api/v1/restaurants/:id` | Update restaurant |
| GET | `/api/v1/menu` | List menu items |
| POST | `/api/v1/menu` | Create menu item |
| PUT | `/api/v1/menu/:id` | Update menu item |
| DELETE | `/api/v1/menu/:id` | Delete menu item |
| GET | `/api/v1/orders` | List orders |
| PATCH | `/api/v1/orders/:id` | Update order status |

## Architecture

### Authentication Flow

1. **JWT Authentication:**
   - Access tokens expire after 15 minutes
   - Refresh tokens expire after 30 days
   - Tokens are stored in HTTP-only cookies

2. **Google OAuth:**
   - Frontend obtains Google ID token
   - Backend verifies token with Google
   - Backend creates/updates user and issues JWT

### Data Flow

```
Frontend (React) → API Service → Backend (NestJS) → Prisma → Database
```

### API Fallback

When `VITE_API_BASE_URL` is not set, the frontend falls back to local mock repositories for development without a backend.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests to ensure nothing is broken
4. Submit a pull request

## License

This is a private repository. All rights reserved.

## Support

For issues or questions, please contact the development team.
