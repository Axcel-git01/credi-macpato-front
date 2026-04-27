import {UserResponse} from './user.response';
import Decimal from 'decimal.js';
import {StandResponseDTO} from './stand';
import {VoucherResponseDTO} from './voucher';

export interface CashClosureReportRequest {
  today: Date;
  ownerId: bigint;
}

export interface CustomerDebtsReportRequest {
  customerId: bigint;
}

export interface CustomerDebtsReport {

}

export interface VouchersByStandDTO {
  totalIssuedVouchersCount: bigint;
  totalSales: Decimal;
  totalDebt: Decimal;
  stand: StandResponseDTO;
  vouchers: VoucherResponseDTO[];
}

export interface CashClosureReport {
  owner: UserResponse;
  totalSalesToday: Decimal;
  totalDebtToday: Decimal;
  totalVouchersCountToday: number;

  vouchersByStand: VouchersByStandDTO[];
}


export enum FileType {
  CSV,
  PDF,
  EXCEL
}
