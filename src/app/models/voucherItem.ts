import Decimal from "decimal.js";
import { ChargeResponseDTO } from "./chargeresponse";
import { PaymentState } from "./voucher";

export interface VoucherItemRequestDTO {
    quantity: Decimal;
    measureUnitType: MeasureUnitType;
    chargeReasonId: number;
    unitValue: Decimal;
}

export enum MeasureUnitType{
    NIU,
    KGM,
    LTR,
    MTR,
    MTK,
    MTQ,
    CS,
    BX,
    PR,
    ZZ,
}

export interface VoucherItemResponseDTO {
    id: number;
    quantity: Decimal;
    measureUnitType: MeasureUnitType;
    charge: ChargeResponseDTO;
    unitValue: Decimal;
    payableAmount: Decimal;
    state: PaymentState;
    voucherId: number;
    paymentId: number;
}



