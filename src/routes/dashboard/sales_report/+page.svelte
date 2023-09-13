<script lang="ts">
    import Card from "$lib/components/card.svelte";
    import {
        Button,
        Checkbox,
        Dropdown,
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

    export let data: PageData;

    let saleTypeFilter = "";
    let saleData: saleReport[] = [];
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
            .from("sale")
            .select("*,sale_detail(*)")
            .gte("created_at", filterData.startDate)
            .eq(saleTypeFilter ? "sale_type" : "", saleTypeFilter)
            .lte("created_at", filterData.endDate)
            .then((response) => {
                saleData = response.data as saleReport[];
                saleData?.forEach((item) => {
                    amountData.totalPrice += item.total_price;
                    amountData.quantity += item.quantity;
                    amountData.totalItem += item.total_item;
                    amountData.totalPurchasePrice += item.total_purchase_price;
                });
            });
    }
    function updateSaleType(saleType: SaleTypeEnum) {
        if (saleTypeFilter == saleType) {
            saleTypeFilter = "";
            return;
        }
        saleTypeFilter = saleType;
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
        <div class="flex items-end">
            <Label class="space-y-2">
                <Button>جۆری فرۆشتن</Button>
                <Dropdown class="w-44 p-3 space-y-3 text-sm">
                    <li>
                        <Checkbox
                            class="mx-2"
                            on:change={() =>
                                updateSaleType(SaleTypeEnum.Single)}
                            checked={saleTypeFilter == SaleTypeEnum.Single}
                        />تاک
                    </li>
                    <li>
                        <Checkbox
                            class="mx-2"
                            on:change={() =>
                                updateSaleType(SaleTypeEnum.Wholesale)}
                            checked={saleTypeFilter == SaleTypeEnum.Wholesale}
                        />کۆ
                    </li>
                </Dropdown>
            </Label>
        </div>
        <div class="w-full flex justify-end items-center col-span-8">
            <Button on:click={getSales}>گەڕان</Button>
        </div>
    </div>
    <Card data={amountData} />
    <Table divClass="w-full mt-10 text-right">
        <TableHead>
            <TableHeadCell>جۆری فرۆشتن</TableHeadCell>
            <TableHeadCell>بەروار</TableHeadCell>
            <TableHeadCell>سەرجەمی نرخی فرۆشتن</TableHeadCell>
            <TableHeadCell>سەرجەمی نرخی کڕین</TableHeadCell>
            <TableHeadCell>سەرجەمی کاڵاکان</TableHeadCell>
            <TableHeadCell />
        </TableHead>
        <TableBody>
            {#each saleData as item}
                <TableBodyRow>
                    <TableBodyCell
                        >{item.sale_type == SaleTypeEnum.Single
                            ? "تاک"
                            : "کۆ"}</TableBodyCell
                    >
                    <TableBodyCell
                        >{item.created_at?.split("T")[0]}</TableBodyCell
                    >

                    <TableBodyCell>{item.total_price}</TableBodyCell>
                    <TableBodyCell>{item.total_purchase_price}</TableBodyCell>
                    <TableBodyCell>{item.total_item}</TableBodyCell>
                    <TableBodyCell>
                        <InformationCircle
                            class="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 h-10 w-10 rounded-md "
                            on:click={() => {
                                goto(`/dashboard/sale_detail/${item.id}`);
                            }}
                        />
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
