// server/routes/favorites.routes.js
import { Router } from "express";
import { supabase } from "../db/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Get current user's favorites
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId);  // Changed from r_id to user_id

    if (error) throw error;
    res.json(data ?? []);
  } catch (e) {
    console.error("Get favorites error:", e);
    res.status(500).json({ error: "Failed to load favorites" });
  }
});

// Add a favorite
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id, item_name, price, image } = req.body || {};
    if (!item_id) return res.status(400).json({ error: "Missing item_id" });

    const { data, error } = await supabase
      .from("favorites")
      .insert([{ 
        user_id: userId,        // Changed from r_id to user_id
        item_id, 
        item_name, 
        item_price: price,
        item_image: image
      }])
      .select("*")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error("Add favorite error:", e);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Remove a favorite
router.delete("/:itemId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)   // Changed from r_id to user_id
      .eq("item_id", itemId);

    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error("Remove favorite error:", e);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

export default router;