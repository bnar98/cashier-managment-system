<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { Item } from "$lib/models/item";
    import type { Stock } from "$lib/models/stock";
    import { supabase } from "$lib/supabase";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import {
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell,
        InformationCircle,
        Button,
        Modal,
        Label,
        Input,
        Spinner,
    } from "flowbite-svelte";
    let loading = false;
    let stock: Stock[] = [];
    let itemData: Item = {
        barcode: "",
        name: "",
        id: 0,
        purchase_price: 0,
        wholesale_price: 0,
        unit_price: 0,
    };
    getStock();
    async function getStock() {
        loading = true;
        await supabase
            .from("item")
            .select("*,stock(*)")
            .eq("id", $page.params.item_id)
            .single()
            .then((response: any) => {
                itemData = response.data;
                console.log(itemData);
                stock = response.data.stock;
            });
        loading = false;
    }
    let formModal = false;
    let stockData: Stock = {
        expire_date: new Date(),
        purchase_date: new Date(),
        quantity: 0,
    };
    async function submitItemsToStock() {
        loading = true;
        let quantity = 0;
        for (let itemInStock of stock) {
            quantity += itemInStock.quantity;
        }
        await supabase
            .from("item")
            .update({
                quantity: quantity + stockData.quantity,
            })
            .eq("id", $page.params.item_id);

        const { data, error } = await supabase
            .from("stock")
            .insert({
                expire_date: stockData.expire_date,
                purchase_date: stockData.purchase_date,
                quantity: stockData.quantity,
                item_id: $page.params.item_id,
            })
            .select("id");

        loading = false;
        formModal = false;
        stockData = {
            expire_date: new Date(),
            purchase_date: new Date(),
            quantity: 0,
        };
        getStock();
    }
    async function updateItemData() {
        loading = true;
        const { error } = await supabase
            .from("item")
            .update({
                name: itemData.name,
                barcode: itemData.barcode,
                purchase_price: itemData.purchase_price,
                unit_price: itemData.unit_price,
                wholesale_price: itemData.wholesale_price,
            })
            .eq("id", $page.params.item_id);

        if (!error) {
            getStock();
        }
        loading = false;
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
            {#if loading}
                <Spinner class="mr-3" size="4" color="white" />
            {/if}
            زیادکردنی كاڵا بۆ كۆگا
        </Button>
    </form>
</Modal>

<div class="p-3 flex justify-end pt-20 pb-10">
    <Button
        on:click={() => {
            formModal = true;
        }}
    >
        {#if loading}
            <Spinner class="mr-3" size="4" color="white" />
        {/if}
        کڕینی کاڵای تازە</Button
    >
    <Button class="mx-2" on:click={updateItemData}>
        {#if loading}
            <Spinner class="mr-3" size="4" color="white" />
        {/if}
        گۆرینی داتای کاڵا</Button
    >
</div>
<div class="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
    <div>
        <Label class="space-y-2">
            <span>ناوی کاڵا</span>
            <Input type="text" bind:value={itemData.name} />
        </Label>
    </div>
    <div>
        <Label class="space-y-2">
            <span>بارکۆد </span>
            <Input type="text" bind:value={itemData.barcode} />
        </Label>
    </div>
    <div>
        <Label class="space-y-2">
            <span>نرخی کڕین</span>
            <Input type="number" bind:value={itemData.purchase_price} />
        </Label>
    </div>
    <div>
        <Label class="space-y-2">
            <span>نرخی فرۆشتنی تاک</span>
            <Input type="number" bind:value={itemData.unit_price} />
        </Label>
    </div>
    <div>
        <Label class="space-y-2">
            <span>نرخی فرۆشتنی کۆ</span>
            <Input type="number" bind:value={itemData.wholesale_price} />
        </Label>
    </div>
</div>
<Table divClass="w-full mt-10 text-right">
    <TableHead>
        <TableHeadCell>بەرواری کڕین</TableHeadCell>
        <TableHeadCell>سەرجەمی کاڵا</TableHeadCell>
        <TableHeadCell>بەرواری بەسەرچون</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each stock as item}
            <TableBodyRow>
                <TableBodyCell>{item.purchase_date}</TableBodyCell>
                <TableBodyCell>{item.quantity}</TableBodyCell>

                <TableBodyCell>{item.expire_date}</TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
