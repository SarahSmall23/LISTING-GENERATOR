# Deployment checklist

## 1. Push to GitHub
```bash
cd listing-generator
git init
git add .
git commit -m "Product Listing Generator"
git branch -M main
git remote add origin https://github.com/<your-username>/listing-generator.git
git push -u origin main
```
`.env` files are git-ignored. Never commit your API keys.

## 2. Backend on Render
1. Render dashboard > New > Blueprint, then pick your repo (it reads `render.yaml`).
   Or New > Web Service with root directory `server`, build `npm install`, start `npm start`.
2. Set the environment variables: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
3. Leave `CLIENT_ORIGIN` for now. You'll set it after step 3.
4. Deploy, then open `https://<your-service>.onrender.com/api/health`. It should return `{"status":"ok"}`.

The free tier sleeps after inactivity, so the first request can take about 30 seconds. Mention this in your README or upgrade before sharing the link widely.

## 3. Frontend on Vercel
1. Vercel > Add New Project, then pick the repo.
2. Set **Root Directory** to `client` (framework preset: Vite).
3. Add environment variables:
   - `VITE_API_URL` = your Render URL (no trailing slash)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy.

## 4. Connect them
1. In Render, set `CLIENT_ORIGIN` to your Vercel URL (no trailing slash) and redeploy.
2. In Supabase > Authentication > URL Configuration, set **Site URL** to your Vercel URL and add it to Redirect URLs.
3. In Supabase > Authentication > Providers > Email, turn "Confirm email" back **on** for production.

## 5. Final checks
- Sign up with a fresh email, confirm it, and generate a listing.
- Reload and confirm the listing appears under Saved listings.
- Save a brand voice, sign out, sign in, and confirm it loads.
- Take the screenshots listed in `docs/screenshots/README.md`.
- Put the live link and repo link at the top of the README.

## Cost control
Every generation calls the Claude API. Keep the rate limit in `server/src/index.js`, set a monthly spend limit in the Anthropic Console, and consider a per-user daily cap before sharing the link publicly.
