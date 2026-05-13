# ServicePro API

## Setup
1. Copy .env.example to .env and fill values.
2. Install dependencies:
   - `npm install`
3. Start server:
   - `npm run dev` (watch mode)
   - `npm start` (production)

## Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/otp
- POST /auth/otp/verify
- POST /auth/google
- POST /orders | GET /orders?clientId=
- POST /builds | GET /builds?clientId=
- POST /repairs | GET /repairs?clientId= | GET /repairs?centerId=
- PATCH /repairs/:id/status
- POST /repairs/:id/media
- POST /warranties | GET /warranties
- GET /health

## Notes
- OTPs are stored server-side only.
- Google OAuth requires Firebase Admin credentials.
- In production, configure SMS provider and Firebase Admin.
