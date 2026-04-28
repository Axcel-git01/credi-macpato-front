import Decimal from "decimal.js";
import { PaymentState } from "./voucher";
import {ChargeResponseDTO} from './charge';

export interface VoucherItemRequestDTO {
    quantity: Decimal;
    measureUnitType: MeasureUnitType;
    chargeReasonId: string;
    unitValue: Decimal;
}

export enum MeasureUnitType{
    NIU = "NIU", KGM = "KGM", LTR = "LTR", MTR = "MTR", MTK = "MTK", MTQ = "MTQ",
    CS = "CS", BX = "BX", PR = "PR", ZZ = "ZZ",
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
