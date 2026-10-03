# Task board (MERN + TypeScript)

## Local run
1. Server: `cd server && copy .env.example .env && npm install && npm run dev`
2. Client: `cd client && copy .env.example .env && npm install && npm run dev`
3. Open http://localhost:5173

> The server will use an in-memory MongoDB fallback when `MONGO_URI` is not set, which is useful for local testing.

## Deployment checklist
1. Deploy the backend to a Node.js host such as Render, Railway, or Fly.io.
2. Set `MONGO_URI` to your production MongoDB connection string.
3. Set `PORT` to the platform-assigned port.
4. Set `CLIENT_URL` (or `CLIENT_URLS`) to your deployed frontend URL.
5. Deploy the frontend to Vercel, Netlify, or another static host.
6. Set `VITE_API_URL` to your backend URL, for example `https://your-backend-url/api`.

## Required environment variables
### Server
- `MONGO_URI` — MongoDB connection string
- `PORT` — backend port, usually `5000` in local dev
- `CLIENT_URL` or `CLIENT_URLS` — allowed frontend origins for CORS

### Client
- `VITE_API_URL` — backend API base URL

## API
GET/POST `/api/tasks`, PUT/DELETE `/api/tasks/:id`
