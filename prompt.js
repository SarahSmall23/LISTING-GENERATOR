export const TONES = ["fun", "premium", "gifting", "professional", "casual"];
export const PLATFORMS = ["website", "instagram", "whatsapp", "facebook"];

// Occasion presets: the client shows the labels, the server adds the guidance.
export const OCCASIONS = [
  { label: "Valentine's Day", hint: "Romantic and thoughtful. Focus on showing someone you care." },
  { label: "Mother's Day", hint: "Warm and appreciative. Focus on thanking and spoiling mom." },
  { label: "Father's Day", hint: "Light-hearted and sincere. Focus on practical, memorable gifts for dad." },
  { label: "Women's Day", hint: "Empowering and celebratory. Avoid clichés and stereotypes." },
  { label: "Heritage Day", hint: "Proudly South African, inclusive and festive. Celebrate local culture respectfully." },
  { label: "Black Friday", hint: "Urgent and value-focused. Only mention a discount or deadline if one was provided." },
  { label: "Christmas", hint: "Festive and generous. Suggest it as a ready-to-wrap gift. Do not promise delivery dates." },
  { label: "Graduation", hint: "Proud and celebratory. Position it as a keepsake for a milestone." },
  { label: "Birthday", hint: "Fun and personal. Focus on making someone feel special." },
];

const PLATFORM_RULES = {
  website: "Full product description of 80-120 words, plus a 60-character-max SEO title.",
  instagram: "Short, punchy caption (under 150 words) with line breaks and a few emojis.",
  whatsapp: "Brief catalogue-style blurb (under 60 words), no hashtags in the body.",
  facebook: "Friendly post of 60-100 words with a clear call to action.",
};

export function buildSystemPrompt(brandVoice) {
  return `You write product copy for small South African online sellers.
Rules:
- Use South African English spelling (colour, personalise) and prices in ZAR (R) only if a price is provided.
- Never invent specs, materials, sizes, discounts or delivery promises that were not provided.
- Keep copy honest, specific and easy to read.
${brandVoice ? `- Brand voice to follow: ${brandVoice}` : ""}
Respond with ONLY valid JSON, no markdown fences, in this exact shape:
{"description": string, "caption": string, "hashtags": string[], "seoTitle": string}`;
}

export function buildUserPrompt({ product, keywords = [], tone, platform, price, occasion }) {
  const preset = occasion
    ? OCCASIONS.find((o) => o.label.toLowerCase() === occasion.trim().toLowerCase())
    : null;
  return `Product: ${product}
Keywords: ${keywords.join(", ") || "none"}
Tone: ${tone}
Platform: ${platform} (${PLATFORM_RULES[platform]})
${price ? `Price: R${price}` : ""}
${occasion ? `Occasion/campaign: ${occasion}` : ""}
${preset ? `Occasion guidance: ${preset.hint}` : ""}
Provide 6-10 relevant hashtags (without the # symbol).`;
}
