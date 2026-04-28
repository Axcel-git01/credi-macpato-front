import {UserState} from "./user.request";
import Decimal from 'decimal.js';

export interface RoleResponse {
  displayName: string;
}

export interface UserResponseDTO {
  id: bigint;
  username: string;
  role: RoleResponse;
  state: UserState;
  createdAt: Date
  fullName: string;
}

export type UserResponse =
  CustomerResponseDTO | AssociationResponseDTO
  | PersonCustomerResponseDTO | PersonVendorResponseDTO
  | BusinessCustomerResponseDTO | BusinessVendorResponseDTO


export interface AssociationResponseDTO extends UserResponseDTO {
    registrationName: string;
    address: string;
}

export interface CustomerResponseDTO extends UserResponseDTO {
  associationId: bigint;
}

export interface PersonCustomerResponseDTO extends  CustomerResponseDTO {
    name: string;
    lastname: string;
}

export interface BusinessCustomerResponseDTO extends CustomerResponseDTO {
    registrationName: string;
    address: string;
}

export interface VendorResponseDTO extends UserResponseDTO {
  associationId: bigint;
  moneyBalance: Decimal;
}


export interface PersonVendorResponseDTO extends VendorResponseDTO {
  name: string;
  lastname: string;
}

export interface BusinessVendorResponseDTO extends VendorResponseDTO {
  registrationName: string;
  address: string;
}
