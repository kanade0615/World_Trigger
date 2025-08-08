import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          stats: {
            trion: number;
            speed: number;
            range: number;
            attack: number;
            defenseSupport: number;
            technique: number;
          };
          triggers: {
            main: string[];
            sub: string[];
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          stats: {
            trion: number;
            speed: number;
            range: number;
            attack: number;
            defenseSupport: number;
            technique: number;
          };
          triggers: {
            main: string[];
            sub: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          stats?: {
            trion: number;
            speed: number;
            range: number;
            attack: number;
            defenseSupport: number;
            technique: number;
          };
          triggers?: {
            main: string[];
            sub: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};