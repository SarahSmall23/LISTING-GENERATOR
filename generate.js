import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt, TONES, PLATFORMS } from "./prompt.js";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
const MODEL = "claude-sonnet-5-5";

export function validateInput(body) {
  const errors = [];
  if (!body.product || typeof body.product !== "string" || body.product.length > 200)
    errors.push("product is required (max 200 characters)");
  if (body.keywords && (!Array.isArray(body.keywords) || body.keywords.length > 10))
    errors.push("keywords must be an array of up to 10 items");
  if (!TONES.includes(body.tone)) errors.push(`tone must be one of: ${TONES.join(", ")}`);
  if (!PLATFORMS.includes(body.platform))
    errors.push(`platform must be one of: ${PLATFORMS.join(", ")}`);
  if (body.brandVoice && body.brandVoice.length > 300)
    errors.push("brandVoice must be 300 characters or fewer");
  return errors;
}

export async function generateListing(input) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: buildSystemPrompt(input.brandVoice),
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return {
    description: String(parsed.description ?? ""),
    caption: String(parsed.caption ?? ""),
    hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [],
    seoTitle: String(parsed.seoTitle ?? ""),
  };
}
