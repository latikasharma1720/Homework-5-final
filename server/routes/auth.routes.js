// server/routes/auth.routes.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../db/supabase.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,          // set true when deploying behind HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data: existing, error: e1 } = await supabase
      .from("users").select("id").eq("email", email).maybeSingle();
    if (e1) throw e1;
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const { data: user, error: e2 } = await supabase
      .from("users")
      .insert([{ name, email, password_hash }])
      .select("id, name, email")
      .single();
    if (e2) throw e2;

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.cookie("token", token, COOKIE_OPTS);
    return res.json({ user });
  } catch {
    return res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password_hash")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.cookie("token", token, COOKIE_OPTS);
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true });
});

router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.json({ user: null });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: { id: decoded.id, name: decoded.name, email: decoded.email } });
  } catch {
    return res.json({ user: null });
  }
});

export default router;
