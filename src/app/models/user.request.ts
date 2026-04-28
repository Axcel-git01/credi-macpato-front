export interface UserRequestDTO {
  username: string;
  password: string;
  role: Role;
  state: UserState;
  type: UserType;
}

export type UserRequest =
  CustomerRequestDTO | AssociationRequestDTO
  | PersonCustomerRequestDTO | PersonVendorRequestDTO
  | BusinessCustomerRequestDTO | BusinessVendorRequestDTO

export enum UserType {
    PERSON_CUSTOMER = "PERSON_CUSTOMER",
    BUSINESS_CUSTOMER = "BUSINESS_CUSTOMER",
    ASSOCIATION = "ASSOCIATION",
    BUSINESS_VENDOR = "BUSINESS_VENDOR",
    PERSON_VENDOR = "PERSON_VENDOR"
}
export enum Role {
    VENDOR = "VENDOR",
    CUSTOMER = "CUSTOMER",
    ASSOCIATION = "ASSOCIATION"
}

export enum UserState {
    ENABLED = "ENABLED",
    BLOCKED = "BLOCKED",
    DISABLED = "DISABLED"
}

export interface AssociationRequestDTO extends UserRequestDTO {
    registrationName: string;
    address: string;
}

export interface CustomerRequestDTO extends UserRequestDTO {
  associationId: string;
}

export interface PersonCustomerRequestDTO extends  CustomerRequestDTO {
    name: string;
    lastname: string;
}

export interface BusinessCustomerRequestDTO extends CustomerRequestDTO {
    registrationName: string;
    address: string;
}

export interface VendorRequestDTO extends UserRequestDTO {
  associationId: string;
}

export interface PersonVendorRequestDTO extends VendorRequestDTO{
  name: string;
  lastname: string;
}

export interface BusinessVendorRequestDTO extends VendorRequestDTO {
  registrationName: string;
  address: string;
}
