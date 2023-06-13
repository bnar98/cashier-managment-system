import { supabase } from "$lib/supabase";
import { redirect } from "@sveltejs/kit";

export const load = async () => {
    let page = "news";

    return {
        page
    }
}