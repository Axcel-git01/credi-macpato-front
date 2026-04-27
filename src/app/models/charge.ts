export interface ChargeRequestDTO {
    description: string;
    standId: bigint;
}

export interface ChargeResponseDTO {
  id: bigint;
  description: string;
  standId: bigint;
  active: boolean;
}
