# Case study: Product Listing Generator

**Live demo:** _add link_  |  **Code:** _add GitHub link_

## The problem
Small online sellers in South Africa write product copy by hand for every platform: a website description, an Instagram caption, a WhatsApp catalogue blurb. It's slow, the tone drifts between posts, and seasonal campaigns (Mother's Day, Black Friday) mean rewriting everything again. I run an e-commerce gifting business myself, so this was a problem I had every week.

## The solution
A web app where a seller enters a product, a few keywords, a tone and the platform. In seconds they get a ready-to-post description, caption, hashtags and SEO title, written in South African English. Sellers can save a brand voice, pick an occasion preset, and reopen anything they've generated before.

## What I built
- **Frontend:** React (Vite) with a two-panel layout, copy-to-clipboard on every output, loading and error states, and a responsive design.
- **Backend:** Node and Express, which calls the Claude API. The API key stays on the server, input is validated, and requests are rate limited.
- **Auth and data:** Supabase email auth and Postgres. Row Level Security means each user can only read and change their own listings and brand voice.
- **Deployment:** Vercel for the frontend, Render for the API.

## Decisions worth explaining
1. **A backend instead of calling the AI from the browser.** It keeps the API key private and gives one place to validate input and limit usage.
2. **Structured output.** The prompt asks for strict JSON and the server validates and normalises it, so the UI never breaks on a badly formatted response.
3. **Guardrails in the prompt.** The model is told not to invent specs, discounts or delivery promises, because made-up claims in a product listing are a real business risk.
4. **Database-level security.** Row Level Security protects user data even if an API route has a bug.
5. **Occasion presets with server-side guidance.** The client sends a simple label and the server adds the detailed instructions, so the prompt can improve without a frontend release.

## Challenges
- _Add 2 or 3 real ones you hit, for example getting consistent JSON back, configuring CORS between Vercel and Render, or Supabase email confirmation redirects. Specific stories are what make a case study convincing._

## Results and learnings
- _Add what you measured or observed, such as how long a listing used to take versus now, or feedback from a real seller. Only include numbers you actually have._
- What I'd build next: product image upload with automatic descriptions, a per-user daily usage cap, export to CSV for bulk uploads to shop platforms, and multi-language output (isiZulu, Afrikaans).

## Tech stack
React, Vite, Node.js, Express, Supabase (Auth and Postgres), Claude API, Vercel, Render
