import Decimal from "decimal.js";

export interface PaymentResponseDTO{
    id:number;
    code: string
    dateTime: Date;
    amount: Decimal; 
    customerId: number;
    voucherId: number;
    paidItemIds: number; 
}
