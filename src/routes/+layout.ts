// src/routes/+layout.ts


import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

};

