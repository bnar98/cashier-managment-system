<script lang="ts">
    import { Card } from "flowbite-svelte";
    import { CurrencyDollar } from "svelte-heros-v2";
    export let data: {
        totalPrice: number;
        quantity: number;
        totalItem: number;
        totalPurchasePrice: number;
    };
</script>

<div class="w-full flex flex-wrap justify-between">
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>کۆی نرخی فرۆشتن</h1>
                <h1 class="mt-2 text-2xl">
                    {data?.totalPrice?.toLocaleString()}
                </h1>
            </div>
        </div>
    </Card>
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>کۆی نرخی کڕین</h1>
                <h1 class="mt-2 text-2xl">
                    {data?.totalPurchasePrice?.toLocaleString()}
                </h1>
            </div>
        </div>
    </Card>
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>ژمارەی کاڵای فرۆشراو</h1>
                <h1 class="mt-2 text-2xl">
                    {data?.quantity?.toLocaleString()}
                </h1>
            </div>
        </div>
    </Card>
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>ژمارەی جۆری کاڵای فرۆشراو</h1>
                <h1 class="mt-2 text-2xl">
                    {data?.totalItem?.toLocaleString()}
                </h1>
            </div>
        </div>
    </Card>
</div>
