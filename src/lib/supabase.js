import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjgyNTEyNDExLCJzdWIiOiJiODRkMGViMC0zMWQzLTQ2NDctODAwYi1lY2Q2MjU1ZmY0YWMiLCJlbWFpbCI6ImJuYXJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE2ODI1MDg4MTF9XSwic2Vzc2lvbl9pZCI6IjBhNTEyZTAwLTc5MzEtNDFiNi05N2I1LWYxMzM4MzljODQzZiJ9.SMKe0DNFk-_ODQEO0c6MaCBLOPziTzOC1ZgOZttFBo4"

export const supabase = createClient(supabaseUrl, supabaseKey)