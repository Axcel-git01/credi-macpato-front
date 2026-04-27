import Decimal from "decimal.js";
import { PaymentState } from "./voucher";
import {ChargeResponseDTO} from './charge';

export interface VoucherItemRequestDTO {
    quantity: Decimal;
    measureUnitType: MeasureUnitType;
    chargeReasonId: bigint;
    unitValue: Decimal;
}

export enum MeasureUnitType{
    NIU, KGM, LTR, MTR, MTK, MTQ,
    CS, BX, PR, ZZ,
}

export interface VoucherItemResponseDTO {
    id: bigint;
    quantity: Decimal;
    measureUnitType: MeasureUnitTypeResponse;
    charge: ChargeResponseDTO;
    unitValue: Decimal;
    payableAmount: Decimal;
    state: PaymentState;
    voucherId: bigint;
    paymentId: bigint;
}

export interface MeasureUnitTypeResponse {
  description: string;
  typicalUse: string;
  unitCode: string;
}
