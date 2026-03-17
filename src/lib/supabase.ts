import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://epeevdretbfzqelzikuu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZWV2ZHJldGJmenFlbHppa3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MTYxMTYsImV4cCI6MjA4OTI5MjExNn0.TFH1VP4NgtekEzTSyWWLOKWcDd4L7NZf_Gt1Rsu5GAk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
