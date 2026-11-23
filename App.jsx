import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import AuthForm from "./AuthForm.jsx";
import ListingForm from "./ListingForm.jsx";
import Results from "./Results.jsx";
import History from "./History.jsx";
import { generateListing, fetchHistory, deleteListing, fetchBrand, saveBrand } from "./api.js";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [result, setResult] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [savedVoice, setSavedVoice] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      setHistory(await fetchHistory());
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadHistory();
      fetchBrand().then((b) => setSavedVoice(b.voice)).catch(() => {});
    } else {
      setHistory([]); setResult(null); setActiveId(null); setSavedVoice("");
    }
  }, [session, loadHistory]);

  async function handleSaveVoice(voice) {
    const saved = await saveBrand(voice);
    setSavedVoice(saved.voice);
  }

  async function handleSubmit(payload) {
    setLoading(true);
    setError("");
    try {
      const data = await generateListing(payload);
      setResult(data);
      setActiveId(data.id);
      loadHistory();
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(item) {
    setError("");
    setResult(item.result);
    setActiveId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    try {
      await deleteListing(id);
      setHistory((h) => h.filter((i) => i.id !== id));
      if (id === activeId) { setResult(null); setActiveId(null); }
    } catch (err) {
      setHistoryError(err.message);
    }
  }

  if (session === undefined) return null;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1>Listing Generator</h1>
            <p>Product copy for South African sellers, ready to post.</p>
          </div>
          {session && (
            <div className="account">
              <span>{session.user.email}</span>
              <button type="button" className="ghost" onClick={() => supabase.auth.signOut()}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {!session ? (
        <main className="auth-wrap"><AuthForm /></main>
      ) : (
        <main>
          <div className="layout">
            <ListingForm onSubmit={handleSubmit} loading={loading} savedVoice={savedVoice} onSaveVoice={handleSaveVoice} />
            <Results result={result} loading={loading} error={error} />
          </div>
          <History
            items={history}
            loading={historyLoading}
            error={historyError}
            activeId={activeId}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </main>
      )}
    </div>
  );
}
