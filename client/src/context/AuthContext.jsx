/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-empty */

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function jsonFetch(url, options = {}) {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
    }
  useEffect(() => {
    (async () => {
      try {
        const { user } = await jsonFetch("/api/auth/me");
        setUser(user);
      } catch { setUser(null); }
      finally { setLoading(false); }
    })();
  }, []);

  const login = async (email, password) => {
    try {
      const { user } = await jsonFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Invalid credentials" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { user } = await jsonFetch("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
      setUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Signup failed" };
    }
  };

  const logout = async () => {
    try { await jsonFetch("/api/auth/logout", { method: "POST" }); } catch {}
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
