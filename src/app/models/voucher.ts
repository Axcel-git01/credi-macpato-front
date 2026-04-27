import Decimal from "decimal.js";
import { VoucherItemRequestDTO } from "./voucherItem";

export interface VoucherRequestDTO {
    igv: string;
    voucherItems: VoucherItemRequestDTO[];
    issuerId: bigint;
    customerId: bigint;
    standId: bigint;

}

export interface VoucherResponseDTO {
    id: bigint;
    serialNumber: string;
    state: PaymentState;
    issueDate: Date;
    igv: Decimal;
    igvAmount: Decimal;
    lineExtensionAmount: Decimal;
    payableAmount: Decimal;
    voucherItems: VoucherItemRequestDTO[];
    issuerId: bigint;
    customerId: bigint;
    standId: bigint;
    pendingAmount: Decimal;
    paidAmount: Decimal;
}
export enum  PaymentState{
    PENDING,
    PAID,
    PARTIALLY_PAID
}
