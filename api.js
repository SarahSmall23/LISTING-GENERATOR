import { supabase } from "./supabase.js";

const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 204) return null;

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.errors?.join(". ") || body.error || "Something went wrong. Please try again.");
  }
  return body;
}

export const generateListing = (payload) =>
  request("/api/generate", { method: "POST", body: JSON.stringify(payload) });

export const fetchHistory = () => request("/api/history");

export const deleteListing = (id) => request(`/api/history/${id}`, { method: "DELETE" });

export const fetchBrand = () => request("/api/brand");

export const saveBrand = (voice) =>
  request("/api/brand", { method: "PUT", body: JSON.stringify({ voice }) });
