<script lang="ts">
    import {
        Label,
        Checkbox,
        A,
        Button,
        Input,
        Spinner,
        Modal,
    } from "flowbite-svelte";
    import type { PageData } from "./$types";
    import type { Item } from "$lib/models/item";
    import { supabase } from "$lib/supabase";
    import { DateInput } from "date-picker-svelte";
    import type { Stock } from "$lib/models/stock";

    export let data: PageData;
    let loading = false;
    let itemData: Item = {
        barcode: "",
        name: "",
        purchase_price: undefined,
        unit_price: undefined,
        wholesale_price: undefined,
    };
    let newItemId = 0;
    let formModal = false;
    let stockData: Stock = {
        expire_date: new Date(),
        purchase_date: new Date(),
        quantity: 0,
    };
    async function addNewItem() {
        loading = true;
        console.log("addedd");
        const { data, error } = await supabase
            .from("item")
            .insert(itemData)
            .select("id");

        loading = false;
        if (data) {
            formModal = true;
            newItemId = data[0].id;
        }
        itemData = {
            barcode: "",
            name: "",
            purchase_price: 0,
            unit_price: 0,
            wholesale_price: 0,
        };
    }
    async function submitItemsToStock() {
        loading = true;
        const { data, error } = await supabase
            .from("stock")
            .insert({
                expire_date: stockData.expire_date,
                purchase_date: stockData.purchase_date,
                quantity: stockData.quantity,
                item_id: newItemId,
            })
            .select("id");

        loading = false;
        formModal = false;
        stockData = {
            expire_date: new Date(),
            purchase_date: new Date(),
            quantity: 0,
        };
    }
</script>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
    <form
        class="flex flex-col space-y-6"
        action="#"
        style="height: calc(100vh - 150px);"
    >
        <h3
            class="mb-4 text-xl font-medium text-gray-900 dark:text-white text-end"
        >
            زیادکردنی كاڵا بۆ كۆگا
        </h3>
        <Label class="space-y-2">
            <span>سەرجەم</span>
            <Input
                type="number"
                placeholder="سەرجەمی ئەو کاڵایانەی کە کڕیوتە"
                bind:value={stockData.quantity}
            />
        </Label>
        <Label class="space-y-2">
            <span>expire date</span>
            <DateInput format="yyyy/MM/dd" bind:value={stockData.expire_date} />
        </Label>
        <Label class="space-y-2">
            <span>purchase date</span>
            <DateInput
                format="yyyy/MM/dd"
                bind:value={stockData.purchase_date}
            />
        </Label>
        <Button type="button" on:click={submitItemsToStock} class="w-full">
            زیادکردنی كاڵا بۆ كۆگا
        </Button>
    </form>
</Modal>
<div
    style="min-height: calc(100vh - 70px);"
    class="w-full flex justify-center items-center py-10"
>
    <div
        class="w-full md:w-3/4 bg-gray-300 dark:bg-gray-800 p-10 rounded-lg flex justify-center items-center"
        style="min-height: calc(100vh - 100px);"
    >
        <form class="w-full" on:submit={addNewItem}>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <Label for="first_name" class="mb-2">ناوی کاڵا</Label>
                    <Input
                        type="text"
                        placeholder="ناوی كالا داخڵ بکە"
                        required
                        bind:value={itemData.name}
                    />
                </div>
                <div>
                    <Label for="last_name" class="mb-2">باڕکۆد</Label>
                    <Input
                        type="text"
                        placeholder="باڕکۆدی کاڵا داخل بکە"
                        required
                        bind:value={itemData.barcode}
                    />
                </div>
                <div>
                    <Label for="company" class="mb-2">نرخی کڕین</Label>
                    <Input
                        type="number"
                        placeholder="0.000"
                        required
                        bind:value={itemData.purchase_price}
                    />
                </div>
                <div>
                    <Label for="phone" class="mb-2">نرخی تاک</Label>
                    <Input
                        type="number"
                        placeholder="0.000"
                        required
                        bind:value={itemData.unit_price}
                    />
                </div>
                <div>
                    <Label class="mb-2">نرخی جملە</Label>
                    <Input
                        type="number"
                        placeholder="0.000"
                        required
                        bind:value={itemData.wholesale_price}
                    />
                </div>
            </div>
            <div class="flex w-full justify-end">
                <Button type="submit">
                    {#if loading}
                        <Spinner class="mr-3" size="4" color="white" />
                    {/if}
                    زیادکردن</Button
                >
            </div>
        </form>
    </div>
</div>
