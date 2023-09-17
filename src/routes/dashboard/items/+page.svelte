<script lang="ts">
    import Card from "$lib/components/card.svelte";
    import {
        Button,
        ButtonGroup,
        Input,
        Label,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import type { PageData } from "./$types";
    import { supabase } from "$lib/supabase";
    import type { saleReport } from "$lib/models/sale";
    import { Trash, InformationCircle } from "svelte-heros-v2";
    import moment from "moment";
    import { PaymentTypeEnum } from "$lib/models/paymentTypeEnum";
    import { SaleTypeEnum } from "$lib/models/saleTypeEnum";
    import { goto } from "$app/navigation";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import type { Item } from "$lib/models/item";
    import { ChevronLeft, ChevronRight } from "svelte-heros-v2";
    import { onMount } from "svelte";

    export let data: PageData;

    let page = 1;
    let totalItems = 0;
    let itemData: Item[] = [];
    let amountData = {
        totalSinglePrice: 0,
        totalWholesalePrice: 0,
        quantity: 0,
        totalPurchasePrice: 0,
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let filterData = {
        startDate: moment(new Date()).format("YYYY-MM-DD"),
        endDate: moment(tomorrow).format("YYYY-MM-DD"),
        barcode: "",
    };
    onMount(async () => {
        await getSales();
        await calculateTotalAmount();
    });
    async function getSales() {
        await supabase
            .from("item")
            .select("*,stock(*)")
            .like("barcode", `%${filterData.barcode}%`)
            .range((page - 1) * 8, page * 8 - 1)
            .then((response) => {
                itemData = response.data as Item[];
            });
        const countResponse = await supabase
            .from("item")
            .select("count", { count: "exact" })
            .single();
        totalItems = countResponse.count ?? 0;
    }

    async function calculateTotalAmount() {
        amountData = {
            totalSinglePrice: 0,
            totalWholesalePrice: 0,
            quantity: 0,
            totalPurchasePrice: 0,
        };
        await supabase
            .rpc("calculate_total_amount")
            .single()
            .then((response: any) => {
                amountData = {
                    totalSinglePrice: response.data.total_unit_sale_price,
                    totalWholesalePrice: response.data.total_wholesale_price,
                    quantity: response.data.total_quantity,
                    totalPurchasePrice: response.data.total_purchase_price,
                };
            });
    }
    async function updateQuantity(id?: number) {
        if (!id) return;
        await supabase
            .from("item")
            .update({
                quantity: itemData.find((item) => item.id == id)?.quantity,
            })
            .eq("id", id);
        getSales();
    }

    function nextPage() {
        if (page * 10 > totalItems) return;
        page++;
        getSales();
    }
    function prevPage() {
        if (page == 1) return;
        page--;
        getSales();
    }
</script>

<div class="p-10">
    <div class=" py-10 bg-white my-4 px-4">
        <div class="w-[300px]">
            <Label class="space-y-2">
                <Input
                    id="birthday"
                    name="birthday"
                    placeholder="باڕکۆد"
                    bind:value={filterData.barcode}
                    on:change={() => {
                        getSales();
                    }}
                />
            </Label>
        </div>

        <div class="w-full flex justify-end items-center col-span-8">
            <Button on:click={getSales}>گەڕان</Button>
        </div>
        <h1>
            کۆی گشتی نرخی کڕینی هەموكاڵاکان : <span
                >{amountData.totalPurchasePrice?.toLocaleString()}</span
            >
        </h1>
        <h1>
            کۆی گشتی نرخی فرۆشتنی هەموكاڵاکان بە تاک : <span
                >{amountData.totalSinglePrice?.toLocaleString()}</span
            >
        </h1>
        <h1>
            کۆی گشتی نرخی فرۆشتنی هەموكاڵاکان بە کۆ : <span
                >{amountData.totalWholesalePrice?.toLocaleString()}</span
            >
        </h1>
        <h1>
            عددی هەموو کاڵاکان: <span
                >{amountData.quantity?.toLocaleString()}</span
            >
        </h1>
    </div>
    <Table divClass="w-full mt-10 text-right">
        <TableHead>
            <TableHeadCell>ناوی کاڵا</TableHeadCell>
            <TableHeadCell>بارکۆدی کاڵا</TableHeadCell>
            <TableHeadCell>نرخی فرۆشتنی تاک</TableHeadCell>
            <TableHeadCell>نرخی کڕین</TableHeadCell>
            <TableHeadCell>نرخی فرۆشتنی کۆ</TableHeadCell>
            <TableHeadCell>عدد</TableHeadCell>
            <TableHeadCell />
        </TableHead>
        <TableBody>
            {#each itemData as item}
                <TableBodyRow>
                    <TableBodyCell>{item.name}</TableBodyCell>
                    <TableBodyCell>{item.barcode}</TableBodyCell>

                    <TableBodyCell>{item.unit_price}</TableBodyCell>
                    <TableBodyCell>{item.purchase_price}</TableBodyCell>
                    <TableBodyCell>{item.wholesale_price}</TableBodyCell>
                    <TableBodyCell>
                        <Input bind:value={item.quantity} />
                    </TableBodyCell>
                    <TableBodyCell>
                        <div class="flex items-center justify-between">
                            <InformationCircle
                                class="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 h-10 w-10 rounded-md "
                                on:click={() => {
                                    console.log(item);
                                    goto(`/dashboard/items/${item.id}`);
                                }}
                            />
                            <Button on:click={() => updateQuantity(item.id)}
                                >گۆڕینی عدد</Button
                            >
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <div class="mt-2 flex justify-end">
        <h1>کۆی گشتی : {totalItems}</h1>
    </div>
    <div class="w-full my-4 flex justify-end">
        <Button color="light" on:click={prevPage}><ChevronRight /></Button>
        <Button color="light" on:click={nextPage}><ChevronLeft /></Button>
    </div>
</div>
