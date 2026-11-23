# Product Listing Generator

AI-powered copy for South African online sellers. Enter a product, pick a tone and platform, and get a ready-to-post description, caption, hashtags and SEO title.

**Live demo:** _add link_  |  **Case study:** [docs/CASE-STUDY.md](docs/CASE-STUDY.md)

![Generator](docs/screenshots/generator.png)

## Features
- Generates a description, caption, hashtags and SEO title for website, Instagram, WhatsApp or Facebook
- Five tones: fun, premium, gifting, professional, casual
- South African English and rand pricing, with no invented specs or discounts
- Occasion presets (Valentine's Day, Mother's Day, Black Friday, Heritage Day and more) with tailored guidance
- Saved brand voice that loads automatically each time you sign in
- Email sign-up and sign-in, with every listing saved to your history
- Copy buttons on every output, plus "Copy everything"
- Responsive layout for phone and desktop

## Screenshots
| Results | Saved listings | Mobile |
|---|---|---|
| ![Results](docs/screenshots/results.png) | ![History](docs/screenshots/history.png) | ![Mobile](docs/screenshots/mobile.png) |

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| AI | Claude API (Anthropic SDK) |
| Auth and database | Supabase (Auth, Postgres, Row Level Security) |
| Hosting | Vercel (client), Render (server) |

## How it works
```
Browser (React)  --Bearer token-->  Express API  --->  Claude API
      |                                  |
      +------ Supabase Auth <------------+
                                         |
                                  Supabase Postgres (RLS)
```
1. The user signs in with Supabase Auth and receives an access token.
2. The client sends the token with every API request.
3. The server verifies the token, builds the prompt, calls Claude, validates the JSON reply and saves it to the user's history.
4. Row Level Security ensures users can only access their own rows.

## Project structure
```
listing-generator/
├── client/                # React (Vite) frontend
│   └── src/               # App, AuthForm, ListingForm, Results, History, api.js
├── server/                # Express API
│   └── src/               # index.js, auth.js, prompt.js, generate.js
├── supabase/              # SQL: schema.sql, step4-brand.sql
├── docs/                  # Case study and screenshots
├── render.yaml            # Render blueprint
└── DEPLOYMENT.md          # Step-by-step deploy guide
```

## Run locally
**1. Supabase (one-time)**
1. Create a project at supabase.com.
2. In the SQL Editor, run `supabase/schema.sql`, then `supabase/step4-brand.sql`.
3. Copy the Project URL and anon key (Project Settings > API).
4. For development, turn off "Confirm email" under Authentication > Providers > Email.

**2. Backend**
```bash
cd server
npm install
cp .env.example .env     # add ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
npm run dev              # http://localhost:3000
```

**3. Frontend**
```bash
cd client
npm install
cp .env.example .env     # add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev              # http://localhost:5173 (proxies /api to port 3000)
```

## API
All routes except `/api/health` need an `Authorization: Bearer <supabase access token>` header.

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/generate` | Generate a listing and save it |
| GET | `/api/history` | List saved listings |
| DELETE | `/api/history/:id` | Delete a saved listing |
| GET | `/api/brand` | Get your saved brand voice |
| PUT | `/api/brand` | Save your brand voice |

## Security notes
- The Anthropic API key lives only on the server.
- Inputs are validated and length-limited, and requests are rate limited.
- Row Level Security isolates each user's data at the database level.
- CORS is restricted to the deployed client origin in production.

## Roadmap
- Product image upload with automatic descriptions
- Per-user daily usage cap
- CSV export for bulk shop uploads
- isiZulu and Afrikaans output

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md).
