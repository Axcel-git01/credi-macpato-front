import Decimal from 'decimal.js';

export interface PaymentRequestDTO{
    customerId: string;
    voucherId: string;
    paidItemIds: string[];
}

export interface PaymentResponseDTO{
  id: bigint;
  code: string
  dateTime: Date;
  amount: Decimal;
  customerId: bigint;
  voucherId: bigint;
  paidItemIds: bigint[];
}
