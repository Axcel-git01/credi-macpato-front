export interface StandRequestDTO {
  ownerId: string;
  description: string;
}

export interface StandResponseDTO {
  id: bigint;
  number: string;
  description: string;
  ownerId: bigint;
}
