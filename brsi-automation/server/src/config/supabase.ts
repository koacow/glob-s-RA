import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Database } from '../models/database.supabase';

dotenv.config();

const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const supabase = createClient<Database>(supabaseURL, supabaseKey);

export default supabase;