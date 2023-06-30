<script lang="ts">
    import Card from "$lib/components/card.svelte";
    import {
        Button,
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

    export let data: PageData;

    let itemData: Item[] = [];
    let amountData = {
        totalPrice: 0,
        quantity: 0,
        totalItem: 0,
        totalPurchasePrice: 0,
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let filterData = {
        startDate: moment(new Date()).format("YYYY-MM-DD"),
        endDate: moment(tomorrow).format("YYYY-MM-DD"),
    };
    getSales();
    async function getSales() {
        await supabase
            .from("item")
            .select("*,stock(*)")
            .then((response) => {
                itemData = response.data as Item[];
            });
    }
</script>

<div class="p-10">
    <div class="grid grid-cols-4 py-10 bg-white my-4 px-4 gap-2">
        <div class="">
            <Label class="space-y-2">
                <span>بەرواری سەرەتا</span>
                <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    bind:value={filterData.startDate}
                />
            </Label>
        </div>
        <div class="">
            <Label class="space-y-2">
                <span>بەرواری کۆتا</span>
                <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    bind:value={filterData.endDate}
                />
            </Label>
        </div>
        <div class="w-full flex justify-end items-center col-span-8">
            <Button on:click={getSales}>گەڕان</Button>
        </div>
    </div>
    <Table divClass="w-full mt-10 text-right">
        <TableHead>
            <TableHeadCell>ناوی کاڵا</TableHeadCell>
            <TableHeadCell>بارکۆدی کاڵا</TableHeadCell>
            <TableHeadCell>نرخی فرۆشتنی تاک</TableHeadCell>
            <TableHeadCell>نرخی کڕین</TableHeadCell>
            <TableHeadCell>نرخی فرۆشتنی کۆ</TableHeadCell>
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
                        <InformationCircle
                            class="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 h-10 w-10 rounded-md "
                            on:click={() => {
                                console.log(item);
                                goto(`/dashboard/items/${item.id}`);
                            }}
                        />
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
