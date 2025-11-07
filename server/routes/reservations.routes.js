import { Router } from "express";
import { supabase } from "../db/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data ?? []);
  } catch {
    res.status(500).json({ error: "Failed to load reservations" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, email, date, time, guests } = req.body || {};
    if (!first_name || !last_name || !phone || !email || !date || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("reservations")
      .insert([{ user_id: userId, first_name, last_name, phone, email, date, time, guests }])
      .select("*")
      .single();

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

export default router;
