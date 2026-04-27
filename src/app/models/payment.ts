import Decimal from 'decimal.js';

export interface PaymentRequestDTO{
    customerId: bigint;
    voucherId: bigint;
    paidItemIds: bigint[];
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
