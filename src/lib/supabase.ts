import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://njnsahbccxtnsntsppdw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qbnNhaGJjY3h0bnNudHNwcGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTc1MzQsImV4cCI6MjA2OTg3MzUzNH0.1XFWkiYdiJ3XMzDh3IJRHy7IeBHQn7OxwIrr3Hddq7Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)