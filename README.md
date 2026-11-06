# ORBIT Hub

Digital design marketplace (UI8-inspired) built with React + Vite + Bootstrap 5. Backend: Node.js + Express + MongoDB.

## Frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173

For Google sign-in, set `VITE_GOOGLE_CLIENT_ID` in the root `.env` file and add
`http://localhost:5173` to **Authorized JavaScript origins** for that OAuth client
in Google Cloud Console. The Vite dev server is pinned to port 5173 so the origin
stays consistent. If you access the app through another hostname or IP address,
add that exact origin as well.

## Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

API: http://localhost:5000

The admin Notifications page sends announcements to active registered email addresses
using BCC batches. Account sign-in verification emails are sent to the individual
account's email address. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
and `SMTP_FROM` in `server/.env` before sending.

## Build

```bash
npm run build
npm run preview
```

## Notes

- Frontend uses localStorage for demo data; backend provides real API.
- Admin access: sign in with an email containing "admin".
- Brand colors: Cyan/Teal primary, near-black background, off-white text.
- MongoDB must be running or use Atlas URI in .env.
