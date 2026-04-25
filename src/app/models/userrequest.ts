export interface UserRequestDTO {
  username: string;
  password: string;
  role: Role;
  state: UserState;
  type: UserType;
}

export enum UserType {
    PERSON_CUSTOMER, 
    BUSINESS_CUSTOMER,
    ASSOCIATION,
    BUSINESS_VENDOR,
    PERSON_VENDOR
}
export enum Role {
    VENDOR, 
    CUSTOMER,
    ASSOCIATION
}

export enum UserState {
    ENABLED, 
    BLOCKED,
    DISABLED
}



export interface AssociationRequestDTO extends UserRequestDTO {
    registrationName: string; 
    address: string; 

}

export interface CustomerRequestDTO extends UserRequestDTO {

}

export interface PersonCustomerRequestDTO extends  CustomerRequestDTO {
    name: string;
    lastname: string;
} 

export interface BusinessCustomerRequestDTO extends CustomerRequestDTO {
    registrationName: string;
    address: string;
}

