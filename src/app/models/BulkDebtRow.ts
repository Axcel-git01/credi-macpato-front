import Decimal from "decimal.js";

export interface BulkDebtRowRequestDTO {
    standId: bigint;
    issuerId: bigint;
    customerId: bigint;
    issueDate?: Date;
    igv: Decimal;
    voucherItems: [];
}

export interface BulkDebtUploadErrorDTO {
    rowIndex: number;
    message: string;
}

export interface BulkDebtUploadRequestDTO {
    rows: BulkDebtRowRequestDTO[];
}
