import Decimal from "decimal.js";
import { VoucherItemRequestDTO } from "./voucherItem";

export interface VoucherRequestDTO {
    igv: Decimal;
    voucherItems: VoucherItemRequestDTO[];
    issuerId: number;
    customerId: number;
    standId: number;

}

export interface VoucherResponseDTO {
    id: number;
    serialNumber: string;
    state: PaymentState;
    issueDate: Date;
    igv: Decimal;
    igvAmount: Decimal;
    lineExtensionAmount: Decimal;
    payableAmount: Decimal;
    voucherItems: VoucherItemRequestDTO[];
    issuerId: number;
    customerId: number;
    standId: number;

}
export enum  PaymentState{
    PENDING,
    PAID,
    PARTIALLY_PAID
}