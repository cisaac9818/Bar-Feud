import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://tebsymyrwpvrfohwyolx.supabase.co';
const supabaseKey = 'sb_publishable_moc2mm6_V7P7mIsHp7GtkA_N9_L3tIX';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };