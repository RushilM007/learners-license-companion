import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const privateKey = process.env.VITE_SUPABASE_SERVICEROLE_KEY
const url = process.env.VITE_SUPABASE_URL
export const supabase = createClient(url, privateKey);