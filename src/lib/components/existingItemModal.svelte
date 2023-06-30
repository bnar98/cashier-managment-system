<script lang="ts">
    import { Button, Helper, Input, Label, Modal } from "flowbite-svelte";
    import type { Item } from "$lib/models/item";

    export let data: Item | undefined;
    export let existingField: string;
    console.log(data);
</script>

<div class="py-10 px-2">
    <h1>ئەم كاڵایە پێشتر تۆمارکراوا بەم زانیارییانە</h1>
    {#if data}
        <div class="grid grid-cols-2 my-6 gap-2">
            <div>
                <Label class="space-y-2">
                    <span>باڕکۆد</span>
                    <Input
                        disabled={true}
                        type="number"
                        placeholder="بارکۆد"
                        bind:value={data.barcode}
                        color={existingField === "barcode" ? "red" : "base"}
                    />
                    {#if existingField === "barcode"}
                        <Helper class="mt-2" color="red"
                            ><span class="font-medium">
                                باڕکۆد دوبارەیە</span
                            ></Helper
                        >
                    {/if}
                </Label>
            </div>
            <div>
                <Label class="space-y-2">
                    <span>ناوی کاڵا</span>
                    <Input
                        disabled={true}
                        placeholder="ناوی کاڵا"
                        bind:value={data.name}
                        color={existingField === "name" ? "red" : "base"}
                    />
                    {#if existingField === "name"}
                        <Helper class="mt-2" color="red"
                            ><span class="font-medium">
                                ناوی کاڵا دوبارەیە</span
                            ></Helper
                        >
                    {/if}
                </Label>
            </div>
            <div>
                <Label class="space-y-2">
                    <span>نرخی کڕین</span>
                    <Input
                        disabled={true}
                        type="number"
                        placeholder="نرخی کڕین"
                        bind:value={data.purchase_price}
                    />
                </Label>
            </div>
            <div>
                <Label class="space-y-2">
                    <span>نرخی تاک</span>
                    <Input
                        disabled={true}
                        type="number"
                        placeholder="نرخی تاک"
                        bind:value={data.unit_price}
                    />
                </Label>
            </div>
            <div>
                <Label class="space-y-2">
                    <span>نرخی جملە</span>
                    <Input
                        disabled={true}
                        type="number"
                        placeholder="نرخی جملە"
                        bind:value={data.wholesale_price}
                    />
                </Label>
            </div>
        </div>
    {/if}
    <div
        class="w-full h-20 my-5 rounded-md border-2 border-red-500 flex justify-center items-center"
        style="background-color: #e0242420;"
    >
        <h1 class="text-red-500 text-lg font-medium">
            تێبینی پێویستە ناو و بارکۆدی کاڵا دوبارە نەبێتەوە
        </h1>
    </div>
    <div class="flex justify-end">
        <Button class="btn btn-secondary">بڕۆ بەشی وردەکاری كاڵا</Button>
    </div>
</div>
