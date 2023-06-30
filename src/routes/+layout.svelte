<script lang="ts">
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase";
  import "../app.postcss";
  import "./styles.scss";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  onMount(() => {
    supabase.auth.getSession().then((response) => {
      console.log(response.data.session);
      if (response.data.session === null) {
        if ($page.url.pathname != "/login") {
          goto("/login");
        }
      }
      if (response.data.session !== null) {
        if ($page.url.pathname === "/login") goto("/dashboard/sale");
      }
    });
  });
</script>

<main>
  <slot />
</main>
