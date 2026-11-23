import { useEffect, useState } from "react";
import { OCCASIONS } from "./occasions.js";

const TONES = [
  { value: "fun", label: "Fun" },
  { value: "premium", label: "Premium" },
  { value: "gifting", label: "Gifting" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
];

const PLATFORMS = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
];

function Segmented({ legend, options, value, onChange }) {
  return (
    <fieldset className="field">
      <legend>{legend}</legend>
      <div className="segmented" role="radiogroup">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            className={value === o.value ? "seg active" : "seg"}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ListingForm({ onSubmit, loading, savedVoice, onSaveVoice }) {
  const [product, setProduct] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("gifting");
  const [platform, setPlatform] = useState("instagram");
  const [price, setPrice] = useState("");
  const [occasion, setOccasion] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");

  // Fill in the saved brand voice once it loads (and when it changes after saving)
  useEffect(() => { setBrandVoice(savedVoice || ""); }, [savedVoice]);

  const voiceChanged = brandVoice.trim() !== (savedVoice || "");

  async function handleSaveVoice() {
    setVoiceStatus("Saving...");
    try {
      await onSaveVoice(brandVoice.trim());
      setVoiceStatus("Saved");
    } catch (err) {
      setVoiceStatus(err.message);
    }
    setTimeout(() => setVoiceStatus(""), 2500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      product: product.trim(),
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 10),
      tone,
      platform,
      price: price.trim() || undefined,
      occasion: occasion.trim() || undefined,
      brandVoice: brandVoice.trim() || undefined,
    });
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h2>Describe your product</h2>

      <label className="field">
        <span>Product name</span>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Personalised teddy bear with embroidered name"
          maxLength={200}
          required
        />
      </label>

      <label className="field">
        <span>Keywords <em>(separate with commas)</em></span>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="gift, birthday, custom, soft"
        />
      </label>

      <Segmented legend="Tone" options={TONES} value={tone} onChange={setTone} />
      <Segmented legend="Where will you post it?" options={PLATFORMS} value={platform} onChange={setPlatform} />

      <fieldset className="field">
        <legend>Occasion <em>(optional)</em></legend>
        <div className="segmented chips">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={occasion === o}
              className={occasion === o ? "seg active" : "seg"}
              onClick={() => setOccasion(occasion === o ? "" : o)}
            >
              {o}
            </button>
          ))}
        </div>
        <input
          className="occasion-input"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="Or type your own, like Winter sale"
          maxLength={80}
        />
      </fieldset>

      <label className="field">
        <span>Price in rand <em>(optional)</em></span>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder="349"
          inputMode="decimal"
        />
      </label>

      <div className="field">
        <label htmlFor="brand-voice"><span>Brand voice <em>(optional)</em></span></label>
        <textarea
          id="brand-voice"
          value={brandVoice}
          onChange={(e) => setBrandVoice(e.target.value)}
          placeholder="Warm, playful, speaks like a friend"
          maxLength={300}
          rows={2}
        />
        <div className="voice-actions">
          <button
            type="button"
            className="copy-btn"
            onClick={handleSaveVoice}
            disabled={!voiceChanged || !brandVoice.trim()}
          >
            Save as my brand voice
          </button>
          {voiceStatus && <span className="voice-status" role="status">{voiceStatus}</span>}
        </div>
      </div>

      <button className="primary" type="submit" disabled={loading || !product.trim()}>
        {loading ? "Generating..." : "Generate listing"}
      </button>
    </form>
  );
}
