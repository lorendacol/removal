import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnkpdaocnkhnmxthzhvy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRua3BkYW9jbmtobm14dGh6aHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjAxMTksImV4cCI6MjA1ODQzNjExOX0.1cqPjNnFlhSK_buSVHYhDOYWoU4B_MSdCvIZUTFBHRE';

export const supabase = createClient(supabaseUrl, supabaseKey);