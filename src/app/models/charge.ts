export interface ChargeRequestDTO {
    description: string;
    standId: string;
}

export interface ChargeResponseDTO {
  id: bigint;
  description: string;
  standId: bigint;
  active: boolean;
}
