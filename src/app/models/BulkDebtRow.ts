import Decimal from "decimal.js";

export interface BulkDebtRowRequestDTO {
    standId: number;
    issuerId: number;
    customerId: number;
    issueDate: Date;
    igv: Decimal;
    voucherItems: [];
}

export interface BulkDebtUploadErrorDTO {
    rowIndex: BigInteger;
    message: string;
}

export interface BulkDebtUploadRequestDTO {
    rows: BulkDebtRowRequestDTO[];
}