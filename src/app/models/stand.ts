export interface StandRequestDTO {
  ownerId: bigint;
  description: string;
}

export interface StandResponseDTO {
  id: bigint;
  number: string;
  description: string;
  ownerId: bigint;
}
