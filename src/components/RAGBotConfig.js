import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const privateKey = import.meta.env.VITE_SUPABASE_SERVICEROLE_KEY
const url = import.meta.env.VITE_SUPABASE_URL
export const supabase = createClient(url, privateKey);