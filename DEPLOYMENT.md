# Deployment Guide

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/stageai
JWT_SECRET=<random-secret>
GROQ_API_KEY=<groq-api-key>
IMAGEKIT_PUBLIC_KEY=<imagekit-public-key>
IMAGEKIT_PRIVATE_KEY=<imagekit-private-key>
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your-imagekit-id>
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

## Vercel Deployment

### Backend
1. Push the backend to a Git repository.
2. Import into Vercel.
3. Set the root directory to `backend/`.
4. Build command: `npm run build`.
5. Output: `dist/`.
6. Add all environment variables.
7. Vercel automatically detects Express via `vercel.json`.

### Frontend
1. Push the frontend to a Git repository.
2. Import into Vercel.
3. Set the root directory to `frontend/`.
4. Build command: `npm run build`.
5. Output: `dist/`.
6. Add `VITE_API_BASE_URL` environment variable.

## MongoDB Atlas
1. Create a free cluster on MongoDB Atlas.
2. Whitelist Vercel's IPs (0.0.0.0/0 for development).
3. Use the connection string as `MONGODB_URI`.

## Seed Data
Run `npm run seed` after deployment to populate test data:
```
cd backend && npm run seed
```

## Notes
- The Express app is wrapped for serverless using the standard Vercel Node.js runtime.
- Mongoose connection is cached across invocations (see `config/db.ts`).
- ImageKit accepts arbitrary file uploads (including PDFs), not just images.
