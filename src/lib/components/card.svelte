<script lang="ts">
    import { Card } from "flowbite-svelte";
    import { CurrencyDollar } from "svelte-heros-v2";
    export let data: { totalPrice: number; totalItem: number };
</script>

<div class="w-full flex flex-wrap justify-between">
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>کۆی گشتی فرۆشتنی ئەمڕۆ</h1>
                <h1 class="mt-2 text-2xl">{data.totalPrice}</h1>
            </div>
        </div>
    </Card>
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>ژمارەی کاڵای فرۆشراو</h1>
                <h1 class="mt-2 text-2xl">{data.totalItems}</h1>
            </div>
        </div>
    </Card>
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>کۆی گشتی فرۆشتنی ئەمڕۆ</h1>
                <h1 class="mt-2 text-2xl">{data.totalItem}</h1>
            </div>
        </div>
    </Card>
    <Card>
        <div class="flex justify-between items-center">
            <CurrencyDollar class="h-12 w-12" />
            <div class="flex flex-col justify-center items-center">
                <h1>کۆی گشتی فرۆشتنی ئەمڕۆ</h1>
                <h1 class="mt-2 text-2xl">2500000</h1>
            </div>
        </div>
    </Card>
</div>
