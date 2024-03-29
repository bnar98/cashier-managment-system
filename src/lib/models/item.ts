import type { Stock } from "./stock";

export interface Item {
    id?: number,
    name: string,
    barcode: string,
    purchase_price?: number,
    unit_price?: number,
    wholesale_price?: number,
    quantity?: number,
    stock?: Stock[]
}