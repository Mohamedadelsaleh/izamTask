import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const saveNav = async (data) => {
  const { error } = await supabase
    .from('nav_data')
    .insert([{ data }]);
  
  if (error) throw error;
  return true;
};

export const loadNav = async () => {
  const { data, error } = await supabase
    .from('nav_data')
    .select('data')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0]?.data || null;
};