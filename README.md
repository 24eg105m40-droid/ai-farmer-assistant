# AI Farmer Assistant

A React/Vite frontend with an Express and MongoDB backend for farmer registration, weather information, crop guidance, soil advice, and chatbot responses.

## Run locally

1. Copy `server/.env.example` to `server/.env` and supply the required API keys. You may omit `MONGODB_URI` to use a local MongoDB instance.
2. In one terminal, run `npm install && npm run dev` from `server`.
3. In another terminal, run `npm install && npm run dev` from `client`.

The frontend defaults to `http://localhost:3000`. To use a different API endpoint, create `client/.env` with `VITE_API_URL=<api-url>`.

## Deploy

### Backend: Render

1. In Render, select **New > Blueprint** and connect this GitHub repository.
2. Render detects `render.yaml`; add values for `MONGODB_URI`, `OPENWEATHER_API_KEY`, `OPENAI_API_KEY`, and `CLIENT_ORIGIN`.
3. Use MongoDB Atlas for `MONGODB_URI` in production.

### Frontend: Vercel

1. Import this GitHub repository into Vercel.
2. Set **Root Directory** to `client`.
3. Add `VITE_API_URL` with the deployed Render API URL, for example `https://ai-farmer-assistant-api.onrender.com`.
4. Deploy, then copy the Vercel URL into Render's `CLIENT_ORIGIN` setting and redeploy the backend.

GitHub Actions runs linting, the client production build, and a backend syntax check on every push and pull request.
