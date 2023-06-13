<script lang="ts">
    import { supabase } from "$lib/supabase";
    import {
        Label,
        Input,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Button,
        Search,
    } from "flowbite-svelte";
    import type { PageData } from "./$types";
    import type { saleDetail } from "$lib/models/sale";
    import { PaymentTypeEnum } from "$lib/models/paymentTypeEnum";
    import { SaleTypeEnum } from "$lib/models/saleTypeEnum";
    import { Trash } from "svelte-heros-v2";

    export let data: PageData;
    let saleData: any[] = [];
    let newItemData = {
        quantity: 1,
        barcode: "",
    };
    let searchResult: any[] = [];
    let showAutoComplete = false;
    let searchResultItemName = "";
    let manualAddItemData: undefined | any = undefined;
    async function addNewRow() {
        let responseData: any;
        if (!manualAddItemData) {
            const response = await supabase
                .from("item")
                .select("*")
                .eq("barcode", newItemData.barcode)
                .single();
            if (response.error) return;
            responseData = response.data;
        }
        let id = manualAddItemData?.id ?? responseData?.id;
        let index = saleData.findIndex((item) => item.item_id == id);
        if (index == -1) {
            saleData.unshift({
                item_id: manualAddItemData?.id ?? responseData.id,
                quantity: manualAddItemData?.quantity ?? newItemData.quantity,
                total_price: manualAddItemData
                    ? manualAddItemData?.unit_price * newItemData.quantity
                    : responseData.unit_price * newItemData.quantity,
                unit_price:
                    manualAddItemData?.unit_price ?? responseData.unit_price,
                item_name: manualAddItemData?.name ?? responseData.name,
                item_barcode:
                    manualAddItemData?.barcode ?? responseData.barcode,
            });

            saleData = [...saleData];
        } else {
            saleData[index].quantity += +newItemData.quantity;
            saleData[index].total_price += manualAddItemData
                ? manualAddItemData.unit_price * newItemData.quantity
                : responseData.unit_price * newItemData.quantity;
            saleData = [...saleData];
        }
        newItemData = {
            quantity: 1,
            barcode: "",
        };
        manualAddItemData = undefined;
        searchResultItemName = "";
    }

    async function addNewSale() {
        console.log(saleData);
        await supabase.rpc("insert_sale_and_sale_detail", {
            sale_data: {
                payment_type: PaymentTypeEnum.Cash,
                sale_type: SaleTypeEnum.Single,
            },
            sale_detail_data: saleData,
        });
    }
    async function searchItemByName(e: any) {
        showAutoComplete = true;
        const response = await supabase
            .from("item")
            .select("*")
            .like("name", `%${e.target?.value}%`);
        searchResult = response.data as any[];
    }
    function deleteItem(itemId: number) {
        let index = saleData.findIndex(
            (saleItem) => saleItem.item_id == itemId
        );
        saleData.splice(index, 1);
        saleData = [...saleData];
    }
</script>

<div class="p-5 mt-12 w-full flex justify-end items-center">
    <Button on:click={addNewSale}>فرۆشتن</Button>
</div>
<div class=" p-10 flex-wrap w-full">
    <Label class="space-y-2 py-5 w-1/2">
        <span>باڕکۆد </span>
        <Input
            type="text"
            placeholder="باڕکۆد"
            class="w-72"
            bind:value={newItemData.barcode}
            autofocus
            on:change={addNewRow}
        />
    </Label>
    <h1 class="text-black dark:text-white pt-10 text-xl pb-2">
        زیادکردن بە دەستی
    </h1>
    <div class="flex flex-wrap w-full">
        <Label class="space-y-2 py-5">
            <span>باڕکۆد </span>
            <Input
                type="text"
                placeholder="باڕکۆد"
                class="w-72"
                bind:value={newItemData.barcode}
            />
        </Label>
        <Label class="space-y-2 pr-10 py-5">
            <span>سەرجەم</span>
            <Input
                type="number"
                placeholder="سەرجەم"
                class="w-72"
                bind:value={newItemData.quantity}
            />
        </Label>
        <Label class="space-y-2 px-10 py-5 w-96">
            <span>گەڕان بە پێی ناوی کاڵا</span>
            <Search
                size="md"
                on:input={searchItemByName}
                on:blur={() => {
                    setTimeout(() => {
                        showAutoComplete = false;
                    }, 200);
                }}
                bind:value={searchResultItemName}
            />
            {#if searchResult.length > 0 && showAutoComplete}
                <div
                    class="w-full bg-gray-100 dark:bg-gray-700 rounded-lg py-2"
                >
                    {#each searchResult as item}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="font-medium py-2 px-4 text-md hover:bg-gray-300 dark:hover:bg-gray-600 w-full cursor-pointer"
                            on:click={() => {
                                newItemData.barcode = item.barcode;
                                searchResultItemName = item.name;
                                manualAddItemData = item;
                            }}
                        >
                            {item.name}
                        </div>
                    {/each}
                </div>
            {/if}
        </Label>
        <div class="px-5 mt-12">
            <Button on:click={addNewRow}>زیادکردن</Button>
        </div>
    </div>

    <Table divClass="w-full mt-10 text-right">
        <TableHead>
            <TableHeadCell>ناوی کاڵا</TableHeadCell>
            <TableHeadCell>باڕکۆد</TableHeadCell>
            <TableHeadCell>سەرجەم</TableHeadCell>
            <TableHeadCell>نرخی هەمووی</TableHeadCell>
            <TableHeadCell />
        </TableHead>
        <TableBody>
            {#each saleData as item}
                <TableBodyRow>
                    <TableBodyCell>{item.item_name}</TableBodyCell>
                    <TableBodyCell>{item.item_barcode}</TableBodyCell>
                    <TableBodyCell>
                        <Input
                            type="number"
                            placeholder="سەرجەم"
                            bind:value={item.quantity}
                            on:input={() => {
                                item.total_price =
                                    item.quantity * item.unit_price;
                                saleData = [...saleData];
                            }}
                        /></TableBodyCell
                    >
                    <TableBodyCell>{item.total_price}</TableBodyCell>
                    <TableBodyCell>
                        <Trash
                            class="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 h-10 w-10 rounded-md text-primary-600"
                            on:click={() => deleteItem(item.id)}
                        />
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
