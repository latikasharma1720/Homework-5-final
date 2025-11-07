import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error("❌ Missing Supabase URL or Service Role key in .env file");
  process.exit(1);
}

// Create a Supabase client using the Service Role key
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

console.log("✅ Connected to Supabase successfully");