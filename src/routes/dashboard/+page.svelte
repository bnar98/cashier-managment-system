<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    onMount(() => {
        goto("/dashboard/sale");
    });
</script>
