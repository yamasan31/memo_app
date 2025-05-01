import { createClient } from '@supabase/supabase-js';

// 環境変数を使用する方法（推奨）
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);