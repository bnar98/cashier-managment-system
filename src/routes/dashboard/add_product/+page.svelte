<script lang="ts">
    import {
        Label,
        Button,
        Input,
        Spinner,
        Modal,
        Helper,
    } from "flowbite-svelte";
    import type { PageData } from "./$types";
    import type { Item } from "$lib/models/item";
    import { supabase } from "$lib/supabase";
    import { DateInput } from "date-picker-svelte";
    import type { Stock } from "$lib/models/stock";
    import ExistingItemModal from "$lib/components/existingItemModal.svelte";
    import { toasts, ToastContainer, FlatToast } from "svelte-toasts";

    type FormRules = {
        [key: string]: {
            required: boolean;
            message: string;
        };
    };
    let formRules: FormRules = {
        name: {
            required: true,
            message: "ناوی كاڵا پێویستە",
        },
        purchase_price: {
            required: true,
            message: "نرخی کڕین پێویستە",
        },
        unit_price: {
            required: true,
            message: "نرخی تاك پێویستە",
        },
        wholesale_price: {
            required: true,
            message: "نرخی جملە پێویستە",
        },
    };
    let submittedForm = false;
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
    let existingData: Item | undefined = undefined;
    let openExistingItemModal = false;
    let existingField = "";
    async function addNewItem() {
        loading = true;
        submittedForm = true;
        for (let field in formRules) {
            if (formRules[field].required && !itemData[field as keyof Item]) {
                console.log("error");
                loading = false;
                return;
            }
        }
        checkIfBarcodeExists().then((exist) => {
            if (exist) {
                openExistingItemModal = true;
                existingField = "barcode";
                return;
            } else {
                checkIfNameExists().then((exist) => {
                    console.log(exist);
                    if (exist) {
                        openExistingItemModal = true;
                        existingField = "name";
                        return;
                    } else {
                        submitNewItem();
                    }
                });
            }
        });
    }
    async function checkIfBarcodeExists() {
        const { data, error } = await supabase
            .from("item")
            .select("*")
            .eq("barcode", itemData.barcode)
            .single();
        if (data) {
            existingData = data as Item;
        }

        console.log(data?.length);
        return !!data;
    }
    async function checkIfNameExists() {
        const { data, error } = await supabase
            .from("item")
            .select("*")
            .eq("name", itemData.name)
            .single();
        if (data) {
            existingData = data as Item;
        }

        console.log(data?.length);
        return !!data;
    }

    async function submitNewItem() {
        const { error, data } = await supabase
            .from("item")
            .insert(itemData)
            .select("id");

        loading = false;
        if (data) {
            formModal = true;
            newItemId = data[0].id;
            toasts.add({
                title: "سەرکەوتوو بوو",
                description: "کاڵاکە بە سەرکەوتویی زیادکرا",
                duration: 5000,
                placement: "top-left",
                type: "success",
                showProgress: true,
                onClick: () => {},
                onRemove: () => {},
            });
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
        itemData = {
            barcode: "",
            name: "",
            purchase_price: 0,
            unit_price: 0,
            wholesale_price: 0,
        };
        submittedForm = false;
    }
    async function submitItemsToStock() {
        loading = true;
        await supabase
            .from("item")
            .update({
                quantity: stockData.quantity,
            })
            .eq("id", newItemId);
        const { data, error } = await supabase
            .from("stock")
            .insert({
                expire_date: stockData.expire_date,
                purchase_date: stockData.purchase_date,
                quantity: stockData.quantity,
                item_id: newItemId,
            })
            .select("id");
        if (data) {
            toasts.add({
                title: "سەرکەوتوو بوو",
                description: "کاڵاکە بە سەرکەوتویی بۆ مەخزەن زیادکرا",
                duration: 5000,
                placement: "top-left",
                type: "success",
                showProgress: true,
                onClick: () => {},
                onRemove: () => {},
            });
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
        formModal = false;
        stockData = {
            expire_date: new Date(),
            purchase_date: new Date(),
            quantity: 0,
        };
    }
</script>

<ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
    <!-- Provider template for your toasts -->
</ToastContainer>
<Modal
    bind:open={openExistingItemModal}
    size="md"
    autoclose={false}
    class="w-full"
>
    <ExistingItemModal data={existingData} {existingField} />
</Modal>
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
                        color={submittedForm && !itemData.name ? "red" : "base"}
                        bind:value={itemData.name}
                    />
                    {#if submittedForm && !itemData.name}
                        <Helper class="mt-2" color="red"
                            ><span class="font-medium"
                                >ناوی کاڵا پڕکردنەوەی پێویستە</span
                            ></Helper
                        >
                    {/if}
                </div>
                <div>
                    <Label for="last_name" class="mb-2">باڕکۆد</Label>
                    <Input
                        type="text"
                        placeholder="باڕکۆدی کاڵا داخل بکە"
                        bind:value={itemData.barcode}
                    />
                </div>
                <div>
                    <Label for="company" class="mb-2">نرخی کڕین</Label>
                    <Input
                        type="number"
                        placeholder="0.000"
                        bind:value={itemData.purchase_price}
                        color={submittedForm && !itemData.purchase_price
                            ? "red"
                            : "base"}
                    />
                    {#if submittedForm && !itemData.purchase_price}
                        <Helper class="mt-2" color="red"
                            ><span class="font-medium"
                                >نرخی کڕین پڕکردنەوەی پێویستە</span
                            ></Helper
                        >
                    {/if}
                </div>
                <div>
                    <Label for="phone" class="mb-2">نرخی تاک</Label>
                    <Input
                        type="number"
                        placeholder="0.000"
                        bind:value={itemData.unit_price}
                        color={submittedForm && !itemData.unit_price
                            ? "red"
                            : "base"}
                    />
                    {#if submittedForm && !itemData.unit_price}
                        <Helper class="mt-2" color="red"
                            ><span class="font-medium">
                                نرخی تاک پڕکردنەوەی پێویستە</span
                            ></Helper
                        >
                    {/if}
                </div>
                <div>
                    <Label class="mb-2">نرخی جملە</Label>
                    <Input
                        type="number"
                        placeholder="0.000"
                        bind:value={itemData.wholesale_price}
                        color={submittedForm && !itemData.wholesale_price
                            ? "red"
                            : "base"}
                    />
                    {#if submittedForm && !itemData.wholesale_price}
                        <Helper class="mt-2" color="red"
                            ><span class="font-medium">
                                نرخی جملە پڕکردنەوەی پێویستە</span
                            ></Helper
                        >
                    {/if}
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
