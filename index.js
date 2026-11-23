import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { generateListing, validateInput } from "./generate.js";
import { requireAuth } from "./auth.js";

const app = express();
app.set("trust proxy", 1); // correct client IPs behind Render/Railway for rate limiting
app.use(express.json({ limit: "10kb" }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));

// Protects your API credit from abuse
app.use("/api/", rateLimit({ windowMs: 60_000, max: 30 }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Generate a listing and save it to the user's history
app.post("/api/generate", requireAuth, async (req, res) => {
  const errors = validateInput(req.body);
  if (errors.length) return res.status(400).json({ errors });

  let result;
  try {
    result = await generateListing(req.body);
  } catch (err) {
    console.error("Generation failed:", err.message);
    return res.status(502).json({ error: "Could not generate a listing. Please try again." });
  }

  const { data, error } = await req.db
    .from("generations")
    .insert({ product: req.body.product, inputs: req.body, result })
    .select("id, created_at")
    .single();

  if (error) console.error("Saving history failed:", error.message);

  res.json({ ...result, id: data?.id ?? null, createdAt: data?.created_at ?? null });
});

// List the user's saved listings (newest first)
app.get("/api/history", requireAuth, async (req, res) => {
  const { data, error } = await req.db
    .from("generations")
    .select("id, product, inputs, result, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: "Could not load your history." });
  res.json(data);
});

// Delete one saved listing
app.delete("/api/history/:id", requireAuth, async (req, res) => {
  const { error } = await req.db.from("generations").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: "Could not delete that listing." });
  res.status(204).end();
});

// Saved brand voice (one per user)
app.get("/api/brand", requireAuth, async (req, res) => {
  const { data, error } = await req.db
    .from("brand_profiles")
    .select("voice")
    .maybeSingle();

  if (error) return res.status(500).json({ error: "Could not load your brand voice." });
  res.json({ voice: data?.voice ?? "" });
});

app.put("/api/brand", requireAuth, async (req, res) => {
  const voice = typeof req.body.voice === "string" ? req.body.voice.trim() : null;
  if (voice === null || voice.length > 300) {
    return res.status(400).json({ error: "Brand voice must be 300 characters or fewer." });
  }

  const { error } = await req.db
    .from("brand_profiles")
    .upsert({ user_id: req.user.id, voice, updated_at: new Date().toISOString() });

  if (error) return res.status(500).json({ error: "Could not save your brand voice." });
  res.json({ voice });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
