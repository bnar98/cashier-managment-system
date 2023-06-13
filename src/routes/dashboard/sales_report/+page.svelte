<script lang="ts">
    import Card from "$lib/components/card.svelte";
    import {
        Input,
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

    export let data: PageData;

    let saleData: saleReport[] = [];
    let amountData = {
        totalPrice: 0,
        totalItems: 0,
        totalItem: 0,
    };
    getSales();
    async function getSales() {
        await supabase
            .from("sale")
            .select("*,sale_detail(*)")
            .then((response) => {
                console.log(response);
                saleData = response.data as saleReport[];
                saleData.forEach((item) => {
                    item.sale_detail.forEach((detail) => {
                        amountData.totalPrice += detail.total_price;
                        amountData.totalItems += detail.quantity;
                    });
                });
            });
    }
</script>

<div class="p-10">
    <Card data={amountData} />
    <Table divClass="w-full mt-10 text-right">
        <TableHead>
            <TableHeadCell>ناوی کاڵا</TableHeadCell>
            <TableHeadCell>باڕکۆد</TableHeadCell>
            <TableHeadCell>سەرجەم</TableHeadCell>
            <TableHeadCell />
        </TableHead>
        <TableBody>
            {#each saleData as item}
                <TableBodyRow>
                    <TableBodyCell>{item.payment_type}</TableBodyCell>
                    <TableBodyCell>{item.sale_detail[0].quantity}</TableBodyCell
                    >

                    <TableBodyCell
                        >{item.sale_detail[0].total_price}</TableBodyCell
                    >
                    <TableBodyCell>
                        <InformationCircle
                            class="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 h-10 w-10 rounded-md "
                        />
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
