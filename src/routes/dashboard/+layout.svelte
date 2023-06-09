<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        DarkMode,
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
        Sidebar,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper,
        Drawer,
        CloseButton,
        SidebarDropdownWrapper,
    } from "flowbite-svelte";
    import { Cog } from "svelte-heros-v2";
    import { sineIn } from "svelte/easing";

    let transitionParams = {
        x: 320,
        duration: 200,
        easing: sineIn,
    };
    export let data: PageData;

    let breakPoint: number = 1024;
    let width: number;
    let backdrop: boolean = false;
    let activateClickOutside = true;
    let drawerHidden: boolean = false;
    $: if (width >= breakPoint) {
        drawerHidden = false;
        activateClickOutside = false;
    } else {
        drawerHidden = true;
        activateClickOutside = true;
    }
    onMount(() => {
        if (width >= breakPoint) {
            drawerHidden = false;
            activateClickOutside = false;
        } else {
            drawerHidden = true;
            activateClickOutside = true;
        }
    });
    const toggleSide = () => {
        if (width < breakPoint) {
            drawerHidden = !drawerHidden;
        }
    };
    const toggleDrawer = () => {
        drawerHidden = false;
    };
    $: activeUrl = $page.url.pathname;
    let spanClass =
        "pl-2 self-center text-md text-gray-900 whitespace-nowrap dark:text-white";
    let darkmodebtn =
        "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed left-2 top-12  md:top-3 md:left-2 z-50";
</script>

<svelte:window bind:innerWidth={width} />

<DarkMode btnClass={darkmodebtn} />
<NavHamburger on:click={toggleDrawer} btnClass="ml-3 lg:hidden" />
<!-- <Navbar let:hidden let:toggle navClass="bg-red-600">
    <NavBrand href="/" class="lg:ml-64">
        <Cog />
        <span
            class="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-4"
        >
            My Website
        </span>
    </NavBrand>
</Navbar> -->
<Drawer
    transitionType="fly"
    {backdrop}
    {transitionParams}
    bind:hidden={drawerHidden}
    bind:activateClickOutside
    width="w-64"
    class="overflow-auto pb-32 left-auto right-0"
    id="sidebar"
>
    <div class="flex items-center">
        <CloseButton
            on:click={() => (drawerHidden = true)}
            class="mb-4 dark:text-white lg:hidden"
        />
    </div>
    <Sidebar asideClass="w-54 right-0 left-auto">
        <SidebarWrapper
            divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800"
        >
            <SidebarGroup>
                {#each data.pages as { meta, path }}
                    <SidebarItem
                        label={meta.title}
                        href={`${path}`}
                        {spanClass}
                        on:click={toggleSide}
                        active={activeUrl === `/pages/${path}`}
                    />
                {/each}
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
</Drawer>

<div
    class="flex px-4 mx-auto w-full bg-gray-200 dark:bg-gray-900"
    style="min-height: calc(100vh - 0px);"
>
    <main class="lg:mr-72 w-full mx-auto">
        <slot />
    </main>
</div>
