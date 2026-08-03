import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  guest_count: string;
  budget_range: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Memory {
  id: string;
  name: string;
  message: string;
  photo: string;
  created_at: string;
}

export interface RsvpGuest {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'attending' | 'declined';
  meal: string;
  created_at: string;
}

export interface CountdownEvent {
  id: string;
  name: string;
  event_date: string;
  created_at: string;
}
