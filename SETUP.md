# Local Development Setup

## Prerequisites
- Node.js >= 18
- npm

## Backend

```bash
cd backend
cp .env.example .env        # Edit .env with your values
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start:dev
```

Backend runs at `http://localhost:3000`  
Swagger docs at `http://localhost:3000/api/docs`

### Required .env values
| Key | Example | Notes |
|-----|---------|-------|
| `JWT_ACCESS_SECRET` | any string >= 32 chars | JWT signing secret |
| `JWT_ACCESS_TTL` | `15m` | Access token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | `30` | Refresh token lifetime |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google OAuth Client ID |

## Frontend

```bash
cp .env.example .env   # Edit VITE_API_BASE_URL if needed
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Required .env values
| Key | Default | Notes |
|-----|---------|-------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | (empty) | Google Client ID for Google Login |

## Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create a project (or select existing)
3. Enable **Google Identity Services** API
4. Go to **Credentials > OAuth 2.0 Client IDs**
5. Create a **Web application** client
6. Add authorized origins:
   - `http://localhost:5173` (frontend dev server)
7. Copy the **Client ID**
8. Set `VITE_GOOGLE_CLIENT_ID` in frontend `.env`
9. Set `GOOGLE_CLIENT_ID` in backend `.env`

No client secret is needed for frontend — only the Client ID.

## Run Both Services

Terminal 1 (Backend):
```bash
cd backend && npm run start:dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Running Tests

Backend:
```bash
cd backend && npm test
```

Frontend (type-check):
```bash
npx tsc --noEmit
```

## Architecture

- Frontend routes API calls through `data/api/` implementations when `VITE_API_BASE_URL` is set
- When `VITE_API_BASE_URL` is empty, falls back to local mock repositories
- Auth uses JWT access tokens (15m) + opaque refresh tokens (30d)
- Google Login sends the Google ID token to `POST /api/v1/auth/google` for server-side verification
