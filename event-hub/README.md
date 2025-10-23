# Event Hub (Full-Stack)

## Structure
- `backend/` Node.js + Express + SQLite + QR
- `frontend/` React + Vite + Axios + react-qr-reader

## Backend setup
```
cd backend
cp .env.example .env
npm install
npm run dev
```
Runs at port 6224. CORS origin allowed: https://events.vjstartup.com/ef-be

## Frontend setup
```
cd frontend
npm install
npm run dev
```
Runs at port 3224. Uses API base URL https://events.vjstartup.com/ef-be

## Notes
- QR payload format: `eventId|userId`.
- Optional email sending via Gmail. Fill `EMAIL_USER` and `EMAIL_PASS` in `backend/.env`.
