# Phase 8C-4 — Actual Cloud UAT Deployment Report

## 1. Deployment Architecture
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render Web Service (Node + Express + Socket.IO)
- **Database**: Neon PostgreSQL UAT Database
- **Image Storage**: Cloudinary

## 2. GitHub Commit Deployed
Latest configured commit: `037c0df`

## 3. Vercel Project/URL
**PENDING**: Vercel initialization blocked due to missing CLI/OAuth credentials for automated execution. 

## 4. Render Service/URL
**PENDING**: Render initialization blocked due to missing CLI/OAuth credentials for automated execution.

## 5. Neon UAT Status
**READY**: Neon successfully connected and verified in Phase 8C-3A.

## 6. Cloudinary Status
**READY**: The source code is now fully configured to consume explicit keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) securely from environment variables.

## 7. Environment Variables Configured
The backend safely processes the following via `process.env`:
- `PORT`
- `FRONTEND_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `OWNER_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The frontend requires:
- `VITE_API_URL`
- `VITE_BACKEND_URL`

## 8 - 20. Public Cloud Smoke Tests (Customer, Owner, Uploads, Security, Socket.io, Integrity)
**BLOCKED**: Cannot perform public HTTP/E2E cloud tests because the public application endpoints (Vercel/Render) could not be automatically instantiated without API keys.

## 21. Free-Tier Limitations
- **Render**: The backend will sleep after 15 minutes of inactivity. First load (cold start) may take up to 30-50 seconds to boot.
- **Neon**: Storage/compute limits are comfortably sufficient for a 10-day test cycle.
- **Cloudinary**: 25 credits/month allowance easily exceeds the UAT upload scale.
- **Vercel**: Bandwidth strictly within 10-day UAT boundaries. No significant limitations.

## 22. Bugs Discovered
1. **Missing Backend Start Command**: `server/package.json` lacked a `"start"` script, which is strictly required by Render for Node.js environments.
2. **SPA Routing**: The React app lacked fallback routing configurations, meaning nested refreshes on Vercel would yield 404s.
3. **Implicit Cloudinary Check**: The source code previously looked for the combined `CLOUDINARY_URL` variable instead of the individual keys required by the Phase.

## 23. Bugs Fixed
1. Added `"start": "node src/server.js"` to `server/package.json`.
2. Added `client/vercel.json` with a rewrite configuration targeting `index.html`.
3. Updated `server/src/middleware/upload.js` and `product.routes.js` to securely map the explicit `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` configurations.
4. Committed all configuration fixes safely to `origin/main`.

## 24. Remaining Known Limitations
**BLOCKER**: The final automated instantiation step on Render and Vercel requires actual human authorization (OAuth or CLI tokens).

## 25. Owner UAT Instructions
To officially release the application to UAT, the Owner must now:
1. Connect Vercel to `sfP`, pointing the root to `client` and setting `VITE_API_URL` / `VITE_BACKEND_URL`.
2. Connect Render to `sfP`, pointing the root to `server`, setting the start command to `npm start`, and injecting the Backend environment variables.

## 26. Rollback/Recovery Considerations
Since the local development database (`clothing_store`) was intentionally untouched, rollbacks are immediate and frictionless. If UAT fails, simply sever the Vercel/Render URLs and resume development on `clothing_store`.

==================================================
IMPORTANT — OWNER HANDOVER
==================================================

CUSTOMER SITE:
(Pending Vercel Provisioning)

OWNER LOGIN:
(Pending Vercel Provisioning)/admin (or respective Owner route)

API:
(Pending Render Provisioning)

DATABASE:
Neon UAT

IMAGE STORAGE:
Cloudinary

==================================================
FINAL STATUS
**NOT READY FOR OWNER UAT** (Pending Manual Infrastructure Provisioning)
