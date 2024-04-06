import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URI;
const supabaseKey = process.env.SUPABASE_ANON_PUBLIC_KEY;

export const db_client = createClient(supabaseUrl, supabaseKey);

