import type { PaymentTypeEnum } from "./paymentTypeEnum";
import type { SaleTypeEnum } from "./saleTypeEnum";

export interface sale {
    id?: number,
    payment_type: PaymentTypeEnum,
    sale_type: SaleTypeEnum,

}
export interface saleDetail {
    id?: number,
    sale_id: number,
    item_id: number,
    quantity: number,
    total_price: number,
    unit_price: number,
    item_name: string,
}

export interface saleReport {
    id?: number,
    payment_type: PaymentTypeEnum,
    sale_type: SaleTypeEnum,
    sale_detail: saleDetail[],
}