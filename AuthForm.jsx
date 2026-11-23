import { useState } from "react";
import { supabase } from "./supabase.js";

export default function AuthForm() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isSignUp = mode === "signup";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    const credentials = { email: email.trim(), password };
    const { data, error: authError } = isSignUp
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    if (authError) {
      setError(authError.message);
    } else if (isSignUp && !data.session) {
      setNotice("Account created. Check your email to confirm it, then sign in.");
      setMode("signin");
    }
    setLoading(false);
  }

  return (
    <form className="panel auth" onSubmit={handleSubmit}>
      <h2>{isSignUp ? "Create your account" : "Sign in"}</h2>
      <p className="muted">Your generated listings are saved to your account so you can reuse them.</p>

      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={6}
          required
        />
      </label>

      {error && <div className="error" role="alert">{error}</div>}
      {notice && <div className="notice" role="status">{notice}</div>}

      <button className="primary" type="submit" disabled={loading}>
        {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
      </button>

      <button
        type="button"
        className="link"
        onClick={() => { setMode(isSignUp ? "signin" : "signup"); setError(""); setNotice(""); }}
      >
        {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </form>
  );
}
