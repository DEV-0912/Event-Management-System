# Event Hub Backend

## Setup

1. Copy `.env.example` to `.env` and adjust values.
2. Install deps:
```
npm install
```
3. Run dev:
```
npm run dev
```

The server runs on port 6224 by default.

## Endpoints
- POST `/api/events`
- GET `/api/events`
- DELETE `/api/events/:id`
- POST `/api/registration`
- POST `/api/registration/checkin`

CORS origin: `https://events.vjstartup.com/ef-be`.
