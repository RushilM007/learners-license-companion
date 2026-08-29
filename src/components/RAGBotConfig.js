import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICEROLE_KEY
);