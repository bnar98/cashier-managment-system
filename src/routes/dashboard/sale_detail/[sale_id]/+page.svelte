<script lang="ts">
    import {
        Button,
        Input,
        Label,
        Modal,
        NumberInput,
        Search,
        Spinner,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import { supabase } from "$lib/supabase";
    import { Trash } from "svelte-heros-v2";
    import { PaymentTypeEnum } from "$lib/models/paymentTypeEnum";
    import { SaleTypeEnum } from "$lib/models/saleTypeEnum";
    import { page } from "$app/stores";
    import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
    import { dataset_dev } from "svelte/internal";

    interface InsertWholesaleData {
        item_id?: number;
        quantity: number;
        total_price: number;
        item_name?: string;
        item_barcode?: string;
        total_purchase_price: number;
        purchase_price: number;
        id?: number;
        unit_price: number;
    }
    let saleData: InsertWholesaleData[] = [];
    let newItemData = {
        quantity: 1,
        barcode: "",
        id: 0,
        unit_price: 0,
        name: "",
        purchase_price: 0,
    };
    let givePrice: undefined | number = undefined;
    let popupModal = false;
    let showAutoComplete = false;
    let searchResult: any[] = [];
    let searchBarcodeResult: any[] = [];
    let showBarcodeAutoComplete = false;
    let totalPrice = 0;
    let loading = false;
    let saleType: SaleTypeEnum = SaleTypeEnum.Single;
    $: {
        totalPrice = 0;
        for (let item of saleData) {
            totalPrice += item.total_price;
        }
    }
    getSaleDetail();
    async function getSaleDetail() {
        await supabase
            .from("sale_detail")
            .select("*, item:item_id(*),sale:sale_id(*)")
            .eq("sale_id", $page.params.sale_id)
            .then((response) => {
                saleType = response.data![0]?.sale.sale_type;
                for (let field of response.data!) {
                    saleData.push({
                        item_id: field.item_id,
                        quantity: field.quantity,
                        total_price: field.total_price,
                        item_name: field.item?.name,
                        item_barcode: field.item?.barcode,
                        total_purchase_price: field.item?.purchase_price!,
                        purchase_price: field.item?.purchase_price!,
                        id: field.id,
                        unit_price: field.unit_price,
                    });
                    saleData = [...saleData];
                }
            });
    }
    async function addRowByBarcode() {
        loading = true;
        const { data, error } = await supabase
            .from("item")
            .select("*")
            .eq("barcode", newItemData.barcode)
            .single();
        if (data) {
            insertDataToSaleData(data);
        }
        loading = false;
    }

    async function searchItemByName(e: any) {
        showAutoComplete = true;
        const response = await supabase
            .from("item")
            .select("*")
            .like("name", `%${e.target?.value}%`);
        searchResult = response.data as any[];
    }
    async function searchItemByBarcode(e: any) {
        loading = true;
        console.log(e.target?.value);
        showBarcodeAutoComplete = true;
        const response = await supabase
            .from("item")
            .select("*")
            .like("barcode", `%${e.target?.value}%`);
        loading = false;
        searchBarcodeResult = response.data as any[];
    }
    function insertDataToSaleData(data: any) {
        let index = saleData.findIndex((item) => item.item_id == data?.id);
        if (index == -1) {
            saleData.unshift({
                item_id: data?.id,
                quantity: newItemData?.quantity,
                total_price: data?.unit_price * newItemData?.quantity,
                unit_price: data?.unit_price,
                item_name: data?.name,
                item_barcode: data?.barcode,
                total_purchase_price:
                    data?.purchase_price * newItemData?.quantity,
                purchase_price: data?.purchase_price,
            });
            saleData = [...saleData];
        } else {
            saleData[index].quantity += +newItemData.quantity;
            saleData[index].total_price =
                saleData[index].quantity * saleData[index].unit_price!;
            if (saleData[index].total_purchase_price) {
                saleData[index].total_purchase_price =
                    saleData[index].quantity * saleData[index].purchase_price!;
            }
            saleData = [...saleData];
        }
        newItemData = {
            quantity: 1,
            barcode: "",
            id: 0,
            unit_price: 0,
            name: "",
            purchase_price: 0,
        };
        showAutoComplete = false;
    }
    function deleteItem(itemId: number) {
        let index = saleData.findIndex(
            (saleItem) => saleItem.item_id == itemId
        );
        saleData.splice(index, 1);
        saleData = [...saleData];
    }
    async function addNewSale() {
        if (saleData.length == 0) return;
        let reportData = {
            quantity: 0,
            total_price: 0,
            total_purchase_price: 0,
            total_item: 0,
        };
        loading = true;
        for (let item of saleData) {
            reportData.quantity += item.quantity;
            reportData.total_price += item.total_price;
            reportData.total_purchase_price += item.total_purchase_price;
        }
        reportData.total_item = saleData.length;
        const { data, error } = await supabase.rpc(
            "update_sale_and_sale_detail",
            {
                sale_data: {
                    payment_type: PaymentTypeEnum.Cash,
                    sale_type: saleType,
                    quantity: reportData.quantity,
                    total_price: reportData.total_price,
                    total_purchase_price: reportData.total_purchase_price,
                    total_item: reportData.total_item,
                    id: $page.params.sale_id,
                },
                sale_detail_data: saleData,
            }
        );
        if (!error) {
            toasts.add({
                title: "سەرکەوتوو بوو",
                description: "کاڵاکە بە سەرکەوتویی گۆڕدرا",
                duration: 5000,
                placement: "top-left",
                type: "success",
                showProgress: true,
                onClick: () => {},
                onRemove: () => {},
            });
            saleData = [];

            getSaleDetail();
        }
        if (error) {
            toasts.add({
                title: "کێشەیەک ڕویدا",
                description: error.message,
                duration: 5000,
                placement: "top-left",
                type: "error",
                showProgress: true,
                onClick: () => {},
                onRemove: () => {},
            });
        }

        loading = false;
    }
</script>

<ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
</ToastContainer>
<div class="p-5 mt-12 w-full flex justify-between items-center">
    <h1 class="text-xl font-bold">لەم پەڕەیەدا فرۆشتن بە تاک داخڵ دەکەیت</h1>

    <Button
        on:click={addNewSale}
        disabled={saleData.length == 0 ? true : false}
    >
        {#if loading}
            <Spinner class="mr-3" size="4" />
        {/if}
        {saleData.length == 0
            ? "بۆ فرۆشتن پێویست ئەکات کاڵا داخڵ بکەیت"
            : "گۆڕینی"}
    </Button>
</div>
<div class=" p-10 w-full">
    <Label class="space-y-2 py-5 md:w-[27rem]">
        <span>باڕکۆد </span>
        <Input
            type="text"
            placeholder="باڕکۆد"
            class="w-72"
            bind:value={newItemData.barcode}
            autofocus
            on:change={addRowByBarcode}
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
                on:input={searchItemByBarcode}
                on:blur={() => {
                    setTimeout(() => {
                        showBarcodeAutoComplete = false;
                    }, 200);
                }}
            />
            {#if searchBarcodeResult.length > 0 && showBarcodeAutoComplete}
                <div
                    class="w-full bg-gray-100 dark:bg-gray-700 rounded-lg py-2"
                >
                    {#each searchBarcodeResult as item}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="font-medium py-2 px-4 text-md hover:bg-gray-300 dark:hover:bg-gray-600 w-full cursor-pointer"
                            on:click={() => {
                                newItemData.id = item.id;
                                newItemData.barcode = item.barcode;
                                newItemData.unit_price = item.unit_price;
                                newItemData.name = item.name;
                                newItemData.purchase_price =
                                    item.purchase_price;
                            }}
                        >
                            {item.name}
                        </div>
                    {/each}
                </div>
            {/if}
        </Label>
        <Label class="space-y-2 pr-10 py-5">
            <span>سەرجەم</span>
            <NumberInput
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
                bind:value={newItemData.name}
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
                                newItemData.id = item.id;
                                newItemData.barcode = item.barcode;
                                newItemData.unit_price = item.unit_price;
                                newItemData.name = item.name;
                                newItemData.purchase_price =
                                    item.purchase_price;
                            }}
                        >
                            {item.name}
                        </div>
                    {/each}
                </div>
            {/if}
        </Label>
        <div class="px-5 mt-12">
            <Button on:click={() => insertDataToSaleData(newItemData)}>
                {#if loading}
                    <Spinner class="mr-3" size="4" />
                {/if}
                زیادکردن</Button
            >
        </div>
    </div>
    <h1 class="mt-10 text-end text-xl font-medium">
        {`کۆی گشتی:${totalPrice}`}
    </h1>
    <Table divClass="w-full mt-5 text-right">
        <TableHead>
            <TableHeadCell>ناوی کاڵا</TableHeadCell>
            <TableHeadCell>باڕکۆد</TableHeadCell>
            <TableHeadCell>سەرجەم</TableHeadCell>
            <TableHeadCell>نرخی هەمووی</TableHeadCell>
            <TableHeadCell>نرخی کڕین</TableHeadCell>
            <TableHeadCell />
        </TableHead>
        <TableBody>
            {#each saleData as item}
                <TableBodyRow>
                    <TableBodyCell>{item.item_name}</TableBodyCell>
                    <TableBodyCell>{item.item_barcode}</TableBodyCell>
                    <TableBodyCell>
                        <NumberInput
                            type="number"
                            placeholder="سەرجەم"
                            bind:value={item.quantity}
                            on:input={() => {
                                console.log(item);
                                item.total_price =
                                    item.quantity * item.unit_price;
                                item.total_purchase_price =
                                    item.quantity * item.purchase_price;
                                saleData = [...saleData];
                            }}
                        /></TableBodyCell
                    >
                    <TableBodyCell>{item.total_price}</TableBodyCell>
                    <TableBodyCell>{item.total_purchase_price}</TableBodyCell>
                    <TableBodyCell>
                        <Trash
                            class="cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 p-2 h-10 w-10 rounded-md text-primary-600"
                            on:click={() => deleteItem(item.item_id ?? 0)}
                        />
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
