import { Role, UserState } from "./userrequest";

export interface UserResponseDTO {
  id: number;
  username: string;
  role: Role;
  state: UserState;
  createdAt: Date

}

export interface AssociationRequestDTO extends UserResponseDTO {
    registrationName: string; 
    address: string; 

}

export interface CustomerRequestDTO extends UserResponseDTO {

}

export interface PersonCustomerRequestDTO extends  CustomerRequestDTO {
    name: string;
    lastname: string;
} 

export interface BusinessCustomerRequestDTO extends CustomerRequestDTO {
    registrationName: string;
    address: string;
}